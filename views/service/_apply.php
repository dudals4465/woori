<h2 class="mobOff"><?=$titleGnb?></h2>
<div class="information mobOff">
	<?php if(isset($_SESSION['name_Temp']) && $_SESSION['name_Temp']){?>
	<b><?=$_SESSION['name_Temp']?></b>님 사용등록을 신청하신 후 이용하실 수 있습니다.
	<?php }else{?>
	처음 방문하신 AG회원님은 사용등록을 신청하여 주세요.
	<?php }?>
</div>
<div class="step call">03 정보입력 <span><em>01</em> <em>02</em> <em class="on">03</em></span></div>
<div class="form">
	<form id="formApply" action="/login/apply" method="POST">
		<dl>
			<dt>이름</dt>
			<dd><input type="text" name="name" value="<?=$_SESSION['name_Temp']?>" placeholder="" readonly></dd>
			<dt>생년월일</dt>
			<dd><input type="text" name="birth" value="<?=$_SESSION['birth_Temp']?>" placeholder="" readonly></dd>
			<dt>지점</dt>
			<dd class="branch">
				<div><select name="branch"><option value="">지점 선택</option></select></div>
			</dd>
			<dt>소속사</dt>
			<dd>
				<div class="search"><input type="text" name="search" value="" placeholder="소속사 명칭 입력" ><button class="searchCompany">검색하기</button></div>
				<ul class="off companyList" id="companyList"  style="max-height: 240px; overflow: auto;"></ul>
			</dd>
			<dt>아이디</dt>
			<dd>
				<div class="search"><input type="text" name="id" value="" placeholder="아이디 입력" maxlength="12"><button class="searchID">중복확인</button></div>
				<div class="desc">아이디에 특수문자 사용 불가</div>
				<input type="hidden" name="idck" value="N">
				<input type="hidden" name="id2" value="">
			</dd>
			<dt>비밀번호</dt>
			<dd class="multi">
				<div><input type="password" name="pw" value="" placeholder="비밀번호 입력"></div>
				<div class="gap"><input type="password" name="pw2" value="" placeholder="한번 더 입력해 주세요."></div>
				<div class="desc">영문숫자 조합 8~16자리, 특수문자 불가</div>
			</dd>
			<dt>휴대전화</dt>
			<dd class="multi">
				<div>
					<input type="text" name="phone" value="<?=$_SESSION['phone_Temp']?>" placeholder="휴대폰 번호, 숫자만 입력" maxlength="11"  onkeypress="onlyNumber();" pattern="[0-9]*" inputmode="numeric" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');">
				</div>
			</dd>
		</dl>
		<?php if((isset($_SESSION['count_Error']) && $_SESSION['count_Error']) || (isset($_SESSION['msg_Error']) && $_SESSION['msg_Error'])){?>
			<div class="alert">
				<?php if(isset($_SESSION['msg_Error']) && $_SESSION['msg_Error']){?><div><?=$_SESSION['msg_Error']?></div><?php }?>
				<?php if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']){?><div>오류 횟수 : <?=$_SESSION['count_Error']?>/5</div><?php }?>
			</div>
		<?php }?>
		<div class="buttonBox">
			<button id="submit" class="cyan">신청하기</button>
			<input type="hidden" name="sex" value="<?=$_SESSION['sex_Temp']?>">
			<input type="hidden" name="nation" value="<?=$_SESSION['nation_Temp']?>">
			<input type="hidden" name="cprnBrchSno" value="">
		</div>
	</form>
</div>
<?php if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict"){?>
	A10010 중복 없음<br>
	A10001 중복됨<br>
<?php }?>

<script>
token = "<?=$_SESSION['token']?>";
$(window).load(function () {
	// 설정 불러오기
	var Dpath = "registerConfig";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/login/registerConfig?token="+token;
		getjsonData(url,Dpath);
	}
	var str ="";
	for(var b in dataBank[Dpath]['branch']){
		var tmp = dataBank[Dpath]['branch'][b];
			str += "<option value='"+tmp['dptCd']+"'>"+tmp['dptNm']+"</option>";
		
	}
	str += "<option value='00'>본점</option>";
	$("#formApply select[name='branch']").append(str);
});
$(document).on("change", "#formApply select[name='branch']", function () {
	var code = $(this).val();
	var name = $("#formApply input[name='search']").val();
	if(code=="00"){
		$("#companyList").html("<li><label><input type='radio' value='00' name='company' cprnBrchSno='00'><span>온라인 운영팀</span></label></li>");
		$("#companyList").removeClass("off");
	}else{
		$("#companyList").html("");
		/*
		// ajax 호출
		if(code){
    		var Dpath = "branchCompany"+code;
    		if(typeof(dataBank[Dpath]) == 'undefined' ){
    			var url = "/login/branchCompany?code="+code+"&token="+token;
    			getjsonApi(url,Dpath);
    		}
		}
		*/
	}
});
function searchCompany(code,name){
	var Dpath = "branchCompany";
	var str = "";
	var list = dataBank[Dpath]['agcompany'];
	for (var i in list) {
		dat = list[i];
		if(dat['custNo']!="0"){
			str += "<li><label><input type='radio' value='"+dat['custNo']+"' name='company' cprnBrchSno='"+dat['cprnBrchSno']+"'><span>"+dat['cprnBrchNm']+"</span></label></li>";
		}
	}
	if(str==""){
		alert("검색한 소속사가 없습니다. 검색어를 변경하여 주세요.");
		str += "<li class='blank'>검색한 소속사가 없습니다. 검색어를 변경하여 주세요.</li>";
	}
	$("#companyList").html(str);
	$("#companyList").removeClass("off");
}
$(document).on("click", "#formApply button.searchCompany", function () {
	var branch = $("#formApply select[name='branch']").val();
	var word = $.trim($(this).prev().val());
	if(branch==""){
		alert("지점을 먼저 선택해 주세요.");
	}else if(branch=="00"){
		alert("아래 목록에서 선택해 주세요.");
	}else if(word.length<2 || word=="(주)"  || word=="(주" || word=="주)"){
		alert("검색어를 2자 이상 입력해주세요.");
		$("#formApply input[name='search']").focus();
	}else{
		var Dpath = "branchCompany";
		var url = "/login/branchCompany?code="+branch+"&name="+encodeURI(word)+"&token="+token;
		getjsonApi(url,Dpath);
	}
	return false;
});

