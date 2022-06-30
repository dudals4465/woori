<?php
class D extends Controller
{
	public function index()
	{
	    header("location:/");
	    exit;
	}
	public function E($idx)
	{
	    //echo '<meta charset="utf-8">';
	    //echo "견적서 준비중";
	    ini_set("display_errors", 0);
	    $token = $idx;
	    
	    $url = URL."/D/E/".$idx;
	    $idx = decodeDocu($idx);
	    $sec = substr($idx,-2);
	    $idx = substr($idx,0,-2);
	    if($idx=="" || !is_numeric($idx) || substr($idx,0,1)!=substr($idx,2,1) || substr($idx,1,1)!=substr($idx,-1)){
	        if(isset($_SESSION['error'])) $_SESSION['error'] ++;
	        else $_SESSION['error'] = 1;
	        header('location: /error.html');
	        exit;
	    }else{
	        $idx = substr($idx,2);
	        $_SESSION['error'] = 0;
	    }
	    
	    $estimate_model = $this->loadModel('estimateModel');
	    $estimate_data = $estimate_model->getDocumentView($idx);
	    if($estimate_data && substr($estimate_data->dInsert_Estimate,-2)==$sec){
	        if((isset($_GET['w']) && $_GET['w']!="") || (isset($_POST['w']) && $_POST['w']!="")){
	            $makeType = "down";
	            if(isset($_POST['w']) && $_POST['w']!=""){
	                $docuType = $_POST['w'];
	            }else{
	                $docuType = $_GET['w'];
	            }
	            require_once '../package/tcpdf/makeFile.php';
	            //require 'views/m/down.php';
	        }else if(substr($estimate_data->cKind_Estimate,0,1)=="L" && !isset($_SERVER['HTTP_AICT_AGENT']) && strpos($_SERVER['HTTP_REFERER'],URL)===false && strpos($_SERVER['HTTP_REFERER'],URL_OFFER)===false){        // 리스 모집인 안내 후 보이게 처리됨
	            header('location: '.URL_OFFER.'?mbrIdnId='.$estimate_data->cID_Member.'&estdKey='.$token);
	            //header('location: /error.html');
	            exit;
	        }else{
	            require 'views/D/estimate.php';
	        }
	        
	    }else{
	        header('location: /error.html');
	        exit;
	    }
	}
	public function P($idx)
	{
	    if(strpos($idx,".")!==false){
	        $tmp = explode(".",$idx);
	        $idx = $tmp[0];
	        $page = $tmp[1];
	    }else{
	        $page = 0;
	    }
	    $url = URL."/D/P/".$idx;
	    $idx = decodeDocu($idx);
	    $sec = substr($idx,0,4);
	    $model = substr($idx,4,"-".substr($idx,1,1));
	    $idx = substr($idx,"-".substr($idx,1,1));
	    $type = substr($sec,0,1);  // 1 정보 표시, 2 영업소 숨김, 3 정보 없음 (소문자)
	    //echo $model."-".$idx."-".$type;
	    if($idx=="" || !is_numeric($idx) || substr($idx,-1)!=substr($sec,3,1) || substr($model,-1)!=substr($sec,2,1)){
	        if(isset($_SESSION['error'])) $_SESSION['error'] ++;
	        else $_SESSION['error'] = 1;
	        header('location: /error.html');
	        exit;
	    }else{
	        $_SESSION['error'] = 0;
	    }
	    $dataModelView =  json_decode(file_get_contents(DATA_PATH."modelData_".$model.".json"), true);
	    if(isset($dataModelView['files'][$idx])){
	        $val = $dataModelView['files'][$idx];
	        $val['modelName'] = $dataModelView['model'][$model]['name'];
	        $val['modelImg'] = $dataModelView['model'][$model]['image'];
	        //var_dump($val);
	        require 'views/D/images.php';
	    }else{
	        header('location: /error.html');
	        exit;
	    }
	}
	public function C($idx)
	{
	    if(isset($_GET)){
	        $str = "";
	        foreach($_GET as $key => $val){
	            if($key!="url"){
    	            if($str) $str .= "\n";
    	            $str .= $key."\t".$val;
	            }
	        }
	       if($str) setcookie("start",$str, '' ,"/",".hanaft.aictin.com");
	    }
	    header('location: /newcar/estimate/'.$idx);
	}
	public function push($idx)
	{
	    $getJson = file_get_contents('php://input');
	    
	    $log_txt = "\n".date("Y-m-d H:i:s")."\t".$_SERVER["REMOTE_ADDR"];
	    if(isset($_SERVER['HTTP_USER_AGENT'])) $log_txt .= "\t".$_SERVER['HTTP_USER_AGENT'];
	    $log_txt .= "\n".$getJson;
	    $log_file = fopen(SITE_PATH."state_".date("Y-m-d").".log", "a");
	    fwrite($log_file, $log_txt);
	    fclose($log_file);
	    
	    $rtnd = json_decode($getJson, true);
	    
	    $estimate_model = $this->loadModel('estimateModel');
	    
	    if($idx=="state"){
	        if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict"){
	            $url = "http://ep.aictcorp.com/hana/api/requestState"; // 디에이시스템 API 테스트용
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
	        $req['Message']['reqInfo']['dvCd'] = "3";
	        $req['Message']['reqJgmnPcndInfo']['mbrIdnId'] = $rtnd['Message']['reqJgmnPcndInfo']['mbrIdnId'];
	        $req['Message']['reqJgmnPcndInfo']['hniEtmtNo'] = $rtnd['Message']['reqJgmnPcndInfo']['hniEtmtNo'];
	        $req['Message']['reqJgmnPcndInfo']['inqrStrDt'] = $rtnd['Message']['reqJgmnPcndInfo']['inqrStrDt'];
	        $req['Message']['reqJgmnPcndInfo']['inqrEndDt'] = $rtnd['Message']['reqJgmnPcndInfo']['inqrEndDt'];
	        $reqJson = json_encode($req);
	        $log_txt = "\n".$reqJson;
	        $log_file = fopen(SITE_PATH."state_".date("Y-m-d").".log", "a");
	        fwrite($log_file, $log_txt);
	        fclose($log_file);
	        
	        if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // 자체
	        else $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
	        $rtnd = json_decode($getJson, true);
	        if(isset($rtnd['Message']['jgmnPcndInfoList'][0]) && $rtnd['Message']['jgmnPcndInfoList'][0]){
	            $estimate_model->updateRequestState($rtnd['Message']['jgmnPcndInfoList']);
	        }
	        $log_txt = "\n".$getJson;
	        $log_file = fopen(SITE_PATH."state_".date("Y-m-d").".log", "a");
	        fwrite($log_file, $log_txt);
	        fclose($log_file);
	    }else{
	        header('location: /error.html');
	        exit;
	    }
	}
	public function data($idx)
	{
	    if($idx=="log" || $idx=="resend" || $idx=="view"){
	        if(!isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
	            $data['result'] = "failure";
	            $data['error'] = "404";
	            echo jxgcompress(json_encode($data), true);
	            exit;
	        }
	        $workDay = $_GET['day'];
	    }else{
	        $getJson = file_get_contents('php://input');
	        $rtnd = json_decode($getJson, true);
	        $workDay = $rtnd['Message']['date'];
	    }
	    $pathHanafn = "../../files/hanafn/";
	    if(file_exists($pathHanafn."hanafn_".$workDay.".json")){
	        $data['Message']['file'] = "ok";
	        $data['Message']['get'] = date("Y-m-d H:i:s",filemtime($pathHanafn."hanafn_".$workDay.".json"));
	        if(file_exists($pathHanafn."hanafn_".$workDay."._log")){
	            $data['Message']['log'] = date("Y-m-d H:i:s",filemtime($pathHanafn."hanafn_".$workDay."._log"));
	            if($idx=="log") $data['Message']['rslt'] = file_get_contents($pathHanafn."hanafn_".$workDay."._log");
	        }else{
	            $data['Message']['log'] = "none";
	        }
	    }else{
	        $data['Message']['file'] = "none";
	        echo json_encode($data);
	        exit;
	    }
	    
	    // 데이터 명칭 변환
	    $mapping['Brand']['dvCd']="BRAND";
	    $mapping['Brand']['list']="brandList";
	    $mapping['Brand']['key']="iIdx_Brand";
	    $mapping['Series']['dvCd']="SERIES";
	    $mapping['Series']['list']="seriesList";
	    $mapping['Series']['key']="iIdx_Series";
	    
	    $mapping['Model']['dvCd']="MODEL";
	    $mapping['Model']['list']="modelList";
	    $mapping['Model']['key']="iIdx_Model";
	    $mapping['ModelSummary']['dvCd']="MODELSUMMARY";
	    $mapping['ModelSummary']['list']="mdsmList";
	    $mapping['ModelSummary']['key']="iIdx_Model";
	    
	    $mapping['Lineup']['dvCd']="LINEUP";
	    $mapping['Lineup']['list']="lineupList";
	    $mapping['Lineup']['key']="iIdx_Lineup";
	    $mapping['Trim']['dvCd']="TRIM";
	    $mapping['Trim']['list']="trimList";
	    $mapping['Trim']['key']="iIdx_Trim";
	    
	    $mapping['ColorExt']['dvCd']="COLOREXT";
	    $mapping['ColorExt']['list']="clrextList";
	    $mapping['ColorExt']['key']="iIdx_ColorExt";
	    $mapping['ColorExtModel']['dvCd']="COLOREXTMODEL";
	    $mapping['ColorExtModel']['list']="clrextmdList";
	    $mapping['ColorExtModel']['key']="iIdx_ColorExt,iIdx_Model";
	    $mapping['ColorExtLineup']['dvCd']="COLOREXTLINEUP";
	    $mapping['ColorExtLineup']['list']="clrextluList";
	    $mapping['ColorExtLineup']['key']="iIdx_ColorExt,iIdx_Lineup";
	    $mapping['ColorExtTrim']['dvCd']="COLOREXTTRIM";
	    $mapping['ColorExtTrim']['list']="clrexttrList";
	    $mapping['ColorExtTrim']['key']="iIdx_ColorExt,iIdx_Trim";
	    
	    $mapping['ColorInt']['dvCd']="COLORINT";
	    $mapping['ColorInt']['list']="clrinList";
	    $mapping['ColorInt']['key']="iIdx_ColorInt";
	    $mapping['ColorIntLineup']['dvCd']="COLORINTLINEUP";
	    $mapping['ColorIntLineup']['list']="clrinlnupList";
	    $mapping['ColorIntLineup']['key']="iIdx_ColorInt,iIdx_Lineup";
	    $mapping['ColorIntTrim']['dvCd']="COLORINTTRIM";
	    $mapping['ColorIntTrim']['list']="clrintrList";
	    $mapping['ColorIntTrim']['key']="iIdx_ColorInt,iIdx_Trim";
	    $mapping['ColorIntExtNot']['dvCd']="COLORINTEXTNOT";
	    $mapping['ColorIntExtNot']['list']="clrinextnotList";
	    $mapping['ColorIntExtNot']['key']="iIdx_ColorInt,iIdx_ColorExt";
	    
	    $mapping['Option']['dvCd']="OPTION";
	    $mapping['Option']['list']="optList";
	    $mapping['Option']['key']="iIdx_Option";
	    $mapping['OptionLineup']['dvCd']="OPTIONLINEUP";
	    $mapping['OptionLineup']['list']="optlnList";
	    $mapping['OptionLineup']['key']="iIdx_Option,iIdx_Lineup";
	    $mapping['OptionTrim']['dvCd']="OPTIONTRIM";
	    $mapping['OptionTrim']['list']="opttrList";
	    $mapping['OptionTrim']['key']="iIdx_Option,iIdx_Trim";
	    
	    $mapping['OptionExtJoin']['dvCd']="OPTIONEXTJOIN";
	    $mapping['OptionExtJoin']['list']="optextjoList";
	    $mapping['OptionExtJoin']['key']="iIdx_Option,iIdx_ColorExt";
	    $mapping['OptionExtNot']['dvCd']="OPTIONEXTNOT";
	    $mapping['OptionExtNot']['list']="optextnotList";
	    $mapping['OptionExtNot']['key']="iIdx_Option,iIdx_ColorExt";
	    $mapping['OptionIntJoin']['dvCd']="OPTIONINTJOIN";
	    $mapping['OptionIntJoin']['list']="optinjoList";
	    $mapping['OptionIntJoin']['key']="iIdx_Option,iIdx_ColorInt";
	    $mapping['OptionIntNot']['dvCd']="OPTIONINTNOT";
	    $mapping['OptionIntNot']['list']="optinnotList";
	    $mapping['OptionIntNot']['key']="iIdx_Option,iIdx_ColorInt";
	    
	    $mapping['Spec']['dvCd']="SPEC";
	    $mapping['Spec']['list']="specList";
	    $mapping['Spec']['key']="iIdx_Spec";
	    $mapping['SpecData']['dvCd']="SPECDATA";
	    $mapping['SpecData']['list']="specdataList";
	    $mapping['SpecData']['key']="iIdx_Spec,iItem_SpecData";
	    $mapping['SpecTrim']['dvCd']="SPECTRIM";
	    $mapping['SpecTrim']['list']="spectrList";
	    $mapping['SpecTrim']['key']="iIdx_Spec,iIdx_Trim,cOption_SpecTrim";
	    
	    $mapping['File']['dvCd']="FILE";
	    $mapping['File']['list']="fileList";
	    $mapping['File']['key']="iIdx_File";
	    $mapping['FileApply']['dvCd']="FILEAPPLY";
	    $mapping['FileApply']['list']="fileaplyList";
	    $mapping['FileApply']['key']="cTable_FileApply,iIdx_TableApply,cKind_Table";
	    $mapping['Document']['dvCd']="DOCUMENT";
	    $mapping['Document']['list']="docList";
	    $mapping['Document']['key']="iIdx_Document";
	    
	    $mapping['BondCut']['dvCd']="BONDCUT";
	    $mapping['BondCut']['list']="bondcutList";
	    $mapping['BondCut']['key']="dDay_BondCut";
	    $mapping['History']['dvCd']="HISTORY";
	    $mapping['History']['list']="historyList";
	    $mapping['History']['key']="iIdx_History";
	    
	    if($idx=="check"){
	        echo json_encode($data);
	    }else if($idx=="log"){
	        echo jxgcompress(json_encode($data), true);
	        exit;
	    }else if($idx=="view"){
	        
	        $dataDaily = json_decode(file_get_contents($pathHanafn."hanafn_".$workDay.".json"), true);
	        
	        $view = "■ ".$workDay." 데이터 현황 \n";
	        
	        $list = explode(",",$dataDaily['list']);
	        $ccc = 0;
	        foreach($list as $key=>$table){
	            $listName = $mapping[$table]['dvCd'];
	            $listCount = count($dataDaily[$table]);
	            $view .= "\n ".$listName." => ".number_format($listCount);
	        }
	        
	        $view .= "\n\n■ 변경 내역";
	        
	        foreach($dataDaily['History'] as $val){
	            $view .= "\n\n▶ ".$val['history']." => ".$val['datetime'];
	            $view .= "\n".$val['cmemoHistory'];
	        }
	        
	        $data['Message']['data'] = $view;
	        
	        echo jxgcompress(json_encode($data), true);
	        exit;
	    }else if($idx=="send" || $idx=="resend"){
	        $log_txt = "\n\n".date("Y-m-d H:i:s")."\t".$_SERVER["REMOTE_ADDR"];
	        if(isset($_SERVER['HTTP_USER_AGENT'])) $log_txt .= "\t".$_SERVER['HTTP_USER_AGENT'];
	        if($idx=="send") $log_txt .= "\n".$getJson;
	        else if($idx=="resend") $log_txt .= "\nADMIN ".$_SESSION['id_Member'];
	        $log_txt .= "\n";
	        $log_file = fopen($pathHanafn."hanafn_".$workDay."._log", "a");
	        fwrite($log_file, $log_txt);
	        fclose($log_file);
	        
	        // $url = "http://pi.aictcorp.com/temp/hanaData.php"; // 디에이시스템 API 테스트용
	        
	        // 헤더값
	        $headers = array(
	            'Content-Type:application/json',
	            'Accept: application/json'
	        );
	        
            $dataDaily = json_decode(file_get_contents($pathHanafn."hanafn_".$workDay.".json"), true);
            if(file_exists($pathHanafn."hanafn_".$workDay."._rslt")){
                $rslt =  json_decode(file_get_contents($pathHanafn."hanafn_".$workDay."._rslt"), true);
            }
            
            $list = explode(",",$dataDaily['list']);
            $ccc = 0;
            foreach($list as $key=>$table){
                //if($ccc<50){
                //if($workDay!="2020-11-15" || $table==$_POST['table']){    // 일부만 적용시    
                    $listName = $mapping[$table]['list'];
                    $keyArr = explode(",",$mapping[$table]['key']);
                    foreach($dataDaily[$table] as $val){
                        $keyStr = "";
                        foreach($keyArr as $col){
                            $col2 = explode("_",$col);
                            $col3 = strtolower($col2[0]).substr($col2[1],0,1).strtolower(substr($col2[1],1));
                            if($keyStr) $keyStr .="_";
                            $keyStr .= $val[$col3];
                        }
                        // pass 체크
                        $pass = true;
                        if(isset($rslt[$table][$keyStr][$val['history']])){
                            if(substr($rslt[$table][$keyStr][$val['history']],2)==$val['datetime']){
                                $pass = false;
                            }else if($val['iud']=="I"){
                                $val['iud'] = "U";
                            }
                        }
                        $log_txt = "\n■ $ccc table=$table, primary=$keyStr\n";
                        if($pass){
                            $log_txt .= "▶ 요청\n";
                            $req = array();
                            $req['Header']['serviceID'] = 'UCARI00011';
                            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
                            $req['Message']['reqInfo']['ccoCustSno'] = '0';
                            $req['Message']['reqInfo']['dvCd'] = $mapping[$table]['dvCd'];
                            $req['Message'][$listName][0] = $val;
                            $reqJson = json_encode($req);
                            $log_txt .= $reqJson."\n";
                                
                            //$getJson = connect_curl($url,$headers,$reqJson);   // 자체
                            $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
                            
                            $log_txt .= "◀ 응답\n";
                            $log_txt .= $getJson."\n";
                            $rtnd = json_decode($getJson, true);
                            if(isset($rtnd['Message']['resInfo']['rspnsCd']) && $rtnd['Message']['resInfo']['rspnsCd']=="1"){
                                $rslt[$table][$keyStr][$val['history']]=$val['iud']."_".$val['datetime'];
                                $log_txt .= "♥ 전송 성공 \n";
                            }else{
                                $log_txt .= "☎ 전송 실패 \n";
                            }
                        }else{
                            $log_txt .= "♡ 전송 성공 이력 있어 재전송 하지 않음, history=".$val['history']."_".$rslt[$table][$keyStr][$val['history']]."\n";
                        }
                        $log_file = fopen($pathHanafn."hanafn_".$workDay."._log", "a");
                        fwrite($log_file, $log_txt);
                        fclose($log_file);
                        // 모델 파일 전송 API
                        if($table=="File" && $val['ctableFile']=="Model" && $val['ckindTable']=="main" && $val['istateFile']=="1"){
                            $fileModel[substr($val['cdirectoryFile'],6)][$val['iidxFile']]=$val['cnameFile'];
                        }
                        $ccc ++;
                    }
                    
                //}
            }  // 일부만 적용시
            // 파일 전송
            $cnt = 0;
            if(isset($fileModel)){
                foreach($fileModel as $dir=>$row){
                    foreach($row as $fNo=>$fName){
                        $filePath = '/home/hosting_user/aict/files/images/model/'.$dir;
                        if(file_exists($filePath.'/'.$fName)){
                            // pass 체크
                            $pass = true;
                            if(isset($rslt['FileReg'][$fNo])){
                                $pass = false;
                            }
                            $log_txt = "\n■ table=FileReg, primary=$fNo\n";
                            if($pass){
                                $log_txt .= "▶ 요청\n";
                                $req = array();
                                $req['Header']['serviceID'] = 'UCARI00011';
                                $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
                                $req['Message']['reqInfo']['ccoCustSno'] = '0';
                                $req['Message']['reqInfo']['dvCd'] = 'FILEREG';
                                $req['Header']['FilePath'] = $filePath;
                                
                                $req['Message']['fileList'][0]['ccoCntrNo'] = "";
                                $req['Message']['fileList'][0]['cslLoanNo'] = "";
                                $req['Message']['fileList'][0]['fileDvCd'] = "2";
                                $req['Message']['fileList'][0]['fileNm'] = $fName;
                                $req['Message']['fileList'][0]['fileSzCnt'] = filesize($req['Header']['FilePath'].'/'.$fName);
                                
                                $req['Message']['reqfileInfo']['pprsRegsDvCd'] = "0006";
                                $req['Message']['reqfileInfo']['pchsDmndDt'] = "";
                                $req['Message']['reqfileInfo']['pchsDmndSqn'] = "";
                                $req['Message']['reqfileInfo']['pchsDmndNcs'] = "";
                                $req['Message']['reqfileInfo']['fileNcs'] = 1;
                                
                                $reqJson = json_encode($req);
                                $reqJson = str_replace("\/","/",$reqJson);
                                $log_txt .= $reqJson."\n";
                                
                                //$getJson = connect_curl($url,$headers,$reqJson);   // 자체
                                $getJson = connect_hana($reqJson);   // 하나제공 (header와 url 함수에 고정됨)
                                
                                $log_txt .= "◀ 응답\n";
                                $log_txt .= $getJson."\n";
                                $rtnd = json_decode($getJson, true);
                                if(isset($rtnd['Message']['resInfo']['rspnsCd']) && $rtnd['Message']['resInfo']['rspnsCd']=="1"){
                                    $rslt['FileReg'][$fNo] = $rtnd['Message']['resInfo']['fileDmndKey'];
                                    $log_txt .= "♥ 전송 성공 \n";
                                }else{
                                    $log_txt .= "☎ 전송 실패 \n";
                                }
                            }else{
                                $log_txt .= "♡ 전송 성공 이력 있어 재전송 하지 않음 fileDmndKey=".$rslt['FileReg'][$fNo]."\n";
                            }
                            $log_file = fopen($pathHanafn."hanafn_".$workDay."._log", "a");
                            fwrite($log_file, $log_txt);
                            fclose($log_file);
                        }
                    }
                }
            }
            
            if(isset($rslt)){
                $rslt_str = json_encode($rslt);
                $rslt_file = fopen($pathHanafn."hanafn_".$workDay."._rslt", "w");
                fwrite($rslt_file, $rslt_str);
                fclose($rslt_file);
            }
            if($idx=="resend"){
                echo jxgcompress(json_encode($data), true);
                exit;
            }else{
                // echo json_encode($data);
            }
	    }
	    exit;
	}
	
	
	
	
	public function api()
	{
	    $getData = file_get_contents('php://input');
	    if(substr($getData,0,1)!="{"){
	        $getData = base64_decode($getData);
	        $getData = @openssl_decrypt($getData, "aes-128-cbc", WOORI_KEY, true, WOORI_IV);
	    }
	    $data = array();
	    $data['result'] = "success";
	    $data['date'] = date("Y-m-d H:i:s");
	    $data['data'] = $getData;
	    
	    $sendData = json_encode($data, JSON_UNESCAPED_UNICODE);
	    
	    $sendData = @openssl_encrypt($sendData , "aes-128-cbc", WOORI_KEY, true, WOORI_IV);
	    $sendData = base64_encode($sendData);
	    
	    echo $sendData;
	}
}
