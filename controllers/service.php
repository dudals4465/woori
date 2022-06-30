<?php
class Service extends Controller
{
    public function index()
    {
        header("location:/");
        exit;
    }
    public function certify($job)
    {
        $dirGnb = "service";
        $dirLnb = "certify";
        
        if(isset($_GET['kind']) && $_GET['kind']){
            $_SESSION['certifyKind'] = $_GET['kind'];
        }
        
        
        if($job=="request") $titleGnb = "회원가입";
        else if($job=="searchid") $titleGnb = "아이디 찾기";
        else if($job=="searchpw") $titleGnb = "비밀번호 찾기";
        else if($job=="reset") $titleGnb = "비밀번호 변경";
        else $titleGnb = "본인인증";
        
        require 'views/_layout/loginH.php';
        if($job=="confirm"){
            require 'views/service/certifyconfirm.php';
        }else if($job=="apply"){
            require 'views/service/certifyapply.php';
        }else{
            require 'views/service/certifyrequest.php';
        }
        require 'views/_layout/loginF.php';
    }
    public function apply()
    {
        $dirGnb = "service";
        $dirLnb = "apply";
        $titleGnb = "회원가입";
        
        $num = rand(1000000000000000, 9999999999999999);
        $_SESSION['token'] = encodeDocu($num);
        
        $getConfig = true;
        if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $fileTmp = "_";
        else $fileTmp = "";
        if(file_exists(SITE_PATH.$fileTmp."registerConfig.json")){
            $fileTime = date("Y-m-d H:i:s", filemtime(SITE_PATH.$fileTmp."registerConfig.json"));
            $compTime = date("Y-m-d H:i:s", strtotime('-1 hours'));
            if($fileTime>$compTime){
                $getConfig = false;
            }else{
                copy(SITE_PATH.$fileTmp."registerConfig.json",SITE_PATH.$fileTmp."registerConfig-".time().".json");
            }
        }
        $getConfig = true;
        if($getConfig){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/register"; // 디에이시스템 API 테스트용
                // 헤더값 aict 만 필요
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST방식으로 보낼 JSON데이터 생성
            $req['Header']['serviceID'] = 'COMMI00011';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "3";  // 영업부서 확인 ?
            $req['Message']['reqDptInfoList'] = ""; // 지정 없어 빈값 보냄
            
            // $req['Message']['reqDptInfoList']['type'] = 'ag';
            $reqJson = json_encode($req);
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
            else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
            $rtnd = json_decode($getJson, true);
            $data['branch'] = $rtnd['Message']['resDptInfoList'];
            // 파일 쓰기
            $str = json_encode($data);
            $jsonFile = fopen(SITE_PATH.$fileTmp."registerConfig.json", "w");
            fwrite($jsonFile, $str);
        }
        
        require 'views/_layout/loginH.php';
        require 'views/service/apply.php';
        require 'views/_layout/loginF.php';
    }
    public function reset()
    {
        $dirGnb = "service";
        $dirLnb = "reset";
        $titleGnb = "비밀번호 찾기";
        
        require 'views/_layout/loginH.php';
        require 'views/service/reset.php';
        require 'views/_layout/loginF.php';
    }
    public function policy()
    {
        $dirGnb = "service";
        $dirLnb = "policy";
        $titleGnb = "이용약관";
        
        if(GRADE_AUTH=="N"){
            require 'views/_layout/loginH.php';
            require 'views/service/policy.php';
            require 'views/_layout/loginF.php';
        }else{
            require 'views/_layout/header.php';
            require 'views/service/policy.php';
            require 'views/_layout/footer.php';
        }
    }
    public function message($idx)
    {
        if(!isset($idx)){
            $idx = "";
        }
        if($idx=="error" && !isset($_SESSION['hex_Device'])){
            header("location:/");
            exit;
        }
        
        $dirGnb = "service";
        $dirLnb = "message";
        $titleGnb = "이용안내";
        
        require 'views/_layout/loginH.php';
        require 'views/service/message.php';
        require 'views/_layout/loginF.php';
    }
}
?>