$(document).on("click", "#formApply button.selectCompany", function () {
	var str = '<input type="text" name="companySelect" value="'+$(this).prev().text()+'" placeholder="" readonly>';
	str += '<input type="hidden" name="code" value="'+$(this).parent().attr('branch')+'">';
	str += '<input type="hidden" name="company" value="'+$(this).parent().attr('company')+'">';
	$("#companyBox").append(str);
	$("#companyBox > div, #companyBox > ul").addClass("off");
	return false;
});
// 
$(document).on("click", "#formApply button.searchID", function () {
    var id = $.trim($('#formApply [name="id"]').val());
    var regId = /^[A-za-z0-9]{6,12}$/g;
    if(!regId.test(id)){
		alert("아이디를 영문과 숫자 6~12자리 이내로 입력해주세요.");
		$('#formApply [name="id"]').focus();
		return false;
	}else{
		$('#formApply [name="id"]').val($.trim($('#formApply [name="id"]').val()));
		var Dpath = "idcheck";
		var url = "/login/idCheck?mbrIdnId="+$.trim($('#formApply [name="id"]').val())+"&token="+token;
		getjsonApi(url,Dpath);
		return false;
	}
});
$(document).on("blur", "#formApply [name='id']", function () {
	if($('#formApply [name="idck"]').val()=="Y" && $('#formApply [name="id"]').val()!=$('#formApply [name="id2"]').val()){
		alert("아이디 중복을 다시 한번 확인해 주세요.");
		$('#formApply [name="idck"]').val("N");
	}
});
function recodeIdCheck(){
	var path = "idcheck";
	if(dataBank[path]['result']=="Y"){
		alert("사용하실 수 있는 ID 입니다.");
		$('#formApply [name="idck"]').val("Y");
		$('#formApply [name="id2"]').val($('#formApply [name="id"]').val());
	}else{
		alert("사용하실 수 없는 ID 입니다.");
		$('#formApply [name="idck"]').val("N");
		$('#formApply [name="id"]').focus();
	}
}
$(document).on("click", "#formApply button.view", function () {
	var title = $(this).prev().text();
	var kind = $(this).attr('cont');
	console.log(kind);
	var cont = "<div class='infoPopup'>"+$("#policy"+kind).text()+"</div>";
	$("#framePopup h3").text(title);
	$("#framePopup .content").html(cont);
	openPopupView(720,'framePopup');
	return false;
});
$(document).on("click", "#formApply button#submit", function () {
	var pw = $.trim($('#formApply [name="pw"]').val());
    var id = $.trim($('#formApply [name="id"]').val());
    var regId = /^[A-za-z0-9]{6,12}$/g;
    var regPw = /^[A-za-z0-9]{8,16}$/g;
	$('#formApply [name="pw"]').val(pw);
	if(!$('#formApply select[name="branch"]').val()){
		alert("지점을 선택해 주세요..");
		return false;
	}else if($('#formApply input[name="company"]:checked').length==0){
		alert("소속사를 검색하여 선택해 주세요.");
		return false;
	}else if(!regId.test(id)){
		alert("아이디를 영문과 숫자 6~12자리 이내로 입력해주세요.");
		$('#formApply [name="id"]').focus();
		return false;
	}else if($('#formApply [name="idck"]').val()!="Y"){
		alert("아이디를 입력하고 중복 여부를 확인해 주세요.");
		return false;
	}else if(!regPw.test(pw)){
		alert("비밀번호를 영문과 숫자기 포함된 8~16 자리 이내로 입력해 주세요.");
		$('#formApply [name="pw"]').focus();
		return false;
	}else if(pw!=$.trim($('#formApply [name="pw2"]').val())){
		alert("입력하신 비밀번호가 서로 일치하지 않습니다.");
		$('#formApply [name="pw2"]').focus();
		return false;
	}else if($('#formApply input[name="phone"]').val().length<10){
		alert("휴대전화번호를 입력해주세요.");
		$('#formApply input[name="phone2"]').focus();
		return false;
	}else{
		$('#formApply input[name="cprnBrchSno"]').val($('#formApply input[name="company"]:checked').attr("cprnBrchSno"));
		// 비밀번호 문자열 체크
		var num = pw.search(/[0-9]/g);
        var eng = pw.search(/[a-z]/ig);
       	if(pw.search(/\s/) != -1){
        	alert("비밀번호는 공백 없이 입력해주세요.");
        	return false;
        }else if(num < 0 || eng < 0){
        	alert("영문,숫자를 혼합하여 입력해주세요.");
        	return false;
        }else{
            ajaxSubmit("formApply");
    		return false;
        }
	}
});
function returnConfirm(){
	viewApiData(dataBank['jsonData']);
	if(dataBank['jsonData']['result']=="Y" && confirm("회원등록이 완료되었습니다. 담당자 승인 후 사용하실 수 있습니다.")){
		window.location.href = "/service/message/waiting";
	}
}
</script>

	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>