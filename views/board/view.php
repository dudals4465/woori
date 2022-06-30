<?php 
    $btns = '<li><a class="list" href="/board/'.$dirLnb.'/list">목록</a></li>';
?>

<div class="viewBox">
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
		<div class="view">
			<div class="subject"><?=stripslashes($board_data->cSubject_Board)?></div>
			<div class="date"><?=substr($board_data->dInsert_Board, 0, 16)?></div>
			<div class="message">
				<?php 
				   if($board_data->cFormat_Board=="html"){
				       $msg = stripslashes(htmlspecialchars_decode($board_data->tMessage_Board));
				       echo $msg;
				   }else{
				       $msg = str_replace("\t",'&nbsp;&nbsp;&nbsp;&nbsp;',$board_data->tMessage_Board);
				       $msg = str_replace("    ",'&nbsp;&nbsp;&nbsp;&nbsp;',$msg);
				       echo stripslashes(nl2br($msg));
				   }
				?>
			</div>
			<?php 
				    if(isset($attach_list)){
				        foreach($attach_list as $row){
				            if($row->cKind_File=="photo"){
				                echo "<div class='photo'><img src='/images/".$row->cDirectory_File."/".$row->cName_File."' alt='".$row->cSubject_File."'></div>\n";
				            }else  if($row->cKind_File=="file"){
				                $key = encodeDocu(substr($row->iIdx_File,0,1).substr($row->iIdx_File,-1).$row->iIdx_File.substr($idx,-2));
				                echo "<div class='file'><b>[파일]</b> <a style='color: blue' href='/api/down/".$key."?token=".$_SESSION['token']."'>".$row->cSubject_File."</a></div>\n";
				            }
				        }
				    }
				?>
		</div>
		<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?>
		<div class="buttonBox">
			<form id="formBoard" action="/board/action/<?=$dirLnb?>" method="POST">
				<input type="hidden" name="idx" value="<?=$idx?>">
				<input type="hidden" name="act" value="">
			<?php if($board_data->iNotice_Board=="9"){?>
				<button act="pushdown" msg="중요를 해제">중요 해제</button>
			<?php }else{ ?>
				<button act="pushup" msg="중요로 지정">중요 지정</button>
			<?php }?>
			</form>
			<a href="/board/<?=$dirLnb?>/edit?no=<?=$bNo?>">수정</a>
		</div>
		<?php }?>
	</div>
</div>
<script>
	$(document).on("click", "#formBoard button", function () {
		var act = $(this).attr("act");
		var msg = $(this).attr("msg");
		if(!confirm("정말로 "+msg+" 하시겠습니까?")){
			return false;
		}
		$("#formBoard input[name='act']").val(act);
	});
</script>