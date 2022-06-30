<?php
class Usedcar extends Controller
{
	public function index()
	{
	    header("location:/newcar/estimate/rent");
	    exit;
	}
	public function estimate($goods)
	{
	    if(!isset($goods)){
	        header("location:/newcar/estimate/rent");
	        exit;
	    }
	    if($goods=="lease" && ($_SESSION['regs_Member']=="N" || $_SESSION['permit_Member'] =="" ||  strpos($_SESSION['permit_Member'],"U")===false)){
	        header("location:/");
	        exit;
	    }
	    
	    $dirGnb = "usedcar";
	    if($goods=="lease"){
	        $titleGnb = "리스견적";
	        $dirSnb = "lease";
	        $testride = false;
	    }else{
	        header("location:/");
	        exit;
	    }
	    $dirLnb = "estimate";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    //$dataBrandList = json_decode(file_get_contents(DATA_PATH."brandList_local.json"), true);
	    
	    // $estmDefault =  json_decode(file_get_contents("config/estimateDefault.json"), true);
	    // 설정파일 불러오기
	    // 파일 날짜 비교..
	    $getConfig = true;
	    if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $fileTmp = "_";
	    else $fileTmp = "";
	    if(file_exists(SITE_PATH.$fileTmp.$goods."UConfig.json")){
	        $fileTime = date("Y-m-d H:i:s", filemtime(SITE_PATH.$fileTmp.$goods."UConfig.json"));
            $compTime = date("Y-m-d H:i:s", strtotime('-1 hours'));
            if($fileTime>$compTime){
                $getConfig = false;
            }else{
                copy(SITE_PATH.$fileTmp.$goods."UConfig.json",SITE_PATH.$fileTmp.$goods."UConfig-".time().".json");
            }
        }
        //if(!isset($_SESSION['mode']) || $_SESSION['mode']!="aict") 
        $getConfig = true;
	    if($getConfig){
	        if($_SESSION['mode']=="aict"){
	            $url = "http://ep.aictcorp.com/hana/api/config"; // 디에이시스템 API 테스트용
        	    // 헤더값 aict 만 필요
        	    $headers = array(
        	        'Content-Type:application/json',
        	        'Accept: application/json'
        	    );
    	    }
    	    // POST방식으로 보낼 JSON데이터 생성
    	    $req['Header']['serviceID'] = 'UCARI00012';
    	    $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
    	    $req['Message']['reqInfo']['ccoCustSno'] = '0';
    	    if($goods=="lease") $req['Message']['reqInfo']['dvCd'] = '4';   // 1 리스, 4. 중고차 리스
    	    else if($goods=="fince") $req['Message']['reqInfo']['dvCd'] = '2';     // 2 할부/론
    	    else $req['Message']['reqInfo']['dvCd'] = '3'; //3 렌트
    	    $reqJson = json_encode($req);
    	    if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
    	    else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
    	    $rtnd = json_decode($getJson, true);
    	    $matchCfg = array();
    	    $matchCfg['buyType']='custDvCd';
            $matchCfg['endType']='endAftDutyPrcsCd';
            $matchCfg['takeType']='dlvyDvCd';
            $matchCfg['deliveryType']='cndgmtMthCd';
            $matchCfg['deliveryShip']='dlvyArDvCd';
            $matchCfg['deliverySido']='cndgmtArDvCd';
            $matchCfg['month']='cntrPrid';
            $matchCfg['prepayMax']='preaLmtRto';
            $matchCfg['depositMax']='gtamtLmtRto';
            $matchCfg['preSumMax']='gtamtPreaSumLmtRto';
            $matchCfg['km']='agrTrvgDstnCd';
            $matchCfg['insureObj']='sustRpraDvCd';
            $matchCfg['insureCar']='ownBodyAcdDvCd';
            $matchCfg['insureAge']='drvrAgeDvCd';
            $matchCfg['insureSelf']='mcarBnamtDvCd';
            $matchCfg['insureEmpYn']='insureEmpYn';  // 임직원 특약은?    insureEmpYn';
            $matchCfg['careType']='reprPrdtCd';
            $matchCfg['navigation']='naviNo';
            $matchCfg['sdrrTinting']='snrWndtngNo';
            $matchCfg['sdrrTintingRatio']='snrWndtngCcrtNo';
            $matchCfg['frtTinting']='cwsWndtngNo';
            $matchCfg['frtTintingRatio']='cwsWndtngCcrtNo';
            $matchCfg['blackBox']='bkbxNo';
            $matchCfg['agFeeMax']='agCmfeLmtRto';
            $matchCfg['cmFeeMax']='cmCmfeLmtRto';
            $matchCfg['agcmFeeMax']='agCmAduCmfeLmtRto';
            $matchCfg['dealerShop']='icarCcoCustCd';
            $matchCfg['kmPromotion']='tdpDvCd';
            $matchCfg['finceType']='istmDvCd';
            $matchCfg['prepayYn']='amtamtUseYn';
            foreach($matchCfg as $key=>$val){
                if($goods=="lease" && ($key=="month" || $key=="km" || $key=="endType")){
                    if(isset($rtnd['Message']['domestic'][$val]['opLeas'])){
                        $data['domestic'][$key] = $rtnd['Message']['domestic'][$val];
                    }else{
                        $data['domestic'][$key]['fnnLeas'] = $rtnd['Message']['domestic'][$val];
                        $data['domestic'][$key]['opLeas'] = $rtnd['Message']['domestic'][$val];
                        if($key=="endType") $data['domestic'][$key]['fnnLeasPstp'] = $rtnd['Message']['domestic'][$val];
                    }
                    if(isset($rtnd['Message']['imported'][$val]['opLeas'])){
                        $data['imported'][$key] = $rtnd['Message']['imported'][$val];
                    }else{
                        $data['imported'][$key]['fnnLeas'] = $rtnd['Message']['imported'][$val];
                        $data['imported'][$key]['opLeas'] = $rtnd['Message']['imported'][$val];
                        if($key=="endType") $data['imported'][$key]['fnnLeasPstp'] = $rtnd['Message']['imported'][$val];
                    }
                }else if($goods=="rent" && $key=="insureCar"){
                    if(isset($rtnd['Message']['domestic'][$val])){
                        foreach($rtnd['Message']['domestic'][$val] as $ins=>$nam){
                            $tmp = explode("/",$nam);
                            $data['domestic'][$key][$ins]=trim($tmp[0]);
                        }
                    }
                    if(isset($rtnd['Message']['imported'][$val])){
                        foreach($rtnd['Message']['imported'][$val] as $ins=>$nam){
                            $tmp = explode("/",$nam);
                            $data['imported'][$key][$ins]=trim($tmp[0]);
                        }
                    }
                }else if($goods=="rent" && $key=="kmPromotion"){
                    if(isset($rtnd['Message']['domestic'][$val])){
                        foreach($rtnd['Message']['domestic'][$val] as $ins=>$nam){
                            if($ins!="3") $data['domestic'][$key][$ins] = $nam;
                        }
                    }
                    if(isset($rtnd['Message']['imported'][$val])){
                        foreach($rtnd['Message']['imported'][$val] as $ins=>$nam){
                            if($ins!="3") $data['imported'][$key][$ins] = $nam;
                        }
                    }
                }else{
                    if(isset($rtnd['Message']['domestic'][$val])){
                        $data['domestic'][$key] = $rtnd['Message']['domestic'][$val];
                    }else if($key=="preSumMax"){
                        $data['domestic'][$key] = "100";
                    }
                    if(isset($rtnd['Message']['imported'][$val])){
                        $data['imported'][$key] = $rtnd['Message']['imported'][$val];
                        /* if($key=="dealerShop"){     // 제휴사 정렬 보장
                            foreach($rtnd['Message']['imported'][$val] as $brand => $list){
                                foreach($list as $cod=>$nam){
                                    if(isset($data['imported']['dealerShopList'][$brand])) $data['imported']['dealerShopList'][$brand] .= ",".$cod;
                                    else $data['imported']['dealerShopList'][$brand] = $cod;
                                }
                            }
                        } */
                    }else if($key=="preSumMax"){
                        $data['imported'][$key] = "100";
                    }
                    
                }
                
            }
            //$data['domestic']['respiteMax'] = "90"; // 금융리스 유예 한도 설정
            //$data['imported']['respiteMax'] = "90";
            
            // 정렬 지정시
            $itemArr = array("insureCar","insureSelf");
            $localArr = array("domestic","imported");
            foreach($itemArr as $item){
                foreach($localArr as $local){
                    if(isset($data[$local][$item])){
                        $str = "";
                        foreach($data[$local][$item] as $key=>$val){
                            if($str) $str .= ",";
                            $str .= $key;
                        }
                        $data[$local][$item."List"]=$str;
                    }
                }
            }
            // $data = $rtnd['Message']['info'];    // 변환 필요 없을 경우..
    	    // 파일 쓰기 
    	    $str = json_encode($data);
    	    $jsonFile = fopen(SITE_PATH.$fileTmp.$goods."UConfig.json", "w");
    	    fwrite($jsonFile, $str);
	    }
	    // 개인설정 불러오기
	    $estimate_model = $this->loadModel('estimateModel');
	    $estmConfig = $estimate_model->getConfigView("estimate");
	    if($estmConfig){
	        $memCfg = extractValue($estmConfig->cContent_Config,"\n", "\t", 0, 1);
	    }
	    
	    require 'views/_layout/header.php';
	    require 'views/usedcar/estimate.php';
	    require 'views/_layout/footer.php';
	}
}
