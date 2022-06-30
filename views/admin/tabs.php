<div class="headTab">
	<div class="frame">
		<ul>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"M")!==false)){?><li class="<?=($dirLnb=="member") ? "on":"";?>"><a href="/admin/member/list">회원관리</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"A")!==false)){?><li class="<?=($dirLnb=="agency") ? "on":"";?>"><a href="/admin/agency/list">에이전시</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"D")!==false)){?><li class="<?=($dirLnb=="dealer") ? "on":"";?>"><a href="/admin/dealer/list">수입딜러사</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"C")!==false)){?><li class="<?=($dirLnb=="codes") ? "on":"";?>"><a href="/admin/codes/list/group">코드매핑</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"G")!==false)){?><li class="<?=($dirLnb=="goods") ? "on":"";?>"><a href="/admin/goods/list/all">금융상품</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"V")!==false)){?><li class="<?=($dirLnb=="data") ? "on":"";?>"><a href="/admin/data">차량DB</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"M")!==false)){?><li class="<?=($dirLnb=="error") ? "on":"";?>"><a href="/admin/error">오류해제</a></li><?php }?>
        	<?php if(GRADE_AUTH=="S" || (GRADE_AUTH=="M" && strpos($_SESSION['permit_Member'],"R")!==false)){?><li class="<?=($dirLnb=="request") ? "on":"";?>"><a href="/admin/request/list">견적심사</a></li><?php }?>
        </ul>
	</div>
</div>