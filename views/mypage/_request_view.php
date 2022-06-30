<?php 
    $btns = '<li><a class="list" href="/mypage/request/list">목록</a></li>';
    if($request_data->cState_Request=="A000") $code = "동의요청";
    //else if($request_data->cState_Request=="A001") $code = "동의완료";
    else $code = $request_data->cCode_Request;
    $fno = $request_data->iFno_Request;
    $data = json_decode($request_data->tData_Estimate, true);
    $mon = $data['fincData'][$fno]['month'];
    $pmt = $data['fincData'][$fno]['pmtGrand'];
    
    $idx = $request_data->iIdx_Estimate;
    $sec = substr($request_data->dInsert_Estimate,-2);
    $key = encodeDocu(substr($idx,0,1).substr($idx,-1).$idx.$sec);
?>
<script>
$(window).load(function () {
	$("#docuViewBox td[fno='M<?=$fno?>']").addClass("selected");
});
</script>

<div class="editBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">심사현황</div>
    			<?php if($btns){?>
				<ul class="button">
					<?=$btns?>
				</ul>
				<?php }?>
			</div>
		</div>
		<dl>
			<dt>심사No</dt><dd><?=$code?> (저장견적 <?=$request_data->iNo_Estimate?>) <span class="state"><?=$request_state[$request_data->cState_Request]?></span><span class="right"><?=substr($request_data->dInsert_Request,0,16)?></span></dd>
			<dt>모델</dt><dd><?=($request_data->cModel_Estimate) ? $request_data->cModel_Estimate:"&nbsp;"?></dd>
			<dt>고객</dt><dd><?=($request_data->cCustomer_Estimate) ? $request_data->cCustomer_Estimate:"&nbsp;"?></dd>
        	<dt>메모</dt><dd><?=($request_data->tCounsel_Estimate) ? nl2br($request_data->tCounsel_Estimate):"&nbsp;"?></dd>
        	<dt>선택조건</dt><dd><?=$mon?>개월</dd>
        	<dt>월납입액</dt><dd><?=number_format($pmt)?></dd>
		</dl>
		
		
		</dl>
		<div class="buttonBox">
			<a href="http://tau.carren.co.kr/test/api/creditAgree.php?aictEtmtNo=<?=$key?>.<?=$request_data->iFno_Request?>&agId=<?=$_SESSION['id_Member']?>" target="_blank">상담접수 url 테스트 </a>
			<button class="right">탁송정보 입력</button>
			<button class="right">발주요청</button>
		</div>
		<div class="estmDocu">
			<div id="docuViewBox" class="docuBox">
				<?=stripslashes(htmlspecialchars_decode($request_data->tDocument_Estimate))?>
			</div>
		</div>
	</div>
	
	<div style="margin: 20px; ">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>
	
</div>