<div class="headBox">
	<div class="frame">
    	<div class="searchBox" id="goodsSearch">
    		<span class="count">목록 <?=number_format(count($codes_list))?> 건</span>
    	</div>
    </div>
</div>

<div class="listBox">
	<div class="frame">
		<div class="index">
			<span>코드</span>
			<span>명칭</span>
			<span>매핑</span>
			<span>사용</span>
			<span>설정</span>
			<span>메모</span>
			<span class="state">상태</span>
		</div>
		<ul class="list" id="codesList">
		<?php 
                foreach($codes_list as $row){
        ?>
            <li class="state<?=$row->iState_Codes?>"><a href="/admin/codes/view/<?=$row->cCode_Codes?>">
            	<span class="code"><?=$row->cCode_Codes?></span>
            	<span class="name"><?=$row->cName_Codes?></span>
            	<span class="map"><?=($row->cMap_Codes) ? $row->cMap_Codes:"&nbsp;"?></span>
            	<span class="use"><?=$use_define[$row->cUse_Codes]?></span>
            	<span class="set"><?=($row->cSet_Codes) ? $row->cSet_Codes:"&nbsp;"?></span>
            	<span class="remark"><?=($row->cRemark_Codes) ? $row->cRemark_Codes:"&nbsp;"?></span>
            	<span class="state"><?=$state_define[$row->iState_Codes]?></span>
            </a></li>
        <?php }
            if(!$codes_list){
        ?>
        	<li class="blank">검색된 결과가 없습니다.</li>
        <?php }?>
		</ul>
		<div class="buttonBox"><a href='/admin/codes/add/group'>카테고리 | 추가하기</a></div>
	</div>
</div>
<script>
$(function () {
	 
});
</script>


