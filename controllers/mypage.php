<?php
class Mypage extends Controller
{
	public function index()
	{
	    $titleGnb = "내 정보";
	    $dirGnb = "mypage";
	    $dirLnb = "info";
	    
	    require 'views/_layout/header.php';
	    require 'views/mypage/info.php';
	    require 'views/_layout/footer.php';
	}
	public function action($table)
	{
	    if($table=="passwd"){
	        if(!isset($_SESSION['mode']) || $_SESSION['mode']==""){
	            exit;
	        }
	        if($_SESSION['mode']=="aict") $url = "http://ep.aictcorp.com/hana/api/change"; // 디에이시스템 API 테스트용
	        else $url = "http://localhost:8080/hanacapital_message.jsp"; // 하나캐피탈 데몬용
	        
	        // 헤더값
	        $headers = array(
	            'Content-Type:application/json',
	            'Accept: application/json'
	        );
	        
	        // POST방식으로 보낼 JSON데이터 생성
	        $post['Header']['serviceID'] = 'COMMI00001';
	        $post['Header']['version'] = '1.0';
	        $post['Message']['reqInfo']['ccoCustNo'] = '6503068349';
	        $post['Message']['reqInfo']['ccoCustSno'] = '1';
	        $post['Message']['reqInfo']['prdtCd'] = '410019';
	        $post['Message']['id'] = $_SESSION['id_Member'];
	        $post['Message']['pw'] = $_POST['userPw'];
	        $post['Message']['pw2'] = $_POST['userPwNew'];
	        $post['Message']['issue'] = 'change';
	        $postJson = json_encode($post);
	        
	        $g = connect_curl($url,$headers,$postJson);
	        $json = json_decode($g, true);
	        if($json['Message']['rspnsCd']==1){
	            $_SESSION['state_Member'] = 1;
	            $_SESSION['count_Error'] = 0;
	            $_SESSION['msg_Error'] = "";
	            header("location:/mypage?msg=changed");
	            exit;
	        }else if($json['Message']['rspnsCd']==2){
	            if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']) $_SESSION['count_Error'] ++;
	            else $_SESSION['count_Error'] = 1;
	            $_SESSION['msg_Error'] = $json['Message']['rspnsMsgCtnt'];
	            if($_SESSION['count_Error']>=5){
	                $_SESSION['state_Member'] = 2;
	                $_SESSION['ip_Device'] = $_SERVER['REMOTE_ADDR'];
	                $_SESSION['hex_Device'] = encodeDocu(mt_rand(100000, 999999));
	            }
	            header("location:/mypage?msg=error");
	            exit;
	        }else{
	            $_SESSION['state_Member'] = 0;
	            $_SESSION['msg_Error'] = "오류가 발생하였습니다.";
	            header("location:/desk");
	            exit;
	        }
	    }else if($table=="save"){
	        if($_POST['work']=="del"){
	            $estimate_model = $this->loadModel('estimateModel');
	            $estimate_model->changeEstimateData($_POST['no'],9,"iState_Estimate");
	            header('location: '.$_SERVER['HTTP_REFERER']);
	        }
	    }
	}
}
