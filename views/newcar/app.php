<script>
token = "<?=$_SESSION['token']?>";

defaultCfg['feeView'] = "<?=(isset($memCfg['feeView'])) ? $memCfg['feeView']:"Y"?>";		// CM 수수료		▶설정	   

estmStart = new Array();
estmStart['mode'] = "blend";
// 아래 두가지 통일 예정
estmMode = "<?=$goods?>";
estmStart["setting"] = "blend";
</script>
	<div class="estmBody off" id="estmBody">	
		<div class="estmCell on" estmNo="1" saveNo="">
			<div class="estmRslt_data off"></div>
			<div class="estmUnit"  fincLen="1" fincTab="" fincDoc=""></div>
		</div>
	</div>
	<div class="off" id="docuEdit"></div>
	<div style="margin:0 15px;">
    	<div class="estmDocu" id="estmDocu" style="margin-top: 0; padding-top: 20px; ">
    		<div class="docuBody">
    			<div class="docuEdit">
					<span class="title">연락처</span>
					<label><input type="radio" name="cardView" value="Y" <?=(!isset($memCfg['cardView'])) ? "checked":""?>><span>표시</span></label>
					<label><input type="radio" name="cardView" value="N"  <?=(isset($memCfg['cardView'])) ? "checked":""?>><span>숨김</span></label>
				</div>
    			<div class="docuBox estmRslt_estmDocu"><div style="padding: 400px 20px; text-align: center; font-size: 30px;">
    			<br>견적을 작성하시면 견적서가 표시됩니다.<br>견적이 표시되지 않으면 아래 버튼을 클릭해 주세요.
    			<div class="buttonBox"><button class="red" id="btnReloadDocu" style="font-size: 30px; border-radius: 40px; padding: 8px 20px; ">견적서 보기 <?=$goods?></button></div>
    		</div></div></div>
    		<div class="buttonBox estm send" type="estm">
    			<!-- <div class="urlBox off">
					<input type="text" value="" name="shortcut">
					<button class="urlCopy">Url 복사</button>
					<a class="urlOpen" href="" target="_blank">열기</a>
				</div>
				<button class="btnEstmAct kakao " job="talk">카톡</button>
				<button class="btnEstmAct " job="url">Url</button>
				<button class="btnEstmAct " job="pdf">PDF</button>
				<button class="btnEstmAct " job="jpg">JPG</button>
				<button class="btnEstmAct " job="print">인쇄</button>
				<button class="btnEstmAct " job="save">저장</button>
				<button class="btnEstmAct red " job="finc">심사요청</button>
				-->
				<button class="btnEstmAct cyan" job="save">견적저장</button>
				<button class="btnEstmAct2 gray" job="share">공유•다운</button>
				<button class="btnEstmConfirm gray" page="estm">견적확정</button>
				<button class="btnEstmAgree gray off" page="estm">신용조회요청</button>
    		</div>
		</div>
		
		
    	</div>
	</div>
		