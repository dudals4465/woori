<?php
class Login extends Controller
{
	public function index()
	{
	    header("location:/");
	    exit;
	}
	public function certify()
	{
	    $url = "/certiNumber";
	    
	    $req['message']['service'] = 'certify';
	    $req['data']['name'] = $_POST['name'];
	    $req['data']['birth'] = $_POST['birth'];
	    $req['data']['nation'] = $_POST['nation'];
	    $req['data']['sex'] = $_POST['sex'];
	    $req['data']['telecom'] = $_POST['telecom'];
	    $req['data']['phone'] = $_POST['phone'];
	    $reqJson = json_encode($req, JSON_UNESCAPED_UNICODE);
	    
	    $getJson = connect_api($url,$reqJson);
	    $getData = json_decode($getJson, true);
	    $rtn = array();
	    if(isset($getData['message']['state'])) $rtn['state'] = $getData['message']['state'];
	    else $rtn['state'] = "0";
	    if($rtn['state']=="1"){    // 1 성공
	        $_SESSION['state_Certify'] = $rtn['state'];
	        $_SESSION['CID'] = $getData['data']['CID'];
	        $_SESSION['name_Certify'] = $getData['data']['name']; // "홍길동";
	        $_SESSION['phone_Certify'] = $getData['data']['phone'];//  "010-1234-5678";
	        $_SESSION['birth_Certify'] = $getData['data']['birth'];//  "19990101";
	        $rtn['page'] = $getData['data']['page'];
	        $rtn['msg'] = $getData['data']['msg'];
	    }else if($rtn['state']=="3"){  //3  실패
	        $rtn['msg'] = $getData['data']['msg'];
	    }else{
	        $rtn['msg'] = "오류가 발생하였습니다.";
	    }
	    $rtnJson = json_encode($rtn);
	    if(API_MODE!="woori"){
	        $data['reqApi'] = jxgcompress($reqJson,true);
	        $data['getApi'] = jxgcompress($getJson,true);
	    }
	    $data['rtnData'] = jxgcompress($rtnJson,true);
	    // $data["msg"] = "안내문";  // 필요시 바로 표시
	    $data["returnFunction"] = "returnCertify()";
	    $str = json_encode($data);
	    echo $str;
	}
	
	public function loginConnect()
	{
	    $url = "/login";
	    
	    $req['message']['service'] = 'login';
	    $req['data']['id'] = $_POST['id'];
	    $req['data']['pw'] = $_POST['pw'];
	    $reqJson = json_encode($req, JSON_UNESCAPED_UNICODE);
	    
	    $getJson = connect_api($url,$reqJson);
	    $getData = json_decode($getJson, true);
	    
	    $rtn = array();
	    if(isset($getData['message']['state'])) $rtn['state'] = $getData['message']['state'];
	    else $rtn['state'] = "0";
	    if($rtn['state']=="1" || $rtn['state']=="2"){    // 1 성공, // 2 번 변경
	        $_SESSION['state_Member'] = $rtn['state'];
	        $_SESSION['id_Member'] = $_POST['id'];
	        $_SESSION['name_Member'] = $getData['data']['name']; // "홍길동";
	        $_SESSION['shop_Member'] = $getData['data']['shop']; // "";
	        $_SESSION['phone_Member'] = $getData['data']['phone'];//  "010-1111-2222";
	        $_SESSION['permit_Member'] = $getData['data']['permit']; // "MDTUC";
	        $_SESSION['count_Error'] = 0;
	        $_SESSION['msg_Error'] = "";
	        $_SESSION['id_Temp'] = "";
	        $_SESSION['name_Temp'] = "";
	        $_SESSION['regs_Member'] ="Y";
	        if($rtn['state']=="2") $rtn['page'] = "/mypage/passwd";
	        else if(isset($_SESSION['return']) && $_SESSION['return']) $rtn['page'] = $_SESSION['return'];
	        else $rtn['page'] = "/desk";
	        $rtn['msg'] = "로그인 성공...";
	    }else if($rtn['state']=="3"){  // 실패
	        if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']) $_SESSION['count_Error'] ++;
	        else $_SESSION['count_Error'] = 1;
	        $_SESSION['id_Temp'] = "";
	        $_SESSION['name_Temp'] = "";
	        if($_SESSION['count_Error']>=5){
	            $_SESSION['ip_Device'] = $_SERVER['REMOTE_ADDR'];
	            $_SESSION['hex_Device'] = encodeDocu(mt_rand(100000, 999999));
	        }
	        $rtn['error'] = $_SESSION['count_Error'];
	    }else{
	        $rtn['msg'] = "오류가 발생하였습니다.";
	    }
	    $rtnJson = json_encode($rtn);
	    if(API_MODE!="woori"){
	        $data['reqApi'] = jxgcompress($reqJson,true);
	        $data['getApi'] = jxgcompress($getJson,true);
	    }
	    $data['rtnData'] = jxgcompress($rtnJson,true);
	    // $data["msg"] = "안내문";  // 필요시 바로 표시
	    $data["returnFunction"] = "returnLogin()";
	    $str = json_encode($data);
	    echo $str;
	}
	
