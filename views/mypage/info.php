<div class="editBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">내 정보</div>
				<ul class="button">
					<li><a class="logout" href="/login/logout">로그아웃</a></li>
				</ul>
			</div>
		</div>
    	<div class="information">
        	회원정보는 온라인에서 변경되지 않습니다. 정보 변경은 관리자에 문의 바랍니다.
        </div>
		<dl>
			<dt>등록 ID</dt><dd><?=$_SESSION['id_Member']?></dd>
			<dt>이름</dt><dd><?=$_SESSION['name_Member']?></dd>
        	<dt>휴대폰</dt><dd><?=$_SESSION['phone_Member']?></dd>
        	<dt>소속사</dt><dd><?=$_SESSION['company_Member']?></dd>
		</dl>
		<?php if(isset($_GET['msg']) && $_GET['msg']=="changed"){?>
		<div class="alert">비밀번호가 변경되었습니다.</div>
		<?php }else if(isset($_GET['msg']) && $_GET['msg']=="error"){?>
		<div class="alert">
			변경에 실패하였습니다.<br>
			<?php if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']){?><div>오류 횟수 5회 중 <?=$_SESSION['count_Error']?>회</div><?php }?>
		</div>
		<?php }else{?>
		<div class="buttonBox" id="btnPasswd" >
			<a href="/service/reset">비밀번호 변경</a>
        </div>
        <?php }?>
	</div>
</div>

<script>
    $(document).on("click", "#btnPasswd button", function () {
    	$("#btnPasswd").css("display","none");
    	$("#formPasswd").slideDown("fase");
    });
	// 비번 변경
	$(document).on("click", "#formPasswd button#submit", function () {
		var pw = $.trim($("#formPasswd input[name='userPwNew']").val());
		if(!$("#formPasswd input[name='userPw']").val() || $.trim($("#formPasswd input[name='userPw']").val()).length<8){
			alert("현재 비밀번호를 정확히 입력하세요.");
			$("#formPasswd input[name='userPw']").focus();
			return false;
		}else if(!$("#formPasswd input[name='userPwNew']").val() || $.trim($("#formPasswd input[name='userPwNew']").val()).length<8 ){
			alert("변경할 비밀번호를 8자리 이상 입력하세요.");
			$("#formPasswd input[name='userPwNew']").focus();
			return false;
		}else if($("#formPasswd input[name='userPw']").val() == $("#formPasswd input[name='userPwNew']").val() ){
			alert("현재 비밀번호와 달라야 합니다.");
			$("#formPasswd input[name='userPwNew']").focus();
			return false;
		}else if($("#formPasswd input[name='userPwNew']").val() != $("#formPasswd input[name='userPwNew2']").val() ){
			alert("변경할 비밀번호를 한번 더 입력해 주세요.");
			$("#formPasswd input[name='userPwNew2']").focus();
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
	        }
		}
	});
</script>