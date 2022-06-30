<div class="listBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">푸시 발송</div>
			</div>
		</div>
		<div class="pushBox">
			<h3>푸시 발송</h3>
				<h4>발송 테스트</h4>
				<div>
					참고 url : <a href="https://firebase.google.com/docs/cloud-messaging/http-server-ref?hl=ko&webview=layer" target="_blank">Firebase 클라우드 메시징 HTTP 프로토콜</a><br>
					참고 url : <a href="https://firebase.google.com/docs/cloud-messaging/server" target="_blank">서버 환경 및 FCM</a>
				</div>
				<h4>푸시 전송</h4>
				<form  method="POST" action="/views/admin/send.php" id="pushSend" target="_blank">
					<div>
						서버 키 : AAAAHKwnnyw:APA91bE5SsMSVxXltOx5UlLXJeKBfptjYQQAtyDu4cUtYPiyFAiU3zdTALvjMajEtEzloyfxEJQIxO0pEm1gbkRt-zFThglHkSSBuq8I6g2wRhzXfYv8f-y8fAbwcISYEowewKkL3XJo
					</div>
					<div>
						token <input type="text" name="ids" value="dzDQwsNXTcKDZAulEndcxx:APA91bFedJtKKUm6LL_GVJS6fZ5lEpWc3W4xuyo4e8dQISEgQALD8UjfwE4yEAYv1iv2dbvYVm2p9OBsdsz_Yav1OTEjBmvVh7Q2DpcP43ZuwRX2JzMTlHnkNKutXlLuwEtrNKwjlyx6" style="width: 80%" placeholder="기기의 등록 토큰" id="appToken">
					</div>
					<div>
						title <input type="text" name="title" value="하나캐피탈 알림 제목입니다." style="width: 80%" placeholder="알림의 제목"><br>
						body <input type="text" name="body" value="하나캐피탈 알림 내용입니다." style="width: 80%" placeholder="알림의 내용"><br>
						url <input type="text" name="url" value="<?=URL?>/mypage/request/list" style="width: 80%" placeholder="알림 클릭시 이동, 필요시"><br>
					</div>
					<button>전송</button>
				</form>
		</div>
	</div>
</div>
<script>
$(function () {
 	// 검색
    $(document).on("click", "#btnPermit", function () {
    	var id = $.trim($("#formAdmin input[name='id']").val());
    	$("#formAdmin input[name='id']").val(id);
    	if(id.length<6){
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