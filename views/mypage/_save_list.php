<?php 
    $btns = '<li><a class="list" href="/mypage/request/list">심사현황</a></li>';
?>

<div class="listBox">
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
		<div class="searchBox">
			<span class="">전체 <?=number_format($estimate_total->count)?>개</span>
			<span>
				<select name="kind" id="searchKind">
					<option value="customer" <?=(isset($_GET['kind']) && $_GET['kind']=="customer") ? "selected":""?>>고객</option>
					<option value="subject" <?=(isset($_GET['kind']) && $_GET['kind']=="subject") ? "selected":""?>>제목</option>
					<option value="model" <?=(isset($_GET['kind']) && $_GET['kind']=="model") ? "selected":""?>>모델</option>
					<option value="counsel" <?=(isset($_GET['kind']) && $_GET['kind']=="counsel") ? "selected":""?>>메모</option>
				</select>
				<input type="text" name="search" id="searchText" value="<?=(isset($_GET['search'])) ? $_GET['search']:""?>">
				<button id="btnSearch">검색</button>
			</span>
		</div>
		<form id="formEstimateList" action="/mypage/action/save" method="POST">
		<ul class="list save">
		<?php if($estimate_total->count){
    	    foreach($estimate_list as $row){
		?>
			<li>
				<a href="/mypage/save/<?=$row->iNo_Estimate?>">
					<label><input type="checkbox" name="no[]" value="<?=$row->iNo_Estimate?>"><span>&nbsp;</span></label>
					<span class="no"><?=$row->iNo_Estimate?><span><?=$row->cCustomer_Estimate?></span></span>
					<span class="model"><b><?=$row->cSubject_Estimate?></b> <?=$row->cModel_Estimate?><span class="memo"><?=$row->tCounsel_Estimate?></span></span>
					<span class="date"><?=substr($row->dInsert_Estimate,0,10)?></span>
					<?php if(isset($request_state[$row->cState_Request])){?>
						<span class="state" style="width: 200px; "><?=$request_state[$row->cState_Request]?> <?=($row->cStateReq_Request) ? $request_stateH[$row->cStateReq_Request]:""?></span>
					<?php }else{?>
						<span class="state">가견적</span>
					<?php }?>
				</a>
				
			</li>
		<?php }}else{?>
    		<li class="blank">검색된 견적이 없습니다.</li>
    	<?php }?>
		</ul>
		<input type="hidden" name="work" value="del">
		</form>
		<div class="buttonBox">
			<button class="left" id="btnEstmDel">선택항목 삭제</button>
		</div>
		<?php if($page_list){?><div class="pageBox" id="pageButton" link="/mypage/save/list?<?=(isset($_GET['search'])) ? "search=".urlencode($_GET['search'])."&kind=".$_GET['kind']."&":""?>"><?=$page_list?></div><?php }?>
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
    			window.location.href = "/mypage/save/list?search="+encodeURI(word)+"&kind="+$("#searchKind").val();
    		}else{
    			window.location.href = "/mypage/save/list";
    		}
    	}
    });
});
</script>