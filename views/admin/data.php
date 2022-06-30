<?php 
    
?>

<style>
    #formConfig input { width: 100%; border: 1px solid #ccc; }
    #formConfig dd .desc { color: #999; }
    #formConfig dd .error { color: red; }
    #formConfig dd .error { color: red; }
</style>
<script>
token = "<?=$_SESSION['token']?>";
</script>
<div class="listBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">데이터 전송</div>
			</div>
		</div>
    	<div class="information">
        	날짜별로 전송 이력을 보실 수 있습니다.
        </div>
        <ul class="list" id="dataSendList">
        	<?php  foreach($files as $val){?>
        	<li><span><?=substr($val,7,10)?></span> <button class="view">데이터 보기</button> <button class="log">로그 보기</button> <button class="resend">재전송 하기</button></li>
        	<?php }?>
        </ul>
	</div>
</div>

<script>
    $(document).on("click", "#dataSendList button", function () {
        var job = $(this).attr("class");
        var date = $(this).parent().find('span').text();
        if(job=="log"){
            var Dpath = "log_"+date;
        	var url = "/D/data/log?day="+date+"&token="+token;
        	getjsonData(url,Dpath);
        	var str = "<div>";
			if(dataBank[Dpath]['Message']['log']=="none"){
				str += "<div>이력 없음, 데이터 전송 필요</div>";
			}else{
				str += "<div>"+dataBank[Dpath]['Message']['rslt'].replace(/\n/g,"<br>")+"</div>";
			}
			str += "</div>";

			$("#framePopup .content").html(str);
			$("#framePopup h3").text("발송 로그 "+date);
		    openPopupView(800,'framePopup');
        }else if(job=="view"){
            var Dpath = "view_"+date;
        	var url = "/D/data/view?day="+date+"&token="+token;
        	getjsonData(url,Dpath);
        	var str = "<div>";
			str += "<div>"+dataBank[Dpath]['Message']['data'].replace(/\n/g,"<br>")+"</div>";
			str += "</div>";

			$("#framePopup .content").html(str);
			$("#framePopup h3").text("Data 현황 "+date);
		    openPopupView(800,'framePopup');
        }else if(job=="resend"){
        	var Dpath = "send_"+date;
        	var url = "/D/data/resend?day="+date+"&token="+token;
        	getjsonData(url,Dpath);
        	$(this).prev().click();
        }
    });
</script>