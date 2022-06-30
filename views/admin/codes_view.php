<?php 
    $group = $idx;

?>

<div class="headBox">
	<div class="frame">
    	<div class="head">
    		<span class="title"><?=$codes_data->cName_Codes?></span>
    		<span> (<?=$codes_data->cCode_Codes?>) <?=$codes_data->cSet_Codes?> <?=$codes_data->cRemark_Codes?></span>
    		<span> <?=$state_define[$codes_data->iState_Codes]?></span>
    		<a href="/admin/codes/edit/group.<?=$idx?>">수정</a>
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
			<span>상태</span>
		</div>
		<form id="formCodes" action="/admin/action/codes" method="POST">
		<ul class="list sortable" id="codesList">
		<?php 
                foreach($codes_list as $row){
        ?>
            <li class="state<?=$row->iState_Codes?>"><a href="/admin/codes/edit/<?=$idx?>.<?=$row->cCode_Codes?>">
            	<span class="code"><?=$row->cCode_Codes?></span>
            	<span class="name"><?=$row->cName_Codes?></span>
            	<span class="map"><?=($row->cMap_Codes) ? $row->cMap_Codes:"&nbsp;"?></span>
            	<span class="use"><?=$use_define[$row->cUse_Codes]?></span>
            	<span class="set"><?=($row->cSet_Codes) ? $row->cSet_Codes:"&nbsp;"?></span>
            	<span class="remark"><?=($row->cRemark_Codes) ? $row->cRemark_Codes:"&nbsp;"?></span>
            	<span class="state"><?=$state_define[$row->iState_Codes]?></span>
            	<input type="hidden" name="codes[]" value="<?=$row->cCode_Codes?>">
            </a></li>
        <?php }
            if(!$codes_list){
        ?>
        	<li class="blank">검색된 결과가 없습니다.</li>
        <?php }?>
		</ul>
		<div class="buttonBox">
			<a href='/admin/codes/add/<?=$idx?>'><?=$codes_data->cName_Codes?> | 추가하기</a>
			<button class="right gray" id="submit">정렬변경</button>
			<input type="hidden" name="act" value="order">
			<input type="hidden" name="group" value="<?=$idx?>">
		</div>
		</form>
		<div class="desc">
		<?php if($group=="residualCompany"){?>설정 ▶ 없음 : 일반 사용, A ~ 특정 조건 그룹 지정<?php }?>
		</div>
	</div>
</div>


<script>
$(function () {
	$('#codesList').sortable();
});
</script>


