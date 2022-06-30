<?php 
    $btns = '';
    if(strpos($_SESSION['permit_Member'],"M")!==false){
        $btns = '<li><a class="edit" href="/board/'.$dirLnb.'/add">글쓰기</a></li>';
    }
?>

<div class="faqBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title"><?=$titleGnb?></div>
    			<?php if($btns){?>
				<ul class="button">
					<?=$btns?>
				</ul>
				<?php }?>
			</div>
		</div>
		<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?>
		<form id="formBoard" action="/board/action/<?=$dirLnb?>" method="POST">
		<ul class="list sortable"  id="sortable">
		<?php }else{?>
		<ul class="list">
		<?php }?>
		<?php if(count($board_list)){
    			    foreach($board_list as $row){
    			        if($row->iState_Board=="2") $cls = "blind";
    			        else $cls = "";
    			?>
    			<li class="<?=$cls?>"><?php if(strpos($_SESSION['permit_Member'],"M")!==false){?><input type="hidden" name="idx[]" value="<?=$row->iIdx_Board?>"><?php }?>
    				<a href="javascript:void(0)">
    					<div class="subj"><?=stripslashes($row->cSubject_Board)?> <?php if(strpos($_SESSION['permit_Member'],"M")!==false){?><button no='<?=$row->iIdx_Board?>'>수정</button><?php }?></div>
    				</a>
    				<div class="cont" <?=($idx==$row->iIdx_Board) ? "style='display: block;'":""?>>
						<?php 
						if($row->cFormat_Board=="html"){
						    $msg = stripslashes(htmlspecialchars_decode($row->tMessage_Board));
        				       echo $msg;
        				   }else{
        				       $msg = str_replace("\t",'&nbsp;&nbsp;&nbsp;&nbsp;',$row->tMessage_Board);
        				       $msg = str_replace("    ",'&nbsp;&nbsp;&nbsp;&nbsp;',$msg);
        				       echo stripslashes(nl2br($msg));
        				   }
        				?>
					</div>
    			</li>
    	<?php }}else{?>
    		<li class="blank">검색된 결과가 없습니다.</li>
    	<?php }?>
		</ul>
		<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?>
			<div class="buttonBox">
				<input type="hidden" name="act" value="order">
				<button no='order'>정렬 변경</button>
			</div>
			</form>
		<?php }?>
	</div>
</div>
<script>
$(function () {
	<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?>
	$('#sortable').sortable();
	<?php }?>
	
	$(document).on("click", ".faqBox .list a", function () {
    	if($(this).next().css("display")=="block"){
    		$(this).next().slideUp("fast");
    	}else{
    		$(this).next().slideDown("fast");
    	}
    });
    $(document).on("click", ".faqBox .list a button", function () {
        window.location.href="/board/faq/edit?no="+$(this).attr('no');
        return false;
    });
    $(document).on("click", "#formBoard button", function () {
        if($(this).attr('no')!="order"){
        	return false;
        }else if(!confirm("정렬을 변경 하시겠습니까?")){
			return false;
		}
	});
});

    
</script>