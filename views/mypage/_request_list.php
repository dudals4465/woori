<?php 
    $btns = '<li><a class="list" href="/mypage/save/list">저장견적</a></li>';
?>

<div class="listBox">
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
		<div class="searchBox">
			<span class="">전체 <?=number_format($request_total->count)?>개</span>
			<span>
				<select name="kind" id="searchKind">
					<option value="customer" <?=(isset($_GET['kind']) && $_GET['kind']=="customer") ? "selected":""?>>고객</option>
					<option value="model" <?=(isset($_GET['kind']) && $_GET['kind']=="model") ? "selected":""?>>모델</option>
				</select>
				<input type="text" name="search" id="searchText" value="<?=(isset($_GET['search'])) ? $_GET['search']:""?>">
				<button id="btnSearch">검색</button>
			</span>
		</div>
		<ul class="list request">
		<?php if($request_total->count){
    	    foreach($request_list as $row){
    	        if($row->cState_Request=="A000") $code = "동의요청";
    	        //else if($row->cState_Request=="A001") $code = "동의완료";
    	        else $code = $row->cCode_Request;
    	        $fno = $row->iFno_Request;
    	        $data = json_decode($row->tData_Estimate, true);
    	        $mon = $data['fincData'][$fno]['month'];
    	        $pmt = $data['fincData'][$fno]['pmtGrand'];
		?>
			<li>
				<a href="/mypage/request/<?=$row->iNo_Estimate?>">
					<label><input type="checkbox" value="<?=$row->cCode_Request?>"><span>&nbsp;</span></label>
					<span class="no"><?=$code?><span><?=$row->cCustomer_Estimate?></span></span>
					<span class="model"><?=$row->cModel_Estimate?></span>
					<span class="cost"><?=$mon?>개월<br><?=number_format($pmt)?></span>
					<span class="date"><?=substr($row->dInsert_Request,0,10)?></span>
					<span class="state"><?=$request_state[$row->cState_Request]?></span>
				</a>
			</li>
		<?php }}else{?>
    		<li class="blank">검색된 신청이 없습니다.</li>
    	<?php }?>
		</ul>
		<div class="buttonBox">
			<button class="left">발주요청</button>
			<button class="left">탁송정보 입력</button>
		</div>
		<?php if($page_list){?><div class="pageBox" id="pageButton" link="/mypage/request/list?<?=(isset($_GET['search'])) ? "search=".urlencode($_GET['search'])."&kind=".$_GET['kind']."&":""?>"><?=$page_list?></div><?php }?>
	</div>
	
	<div style="margin: 20px; ">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>
	
</div>
<script>
$(function () {
    $(document).on("click", "#btnEstmDel", function () {
        if($("#formEstimateList input[name='no[]']:checked").length==0){
            alert("삭제할 견적을 선택해 주세요.");
            return false;
        }else if(confirm("선택한 견적을 정말로 삭제하시겠습니까?")){
            $("#formEstimateList").submit();
        }else{
    		return false;
    	}
    });
 	// 검색
    $(document).on("click", "#btnSearch", function () {
    	var word = $.trim($("#searchText").val());
    	if(word.length>0 && word.length<2){
    		alert("두 글자 이상 입력해 주세요.");
    	}else{
    		if(word){
    			window.location.href = "/mypage/request/list?search="+encodeURI(word)+"&kind="+$("#searchKind").val();
    		}else{
    			window.location.href = "/mypage/request/list";
    		}
    	}
    });
});
</script>