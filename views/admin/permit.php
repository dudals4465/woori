<div class="listBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">권한 지정</div>
			</div>
		</div>
		<div class="searchBox">
			<form id="formAdmin" action="/api/config/permit" method="POST">
			<span>
				아이디 <input type="text" name="id" value="">
				<label><input type="checkbox" name="permit[]" value="M"><span>관리자</span></label>
				<label><input type="checkbox" name="permit[]" value="D"><span>선구매 등록</span></label>
				<label><input type="checkbox" name="permit[]" value="T"><span>시승차 허용</span></label>
				<label><input type="checkbox" name="permit[]" value="p"><span>선구매 제한</span></label>
				<label><input type="checkbox" name="permit[]" value="r"><span>렌트 제한</span></label>
				<label><input type="checkbox" name="permit[]" value="l"><span>리스 제한</span></label>
				<label><input type="checkbox" name="permit[]" value="f"><span>할부 제한</span></label>
				<label><input type="checkbox" name="permit[]" value="U"><span>중고 리스 허용</span></label>
				<button id="btnPermit">권한 설정</button>
			</span>
			</form>
		</div>
		<ul class="list board">
			<?php if($permit_list){
			         foreach($permit_list as $row){
			             $permit = "";
			             if(strpos($row->cContent_Config,"M")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "관리자 권한";
			             }
			             if(strpos($row->cContent_Config,"D")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "선구매 등록";
			             }
			             if(strpos($row->cContent_Config,"T")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "시승차 견적 허용";
			             }
			             if(strpos($row->cContent_Config,"p")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "선구매 견적 제한";
			             }
			             if(strpos($row->cContent_Config,"r")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "렌트 견적 제한";
			             }
			             if(strpos($row->cContent_Config,"l")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "리스 견적 제한";
			             }
			             if(strpos($row->cContent_Config,"f")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "할부 견적 제한";
			             }
			             if(strpos($row->cContent_Config,"U")!==false){
			                 if($permit)  $permit .= ", ";
			                 $permit .= "중고 리스 허용";
			             }
    			?>
    			<li><a href="javascript:void(0)">
    				<span class="subj">
    					<?=$row->cID_Member?> (<?=$permit?>)
    				</span>
    				<span class="date"><button class="denDelPermit" mem="<?=$row->cID_Member?>">삭제</button></span>
    				</a>
    			</li>
    	<?php }}else{?>
    		<li class="blank">설정된 내역이 없습니다.</li>
    	<?php }?>
		</ul>
		<form id="formError" action="/admin/action/error" method="POST"></form>
	</div>
</div>
<script>
$(function () {
 	// 검색
    $(document).on("click", "#btnPermit", function () {
    	var id = $.trim($("#formAdmin input[name='id']").val());
    	$("#formAdmin input[name='id']").val(id);
    	if(id.length<3){
    		alert("아이디를 정확히 입력해 주세요.");
    		$("#formAdmin input[name='id']").focus();
    		return false;
    	}else if($("#formAdmin input[name='permit[]']:checked").length==0){
    		alert("부여할 권한을 선택해 주세요.");
    		return false;
    	}
    });
    $(document).on("click", ".denDelPermit", function () {
    	var id = $(this).attr("mem");
    	$("#formAdmin input[name='id']").val(id);
    	$("#formAdmin").attr("action","/api/config/permitDel");
    	$("#formAdmin").submit();
    });
});
</script>