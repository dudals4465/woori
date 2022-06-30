<style>
.msgBox { padding: 50px 0; }
.msgBox .information { font-size: 17px; }
.msgBox .information .point { color: #1491ee; font-weight: bold; }
.msgBox .subTxt { margin-bottom: 50px; color: rgba(0,0,0,.6); }
</style>
<div class="stateBox">
	<span>
    <?php if($_SESSION['certifyKind'] == "join"){
             echo "회원가입";
          }else if($_SESSION['certifyKind'] == "id"){
             echo "아이디 찾기";
          }else if($_SESSION['certifyKind'] == "pw"){
             echo "비밀번호 찾기";
          }
    ?>
	</span>
	<div class="stepBox">
		<b>진행 상황</b>
		<span class="step ">1</span>
		<span class="step">2</span>
		<span class="step on">3</span>
	</div>
</div>
<div class="msgBox">
	<?php if($idx=="apply"){?>
    	<h2 class="">가입 신청 완료</h2>
    	<div class="information"><span class="point">가입 신청</span>이 완료되었습니다.</div>
    	<div class="subTxt">
    		등록하신 아이디는 담당자의 심사를 거쳐 가입이 완료됩니다.<br>
    		빠른 시일에 처리되도록 하겠습니다.
    	</div>
    	<div class="buttonBox">
    		<a href="/" class="cyan">메인으로 이동하기</a>
    	</div>
	<?php }else if($idx=="idsearch"){?>
    	<h2 class="">아이디 찾기</h2>
    	<div class="information">홍길동님의 아이디는<span class="point">univer***</span>입니다.</div>
    	<div class="subTxt">
    		정보 보호를 위해 아이디의 일부만 보여집니다.
    	</div>
    	<div class="buttonBox">
    		<a href="/" class="cyan">로그인</a>
		</div>
	<?php }else if($idx=="pwsearch"){?>
		<h2 class="">비밀번호 찾기</h2>
    	<div class="information">임시비밀번호를 고객님의 휴대폰 번호로 발송하였습니다.</div>
    	<div class="subTxt">
    		임시비밀번호로 로그인 하신 후 보안을 위하여 회원정보수정에서 비밀번호를 수정해 주세요.
    	</div>
    	<div class="buttonBox">
    		<a href="/" class="cyan">로그인</a>
		</div>
	<?php }?>
</div>