<?php 
    $btns = '';
    if(strpos($_SESSION['permit_Member'],"M")!==false){
        $btns = '<li><a class="edit" href="/board/'.$dirLnb.'/add">글쓰기</a></li>';
    }
    if(isset($_GET['search']))$_GET['search'] = preg_replace("/[ #\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/i", "", $_GET['search']);
?>

<div class="listBox">
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
		<div class="searchBox">
			<span class="">전체 <?=number_format($board_total->count)?>개</span>
			<span>
				<select name="kind" id="searchKind">
					<option value="subject" <?=(isset($_GET['kind']) && $_GET['kind']=="subject") ? "selected":""?>>제목</option>
					<option value="content" <?=(isset($_GET['kind']) && $_GET['kind']=="content") ? "selected":""?>>내용</option>
				</select>
				<input type="text" name="search" id="searchText" value="<?=(isset($_GET['search'])) ? $_GET['search']:""?>">
				<button id="btnSearch">검색</button>
			</span>
		</div>
		<ul class="list board">
			<?php if(count($board_list)){
    			    foreach($board_list as $row){
    			        if($row->iState_Board=="2") $cls = "blind";
    			        else if($row->iState_Board=="8") $cls = "delete";
    			        else $cls = "";
    			        if($row->iNotice_Board)  $cls .=" accent";
    			?>
    			<li class="<?=$cls?>">
    				<a href="/board/<?=$dirLnb?>/<?=$row->iIdx_Board?>">
    				<span class="subj">
    					<?=stripslashes($row->cSubject_Board)?>
    				</span>
    				<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?>
    				<span class="count">&nbsp; (<?=number_format($row->iCount_Board)?>)</span>
    				<?php }?>
    				<span class="date <?=(substr($row->dInsert_Board, 0, 10)==date("Y-m-d")) ? "today":"";?>"><?=(substr($row->dInsert_Board, 0, 10)==date("Y-m-d")) ? "오늘 ".substr($row->dInsert_Board, 11, 5):substr($row->dInsert_Board, 0, 10)?></span>
    				</a>
    			</li>
    	<?php }}else{?>
    		<li class="blank">검색된 결과가 없습니다.</li>
    	<?php }?>
		</ul>
		<?php if($page_list){?><div class="pageBox" id="pageButton" link="/board/<?=$dirLnb?>/list?<?=(isset($_GET['kind']) && $_GET['kind']) ? "kind=".$_GET['kind']."&":"";?><?=(isset($_GET['search'])) ? "search=".urlencode($_GET['search'])."&":""?>"><?=$page_list?></div><?php }?>
	</div>
</div>
<script>
$(function () {
 	// 검색
    $(document).on("click", "#btnSearch", function () {
    	var word = $.trim($("#searchText").val());
    	if(word.length>0 && word.length<2){
    		alert("두 글자 이상 입력해 주세요.");
    	}else{
    		if(word){
    			window.location.href = "/board/<?=$dirLnb?>/list?search="+encodeURI(word)+"&kind="+$("#searchKind").val();
    		}else{
    			window.location.href = "/board/<?=$dirLnb?>/list";
    		}
    	}
    });
});
</script>