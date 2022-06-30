<?php 
    $btns = '<li><a class="list" href="/board/'.$dirLnb.'/list">목록</a></li>';
    
    if((isset($board_data) && $board_data->cFormat_Board=="html")){
        $ckdText = "";
        $ckdHtml = "checked";
    }else{
        $ckdText = "checked";
        $ckdHtml = "";
    }
    
?>

<div class="editBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title"><?=$titleGnb?> > 글쓰기</div>
    			<?php if($btns){?>
				<ul class="button">
					<?=$btns?>
				</ul>
				<?php }?>
			</div>
		</div>
		<form id="formBoard" action="/board/action/<?=$dirLnb?>"  method="POST" enctype="multipart/form-data">
		<dl>
			<dt>제목</dt>
			<dd class="full"><input type="text" name="subject" value="<?php if(isset($board_data)) echo stripslashes($board_data->cSubject_Board)?>"></dd>
			<?php if(isset($board_data)){?>
			<dt>노출</dt>
			<dd>
				<label><input type="radio" name="state" value="1" <?=($board_data->iState_Board=="1") ? "checked":""?>><span>표시</span></label>
				<label><input type="radio" name="state" value="2" <?=($board_data->iState_Board=="2") ? "checked":""?>><span>중지</span></label>
			</dd>
			<?php }?>
			<?php if(0){?>
			<dt>형식</dt>
			<dd><label><input type="radio" name="format" value="text" <?=$ckdText?>><span>text</span></label><label><input type="radio" name="format" value="html" <?=$ckdHtml?>><span>html</span></label></dd>
			<?php }?>
			<dt>내용</dt>
			<dd><textarea name="message" value="" placeholder="내용을 입력해 주세요."><?=(isset($board_data))?stripslashes($board_data->tMessage_Board):""?></textarea></dd>
			<dt>첨부</dt>
			<dd>
				<div class="addButton" id="attachAdd"><button kind="photo" name="이미지">이미지</button> <button kind="file" name="파일">파일</button></div>
    			<ul class="attachList" id="attachList">
    				<?php 
    				    if(isset($attach_list)){
    				        foreach($attach_list as $row){
    				            echo "<li>";
    				            echo "<div class='data'>\n";
    				            if($row->cKind_File=="photo"){
    				                echo "<span>이미지</span> <div class='photo'><img src='/images/".$row->cDirectory_File."/".$row->cName_File."'></div>\n";
    				                echo "<input type='hidden' value='".$row->cDirectory_File."/".$row->cName_File."' name='images[]'>\n";
    				            }else if($row->cKind_File=="file"){
    				                $key = encodeDocu(substr($row->iIdx_File,0,1).substr($row->iIdx_File,-1).$row->iIdx_File.substr($bNo,-2));
    				                echo "<span>파일</span> <a style='color: blue' href='/api/down/".$key."?token=".$_SESSION['token']."'>".$row->cSubject_File."</a>\n";
    				                echo "<input type='hidden' value='".$row->cDirectory_File."/".$row->cName_File."' name='images[]'>\n";
    				            }
    				            echo "<input type='hidden' value='mod' name='attachAct[]'>\n";
    				            echo "<input type='hidden' value='".$row->iIdx_File."' name='attachIdx[]'>\n";
    				            echo "<input type='hidden' value='".$row->cKind_File."' name='attachKind[]'>\n";
    				            if($row->cKind_File=="photo" || $row->cKind_File=="file"){
    				                echo "<input type='file' value='' name='attachFile[]'  placeholder='파일선택' style='display:none;'>\n";
    				            }
    				            echo "</div>\n";
    				            echo "<div class='button'>\n";
    				            echo "<button class='icon up'>∧</button> <button class='icon down'>∨</button> <button class='icon delete'>×</button>\n";
    				            echo "</div>\n";
    				            if($row->cKind_File=="photo"){
    				                echo "<div class='subj'><textarea name='attachSubject[]'  placeholder='이미지 설명 (alt 표시, 100자 이내)'>".stripslashes($row->cSubject_File)."</textarea></div>\n";
    				            }else if($row->cKind_File=="file"){
    				                echo "<input type='hidden' name='attachSubject[]' value='".$row->cSubject_File."'>\n";
    				            }
    				            echo "</li>\n";
    				        }
    				    }
    				?>
    			</ul>
			</dd>
		</dl>
		<div class="buttonBox">
			<input type="hidden" name="idx" value="<?=($bNo) ? $bNo:""?>">
			<input type="hidden" name="act" value="<?=($bNo) ? "mod":"add"?>">
        	<button id="submit"><?=($bNo) ? "수정하기":"입력하기"?> </button>
		</div>
		</form>
	</div>
</div>
<script>
	$(document).on("click", "#formBoard button#submit", function () {
		if(!$("#formBoard input[name='subject']").val()){
			alert("제목을 입력해주세요.");
			$("#formBoard input[name='subject']").focus();
			return false;
		}else if(!$("#formBoard textarea[name='message']").val()){
			alert("내용을 입력해주세요.");
			$("#formBoard textarea[name='message']").focus();
			return false;
		}
	});
	$(document).on("click", "#attachAdd button", function () {
		var kind = $(this).attr("kind");
		var name = $(this).attr("name");
		var str = "<li>";
		str += "<div class='data'>\n";
		str += "<span>"+name+"</span>\n";
		str += "<input type='hidden' value='add' name='attachAct[]'>\n";
		str += "<input type='hidden' value='' name='attachIdx[]'>\n";
		str += "<input type='hidden' value='"+kind+"' name='attachKind[]'>\n";
		if(kind=="photo"){
			str += "<input type='file' value='' name='attachFile[]'  placeholder='파일선택'> (형식 : jpg, jpeg, png, gif)\n";
			str += "<input type='hidden' value='' name='attachUrl[]'  placeholder='url 입력'>\n";
			str += "<input type='hidden' value='' name='images[]'>\n";
		}else if(kind=="file"){
			str += "<input type='file' value='' name='attachFile[]'  placeholder='파일선택'>\n";
			str += "<input type='hidden' value='' name='attachUrl[]'  placeholder='url 입력'>\n";
			str += "<input type='hidden' value='' name='images[]'>\n";
		}
		str += "</div>\n";
		str += "<div class='button'>\n";
		str += "<button class='icon up'>∧</button> <button class='icon down'>∨</button> <button class='icon delete'>×</button>\n";
		str += "</div>\n";
		if(kind=="photo"){
			str += "<div class='subj'><textarea name='attachSubject[]'  placeholder='이미지 설명 (100자 이내)'></textarea></div>\n";
		}
		str += "</li>\n";
		$("#attachList").append(str);
		return false;
	});
	//첨부 삭제
	$(document).on("click", "#attachList button.delete", function () {
		$obj = $(this).parent().parent();
		var act = $obj.find("input[name='attachAct[]']").val();
		if(act=="add"){
			 $obj.remove();
		}else{
			$obj.addClass("off");
			$obj.find("input[name='attachAct[]']").val("del");
		}
		return false;
	});
	// 첨부 이동 up
	$(document).on("click", "#attachList button.up", function () {
		$obj = $(this).parent().parent();
		$obj.prev().before($obj);
		return false;
	});
	// 첨부 이동 down
	$(document).on("click", "#attachList button.down", function () {
		$obj = $(this).parent().parent();
		$obj.next().after($obj);
		return false;
	});
</script>