	public function confirm()
	{
	    $url = "/confirmNumber";
	    
	    $req['message']['service'] = 'confirm';
	    $req['data']['certify'] = $_POST['certify'];
	    $req['data']['CID'] = $_SESSION['CID'];
	    $req['data']['name'] = $_SESSION['name_Certify'];
	    $req['data']['phone'] = $_SESSION['phone_Certify'];
	    $req['data']['kind'] = $_SESSION['certifyKind'];
	    $reqJson = json_encode($req, JSON_UNESCAPED_UNICODE);
	    
	    $getJson = connect_api($url,$reqJson);
	    $getData = json_decode($getJson, true);
	    $rtn = array();
	    if(isset($getData['message']['state'])) $rtn['state'] = $getData['message']['state'];
	    else $rtn['state'] = "0";
	    if($rtn['state']=="1"){    // 1 성공
	        if($_SESSION['certifyKind']=="join" || $_SESSION['certifyKind']=="pw"){
	            $rtn['page'] = $getData['data']['page'];
	            $rtn['msg'] = $getData['data']['msg'];
	        }else if($_SESSION['certifyKind']=="id"){
	            $urlId = "/searchid";
	            $reqId['message']['service'] = 'searchid';
	            $reqId['data']['CID'] = $_SESSION['CID'];
	            $reqId['data']['name'] = $_SESSION['name_Certify'];
	            $reqId['data']['phone'] = $_SESSION['phone_Certify'];
	            
 	            $reqJsonId = json_encode($reqId, JSON_UNESCAPED_UNICODE);
	            
 	            $getJsonId = connect_api($urlId,$reqJsonId);
 	            $getDataId = json_decode($getJsonId, true);
 	            if($getDataId['message']['state']=="1"){
 	                $rtn['id'] = $getDataId['data']['id'];
 	                $rtn['page'] = $getData['data']['page'];
 	                $rtn['msg'] = $getData['data']['msg'];
 	            }else if($getDataId['message']['state']=="3"){
 	                $rtn['msg'] = $getDataId['data']['msg'];
 	            }
	        }
	    }else if($rtn['state']=="3"){  // 실패
	        $rtn['msg'] = $getData['data']['msg'];
	    }else{
	        $rtn['msg'] = "오류가 발생하였습니다.";
	    }
	    $rtnJson = json_encode($rtn);
	    if(API_MODE!="woori"){
	        $data['reqApi'] = jxgcompress($reqJson,true);
	        $data['getApi'] = jxgcompress($getJson,true);
	    }
	    $data['rtnData'] = jxgcompress($rtnJson,true);
	    // $data["msg"] = "안내문";  // 필요시 바로 표시
	    $data["returnFunction"] = "returnConfirm()";
	    $str = json_encode($data);
	    echo $str;
	}
	public function logout()
	{
	    //if(isset($_SESSION['mode']) && $_SESSION['mode']) $mode = $_SESSION['mode'];
	    //if(isset($_SESSION['path_login']) && $_SESSION['path_login']) $path = $_SESSION['path_login'];
	    session_destroy();
	    /* if(DEVICE_TYPE=='app'){
	        setcookie('autoLogin', '', time() -3600, '/', '.'.DOMAIN);
	        header("location:/?auto=N");
	    }else{ */
	        header("location:/");
	    //}
	    exit;
	}
	
	
	
	
	
	
	public function apply()
	{
	    $url = "/apply";
	    
	    $req['message']['service'] = 'apply';
	    $req['data']['name'] = $_POST['name'];
	    $req['data']['birth'] = $_POST['birth'];
	    $req['data']['phone'] = $_POST['phone'];
	    $req['data']['sex'] = $_POST['sex'];
	    $req['data']['id'] = $_POST['id'];
	    $req['data']['pw'] = $_POST['pw'];
	    $req['data']['pwc'] = $_POST['pwc'];
	    $req['data']['agid'] = $_POST['agid'];
	    $req['data']['companyid'] = $_POST['companyid'];
	    $reqJson = json_encode($req, JSON_UNESCAPED_UNICODE);
	    
	    $getJson = connect_api($url,$reqJson);
	    $getData = json_decode($getJson, true);
	    $rtn = array();
	    if(isset($getData['message']['state'])) $rtn['state'] = $getData['message']['state'];
	    else $rtn['state'] = "0";
	    if($rtn['state']=="1"){    // 1 성공
	        $rtn['msg'] = $getData['data']['msg'];
	        $rtn['page'] = $getData['data']['page'];
	    }else if($rtn['state']=="2" || $rtn['state']=="3"){  // 실패
	        $rtn['msg'] = $getData['data']['msg'];
	    }else{
	        $rtn['msg'] = "오류가 발생하였습니다.";
	    }
	    $rtnJson = json_encode($rtn);
	    if(API_MODE!="woori"){
	        $data['reqApi'] = jxgcompress($reqJson,true);
	        $data['getApi'] = jxgcompress($getJson,true);
	    }
	    $data['rtnData'] = jxgcompress($rtnJson,true);
	    // $data["msg"] = "안내문";  // 필요시 바로 표시
	    $data["returnFunction"] = "returnJoin()";
	    $str = json_encode($data);
	    echo $str;
	}
	
