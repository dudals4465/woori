<?php
class Admin extends Controller
{
	public function index()
	{
        $titleGnb = "관리자";
        $dirGnb = "admin";
        $dirLnb = "home";
        
        if(!isset($_GET['dateS'])){
            $_GET['dateS'] = date("Y-m-d", strtotime("-7 day"));
            $_GET['dateE'] = date("Y-m-d");
        }
        $dateS = $_GET['dateS'];
        $dateE = $_GET['dateE'];
        
        $dateToday = date("Y-m-d");
        $dateLimitSelf = date("Y-m-d", strtotime("-12 month"));
        
        $estimate_model = $this->loadModel('estimateModel');
        $dateLimit = date("Y-m-d", strtotime("-1 month"));
        $request_group = $estimate_model->getRequestCount('',$_GET['dateS'],$_GET['dateE']);
        
        require 'views/_layout/header.php';
        require 'views/admin/index.php';
        require 'views/_layout/footer.php';
	}
	public function error()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "error";
	    
	    require 'views/_layout/header.php';
	    require 'views/admin/error.php';
	    require 'views/_layout/footer.php';
	}
	public function codes($job,$idx)
	{
	    if(strpos($_SESSION['permit_Member'],"C")===false){
	        header("location:/desk");
	        exit;
	    }
	    $titleGnb = "코드매핑";
	    $dirGnb = "admin";
	    $dirLnb = "codes";
	    
	    $state_define = setCode("stateCode");      // 상태
	    $use_define = setCode("useCode");          // 사용
	    $admin_model = $this->loadModel('adminModel');
	    
	    if($job=="list"){
	        $codes_list = $admin_model->getCodesList('group');
	    }else if($job=="edit"){
	        $code = explode(".",$idx);
	        $codes_data = $admin_model->getCodesView($code[0],$code[1]);
	    }else if($job=="view"){
	        $codes_data = $admin_model->getCodesView('group',$idx);
	        $codes_list = $admin_model->getCodesList($idx);
	    }
	    
	    require 'views/_layout/header.php';
	    require 'views/admin/tabs.php';
	    if($job=="view") require 'views/admin/codes_view.php';
	    else if($job=="edit" || $job=="add") require 'views/admin/codes_edit.php';
	    else require 'views/admin/codes_list.php';
	    require 'views/_layout/footer.php';
	}
	public function permit()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "permit";
	    
	    $estimate_model = $this->loadModel('estimateModel');
	    $permit_list = $estimate_model->getConfigList('permit');
	    
	    require 'views/_layout/header.php';
	    require 'views/admin/permit.php';
	    require 'views/_layout/footer.php';
	}
	public function config()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "permit";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    $salesList =  json_decode(file_get_contents(DATA_PATH."salesList_search.json"), true);
	    if(file_exists(SITE_PATH."defaultConfig.json")){
	        $configSet =  json_decode(file_get_contents(SITE_PATH."defaultConfig.json"), true);
	    }
	    require 'views/_layout/header.php';
	    require 'views/admin/config.php';
	    require 'views/_layout/footer.php';
	}
	public function data()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "send";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
        $dayCut = date("Y-m-d", strtotime("-60 day"));
        $dir = "../../files/hanafn";
        $handle  = opendir($dir);
        $files = array();
        while (false !== ($filename = readdir($handle))) {
            if($filename == "." || $filename == ".."){
                continue;
            }
            if(is_file($dir . "/" . $filename)){
                $dayFile = substr($filename,7,10);
                if($dayFile<$dayCut){
                    // 삭제
                }else{
                    if(strpos($filename,".json")!==false){
                        $files[] = $filename;
                    }
                }
            }
        }
        rsort($files);
	    require 'views/_layout/header.php';
	    require 'views/admin/data.php';
	    require 'views/_layout/footer.php';
	}
	public function push()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "push";
	    
	    $estimate_model = $this->loadModel('estimateModel');
	    $permit_list = $estimate_model->getConfigList('permit');
	    
	    require 'views/_layout/header.php';
	    require 'views/admin/push.php';
	    require 'views/_layout/footer.php';
	}
	public function action($table)
	{
	    var_dump($_POST);
	    if($table=="error"){
	        unlink(DIR_SESS."/".$_POST['sess']);
	        header('location: '.$_SERVER['HTTP_REFERER']);
	    }else if($table=="codes"){
	        if(strpos($_SESSION['permit_Member'],"C")===false){
	            header("location:/desk");
	            exit;
	        }
	        
	        $admin_model = $this->loadModel('adminModel');
	        if($_POST['act']=="add" || $_POST['act']=="mod"){
	            $data = array(
	                "cGroup_Codes" => $_POST['group'],
	                "cCode_Codes" => $_POST['code'],
	                "cName_Codes" => $_POST['name'],
	                "cMap_Codes" => $_POST['map'],
	                "cUse_Codes" => $_POST['use'],
	                "cSet_Codes" => $_POST['set'],
	                "cRemark_Codes" => $_POST['remark'],
	                "iState_Codes" => $_POST['state']
	            );
	            if($_POST['act']=="add"){
	                $idx = $admin_model->addCodes($data);
	            }else{
	                $admin_model->updateCodes($_POST["group"],$_POST["codeO"],$data);
	            }
	            if($_POST['group']=="group" && $_POST['code']!=$_POST['codeO']){
	                $admin_model->changeGroupCodes($_POST["code"],$_POST["codeO"]);
	            }
	        }else if($_POST['act']=="order"){
	            $admin_model->changeOrderCodes($_POST["group"],$_POST["codes"]);
	        }
	        
	        $code_apply = $admin_model->getCodesApply();
	        $json = array();
	        foreach($code_apply as $row){
	            if(isset($json['list'][$row->cGroup_Codes])) $json['list'][$row->cGroup_Codes] .= ",".$row->cCode_Codes;
	            else $json['list'][$row->cGroup_Codes] = $row->cCode_Codes;
	            $json[$row->cGroup_Codes][$row->cCode_Codes]['name'] = $row->cName_Codes;
	            $json[$row->cGroup_Codes][$row->cCode_Codes]['map'] = $row->cMap_Codes;
	            $json[$row->cGroup_Codes][$row->cCode_Codes]['use'] = $row->cUse_Codes;
	            $json[$row->cGroup_Codes][$row->cCode_Codes]['set'] = $row->cSet_Codes;
	        }
	        if(file_exists(SITE_PATH.PARTNER_PATH."_codes.json")){
	            copy(SITE_PATH.PARTNER_PATH."_codes.json",SITE_PATH.PARTNER_PATH."_codes-".time().".json");
	        }
	        $str = json_encode($json);
	        $jsonFile = fopen(SITE_PATH.PARTNER_PATH."_codes.json", "w");
	        fwrite($jsonFile, $str);
	        if($_POST['group']=="group") header('location: /admin/codes/list/group');
	        else header('location: /admin/codes/view/'.$_POST['group']);
	    }else if($table=="config"){
	        if(file_exists(SITE_PATH."defaultConfig.json")){
	           copy(SITE_PATH."defaultConfig.json",SITE_PATH."defaultConfig-".time().".json");
	        }
	        $dataArr = array(
	            "rentDisBrand"=>"brand","rentDisModel"=>"model","rentDisLineup"=>"lineup","rentDisTrim"=>"trim",
	            "rentNotBrand"=>"brand","rentNotModel"=>"model","rentNotLineup"=>"lineup","rentNotTrim"=>"trim",
	            "leaseDisBrand"=>"brand","leaseDisModel"=>"model","leaseDisLineup"=>"lineup","leaseDisTrim"=>"trim",
	            "leaseNotBrand"=>"brand","leaseNotModel"=>"model","leaseNotLineup"=>"lineup","leaseNotTrim"=>"trim",
	            "finceDisBrand"=>"brand","finceDisModel"=>"model","finceDisLineup"=>"lineup","finceDisTrim"=>"trim"
	        );
	        foreach($dataArr as $key=>$type){
	            if(isset($_POST[$key])) $data[$key] = implode(",",$_POST[$key]);
	            else $data[$key] = "";
	        }
	        if(isset($_POST['brand'])){
	            foreach($_POST['brand'] as $val){
	                $tmp = explode("\t",$val);
	                $data['brand'][$tmp[1]] = trim($tmp[0]);
	            }
	        }
	        if(isset($_POST['model'])){
	            foreach($_POST['model'] as $val){
	                $tmp = explode("\t",$val);
	                $data['model'][$tmp[1]] = trim($tmp[0]);
	            }
	        }
	        if(isset($_POST['lineup'])){
	            foreach($_POST['lineup'] as $val){
	                $tmp = explode("\t",$val);
	                $data['lineup'][$tmp[1]] = trim($tmp[0]);
	            }
	        }
	        if(isset($_POST['trim'])){
	            foreach($_POST['trim'] as $val){
	                $tmp = explode("\t",$val);
	                $data['trim'][$tmp[1]] = trim($tmp[0]);
	            }
	        }
	        $str = json_encode($data);
	        $jsonFile = fopen(SITE_PATH."defaultConfig.json", "w");
	        fwrite($jsonFile, $str);
	        header('location: '.$_SERVER['HTTP_REFERER']);
	    }
	}
	public function summary()
	{
	    $titleGnb = "관리자";
	    $dirGnb = "admin";
	    $dirLnb = "summary";
	    
	    $estimate_model = $this->loadModel('estimateModel');
	    $dateS = "2020-12-22";
	    $dateE = "2021-03-22";
	    $estm_list = $estimate_model->getEstimateSummary($dateS,$dateE);
	    
	    $request_state = boardTheme('request');
	    $request_stateH = boardTheme('requestH');
	    $request_kind = boardTheme('requestK');
	    
	    $str = "일자\t아이디\t견적번호\t브랜드\t모델\t라인업\t트림\t기본가격\t차량가격 합계\t기간\t월납입금\t상품\t진행상태";
	    echo count($estm_list) ;
	    // iIdx_Estimate,cID_Member,cKind_Estimate,tData_Estimate,cCode_Request,cState_Request,iFno_Request,dInsert_Estimate
	    foreach($estm_list as $row){
	        $idxE = $row->iIdx_Estimate;
	        $secE = substr($row->dInsert_Estimate,-2);
	        $keyE = encodeDocu(substr($idxE,0,1).substr($idxE,-1).$idxE.$secE);
	        $data = json_decode($row->tData_Estimate, true);
	        if($row->iFno_Request) $fno = $row->iFno_Request;
	        else $fno = 1;
	        $eVal = $data['fincData'][$fno];
	        $fastKd = "";
	        if($row->cKind_Estimate=="RF"){
	            $fastKd = $data['estmData']['fastKind'];
	        }
	        
	        $str .= "\n".substr($row->dInsert_Estimate,0,10);
	        $str .= "\t".$row->cID_Member;
	        $str .= "\t".$keyE;
	        $str .= "\t".$data['estmData']['brandName'];
	        $str .= "\t".$data['estmData']['modelName'];
	        $str .= "\t".$data['estmData']['lineupName'];
	        $str .= "\t".$data['estmData']['trimName'];
	        $str .= "\t".$data['estmData']['trimPrice'];
	        $str .= "\t".$data['estmData']['priceSum'];
	        $str .= "\t".$eVal['month'];
	        $str .= "\t".$eVal['pmtGrand'];
	        $str .= "\t".$request_kind[$row->cKind_Estimate.$fastKd];
	        $str .= "\t".$request_state[$row->cState_Request];
	    }
	    
	    $jsonFile = fopen(SITE_PATH."summary_".$dateS."_".$dateE.".txt", "w");
	    fwrite($jsonFile, $str);
	    
	    echo " 완료";
	}
}
