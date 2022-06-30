<?php 
    $btns = '<li><a class="list" href="/mypage/save/list">목록</a></li>';
    
    $idx = $estimate_data->iIdx_Estimate;
    $sec = substr($estimate_data->dInsert_Estimate,-2);
    $key = encodeDocu(substr($idx,0,1).substr($idx,-1).$idx.$sec);
    
    
?>

<div class="editBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">저장견적</div>
    			<?php if($btns){?>
				<ul class="button">
					<?=$btns?>
				</ul>
				<?php }?>
			</div>
		</div>
		<dl>
			<dt>No</dt><dd><?=$estimate_data->iNo_Estimate?> <span class="right"><?=substr($estimate_data->dInsert_Estimate,0,16)?></span></dd>
			<dt>모델</dt><dd><?=($estimate_data->cModel_Estimate) ? $estimate_data->cModel_Estimate:"&nbsp;"?></dd>
			<dt>고객</dt><dd save="customer"><?=($estimate_data->cCustomer_Estimate) ? $estimate_data->cCustomer_Estimate:"&nbsp;"?></dd>
			<dt>제목</dt><dd save="subject"><?=($estimate_data->cSubject_Estimate) ? $estimate_data->cSubject_Estimate:"&nbsp;"?></dd>
        	<dt>메모</dt><dd save="counsel"><?=($estimate_data->tCounsel_Estimate) ? nl2br($estimate_data->tCounsel_Estimate):"&nbsp;"?></dd>
        	<dt>상태</dt><dd><?=(isset($request_state[$estimate_data->cState_Request])) ?  $request_state[$estimate_data->cState_Request]:"가견적";?> (<?=$estimate_data->cCode_Request?>) <?=($estimate_data->cStateReq_Request) ? $request_stateH[$estimate_data->cStateReq_Request]:""?></dd>
		</dl>
		<div class="buttonBox">
    		<form id="formEstmDel" action="/api/estimate" method="POST">
				<input type="hidden" name="no" value="<?=$no?>">
				<input type="hidden" name="key" value="">
				<input type="hidden" name="tab" value="">
				<input type="hidden" name="type" value="">
				<input type="hidden" name="cNo" value="">
				<input type="hidden" name="job" value="del">
				<button>삭제하기</button>
			</form>
			<button id="estmBtnEdit" class="edit btnEstmAct" no="<?=$no?>" key="<?=$key?>" job="mod">기록하기</button>
    		<?php if(0 && $state){?>
    			<button id="btnOpenEstimate" no="<?=$idx?>" path="<?=$mode?>">견적 이동</button>
    		<?php }?>
    		<?php if(!isset($request_state[$estimate_data->cState_Request])){?>
    			<button class="btnEstmConfirm red" type="save">견적확정</button>
    		<?php }else if($estimate_data->cState_Request=="01"){?>
    			<button class="btnEstmAgree red" fno="<?=$estimate_data->iFno_Request?>" type="save">신용조회신청</button>
    		<?php }else if($estimate_data->cState_Request=="02"){?>
    			<button class="red" fno="<?=$estimate_data->iFno_Request?>" onclick="alert('동의중 완료후 한도조회 가능')">동의중..</button>
    		<?php }else if($estimate_data->cState_Request=="03"){?>
    			<button class="btnEstmCredit red" fno="<?=$estimate_data->iFno_Request?>" hno="<?=$estimate_data->cCode_Request?>">한도조회신청</button>
    		<?php }else if($estimate_data->cState_Request=="04"){?>
    			<a class="red" href="javascript:void(0)">상담중</a>
    		<?php }else if($estimate_data->cState_Request=="05"){?>
    			<a class="red" href="javascript:void(0)">상담완료</a>
    		<?php }?>
    	</div>
		<div class="estmDocu">
			<div id="docuViewBox" class="docuBox">
				<?=stripslashes(htmlspecialchars_decode($estimate_data->tDocument_Estimate))?>
			</div>
		</div>
		<div class="buttonBox"  type="save" no="<?=$no?>" key="<?=$key?>">
			<div class="urlBox">
				<input type="text" value="<?=URL?>/D/E/<?=$key?>">
				<button class="urlCopy">Url 복사</button>
				<a class="urlOpen" href="<?=URL?>/D/E/<?=$key?><?=(DEVICE_TYPE=="app") ? "?webview=layer":""?>" target="_blank">열기</a>
			</div>
			<button class="btnEstmAct kakao" job="talk">카톡</button>
			<button class="btnEstmAct" job="pdf">PDF</button>
			<button class="btnEstmAct" job="jpg">JPG</button>
			<button class="btnEstmAct" job="print">인쇄</button>
		</div>
	</div>
</div>

<div style="margin: 20px; ">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>
	
<script>
$(document).on("click", "#formEstmDel button", function () {
	if(!confirm("견적을 정말 삭제하시겠습니까?")){
		return false;
	}
});
</script>
