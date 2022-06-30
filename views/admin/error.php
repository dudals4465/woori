<div class="adminBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">오류 해제</div>
			</div>
		</div>
		<ul class="sessList">
<?php
	$handle  = opendir(DIR_SESS);	// 핸들 획득
	$c = 0;
	while (false !== ($filename = readdir($handle))) {
	    if($filename == "." || $filename == ".." || $filename == "_ClearTime.txt" || strpos($filename,".json")!==false || strpos($filename,".log")!==false || strpos($filename,".txt")!==false || $filename == "sess_".session_id()){
			continue;
		}
		if(is_file(DIR_SESS . "/" . $filename)){		// 파일인 경우
			$sess = sessionDecode(file_get_contents(DIR_SESS."/".$filename));
			$time = date ("Y-m-d H:i:s", filemtime(DIR_SESS . "/" . $filename));
			$c ++;
			if(isset($sess['hex_Device'])){
			    echo "<li><span class='code'>".$sess['hex_Device']."</span><span class='ip'>".$sess['ip_Device']." </span><span class='time'>".$time."</span><button class='errorDel' sess='".$filename."'>삭제</button></li>";
			}
		}
	}
	if($c == 0){
	    echo "<li class='blank'>오류 세션이 없습니다.</li>\n";
	}
?>
		</ul>
		<form id="formError" action="/admin/action/error" method="POST"></form>
	</div>
</div>

<script>
$(document).on("click", "button.errorDel", function () {
	if(confirm("오류 상태를 초기화 하시겠습니까?")){
		$("#formError").html("<input type='hidden' name='sess' value='"+$(this).attr('sess')+"'>");
		$("#formError").submit();
	}
});
</script>