<style>
    .form #formApply dd { position: relative; }
    .form #formApply dd.checked::after {content: "중복확인 완료"; position: absolute; top: 0; right: 0; color: red; }
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
		<span class="step">1</span>
		<span class="step">2</span>
		<span class="step on">3</span>
	</div>
</div>
<div class="form">
	<form id="formApply" action="/login/apply" method="POST">
		<dl class="line call">
			<dt>이름</dt>
			<dd><input type="text" name="name" value="<?=$_SESSION['name_Certify']?>"></dd>
			<dt>생년월일</dt>
			<dd><input type="text" name="birth" value="<?=$_SESSION['birth_Certify']?>"></dd>
			<dt>전화번호</dt>
			<dd><input type="text" name="phone" value="<?=$_SESSION['phone_Certify']?>"></dd>
			<dt>성별</dt>
			<dd class="radioBox">
				<label><input type="radio" name="sex" value="1" checked><span><em>남성</em></span></label>
				<label><input type="radio" name="sex" value="0"><span><em>여성</em></span></label>
			</dd>
			<dt>아이디</dt>
			<dd>
				<input class="" type="text" name="id" value="univer003">
				<button id="idCheck" type="button">아이디 중복확인</button>
			</dd>
			<dt>비밀번호</dt>
			<dd><input type="text" name="pw" value="123456" placeholder="※영문 숫자 특수기호 조합, 8자리 이상"></dd>
			<dt>비밀번호 확인</dt>
			<dd><input type="text" name="pwc" value="123456"></dd>
			<dt>제휴법인 AG ID</dt>
			<dd><input type="text" name="agid" value="1361"></dd>
			<dt>당사 등록 ID*</dt>
			<dd><input type="text" name="companyid" value="1361"></dd>
			<span>※ 제휴법인 / 당사 등록 ID는 담당 관리지점을 통해 확인바랍니다.</span>
	
		<div class="buttonBox">
			<button id="confirmCertifyNo" class="cyan">가입 신청</button>
		</div>
	</form>
	<form id="idCheckFrom" action="/login/idCheck" method="POST">
		<input type="hidden" name="id" value="">
	</form>
	<div id="apiView">
		<h5>페이지 이동</h5>
		<div id="apiResponsePage" style="word-break:break-all"></div>
	</div>
</div>

<script>
	$(document).on("click","#formApply #confirmCertifyNo",function(){
		if($("#formApply input[name='name']").val()==""){
			alert("이름을 입력해 주세요");
			$("#formApply input[name='name']").focus();
			return false;
		}else if($("#formApply input[name='birth']").val()==""){
			alert("생년월일을 입력해 주세요");
			$("#formApply input[name='birth']").focus();
			return false;
		}else if($("#formApply input[name='phone']").val()==""){
			alert("전화번호를 입력해 주세요");
			$("#formApply input[name='phone']").focus();
			return false;
		}else if($("#formApply input[name='id']").val()==""){
			alert("아이디를 입력해 주세요");
			$("#formApply input[name='id']").focus();
			return false;
		}else if($("#formApply input[name='pw']").val()==""){
			alert("비밀번호를 입력해 주세요");
			$("#formApply input[name='pw']").focus();
			return false;
		}else if($("#formApply input[name='pwc']").val()==""){
			alert("비밀번호 확인을 입력해 주세요");
			$("#formApply input[name='pwc']").focus();
			return false;
		}else if($("#formApply input[name='agid']").val()==""){
			alert("AGID를 입력해 주세요");
			$("#formApply input[name='agid']").focus();
			return false;
		}else if($("#formApply input[name='companyid']").val()==""){
			alert("당사ID를 입력해 주세요");
			$("#formApply input[name='companyid']").focus();
			return false;
		
		}else if($("#formApply input[name='id']").parent().hasClass("checked")===false){
			alert("아이디 중복 확인을 해주세요");
			return false;
		}else if($("#formApply input[name='pw']").val() != $("#formApply input[name='pwc']").val()){
			alert("비밀번호가 일치하지 않습니다.")
			$("#formApply input[name='pwc']").focus();
			return false;
		}else{
    		ajaxSubmit("formApply");
    		return false;
		}
	});
	
	$(document).on("click","#idCheck",function(){
		if($("#formApply input[name='id']").val()==""){
			alert("아이디를 입력해주세요");
			$("#formApply input[name='id']").focus();
			return false;
		}else{
			$("#idCheckFrom input[name='id']").val($("#formApply input[name='id']").val());
			ajaxSubmit("idCheckFrom");
			return false;
		}
	});

	function returnIdCheck(){
		console.log(dataBank['rtnData']);
		if(dataBank['rtnData']['state'] == "1"){
			$("#formApply input[name='id']").parent().addClass("checked");
		}
		alert(dataBank['rtnData']['msg']);
	}
	function returnJoin(){
    	if(dataBank['rtnData']['state']=="1"){
            <?php if(API_MODE=="woori"){?>
        		window.location.href = dataBank['rtnData']['page'];
        	<?php }else{?>
        		$("#apiResponsePage").html("<a href='"+ dataBank['rtnData']['page']+"'>이동</a>")
        	<?php }?>
    	}
		alert(dataBank['rtnData']['msg']);
	}
</script>