	public function mct($code)
	{
	    if(!isset($code) && $code==""){
	        header("location:/");
	        exit;
	    }
	    if($_SESSION['mode']=="aict"){
	        $url = "http://ep.aictcorp.com/hana/api/login"; // 디에이시스템 API 테스트용
	        // 헤더값 aict 만 필요
	        $headers = array(
	            'Content-Type:application/json',
	            'Accept: application/json'
	        );
	    }
	    // POST방식으로 보낼 JSON데이터 생성
	    $req['Header']['serviceID'] = 'COMMI00012';
	    $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	    $req['Message']['reqInfo']['ccoCustSno'] = '0';
	    $req['Message']['reqInfo']['dvCd'] = "8";
	    
	    $req['Message']['reqLoginInfo']['lginMngeNo'] = $code;
	    $req['Message']['reqLoginInfo']['ipAddr'] = $_SERVER['REMOTE_ADDR'];
	    $reqJson = json_encode($req);
	    
	    //echo $url;
	    if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	    else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	    $rtnd = json_decode($getJson, true);
	    if($rtnd['Message']['resInfo']['rspnsCd']!='PS000001'){
	        $_SESSION['state_Member'] = 0;
	        $_SESSION['msg_Error'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
	        header("location:/");
	        exit;
	    }else if($rtnd['Message']['resLoginInfo']['succYn']=='Y' && $rtnd['Message']['resLoginInfo']['mbrSttsDvCd']=='00'){  // 정상
	        session_regenerate_id();
	        $_SESSION['state_Member'] = 1;
	        $_SESSION['id_Member'] = $rtnd['Message']['mbrSrchInfo']['mbrIdnId'];
	        $_SESSION['name_Member'] = $rtnd['Message']['mbrSrchInfo']['custNm'];
	        $_SESSION['shop_Member'] = $rtnd['Message']['mbrSrchInfo']['cprnCustIdnNm'];
	        $_SESSION['branch_Member'] = $rtnd['Message']['mbrSrchInfo']['dptCd'];
	        $_SESSION['branch_Name'] = $rtnd['Message']['mbrSrchInfo']['dptNm'];
	        $_SESSION['branch_Account'] = $rtnd['Message']['mbrSrchInfo']['vaccNo'];
	        if(isset($rtnd['Message']['mbrSrchInfo']['vaccNoList'])) $_SESSION['account_List'] = jxgcompress(json_encode($rtnd['Message']['mbrSrchInfo']['vaccNoList']), true);
	        $_SESSION['phone_Member'] = $rtnd['Message']['mbrSrchInfo']['basTrmArTlno']."-".$rtnd['Message']['mbrSrchInfo']['basTrmTonoTlno']."-".$rtnd['Message']['mbrSrchInfo']['basTrmDtlTlno'];
	        $_SESSION['company_Member'] = $rtnd['Message']['mbrSrchInfo']['cprnCustIdnNm'];
	        $_SESSION['company_Type'] = $rtnd['Message']['mbrSrchInfo']['cbrCustDvCd'];   // 개인 1, 개인사업자 2, 법인 3
	        $estimate_model = $this->loadModel('estimateModel');
	        $permit_data = $estimate_model->getConfigView('permit');
	        if($permit_data){
	            $_SESSION['permit_Member'] = $permit_data->cContent_Config;
	        }else{
	            $_SESSION['permit_Member'] = "";
	        }
	        
	        $_SESSION['count_Error'] = 0;
	        $_SESSION['msg_Error'] = "";
	        $_SESSION['id_Temp'] = "";
	        $_SESSION['name_Temp'] = "";
	        
	        $_SESSION['path_login'] = "mct";
	        setcookie('pathLogin', 'mct', time() + 86400 * 7, '/', '.'.DOMAIN);
	        
	        header("location:/desk");
	        exit;
	    }else{ // API 작동 없을 경우
	        $_SESSION['state_Member'] = 0;
	        $_SESSION['msg_Error'] = "오류가 발생하였습니다.";
	        header("location:https://m.hanacapital.co.kr/partner/bzn/common/login.hnc?lgnType=lr");
	        exit;
	    }
	}
	public function certify0()
	{
	    if($_POST['act']=="call"){
	        //var_dump($_POST);
	        if($_SESSION['mode']=="aict"){
	           $url = "http://ep.aictcorp.com/hana/api/certifyCall"; // 디에이시스템 API 테스트용
	            // 헤더값 aict 만 필요
	            $headers = array(
	                'Content-Type:application/json',
	                'Accept: application/json'
	            );
	        }
	        $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	        $req['Message']['reqInfo']['ccoCustSno'] = '0';
	        if($_POST['job']!="apply"){   // 아이디 비번 찾기
	            // POST방식으로 보낼 JSON데이터 생성
	            $req['Header']['serviceID'] = 'COMMI00012';
	            $req['Message']['reqInfo']['dvCd'] = "4";   // 인증번호 요청
	            //$vars = "reqCtfcNo";
	        }else{ // 회원등록
                // POST방식으로 보낼 JSON데이터 생성
                $req['Header']['serviceID'] = 'COMMI00011';
                $req['Message']['reqInfo']['dvCd'] = "1";   // 인증번호 요청
                //$vars = "reqCtfcNoInfo";
	        }
	        $vars = "reqCtfcNoInfo";
            
            $req['Message'][$vars]['slfCnfmMngeNo'] = "";
            $req['Message'][$vars]['cellTscoDvCd'] = $_POST['telecom'];
            $req['Message'][$vars]['brddDt'] = $_POST['birth'];
            $req['Message'][$vars]['cellNo'] = $_POST['phone'];
            $req['Message'][$vars]['custNo'] = "";
            $req['Message'][$vars]['custNm'] = $_POST['name'];
            $req['Message'][$vars]['sexCd'] = $_POST['sex'];
            $req['Message'][$vars]['rnrsdDvCd'] = $_POST['nation'];
            $req['Message'][$vars]['smsDvCd'] = "BZN";
            
            $reqJson = json_encode($req);
            //echo "<br>";
            //var_dump($reqJson);
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
            else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
            $rtnd = json_decode($getJson, true);
            //if(isset($rtnd['Message']['resCtfcNo'])) $rtnd['Message']['resCtfcNoInfo'] = $rtnd['Message']['resCtfcNo'];
            
            if(!isset($rtnd['Message'])){
                $data['msg'] = "통신 오류, 다시 시도해주세요.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                /*
                if($rtnd['Message']['resCtfcNoInfo']['prcsRsltCd']=="1"){
                    $_SESSION['trSno'] = $rtnd['Message']['resCtfcNoInfo']['trSno'];
                    $_SESSION['slfCnfmMngeNo'] = $rtnd['Message']['resCtfcNoInfo']['slfCtfcMngeNo'];
                }else{
                    $data['msg'] = $rtnd['Message']['resCtfcNoInfo']['rspnsMsgCtnt'];
                }
                $data['jsonData']['state'] = $rtnd['Message']['resCtfcNoInfo']['prcsRsltCd'];
                */
                $_SESSION['trSno'] = $rtnd['Message']['resCtfcNoInfo']['trSno'];
                $_SESSION['slfCnfmMngeNo'] = $rtnd['Message']['resCtfcNoInfo']['slfCtfcMngeNo'];
                $data['jsonData']['state'] = 1;
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
                $data['jsonData']['state'] = 0;
            }else{
                $data['msg'] = "오류가 발생하였습니다. 다시 시도해주세요.";
                $data['jsonData']['state'] = 0;
            }
            /*
            if($rtnd['Message']['resCtfcNoInfo']['prcsRsltCd']=="1"){
                $_SESSION['trSno'] = $rtnd['Message']['resCtfcNoInfo']['trSno'];
                $_SESSION['slfCnfmMngeNo'] = $rtnd['Message']['resCtfcNoInfo']['slfCtfcMngeNo'];
            }else{
                $data['msg'] = "본인인증에 실패하였습니다. 입력하신 정보를 다시 확인해주세요.";
            }
            */
            //$data['jsonData']['state'] = $rtnd['Message']['resCtfcNoInfo']['prcsRsltCd'];
            $data['jsonData']['Request'] = $reqJson;
            $data['jsonData']['Response'] = $getJson;
            $data["returnFunction"] = "returnCertify()";
            $str = json_encode($data);
            echo $str;
            exit;
	    }else if($_POST['act']=="confirm"){
	        if($_SESSION['mode']=="aict"){
	            $url = "http://ep.aictcorp.com/hana/api/certifyConfirm"; // 디에이시스템 API 테스트용
	            // 헤더값 aict 만 필요
	            $headers = array(
	                'Content-Type:application/json',
	                'Accept: application/json'
	            );
	        }
	        $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	        $req['Message']['reqInfo']['ccoCustSno'] = '0';
	        if($_POST['job']!="apply"){   // 아이디 비번 찾기
	            // POST방식으로 보낼 JSON데이터 생성
	            $req['Header']['serviceID'] = 'COMMI00012';
	            $req['Message']['reqInfo']['dvCd'] = "5";   // 인증번호 요청
	            //$vars = "reqSlfCtfcCnfm";
	        }else{ // 회원등록
	            // POST방식으로 보낼 JSON데이터 생성
	            $req['Header']['serviceID'] = 'COMMI00011';
	            $req['Message']['reqInfo']['dvCd'] = "2";   // 인증번호 요청
	            //$vars = "reqSlfCtfcCnfmInfo";
	        }
	        $vars = "reqSlfCtfcCnfmInfo";
	        
	        $req['Message'][$vars]['slfCnfmMngeNo'] = $_SESSION['slfCnfmMngeNo'];
	        $req['Message'][$vars]['trSno'] = $_SESSION['trSno'];
	        $req['Message'][$vars]['brddDt'] = $_POST['birth'];
	        $req['Message'][$vars]['custNm'] = $_POST['name'];
	        $req['Message'][$vars]['sexCd'] = $_POST['sex'];
	        $req['Message'][$vars]['smsCtfcNo'] = $_POST['certify'];
	        $req['Message'][$vars]['custNo'] = "";
	        $req['Message'][$vars]['cellNo'] = $_POST['phone'];
	        $req['Message'][$vars]['cellTscoDvCd'] = $_POST['telecom'];
	        $req['Message'][$vars]['smsCrdchkAgreMngeNo'] = "";
	        $req['Message'][$vars]['smsDvCd'] = "BZN";
	        if($_POST['job']=="apply"){
    	        if(isset($_POST['agreeService1']))  $req['Message'][$vars]['picuaYn'] = $_POST['agreeService1'];
    	        else $req['Message'][$vars]['picuaYn'] = "N";
    	        if(isset($_POST['agreeService2']))  $req['Message'][$vars]['mcecupiYn'] = $_POST['agreeService2'];
    	        else $req['Message'][$vars]['mcecupiYn'] = "N";
    	        if(isset($_POST['agreeService3']))  $req['Message'][$vars]['cpciircYn'] = $_POST['agreeService3'];
    	        else $req['Message'][$vars]['cpciircYn'] = "N";
    	        if(isset($_POST['agreeService4']))  $req['Message'][$vars]['mceppiYn'] = $_POST['agreeService4'];
    	        else $req['Message'][$vars]['mceppiYn'] = "N";
    	        if(isset($_POST['agreeService5']))  $req['Message'][$vars]['cpciipeYn'] = $_POST['agreeService5'];
    	        else $req['Message'][$vars]['cpciipeYn'] = "N";
    	        if(isset($_POST['agreeService6']))  $req['Message'][$vars]['cufpisYn'] = $_POST['agreeService6'];
    	        else $req['Message'][$vars]['cufpisYn'] = "N";
    	        if(isset($_POST['agreeService7']))  $req['Message'][$vars]['cuiisofpYn'] = $_POST['agreeService7'];
    	        else $req['Message'][$vars]['cuiisofpYn'] = "N";
    	        if(isset($_POST['agreeService8']))  $req['Message'][$vars]['cpciiscYn'] = $_POST['agreeService8'];
    	        else $req['Message'][$vars]['cpciiscYn'] = "N";
    	        if(isset($_POST['agreeService9']))  $req['Message'][$vars]['cumpYn'] = $_POST['agreeService9'];
    	        else $req['Message'][$vars]['cumpYn'] = "N";
    	        if(isset($_POST['agreeService10']))  $req['Message'][$vars]['cumsYn'] = $_POST['agreeService10'];
    	        else $req['Message'][$vars]['cumsYn'] = "N";
    	        if(isset($_POST['agreeService11']))  $req['Message'][$vars]['cumdYn'] = $_POST['agreeService11'];
    	        else $req['Message'][$vars]['cumdYn'] = "N";
    	        if(isset($_POST['agreeService12']))  $req['Message'][$vars]['cumeYn'] = $_POST['agreeService12'];
    	        else $req['Message'][$vars]['cumeYn'] = "N";
    	        if(isset($_POST['agreeService13']))  $req['Message'][$vars]['cumdaYn'] = $_POST['agreeService13'];
    	        else $req['Message'][$vars]['cumdaYn'] = "N";
	        }
	        
	        $reqJson = json_encode($req);
	        //echo $url;
	        if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	        else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	        $rtnd = json_decode($getJson, true);
	        //if(isset($rtnd['Message']['resSlfCtfcCnfm'])) $rtnd['Message']['resSlfCtfcCnfmInfo'] = $rtnd['Message']['resSlfCtfcCnfm'];
	        
	        if(!isset($rtnd['Message'])){
	            $data['msg'] = "통신 오류, 다시 시도해주세요.";
	        }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
	            /*
	            if($rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd']=="1"){
	                if($rtnd['Message']['resSlfCtfcCnfmInfo']['custNo']=="0"){
	                    $data['msg'] = "소속제휴사가 하나캐피탈에 등록되어있지 않습니다. 관리지점 담당자에게 문의 해주시기 바랍니다.";
	                    //$rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd'] = "2";
	                }else{
	                    $_SESSION['custNo'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['custNo'];
	                    $_SESSION['name_Temp'] = $_POST['name'];
	                    $_SESSION['birth_Temp'] = $_POST['birth'];
	                    $_SESSION['sex_Temp'] = $_POST['sex'];
	                    $_SESSION['nation_Temp'] = $_POST['nation'];
	                    $_SESSION['phone_Temp'] = $_POST['phone'];
	                }
	            }
	            $data['jsonData']['state'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd'];
	            */
	            $_SESSION['custNo'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['custNo'];
	            $_SESSION['name_Temp'] = $_POST['name'];
	            $_SESSION['birth_Temp'] = $_POST['birth'];
	            $_SESSION['sex_Temp'] = $_POST['sex'];
	            $_SESSION['nation_Temp'] = $_POST['nation'];
	            $_SESSION['phone_Temp'] = $_POST['phone'];
	            $data['jsonData']['state'] = 1;
	        }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
	            $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
	            $data['jsonData']['state'] = 0;
	        }else{
	            $data['msg'] = "오류가 발생하였습니다. 다시 시도해주세요.";
	            $data['jsonData']['state'] = 0;
	        }
	        /*
	        if(!isset($rtnd['Message'])){
	            $data['msg'] = "Message 가 없습니다.";
	        }else if(!isset($rtnd['Message']['resSlfCtfcCnfmInfo'])){
	            if(isset($rtnd['Message']['resInfo']['rspnsMsgCtnt'])) $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
	            else $data['msg'] = "Message resSlfCtfcCnfmInfo 가 없습니다.";
	        }else if($rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd']=="1"){
	            if($rtnd['Message']['resSlfCtfcCnfmInfo']['custNo']=="0"){
	                $rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd'] = "2";
	            }else{
	                $_SESSION['custNo'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['custNo'];
	                $_SESSION['name_Temp'] = $_POST['name'];
	                $_SESSION['birth_Temp'] = $_POST['birth'];
	                $_SESSION['sex_Temp'] = $_POST['sex'];
	                $_SESSION['nation_Temp'] = $_POST['nation'];
	                $_SESSION['phone_Temp'] = $_POST['phone'];
	            }
	        }else{
	            $data['msg'] = "인증번호가 맞지 않습니다. 문자메세지를 확인해 주세요.";
	        }
	        */
	        //$data['jsonData']['state'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd'];
	        $data['jsonData']['Request'] = $reqJson;
	        $data['jsonData']['Response'] = $getJson;
	        $data["returnFunction"] = "returnConfirm()";
	        if($_POST['job']=="searchid" && $rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){   //  && $rtnd['Message']['resSlfCtfcCnfmInfo']['prcsRsltCd']=="1"
	            if($_SESSION['mode']=="aict") $url = "http://ep.aictcorp.com/hana/api/searchID"; // 디에이시스템 API 테스트용
	            $req = array();
	            $req['Header']['serviceID'] = 'COMMI00012';
	            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	            $req['Message']['reqInfo']['ccoCustSno'] = '0';
	            $req['Message']['reqInfo']['dvCd'] = "6";  // 아이디 찾기
	            $req['Message']['reqIdSrchInfo']['custNo'] = $rtnd['Message']['resSlfCtfcCnfmInfo']['custNo'];
	            $req['Message']['reqIdSrchInfo']['mbrDvCd'] = "11";
	            $reqJson = json_encode($req);
	            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	            else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	            $rtnd = json_decode($getJson, true);
	            if(!isset($rtnd['Message'])){
	                $data['msg'] = "통신 오류, 다시 시도해주세요.";
	            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
	                $_SESSION['id_Temp'] = $rtnd['Message']['resIdSrchInfo']['mbrIdnId'];
	                $data['jsonData']['id'] = $rtnd['Message']['resIdSrchInfo']['mbrIdnId'];;
	                $data['jsonData']['idRslt'] = "Y";
	            }else{
	                $data['jsonData']['idRslt'] = "N";
	            }
	            /*
	            if($rtnd['Message']['resIdSrchInfo']['succYn']=="Y"){
	                $_SESSION['id_Temp'] = $rtnd['Message']['resIdSrchInfo']['mbrIdnId'];
	                $data['jsonData']['id'] = $rtnd['Message']['resIdSrchInfo']['mbrIdnId'];;
	                $data['jsonData']['idRslt'] = "Y";
	            }else{
	                $data['jsonData']['idRslt'] = "N";
	            }
	            */
	        }
	        $str = json_encode($data);
	        echo $str;
	        exit;
	    }
	}
	public function idCheck()
	{
	    $url = "/idCheck";
	    
	    $req['message']['service'] = 'idCheck';
	    $req['data']['id'] = $_POST['id'];
	    $reqJson = json_encode($req, JSON_UNESCAPED_UNICODE);
	    
	    $getJson = connect_api($url,$reqJson);
	    $getData = json_decode($getJson, true);
	    $rtn = array();
	    if(isset($getData['message']['state'])) $rtn['state'] = $getData['message']['state'];
	    else $rtn['state'] = "0";
	    if($rtn['state']=="1"){    // 1 성공
	        $rtn['msg'] = $getData['data']['msg'];
	    }else if($rtn['state']=="3"){  // 실패
	        $rtn['msg'] = $getData['data']['msg'];
	    }else{
	        $rtn['msg'] = "오류가 발생하였습니다.";
	    }
	    $rtnJson = json_encode($rtn);
	    if(API_MODE!="woori"){
	        $data['reqApi'] = jxgcompress($reqJson,true);
	        $data['getApi'] = jxgcompress($getJson,true);
	    }
	    $data['rtnData'] = jxgcompress($rtnJson,true);
	    // $data["msg"] = "안내문";  // 필요시 바로 표시
	    $data["returnFunction"] = "returnIdCheck()";
	    $str = json_encode($data);
	    echo $str;
	}
	public function branchCompany()
	{
	    if($_SESSION['mode']=="aict"){
	        $url = "http://ep.aictcorp.com/hana/api/agcompany"; // 디에이시스템 API 테스트용
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
	    $req['Message']['reqInfo']['dvCd'] = "4";  // 부서별 소속사
	    $req['Message']['reqCcoInfoList']['custNo'] = "";
	    $req['Message']['reqCcoInfoList']['custSno'] = "";
	    $req['Message']['reqCcoInfoList']['custNm'] = $_GET['name'];  // 소속사명
	    $req['Message']['reqCcoInfoList']['resdBzno'] = "";
	    $req['Message']['reqCcoInfoList']['allYn'] = "N";
	    $req['Message']['reqCcoInfoList']['cndDvCd'] = "00";
	    $req['Message']['reqCcoInfoList']['ccoCustNo'] = "";
	    $req['Message']['reqCcoInfoList']['mgdptCd'] = $_GET['code'];  // 부서별 소속사
	    $req['Message']['reqCcoInfoList']['cprnBrchSno'] = "";
	    $req['Message']['reqCcoInfoList']['cprnResdBzno'] = "";
	        
	    $reqJson = json_encode($req);
	    
	    //echo $url;
	    if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	    else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	    $rtnd = json_decode($getJson, true);
	    
	    
	    $data['agcompany'] = $rtnd['Message']['resCcoInfoList'];
	    
	    $data['code'] = $_GET['code'];
	    $data['name'] = $_GET['name'];
	    $data['Request'] = $reqJson;
	    $data['Response'] = $getJson;
	    $str = json_encode($data);
	    echo jxgcompress($str,true);
	}
	public function registerConfig()
	{
	    if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $fileTmp = "_";
	    else $fileTmp = "";
	    $goodsConfig =  json_decode(file_get_contents(SITE_PATH.$fileTmp."registerConfig.json"), true);
	    $str = json_encode($goodsConfig);
	    echo jxgcompress($str,true);
	}
	
	public function passwd()
	{
	    if(!isset($_SESSION['mode']) || $_SESSION['mode']==""){
	        exit;
	    }
	    if($_SESSION['mode']=="aict") $url = "http://ep.aictcorp.com/hana/api/passwd"; // 디에이시스템 API 테스트용
	    else $url = "http://localhost:8080/hanacapital_message.jsp"; // 하나캐피탈 데몬용
	    
	    // 헤더값
	    $headers = array(
	        'Content-Type:application/json',
	        'Accept: application/json'
	    );
	    
	    $_POST['id'] = trim($_POST['id']);
	    $_POST['pwNew'] = trim($_POST['pwNew']);
	    // POST방식으로 보낼 JSON데이터 생성
	    $post['Header']['serviceID'] = 'COMMI00001';
	    $post['Header']['version'] = '1.0';
	    $post['Message']['reqInfo']['ccoCustNo'] = '6503068349';
	    $post['Message']['reqInfo']['ccoCustSno'] = '1';
	    $post['Message']['reqInfo']['prdtCd'] = '410019';
	    $post['Message']['info']['id'] = $_POST['id'];
	    $post['Message']['info']['cno'] = $_POST['cno'];
	    $post['Message']['info']['pw2'] = $_POST['pwNew'];
	    $post['Message']['info']['issue'] = 'passwd';
	    $postJson = json_encode($post);
	    
	    $g = connect_curl($url,$headers,$postJson);
	    $json = json_decode($g, true);
	    if($json['Message']['rspnsCd']==1){
	        $_SESSION['state_Member'] = 1;
	        $_SESSION['id_Member'] = $_POST['id'];
	        $_SESSION['name_Member'] = $json['Message']['info']['name'];
	        $_SESSION['company_Member'] = $json['Message']['info']['company'];
	        $_SESSION['shop_Member'] = $json['Message']['info']['shop'];
	        $_SESSION['phone_Member'] = $json['Message']['info']['phone'];
	        $_SESSION['permit_Member'] = $json['Message']['info']['permission'];
	        $_SESSION['count_Error'] = 0;
	        $_SESSION['msg_Error'] = "";
	        $_SESSION['id_Temp'] = "";
	        $_SESSION['name_Temp'] = "";
	        $_SESSION['idx_Member'] = "10000"; // 회원 Seq 생성 필요
	        header("location:/desk");
	        exit;
	    }else if($json['Message']['rspnsCd']==2){
	        $_SESSION['state_Member'] = 2;
	        if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']) $_SESSION['count_Error'] ++;
	        else $_SESSION['count_Error'] = 1;
	        $_SESSION['msg_Error'] = $json['Message']['rspnsMsgCtnt'];
	        $_SESSION['id_Temp'] = "";
	        $_SESSION['name_Temp'] = "";
	        if($_SESSION['count_Error']>=5){
	            $_SESSION['ip_Device'] = $_SERVER['REMOTE_ADDR'];
	            $_SESSION['hex_Device'] = encodeDocu(mt_rand(100000, 999999));;
	        }
	        header("location:/service/passwd");
	        exit;
	    }else{
	        $_SESSION['state_Member'] = 0;
	        $_SESSION['msg_Error'] = "오류가 발생하였습니다.";
	        header("location:/");
	        exit;
	    }
	}
	public function reset()
	{
	    if($_SESSION['mode']=="aict"){
	        $url = "http://ep.aictcorp.com/hana/api/reset"; // 디에이시스템 API 테스트용
	        // 헤더값 aict 만 필요
	        $headers = array(
	            'Content-Type:application/json',
	            'Accept: application/json'
	        );
	    }
	    
	    $_POST['id'] = trim($_POST['id']);
	    $_POST['pw'] = trim($_POST['pw']);
	    // POST방식으로 보낼 JSON데이터 생성
	    $req['Header']['serviceID'] = 'COMMI00012';
	    $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
	    $req['Message']['reqInfo']['ccoCustSno'] = '0';
	    $req['Message']['reqInfo']['dvCd'] = "7";  // 비밀번호 재설정
	    
	    $req['Message']['reqPwChngInfo']['mbrIdnId'] = $_POST['id'];
	    $req['Message']['reqPwChngInfo']['nwMbrPwd'] = $_POST['pw'];
	    if(GRADE_AUTH=="N"){
	        $req['Message']['reqPwChngInfo']['slfCnfmMngeNo'] = $_SESSION['slfCnfmMngeNo'];
	        $req['Message']['reqPwChngInfo']['othrMbgHpYn'] = "N";
	    }else{
	        $req['Message']['reqPwChngInfo']['slfCnfmMngeNo'] = date("YmdHis");
	        $req['Message']['reqPwChngInfo']['othrMbgHpYn'] = "N";
	    }
	    $req['Message']['reqPwChngInfo']['smrtChnlDvCd'] = "SMCMAP";
	    $req['Message']['reqPwChngInfo']['mbrDvCd'] = "11";
	    
	    $reqJson = json_encode($req);
	    
	    if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	    else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	    $rtnd = json_decode($getJson, true);
	    /*
	     if($rtnd['Message']['resPwChngInfo']['succYn']=="Y"){
	     
	     }else if($rtnd['Message']['resPwChngInfo']['bfUsePwdYn']=="Y"){
	     $data['msg'] = "과거 등록된 이력이 있어 다른 비밀번호로 변경이 필요합니다.";
	     }else{
	     $data['msg'] = "설정에 실패하였습니다";
	     }
	     */
	    if(!isset($rtnd['Message'])){
	        $data['msg'] = "통신 오류, 다시 시도해주세요.";
	        $data['jsonData']['state'] = "N";
	    }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
	        $data['jsonData']['state'] = $rtnd['Message']['resPwChngInfo']['succYn'];
	    }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
	        $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
	        $data['jsonData']['state'] = "N";
	    }else{
	        $data['msg'] = "오류가 발생하였습니다. 다시 시도해주세요.";
	        $data['jsonData']['state'] = "N";
	    }
	    
	    $data['jsonData']['Request'] = $reqJson;
	    $data['jsonData']['Response'] = $getJson;
	    $data["returnFunction"] = "returnReset()";
	    $str = json_encode($data);
	    echo $str;
	    exit;
	}
}
