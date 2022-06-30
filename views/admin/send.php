<?php 
// http://blog.naver.com/PostView.nhn?blogId=cosmosjs&logNo=22074011813
// https://cosmosjs.blog.me/221352932438

function send_notification ($tokens, $data)
{
    $url = 'https://fcm.googleapis.com/fcm/send';
    $key = 'AAAAHKwnnyw:APA91bE5SsMSVxXltOx5UlLXJeKBfptjYQQAtyDu4cUtYPiyFAiU3zdTALvjMajEtEzloyfxEJQIxO0pEm1gbkRt-zFThglHkSSBuq8I6g2wRhzXfYv8f-y8fAbwcISYEowewKkL3XJo';
    //어떤 형태의 data/notification payload를 사용할것인지에 따라 폰에서 알림의 방식이 달라 질 수 있다.
    
    $noti = array(
        'title'	=> $data["title"],
        'body' 	=> $data["body"]
    );
    $msg = array(
        'url' 	=> $data["url"]
    );
   
    //data payload로 보내서 앱이 백그라운드이든 포그라운드이든 무조건 알림이 떠도록 하자.
    $fields = array(
        'registration_ids'		=> $tokens,
        'notification'		=> $noti,
        'data'	=> $msg
    );
    //구글키는 config.php에 저장되어 있다.
    $headers = array(
        'Authorization:key =' . $key,
        'Content-Type: application/json'
    );
    //var_dump($fields);
    //echo '<br><br>';
    //var_dump($headers);
    //echo '<br><br>';
    //echo json_encode($fields);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
    if ($result === FALSE) {
        die('Curl failed: ' . curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

$tokens = array();
$tokens[] = $_POST['ids'];
$inputData = array();
$inputData = array(
    'title'	=> $_POST["title"],
    'body' 	=> $_POST["body"],
    'url' 	=> $_POST["url"]
);
//echo '<meta charset="utf-8">';
//echo '{"multicast_id":7467979871464454558,"success":1,"failure":0,"canonical_ids":0,"results":[{"message_id":"0:1553641957071759%fb3e4444f9fd7ecd"}]}';
$result = send_notification($tokens, $inputData);
echo $result;
/*
var_dump($_POST);
echo "<br>----<br>";
var_dump($result);
*/
?>