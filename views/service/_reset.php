<?php 
    
    if(isset($_SESSION['id_Member']) && $_SESSION['id_Member']) $tmpId = $_SESSION['id_Member'];
    else if(isset($_SESSION['id_Temp']) && $_SESSION['id_Temp']) $tmpId = $_SESSION['id_Temp'];
    else $tmpId = "";
    
    $_SESSION['count_Error'] = 0;
?>

<h2 class="mobOff">비밀번호 재설정</h2>
<div class="information" style="color: #ed1652;">
	<?php if(GRADE_AUTH=="T" && !isset($_GET['initializationYn'])){?>
	비밀번호 변경 후 90일이 경과하였습니다. 비밀번호를 변경하신 후 이용해주세요.
	<?php }else{?>
	비밀번호를 다시 설정해 주세요.
	<?php }?>
</div>
<div class="form">
	<form id="formApply" action="/login/reset" method="POST">
		<dl>
			<dt>아이디</dt>
			<dd><input type="text" name="id" value="<?=$tmpId?>" placeholder="" ></dd>
			<dt>비밀번호</dt>
			<dd class="multi">
				<div><input type="password" name="pw" value=""  placeholder="비밀번호 입력"></div>
				<div class="gap"><input type="password" name="pw2" value="" placeholder="한번 더 입력해 주세요."></div>
				<div class="desc">영문숫자 조합 8~16자리, 특수문자 불가</div>
			</dd>
		</dl>
		<?php if((isset($_SESSION['count_Error']) && $_SESSION['count_Error']) || (isset($_SESSION['msg_Error']) && $_SESSION['msg_Error'])){?>
			<div class="alert">
				<?php if(isset($_SESSION['msg_Error']) && $_SESSION['msg_Error']){?><div><?=$_SESSION['msg_Error']?></div><?php }?>
				<?php if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']){?><div class="off">오류 횟수 : <?=$_SESSION['count_Error']?>/5</div><?php }?>
			</div>
		<?php }?>
		<div class="buttonBox">
			<button id="submit" class="cyan">설정하기</button>
		</div>
	</form>
</div>
<?php if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict"){?>
	ID && 미등록 A10003 01012345678(휴대폰)<br>
	이용거절 A10004
<?php }?>

<script>
$(document).on("click", "#formApply button", function () {
	var pw = $.trim($('#formApply [name="pw"]').val());
	var regPw = /^[A-za-z0-9]{8,16}$/g;
	$('#formApply [name="pw"]').val(pw);
	if($('#formApply [name="id"]').val().length<2){
		alert("등록된 아이디를 정확히 입력해주세요.");
		$('#formApply [name="id"]').focus();
		return false;
	}else if(!regPw.test(pw)){
		alert("비밀번호를 영문과 숫자가 포함된 8~16 자리 이내로 입력해 주세요.");
		$('#formApply [name="pw"]').focus();
		return false;
	}else if(pw!=$.trim($('#formApply [name="pw2"]').val())){
		alert("입력하신 비밀번호가 서로 일치하지 않습니다.");
		$('#formApply [name="pw2"]').focus();
		return false;
	}else{
		// 비밀번호 문자열 체크
		var num = pw.search(/[0-9]/g);
        var eng = pw.search(/[a-z]/ig);
       	if(pw.search(/\s/) != -1){
        	alert("비밀번호는 공백 없이 입력해주세요.");
        	return false;
        }else if(num < 0 || eng < 0){
        	alert("영문,숫자, 를 혼합하여 입력해주세요.");
        	return false;
        }else{
            ajaxSubmit("formApply");
    		return false;
        }
	}
});
function returnReset(){
	viewApiData(dataBank['jsonData']);
	
	if(dataBank['jsonData']['state']=="Y"){
		alert("비밀번호가 재설정되었습니다. 로그인해주세요.");
		<?php if(GRADE_AUTH=="N"){?>
			window.location.href = "/";
		<?php }else{?>
		    window.location.href = "/login/logout";
		<?php }?>
	}
}
</script>

	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>