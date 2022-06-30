<style>
<?php if($idx=="pc"){?>
    #btnMenuOpen { display: none; }
<?php }?>
</style>

<h2 class="mobOff">이용 안내</h2>
<div class="information mobOff">
	아래 내용을 확인하여 주시기 바랍니다.
</div>

<div class="form">
	<div class="msg ">
    	<?php if($idx=="expire"){?>
    	<div>이용에 불편을 드려 죄송합니다. ID <?=$_SESSION['id_Temp']?> 계정은 현재 이용이 중지된 상태입니다.
    		<br>자세한 사항은 관리자에 문의 바랍니다.
    	</div>
    	<div class="error"></div>
    	<?php }else if($idx=="error"){?>
    	<div>오류 횟수를 초과하였습니다. <br>관리자에 문의 바랍니다. <br><br>해제 코드 : <?=$_SESSION['hex_Device']?><br> 접속 IP : <?=$_SESSION['ip_Device']?></div>
    	<div class="error"></div>
    	<?php }else if($idx=="waiting"){?>
    	<div>회원 등록이 완료되었습니다. <br>관리자 승인 후 사용하실 수 있습니다.</div>
    	<div class="clear"></div>
    	<?php }else if($idx=="apply"){?>
    	<div>해당 지점에 등록되지 않았습니다. <br>지점에 문의 하시기 바랍니다</div>
    	<div class="error"></div>
    	<?php }else if($idx=="pc"){?>
    	<div>현재 모바일 서비스만 가능합니다. <br><br>PC 및 태블릿 서비스는 개발중입니다.</div>
    	<div class="clear"></div>
    	<?php }else{?>
    	<div>
    		<?=(isset($_SESSION['msg_Error'])) ? $_SESSION['msg_Error']:"";?>
    		<br>자세한 사항은 관리자에 문의 바랍니다.
    	</div>
    	<div class="error"></div>
    	<?php }?>
	</div>
</div>