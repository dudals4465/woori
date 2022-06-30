<?php
class Newcar extends Controller
{
	public function index()
	{
	    header("location:/newcar/estimate/rent");
	    exit;
	}
	public function estimate($goods)
	{
	    $dirGnb = "newcar";
	    if($goods=="rent"){
	        if(isset($_COOKIE['start']) && strpos($_COOKIE['start'],"fastship")!==false){
	            $titleGnb = "선구매";
	            $dirSnb = "fastship";
	        }else{
	            $titleGnb = "렌트견적";
	            $dirSnb = "rent";
	        }
	    }else if($goods=="fince"){
	        $titleGnb = "할부견적";
	        $dirSnb = "fince";
	    }else{
	        $titleGnb = "리스견적";
	        $dirSnb = "lease";
	        $testride = false;
	    }
	    $dirLnb = "estimate";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    // 상품별 설정 만들기
	    $getConfig = true;
	    if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $fileTmp = "_";
	    else $fileTmp = "";
	    if(file_exists(SITE_PATH.$fileTmp.$goods."Config.json")){      // 1시간 지나면 설정 파일 새로 갱신함
	        $fileTime = date("Y-m-d H:i:s", filemtime(SITE_PATH.$fileTmp.$goods."Config.json"));
	        $compTime = date("Y-m-d H:i:s", strtotime('-1 hours'));
	        if($fileTime>$compTime){
	            $getConfig = false;
	        }else{
	            copy(SITE_PATH.$fileTmp.$goods."Config.json",SITE_PATH.$fileTmp.$goods."Config-".time().".json");
	        }
	    }
	    $getConfig = true;     // 운영시 제외
	    if($getConfig){
	        $url = "http://epa.aictin.com/caps/api/config"; // 디에이시스템 API 테스트용
	        $headers = array(
	            'Content-Type:application/json',
	            'Accept: application/json'
	        );
	        $req['header']['service'] = 'online';
	        $req['message']['goods'] = $goods;
	        $reqJson = json_encode($req);
	        $getData = connect_curl($url,$headers,$reqJson);   // 자체
	        $getJson = json_decode($getData, true);
	        $data = array();
	        //var_dump($getJson['message']);
	        $codesMatch['km'] = "milage";  // 코드 매칭
	        $codesMatch['custType'] = "buyType";
	        foreach($getJson['message'] as $key => $val){
	            if(isset($codesMatch[$key])) $key = $codesMatch[$key];
	            foreach($val as $row){
	                if(isset($data['list'][$key])) $data['list'][$key] .= ",".$row['code'];
	                else $data['list'][$key] = $row['code'];
	                $data[$key][$row['code']]['name'] = $row['name'];
	                $data[$key][$row['code']]['use'] = $row['use'];
	            }
	        }
	        $str = json_encode($data);
	        $jsonFile = fopen(SITE_PATH.$fileTmp.$goods."Config.json", "w");
	        fwrite($jsonFile, $str);
	    }
	    
	    /* // 개인설정 불러오기
	    $estimate_model = $this->loadModel('estimateModel');
	    $estmConfig = $estimate_model->getConfigView("estimate");
	    if($estmConfig){
	        $memCfg = extractValue($estmConfig->cContent_Config,"\n", "\t", 0, 1);
	    } */
	    
	    require 'views/_layout/header.php';
	    require 'views/newcar/estimate.php';
	    require 'views/_layout/footer.php';
	}
	public function fastship($idx)
	{
	    if($idx=="add" && strpos($_SESSION['permit_Member'],"D")===false){
	        header("location:/newcar/fastship/list");
	        exit;
	    }
	    if($_SESSION['permit_Member'] && strpos($_SESSION['permit_Member'],"p")!==false){
	        header("location:/");
	        exit;
	    }
	    
	    $titleGnb = "선구매";
	    $dirGnb = "newcar";
	    $dirLnb = "fastship";
	    
	    if($idx=="add"){
	        $num = rand(1000000000000000, 9999999999999999);
	        $_SESSION['token'] = encodeDocu($num);
	        
	        $dataBrandList = json_decode(file_get_contents(DATA_PATH."brandList_local.json"), true);
	        // $estmDefault =  json_decode(file_get_contents("config/estimateDefault.json"), true);
	    }else if($idx=="list"){
	        $num = rand(1000000000000000, 9999999999999999);
	        $_SESSION['token'] = encodeDocu($num);
	        if(isset($_GET['company'])){
	            if($_GET['company']){
	                $_SESSION["custno_Fastship"] = $_GET['company'];
	                $_SESSION["name_Fastship"] = $_GET['name'];
	            }else{
	                $_SESSION["custno_Fastship"] = "";
	                $_SESSION["name_Fastship"] = "";
	            }
	        }
	        if($_SESSION['mode']=="aict"){
	            $url = "http://ep.aictcorp.com/hana/api/fastList"; // 디에이시스템 API 테스트용
	            // 헤더값 aict 만 필요
	            $headers = array(
	                'Content-Type:application/json',
	                'Accept: application/json'
	            );
	        }
	        // POST방식으로 보낼 JSON데이터 생성
	        $req['Header']['serviceID'] = 'UCARI00016';
	        $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	        $req['Message']['reqInfo']['ccoCustSno'] = '0';
	        $req['Message']['reqInfo']['dvCd'] = "MODELCOUNT";
	        $req['Message']['reqMap']['agId'] = $_SESSION["id_Member"];
	        if(isset($_SESSION["custno_Fastship"]) && $_SESSION["custno_Fastship"]){
	            if($_SESSION["custno_Fastship"]=="all") $req['Message']['reqMap']['inqrCprnCustNo'] = "";
	            else $req['Message']['reqMap']['inqrCprnCustNo'] = $_SESSION["custno_Fastship"];
	        }
	        $reqJson = json_encode($req);
	        if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	        else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	        $rtnd = json_decode($getJson, true);
	        $data = $rtnd['Message']['modelcntList'];
	        $dataModelList =  json_decode(file_get_contents(DATA_PATH."modelList_search.json"), true);
	    }else{
	        if($_SESSION['mode']=="aict"){
	            $url = "http://ep.aictcorp.com/hana/api/fastView"; // 디에이시스템 API 테스트용
	            // 헤더값 aict 만 필요
	            $headers = array(
	                'Content-Type:application/json',
	                'Accept: application/json'
	            );
	        }
	        // POST방식으로 보낼 JSON데이터 생성
	        $req['Header']['serviceID'] = 'UCARI00016';
	        $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	        $req['Message']['reqInfo']['ccoCustSno'] = '0';
	        $req['Message']['reqInfo']['dvCd'] = "MODELLIST";
	        $req['Message']['reqMap']['mdlNo'] = $idx;
	        $req['Message']['reqMap']['agId'] = $_SESSION["id_Member"];
	        if(isset($_SESSION["custno_Fastship"]) && $_SESSION["custno_Fastship"]){
	            if($_SESSION["custno_Fastship"]=="all") $req['Message']['reqMap']['inqrCprnCustNo'] = "";
	            else $req['Message']['reqMap']['inqrCprnCustNo'] = $_SESSION["custno_Fastship"];
	        }
	        $reqJson = json_encode($req);
	        if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	        else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	        $rtnd = json_decode($getJson, true);
	        $data = $rtnd['Message']['modeldtlList'];
	        
	        $model = $idx;
	        $dataModelView =  json_decode(file_get_contents(DATA_PATH."modelData_".$model.".json"), true);
	        $brand = $dataModelView['model'][$model]['brand'];
	    }
	    
	    require 'views/_layout/header.php';
	    if($idx=="list")  require 'views/newcar/fastship_list.php';
	    else if($idx=="add")  require 'views/newcar/fastship.php';
	    else require 'views/newcar/fastship_view.php';
	    require 'views/_layout/footer.php';
	}
	public function app($goods)
	{
	    if(!isset($goods)){
	        header("location:/newcar/app/rent");
	        exit;
	    }
	    $titleGnb = "견적내기";
	    $dirGnb = "newcar";
	    $dirLnb = "app";
	    
	    // 개인설정 불러오기
	    $estimate_model = $this->loadModel('estimateModel');
	    $estmConfig = $estimate_model->getConfigView("estimate");
	    if($estmConfig){
	        $memCfg = extractValue($estmConfig->cContent_Config,"\n", "\t", 0, 1);
	    }
	    
	    require 'views/_layout/appH.php';
	    require 'views/newcar/app.php';
	    require 'views/_layout/appF.php';
	}
}
