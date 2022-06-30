<h2 class="">AG 등록회원 로그인<a href=""></a></h2>
<div class="information">
	우리금융캐피탈 AG 회원 전용 온라인 견적입니다.<br>
	처음 방문하신 AG 회원님은 등록하시고 승인된 후 이용하실 수 있습니다.
</div>
<?php 
if(isset($_SESSION['id_Temp']) && $_SESSION['id_Temp']) $id = $_SESSION['id_Temp'];
else if(isset($_COOKIE['saveid']) && $_COOKIE['saveid'])  $id = $_COOKIE['saveid'];
else $id = "";
?>
<div class="form login">
	<form id="formLogin" action="/login/loginConnect" method="POST">
		<dl>
			<dt>아이디</dt>
			<dd><input class="full" type="text" name="id" value="<?=(isset($_COOKIE['saveid']) && $_COOKIE['saveid']) ? $_COOKIE['saveid']:"woorifc"?>" placeholder="아이디 입력" ></dd>
			<dt>비밀번호</dt>
			<dd><input class="full" type="password" name="pw" value="woorifc" placeholder="비밀번호 입력"></dd>
		</dl>
		<?php if((isset($_SESSION['count_Error']) && $_SESSION['count_Error']) || (isset($_SESSION['msg_Error']) && $_SESSION['msg_Error'])){?>
			<div class="alert">
				<?php if(isset($_SESSION['msg_Error']) && $_SESSION['msg_Error']){?><div><?=$_SESSION['msg_Error']?></div><?php }?>
				<?php if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']){?><div>오류 횟수 : <?=$_SESSION['count_Error']?>/5</div><?php }?>
			</div>
		<?php }?>
		<div class="saveid"><label><input type="checkbox" name="saveid" value="Y" <?=(isset($_COOKIE['saveid']) && $_COOKIE['saveid']) ? "checked":"";?>><span>아이디 저장</span></label></div>
		<div class="buttonBox">
			<button class="cyan"  id="submit">로그인</button>
	    	<a class="white" href="/service/certify/request?kind=join">회원등록</a>
		</div>
	</form>
	<ul class="searchBtn">
		<li><a href="/service/certify/searchid?kind=id">아이디 찾기</a></li>
    	<li><a href="/service/certify/searchpw?kind=pw">비밀번호 찾기</a></li>
	</ul>
	<div class="demo" style="margin-top: 20px; color: #666; font-size: 12px; ">
		로그인 테스트 : ID woorifc, PW woorifc
		<br><?=API_MODE?>
	</div>
	
	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"></div>
		<h5>Data</h5>
		<div id="apiData" style="word-break:break-all"></div>
		<h5>페이지 이동</h5>
		<div id="apiPage" style="word-break:break-all"></div>
	</div>
	
	<div class="linkBox">
		<h5>&lt;페이지 바로가기&gt;</h5>
		<p>- 회원가입</p>
		<a href="/service/certify/request">/service/certify/request - 인증요청</a><br>
		<a href="/service/certify/confirm">/service/certify/confirm - 인증확인</a><br>
		<a href="/service/certify/apply">/service/certify/apply - 회원가입 양식</a><br>
		<a href="/service/message/apply">/service/message/apply - 완료</a><br>
		<p>- 아이디 찾기</p>
		<a href="/service/certify/searchid">/service/certify/searchid - 인증요청</a><br>
		<a href="/service/certify/confirm">/service/certify/confirm - 인증확인</a><br>
		<a href="/service/message/idsearch">/service/message/idsearch - 완료</a><br>
		<p>- 비밀번호 찾기</p>
		<a href="/service/certify/searchpw">/service/certify/searchpw - 인증요청</a><br>
		<a href="/service/certify/confirm">/service/certify/confirm - 인증확인</a><br>
		<a href="/service/message/pwsearch">/service/message/pwsearch - 완료</a><br>
	</div>
	
	
	
</div>

<script>
$(document).on("click", "#formLogin button", function () {
	if($('#formLogin [name="id"]').val().length<6){
		alert("등록된 ID를 정확히 입력해주세요.");
		$('#formLogin [name="id"]').focus();
		return false;
	}else if($('#formLogin [name="pw"]').val().length<6){
		alert("비밀번호를 6자리 이상 입력해 주세요.");
		$('#formLogin [name="pw"]').focus();
		return false;
	}else{
		if($('#formLogin input[name="saveid"]').prop("checked")) $.cookie("saveid", $('#formLogin [name="id"]').val(), {expires: 30, path: "/", domain: location.host});
		else $.cookie("saveid", "", {expires: 30, path: "/", domain: location.host});
		ajaxSubmit("formLogin");
		return false;
	}
});

function returnLogin(){
	if(dataBank['rtnData']['state']=="1"){
		alert(dataBank['rtnData']['msg']);
		<?php if(API_MODE=="woori"){?>
			window.location.href = dataBank['rtnData']['page'];
		<?php }else{?>
			$("#apiPage").html("<a href='"+ dataBank['rtnData']['page']+"'>이동</a>")
		<?php }?>
	}
}
</script>