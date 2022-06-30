<?php 
    if(isset($codes_data)) $group = $codes_data->cGroup_Codes;
    else $group = $idx
?>
<div class="editBox">
	<div class="frame">
		<form id="formCodes" action="/admin/action/codes" method="POST">
		<dl>
			<dt>카테고리</dt>
			<dd><input type="text" name="group" value="<?=(isset($codes_data)) ? $codes_data->cGroup_Codes:$idx?>" readonly></dd>
			<dt>코드</dt>
        	<dd><input type="text" name="code" value="<?=(isset($codes_data)) ? $codes_data->cCode_Codes:""?>" <?=(isset($codes_data) && $codes_data->cGroup_Codes=="group") ? "readonly":""?>> <input type="hidden" name="codeOld" value="<?=(isset($codes_data)) ? $codes_data->cCode_Codes:""?>"><span class="desc">AICT code (영문과 숫자만, 특수문자 금지)</span></dd>
			<dt>명칭</dt>
			<dd><input type="text" name="name" value="<?=(isset($codes_data)) ? $codes_data->cName_Codes:""?>"></dd>
			<dt>매핑</dt>
			<dd><input type="text" name="map" value="<?=(isset($codes_data)) ? $codes_data->cMap_Codes:""?>"> <span class="desc">금융사 code</span></dd>
			<dt>사용</dt>
        	<dd>
        		<?php foreach($use_define as $key => $val){ ?>
        		<label><input type="radio" name="use" value="<?=$key?>" <?=((!isset($codes_data) && $key=="Y") || (isset($codes_data) && $key==$codes_data->cUse_Codes)) ? "checked":""?>><span><?=$val?></span></label>
        		<?php }?>
        	</dd>
			<dt>설정</dt>
			<dd><input type="text" name="set" value="<?=(isset($codes_data)) ? $codes_data->cSet_Codes:""?>"> <span class="desc">
				<?php if($group=="residualCompany"){?>없음 : 일반 사용, 지정 사용시 Y 넣고, 회원정보에서 잔가보장사 코드를 입력<?php }?>
				<?php if($group=="endType"){?>상품별 적용 코드 추가 (R 렌트, L 운용리스, K 금융리스<?php }?>
			</span></dd>
			<dt>비고</dt>
			<dd><input type="text" name="remark" value="<?=(isset($codes_data)) ? $codes_data->cRemark_Codes:""?>"></dd>
			<dt>상태</dt>
        	<dd>
        		<?php foreach($state_define as $key => $val){ ?>
        		<label><input type="radio" name="state" value="<?=$key?>" <?=((!isset($codes_data) && $key==1) || (isset($codes_data) && $key==$codes_data->iState_Codes)) ? "checked":""?>><span><?=$val?></span></label>
        		<?php }?>
        	</dd>
		</dl>
		<div class="buttonBox">
			<span class="left">
				<?php if($job=="add" && $idx=="group"){?>
				<a class="gray" href="/admin/codes/list/group">목록 보기</a>
				<?php }else{?>
				<a class="gray" href="/admin/codes/view/<?=$group?>">목록 보기</a>
				<?php }?>
			</span>
			<?php if($job!="add"){?><input type="hidden" name="codeO" value="<?=$codes_data->cCode_Codes?>"><?php }?>
			<input type="hidden" name="act" value="<?=($job=="add") ? "add":"mod";?>">
			<button id="submit"><?=($job=="add") ? "추가하기":"변경하기";?></button>
        </div>
		</form>
	</div>
</div>

<script>
    $(document).on("click", "#formCodes button#submit", function () {
    	if(!$('#formCodes [name="code"]').val()){
    		alert("코드를 입력해 주세요.");
    		$('#formCodes [name="code"]').focus();
    		return false;
    	}else if(!$('#formCodes [name="name"]').val()){
    		alert("명칭을 입력해 주세요.");
    		$('#formCodes [name="name"]').focus();
    		return false;
    	}
    });
</script>


