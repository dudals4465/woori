<?php
class Api extends Controller
{
    public function index()
    {
        header("location:/");
        exit;
    }
    public function auto($idx)
    {
        if(!isset($idx) || !isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
        if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict") $fileTmp = "_";
        else $fileTmp = "";
        if($idx=="rentConfig" && file_exists(SITE_PATH.$fileTmp."rentConfig.json")){
            $goodsConfig =  json_decode(file_get_contents(SITE_PATH.$fileTmp."rentConfig.json"), true);
            $str = json_encode($goodsConfig);
            echo jxgcompress($str,true);
        }else if($idx=="leaseConfig" && file_exists(SITE_PATH.$fileTmp."leaseConfig.json")){
            $goodsConfig =  json_decode(file_get_contents(SITE_PATH.$fileTmp."leaseConfig.json"), true);
            $str = json_encode($goodsConfig);
            echo jxgcompress($str,true);
        }else if($idx=="leaseUConfig" && file_exists(SITE_PATH.$fileTmp."leaseUConfig.json")){
            $goodsConfig =  json_decode(file_get_contents(SITE_PATH.$fileTmp."leaseUConfig.json"), true);
            $str = json_encode($goodsConfig);
            echo jxgcompress($str,true);
        }else if($idx=="finceConfig" && file_exists(SITE_PATH.$fileTmp."finceConfig.json")){
            $goodsConfig =  json_decode(file_get_contents(SITE_PATH.$fileTmp."finceConfig.json"), true);
            $str = json_encode($goodsConfig);
            echo jxgcompress($str,true);
        }else if($idx=="defaultConfig" && file_exists(SITE_PATH."defaultConfig.json")){
            $defaultConfig =  json_decode(file_get_contents(SITE_PATH."defaultConfig.json"), true);
            $str = json_encode($defaultConfig);
            echo jxgcompress($str,true);
        }else if(file_exists(DATA_PATH.$idx.".json")){
            //require DATA_PATH.$idx.".json";
            if(substr($idx,0,10)=="modelData_" || substr($idx,0,10)=="modelUsed_"){
                $model = substr($idx,10);
                $dataModelView =  json_decode(file_get_contents(DATA_PATH.$idx.".json"), true);
                if(isset($dataModelView['files'])){
                    $mem = 210; // hana????????? 210 B2B 200 ??????, ????????? ?????????
                    foreach($dataModelView['files'] as $key=>$val){
                        for($i=1;$i<=3;$i++){
                            $dataModelView['files'][$key]["url".$i] = URL."/D/P/".encodeDocu($i.strlen($key).substr($model,-1).substr($key,-1).$model.$key);
                        }
                    }
                }
                $str = json_encode($dataModelView);
                echo jxgcompress($str,true);
            }else{
                echo jxgcompress(file_get_contents(DATA_PATH.$idx.".json"), true);
            }
        }else{
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
    }
    public function finance($idx)
    {
        if(!isset($idx) || !isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
        if(file_exists(SITE_PATH.$idx.".json")){
            echo jxgcompress(file_get_contents(SITE_PATH.$idx.".json"), true);
        }else{
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
    }
    public function apply($path)
    {
        if($path=="get"){
            $_POST = $_GET;
        }
        $url = URL."/D/E/".$_POST['key'];
        $fno = $_POST['fno'];
        $idx = decodeDocu($_POST['key']);
        $sec = substr($idx,-2);
        $idx = substr($idx,0,-2);
        $estimate_model = $this->loadModel('estimateModel');
        if($idx=="" || !is_numeric($idx) || substr($idx,0,1)!=substr($idx,2,1) || substr($idx,1,1)!=substr($idx,-1)){
            if(isset($_SESSION['error'])) $_SESSION['error'] ++;
            else $_SESSION['error'] = 1;
            header('location: /error.html');
            exit;
        }else{
            $idx = substr($idx,2);
            $_SESSION['error'] = 0;
        }
        if($_POST['job']=="confirm"){
            $estimate_data = $estimate_model->getDocumentRequest($idx);
            if($estimate_data && substr($estimate_data->dInsert_Estimate,-2)==$sec){
                $data = json_decode($estimate_data->tData_Estimate, true);
                if(isset($data['estmData']['ucarCode'])){
                    $carAge = "usedcar";
                }else{
                    $carAge = "newcar";
                }                
                if($_SESSION['mode']=="aict"){
                    $url = "http://ep.aictcorp.com/hana/api/sendEstm"; // ?????????????????? API ????????????
                    // ????????? aict ??? ??????
                    $headers = array(
                        'Content-Type:application/json',
                        'Accept: application/json'
                    );
                }
                // POST???????????? ?????? JSON????????? ??????
                $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
                $req['Message']['reqInfo']['ccoCustSno'] = '0';
                if($data['estmData']['mode']=="rent"){
                    $req['Header']['serviceID'] = 'UCARI00014';
                    //if(isset($data['estmData']['vin']) && $data['estmData']['vin']) $req['Message']['reqInfo']['dvCd'] = '2';
                    //else
                    $req['Message']['reqInfo']['dvCd'] = '1';      // ???????????? 1, ?????????/???????????? 2
                }else  if($data['estmData']['mode']=="lease"){
                    $req['Header']['serviceID'] = 'UCARI00019';
                    $req['Message']['reqInfo']['dvCd'] = '4';
                    if($carAge == "usedcar") $req['Message']['info']['nprvDvCd'] = "NP02";         // ?????????????????? NP01- ??????,    NP02- ?????????
                    else $req['Message']['info']['nprvDvCd'] = "NP01";         // ?????????????????? NP01- ??????,    NP02- ?????????
                }else  if($data['estmData']['mode']=="fince"){
                    $req['Header']['serviceID'] = 'UCARI00022';
                    $req['Message']['reqInfo']['dvCd'] = '2';
                }
                // ?????? ??????
                $req['Message']['info']['aictEtmtNo'] = $_POST['key'].".".$_POST['fno']; // $estimate_data->iIdx_Estimate;
                $req['Message']['info']['custNm'] = $_POST['custNm']; // $estimate_data->iIdx_Estimate;
                //$req['Message']['info']['estdHtmlDcmCtnt'] = $estimate_data->tDocument_Estimate;
                //$req['Message']['info']['estdLnkCtnt'] = $url;
                $req['Message']['info']['etmtDt'] = substr($estimate_data->dInsert_Estimate,0,10);
                $req['Message']['info']['etmtDt'] = str_replace("-","",$req['Message']['info']['etmtDt']);
                if($carAge == "usedcar"){
                    $req['Message']['info']['ctfcUcarYn'] = (string)$data['estmData']['certifyYN'];
                    $req['Message']['info']['cmnyCd'] = (string)$data['estmData']['regYM'];
                    $req['Message']['info']['ucarMdlCd'] = (string)$data['estmData']['ucarCode'];
                    $req['Message']['info']['basAmt'] = (string)$data['estmData']['ucarPrice'];
                }else{
                    $req['Message']['info']['braNo'] = (string)$data['estmData']['brand'];
                    $req['Message']['info']['braNm'] = (string)$data['estmData']['brandName'];
                    $req['Message']['info']['mdlNo'] = (string)$data['estmData']['model'];
                    $req['Message']['info']['mdlNm'] = (string)$data['estmData']['modelName'];
                    $req['Message']['info']['linupNo'] = (string)$data['estmData']['lineup'];
                    $req['Message']['info']['linupNm'] = (string)$data['estmData']['lineupName'];
                    $req['Message']['info']['trimNo'] = (string)$data['estmData']['trim'];
                    $req['Message']['info']['trimNm'] = (string)$data['estmData']['trimName'];
                    $req['Message']['info']['basAmt'] = (string)$data['estmData']['trimPrice'];
                    $req['Message']['info']['xtrClrtnNo'] = (string)$data['estmData']['colorExt'];
                    $req['Message']['info']['xtrClrtnNm'] = (string)$data['estmData']['colorExtName'];
                    if($req['Message']['info']['xtrClrtnNo']) $req['Message']['info']['xtrClrtnAmt'] = (string)$data['estmData']['colorExtPrice'];
                    else $req['Message']['info']['xtrClrtnAmt'] = "";
                    $req['Message']['info']['itrClrtnNo'] = (string)$data['estmData']['colorInt'];
                    $req['Message']['info']['itrClrtnNm'] = (string)$data['estmData']['colorIntName'];
                    if($req['Message']['info']['itrClrtnNo']) $req['Message']['info']['itrClrtnAmt'] = (string)$data['estmData']['colorIntPrice'];
                    else $req['Message']['info']['itrClrtnAmt'] = "";
                    if($data['estmData']['mode']!="fince") $req['Message']['info']['dlvyDvCd'] = (string)$data['fincCfg'][0]['takeType'];
                    //$req['Message']['info']['cropNo'] = (string)$data['estmData']['option'];
                    $cropNm = "";
                    $cropAmt = "";
                    if($data['estmData']['option']){
                        $opt = explode("\n",$data['estmData']['optionList']);
                        foreach($opt as $dat){
                            $da = explode("\t",$dat);
                            if($cropNm){
                                $cropNm .="^";
                                $cropAmt .= "^";
                            }
                            $cropNm .=$da[0];
                            $cropAmt .= $da[1];
                        }
                    }
                    $req['Message']['info']['cropNmList'] = (string)$cropNm;
                    $req['Message']['info']['cropAmtList'] = (string)$cropAmt;
                    $req['Message']['info']['cropNoList'] = (string)str_replace(",","^",$data['estmData']['option']);
                }
                
                if($data['estmData']['mode']!="fince"){
                    $req['Message']['info']['endAftDutyPrcsCd'] = (string)$data['fincCfg'][$fno]['endType'];
                    if($data['fincData'][$fno]['depositS']=="0"){
                        $req['Message']['info']['gtamtRto'] = (string)$data['fincData'][$fno]['depositR'];
                        $req['Message']['info']['grtAmt'] = (string)$data['fincData'][$fno]['deposit'];
                        $req['Message']['info']['flflGisurSctsRto'] = "0";       // ??????????????????????????????	flflGisurSctsRto
                        $req['Message']['info']['flflGisurSctsAmt'] =  "0";        // ??????????????????????????????	flflGisurSctsAmt
                    }else{
                        $req['Message']['info']['gtamtRto'] = "0";
                        $req['Message']['info']['grtAmt'] = "0";
                        $req['Message']['info']['flflGisurSctsRto'] = (string)$data['fincData'][$fno]['depositR'];       // ??????????????????????????????	flflGisurSctsRto
                        $req['Message']['info']['flflGisurSctsAmt'] = (string)$data['fincData'][$fno]['depositS'];        // ??????????????????????????????	flflGisurSctsAmt
                    }
                    $req['Message']['info']['gtamtRto'] = (string)$data['fincData'][$fno]['depositR'];
                    $req['Message']['info']['grtAmt'] = (string)$data['fincData'][$fno]['deposit'];
                    $req['Message']['info']['agrTrvgDstnCd'] = (string)$data['fincData'][$fno]['km'];
                    $req['Message']['info']['prrpRto'] = (string)$data['fincData'][$fno]['prepayR'];
                    $req['Message']['info']['prrpAmt'] = (string)$data['fincData'][$fno]['prepay'];
                    $req['Message']['info']['aplRcstRto'] = (string)$data['fincData'][$fno]['remainR'];
                    $req['Message']['info']['aplRcstAmt'] = (string)$data['fincData'][$fno]['remain'];
                    
                    // ???????????? ???????????? ??????, ??? ??????????????? ???????????? ????????????
                    $req['Message']['info']['agCmfeAmt'] = (string)$data['estmData']['feeAg'];
                    $req['Message']['info']['cmCmfeAmt'] = (string)$data['estmData']['feeCm'];
                    
                    if(isset($data['fincCfg'][0]['branchShop'])) $req['Message']['info']['mgdptCd'] = (string)$data['fincCfg'][0]['branchShop']; // mgdptCd ????????????
                    // ?????? ?????????
                    if(isset($data['fincCfg'][$fno]['feeAgAdd'])){
                        $req['Message']['info']['agAdCmfe'] = (string)$data['fincCfg'][$fno]['feeAgAdd'];
                        $req['Message']['info']['agAdCmfeRto'] = (string)$data['fincCfg'][$fno]['feeAgAddR'];
                    }
                }
                
                $req['Message']['info']['agId'] = $_SESSION["id_Member"];
                
                $req['Message']['info']['cprnCustNo'] = (string)$data['fincCfg'][0]['dealerShop']; // ????????? ???????????? dealerShop
                if($req['Message']['info']['cprnCustNo']=="etc" || $req['Message']['info']['cprnCustNo']=="0") $req['Message']['info']['cprnCustNo'] = "";    // etc ?????????
                
                $req['Message']['info']['custDvCd'] =  (string)$data['fincCfg'][0]['buyType'];  // ???????????? ??????, ???????????? ?????? 20220607 W/?????????
                
                if($data['estmData']['mode']=="rent"){
                    $req['Message']['info']['dptCd'] =  $_SESSION["branch_Member"];
                    
                    if(isset($data['estmData']['vin']) && $data['estmData']['vin']){
                        $req['Message']['info']['vin'] = (string)$data['estmData']['vin'];
                        $req['Message']['info']['preBuyDvCd'] = (string)$data['estmData']['fastKind'];
                    }else{
                        $req['Message']['info']['vin'] = "";
                        $req['Message']['info']['preBuyDvCd'] = "";
                    }
                    $req['Message']['info']['trimAmt'] = (string)$data['estmData']['trimPrice'];
                    $req['Message']['info']['mkrCsfe'] = (string)$data['estmData']['deliveryMaker'];
                    if($req['Message']['info']['cropNoList']) $req['Message']['info']['cropAduAmt'] = (string)$data['estmData']['optionSum'];
                    else $req['Message']['info']['cropAduAmt'] = "";
                    $req['Message']['info']['spcSellDlvyDcAmt'] = '';  //?????????????????????
                    $req['Message']['info']['spcSellDlvyDcRto'] = '';  //?????????????????????
                    //$req['Message']['info']['mkrDcAmt'] = (string)$data['estmData']['discountMaker'];
                    $req['Message']['info']['gnDcAmt'] = (string)$data['estmData']['discountMaker'];   //????????????
                    $req['Message']['info']['gnDcRto'] = (string)$data['estmData']['discountRate'];   //????????? 
                    $req['Message']['info']['puryCarAmt'] = (string)$data['estmData']['priceSum'];
                    $req['Message']['info']['cntrPrid'] = (string)$data['fincData'][$fno]['month'];
                    $req['Message']['info']['hirrRto'] = ''; //????????????
                    if(isset($data['fincData'][$fno]['remainType'])) $req['Message']['info']['aiIstmRcstYn'] = (string)$data['fincData'][$fno]['remainType'];
                    else $req['Message']['info']['aiIstmRcstYn'] = "N";    // ?????????
                    $req['Message']['info']['custBzFrmCd'] = (string)$data['fincCfg'][0]['buyType'];
                    //$req['Message']['info']['custDvCd'] = (string)$data['fincCfg'][0]['buyType'];                   // 2022-03-23 ?????? // ???????????? ?????? 20220607 W/?????????
                    $req['Message']['info']['jnIscoNm'] = (string)$data['fincCfg'][0]['insureCompany'];
                    $req['Message']['info']['drvrAgeDvCd'] = (string)$data['fincCfg'][0]['insureAge'];
                    $req['Message']['info']['sustRpraDvCd'] = (string)$data['fincCfg'][0]['insureObj'];
                    $req['Message']['info']['ownBodyAcdDvCd'] = (string)$data['fincCfg'][0]['insureCar'];
                    $req['Message']['info']['apemSconJnYn'] = (string)$data['fincCfg'][0]['insureEmpYn'];
                    $req['Message']['info']['mcarBnamtDvCd'] = (string)$data['fincCfg'][0]['insureSelf'];
                    $req['Message']['info']['cndgmtMthCd'] = (string)$data['fincCfg'][0]['deliveryType'];
                    $req['Message']['info']['dlvyArDvCd'] = (string)$data['fincCfg'][0]['deliveryShip'];
                    $req['Message']['info']['cndgmtArDvCd'] = (string)$data['fincCfg'][0]['deliverySido'];
                    $req['Message']['info']['snrWndtngNo'] = (string)$data['fincCfg'][0]['sdrrTinting'];
                    if(isset($data['fincCfg'][0]['sdrrTintingRatio'])) $req['Message']['info']['snrWndtngCcrtNo'] = (string)$data['fincCfg'][0]['sdrrTintingRatio'];
                    else $req['Message']['info']['snrWndtngCcrtNo'] = "";
                    $req['Message']['info']['cwsWndtngNo'] = (string)$data['fincCfg'][0]['frtTinting'];
                    if(isset($data['fincCfg'][0]['frtTintingRatio'])) $req['Message']['info']['cwsWndtngCcrtNo'] = (string)$data['fincCfg'][0]['frtTintingRatio'];
                    else $req['Message']['info']['cwsWndtngCcrtNo'] = "";
                    $req['Message']['info']['bkbxNo'] = (string)$data['fincCfg'][0]['blackBox'];
                    $req['Message']['info']['naviNo'] = (string)$data['fincCfg'][0]['navigation'];
                    if($data['fincCfg'][0]['etcAccessorie']!="" && $data['fincCfg'][0]['etcAccessorieCost']!="") $req['Message']['info']['etcCarspNo'] = "S";
                    else $req['Message']['info']['etcCarspNo'] = "";
                    $req['Message']['info']['etcCarspNm'] = (string)$data['fincCfg'][0]['etcAccessorie'];
                    $req['Message']['info']['etcCarspAmt'] = (string)$data['fincCfg'][0]['etcAccessorieCost'];
                    $req['Message']['info']['sftrRmdlIemNm'] = (string)$data['fincCfg'][0]['modify'];
                    $req['Message']['info']['sftrRmdlAmt'] = (string)$data['fincCfg'][0]['modifyCost'];
                    $req['Message']['info']['agCmrt'] = (string)$data['fincCfg'][0]['feeAgR'];
                    $req['Message']['info']['cmNm'] = "";
                    $req['Message']['info']['cmCmrt'] = (string)$data['fincCfg'][0]['feeCmR'];
                    $req['Message']['info']['ccoCmfeRto'] = ""; // ????????? ?????????
                    $req['Message']['info']['ccoCmfeAmt'] = ""; // ????????? ?????????
                    $req['Message']['info']['acqCamtAmt'] = (string)$data['fincData'][$fno]['capital'];    // ????????????
                    $req['Message']['info']['carRtfe'] = (string)$data['fincData'][$fno]['pmtCar'];
                    $req['Message']['info']['addRtfe'] = (string)$data['fincData'][$fno]['pmtAdd'];
                    $req['Message']['info']['spprcAmt'] = (string)$data['fincData'][$fno]['pmtSupply'];
                    $req['Message']['info']['srtxAmt'] = (string)$data['fincData'][$fno]['pmtVat'];
                    $req['Message']['info']['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtSum'];
                    $req['Message']['info']['prrpRtfe'] = (string)$data['fincData'][$fno]['pmtPay'];
                    $req['Message']['info']['rlpnRtfe'] = (string)$data['fincData'][$fno]['pmtGrand'];
                    $req['Message']['info']['reprPrdtCd'] = (string)$data['fincCfg'][$fno]['careType'];
                    if(isset($data['fincCfg'][$fno]['kmPromotion'])) $req['Message']['info']['tdpDvCd'] = (string)$data['fincCfg'][$fno]['kmPromotion'];
                    else $req['Message']['info']['tdpDvCd'] = "1"; // ???????????? ????????????
                }else  if($data['estmData']['mode']=="lease"){
                    if($carAge != "usedcar"){
                        $req['Message']['info']['cropAduAmt'] = (string)$data['estmData']['extraSum'];
                        if($data['fincCfg'][0]['deliveryIn']=="01" || $data['estmData']['brand']<"200") $req['Message']['info']['dgr1CndgmtAmt'] = (string)$data['estmData']['deliveryMaker'];// ??????????????????
                        else  $req['Message']['info']['dgr1CndgmtAmt'] = "0";// ??????????????????
                        $req['Message']['info']['spcDcRto'] = (string)$data['estmData']['discountSpecialR'];  // ??????????????????	spcDcRto
                        $req['Message']['info']['spcDcAmt'] = (string)$data['estmData']['discountSpecial'];  // ??????????????????	spcDcAmt
                        
                        $dcSum = (int)$data['estmData']['discountMaker'];
                        if(isset($data['estmData']['vehicleTax'])) $dcSum += (int)$data['estmData']['vehicleTax'];
                        if(isset($data['estmData']['vehicleHev'])) $dcSum += (int)$data['estmData']['vehicleHev'];
                        $req['Message']['info']['gnDcAmt'] = (string)$dcSum;   //??????????????????	gnDcAmt // ???????????? ??????
                        $req['Message']['info']['gnDcRto'] = (string)$data['estmData']['discountRate'];   //??????????????????	gnDcRto
                    }
                    
                    
                    $req['Message']['info']['rmbrMcnt'] = (string)$data['fincData'][$fno]['month'];// ???????????????	rmbrMcnt
                    $req['Message']['info']['agCmfeRto'] = (string)$data['fincCfg'][0]['feeAgR'];// AG???????????????	agCmfeRto		Y	17			#N/A
                    $req['Message']['info']['cmCmfeRto'] = (string)$data['fincCfg'][0]['feeCmR'];// CM???????????????	cmCmfeRto
                    
                    $req['Message']['info']['pdebtCstAmt'] =  (string)$data['estmData']['bondCut'];       // ??????????????????	pdebtCstAmt
                    if($req['Message']['info']['pdebtCstAmt']=="0") $req['Message']['info']['pdebtCstAmtPrcsCd']="02"; // ?????? ????????? 02 ??????????????? ??????
                    else $req['Message']['info']['pdebtCstAmtPrcsCd'] = (string)$data['fincCfg'][0]['regBondIn'];       // ??????????????????????????????	pdebtCstAmtPrcsCd
                    $req['Message']['info']['pdebtPrtoArStdrCd'] = (string)$data['fincCfg'][0]['takeSidoHana'];       // ?????????????????????????????????	pdebtPrtoArStdrCd
                    $req['Message']['info']['pdebtPchsRto'] =  (string)$data['estmData']['bondRate'];      // ??????????????????	pdebtPchsRto
                    $req['Message']['info']['pdebtDcRto'] =  (string)$data['estmData']['bondDc'];      // ???????????????	pdebtDcRto
                    
                    
                    $req['Message']['info']['raccAmt'] =  "0";      // ????????????????????????	raccAmt
                    $req['Message']['info']['etcIcexpAmt'] = (string)$data['estmData']['takeExtra'];       // ????????????????????????	etcIcexpAmt
                    $req['Message']['info']['regsEtxpDvCd'] = (string)$data['fincCfg'][0]['regExtrIn'];       // ??????????????????????????????	regsEtxpDvCd
                    
                    $req['Message']['info']['bznCarYn'] = "N";      // ??????????????????	bznCarYn
                    $req['Message']['info']['regsMbgCd'] = (string)$data['fincCfg'][0]['regType'];     // ??????????????????	regsMbgCd
                    $req['Message']['info']['slfBrdnAmt'] =  (string)$data['estmData']['takeSelf'];      // ??????????????????	slfBrdnAmt
                    $req['Message']['info']['slfBrdnRto'] =  "";      // ??????????????????	slfBrdnRto
                    $req['Message']['info']['qtaxPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];     // ?????????????????????	qtaxPrcsCd
                    $req['Message']['info']['rgtxAmtPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];       // ???????????????????????????	rgtxAmtPrcsCd
                    $req['Message']['info']['acqCamt'] = (string)$data['estmData']['capital'];       // ????????????	acqCamt
                    $req['Message']['info']['prdtDvCd'] = (string)$data['fincCfg'][0]['prdtDvCd'];       // ??????????????????	prdtDvCd
                    $req['Message']['info']['qtaxAmt'] =  (string)$data['estmData']['takeTax2'];      // ???????????????	qtaxAmt
                    $req['Message']['info']['rgtxAmt'] =  (string)$data['estmData']['takeTax5'];     // ???????????????	rgtxAmt
                    $req['Message']['info']['dfrMcnt'] = (string)$data['fincData'][$fno]['monthH'];       // ???????????????	dfrMcnt
                    $req['Message']['info']['gtamtCalcStdrCd'] =  "02";      // ???????????????????????????	gtamtCalcStdrCd
                    $req['Message']['info']['prrpPrcsCd'] =  "01";      // ??????????????????	prrpPrcsCd
                    $req['Message']['info']['mxRevalRto'] =   (string)$data['fincData'][$fno]['remainMax'];   // ????????????????????????	mxRevalRto
                    $req['Message']['info']['catxInclYn'] =   (string)$data['fincCfg'][0]['cartaxAdd'];      // ????????????????????????	catxInclYn
                    $req['Message']['info']['pmfeAmt'] = "0";       // ???????????????	pmfeAmt
                    $req['Message']['info']['pmfeRto'] = "0";       // ???????????????	pmfeRto
                    $req['Message']['info']['setfeCalcStdrCd'] =  "02";      // ???????????????????????????	setfeCalcStdrCd
                    $req['Message']['info']['rntcCorYn'] =  (string)$data['fincCfg'][0]['useBiz'];      // ?????????????????????	rntcCorYn
                    $req['Message']['info']['carPrcSetlMthCd'] =  (string)$data['fincCfg'][0]['payType'];      // ??????????????????????????????	carPrcSetlMthCd
                    //$req['Message']['info']['cprnCustNo'] = (string)$data['fincCfg'][0]['dealerShop']; // ?????????????????????
                    $req['Message']['info']['pstpPrnc'] =  (string)$data['fincData'][$fno]['respite'];      // ????????????	pstpPrnc
                    $req['Message']['info']['pstpPrncRto'] =   (string)$data['fincData'][$fno]['respiteR'];     // ??????????????????	pstpPrncRto
                    $req['Message']['info']['eachCtaxRto'] =   "0";     // ????????????	eachCtaxRto
                    $req['Message']['info']['eachCtaxAmt'] =   "0";    // ????????????	eachCtaxAmt
                    $req['Message']['info']['estdReflCtnt'] = "";     // ?????????????????????	estdReflCtnt
                    $req['Message']['info']['prdtCd'] = (string)$data['fincData'][$fno]['prdtCd'];     // ????????????	prdtCd
                    $req['Message']['info']['mtSetDvCd'] = "";    // ????????????????????????	mtSetDvCd
                    $req['Message']['info']['mtSetAmt'] = "";   // ??????????????????	mtSetAmt
                    $req['Message']['info']['mtSetRto'] = "";        // ??????????????????	mtSetRto
                    $req['Message']['info']['rcstGrnCustNo'] = "";        // ???????????????????????????	rcstGrnCustNo
                    $req['Message']['info']['rcstGrnCmfeAmt'] = "";        // ???????????????????????????	rcstGrnCmfeAmt
                    $req['Message']['info']['rcstGrnCmrt'] = "";        // ????????????????????????	rcstGrnCmrt
                    //if($data['fincCfg'][0]['goodsKind']=="loan"){
                    //    $req['Message']['info']['agCmfeAmt'] = (string)$data['fincData'][$fno]['feeAg'];
                    //    $req['Message']['info']['cmCmfeAmt'] = (string)$data['fincData'][$fno]['feeCm'];
                    //}
                    $req['Message']['info']['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtMon'];
                    $req['Message']['info']['evtmPrrpAmt'] = (string)$data['fincData'][$fno]['pmtPay'];
                    $req['Message']['info']['evtmRlpnAmt'] = (string)$data['fincData'][$fno]['pmtGrand'];
                    // ???????????? ?????? 20220607 W/?????????
                    $req['Message']['info']['rmbrAplInrt'] = (string)$data['fincData'][$fno]['rate'];       // ????????????, ????????? ???????????? ?????? ??????
                    $req['Message']['info']['maxRmbrAplInrt'] = (string)$data['fincData'][$fno]['rateMax'];
                    $req['Message']['info']['maxEvtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtMonMax'];
                    $req['Message']['info']['maxEvtmRlpnAmt'] = (string)$data['fincData'][$fno]['pmtGrandMax'];
                    
                    $req['Message']['info']['catxAmtx'] = (string)$data['fincData'][$fno]['carTax'];
                    $req['Message']['info']['pmfex'] = (string)$data['fincData'][$fno]['carIns'];
                    $req['Message']['info']['rnPrnc'] = (string)$data['fincData'][$fno]['carSelf'];
                    
                    $req['Message']['info']['rcstGrnCustNo'] = (string)$data['fincData'][$fno]['rcstGrnCustNo'];    // ???????????????????????????	rcstGrnCustNo
                    $req['Message']['info']['rcstGrnCmfeAmt'] = (string)$data['fincData'][$fno]['rcstGrnCmfeAmt'];    // ???????????????????????????	rcstGrnCmfeAmt
                    $req['Message']['info']['rcstGrnCmrt'] = (string)$data['fincData'][$fno]['rcstGrnCmrt'];    // ????????????????????????	rcstGrnCmrt
                    $req['Message']['info']['trvgDstnDeprRto'] = (string)$data['fincData'][$fno]['trvgDstnDeprRto'];    // ????????????????????????	trvgDstnDeprRto
                    
                    $req['Message']['info']['adCmfeTrgtDvCd'] =  (string)$data['fincCfg'][$fno]['adCmfe']; // ?????????????????????????????????
                    $req['Message']['info']['dcSpptAmtDsbojDvCd'] =  (string)$data['fincCfg'][$fno]['dcSppt']; // ??????????????????????????????????????????
                    if(isset($data['fincCfg'][0]['testride']) && $data['fincCfg'][0]['testride']){
                        $req['Message']['info']['demoCarYn'] =  "Y"; // ????????? ??????  demoCarYn
                        $req['Message']['info']['demoAutmbNo'] =  $data['fincCfg'][0]['testride']; // ????????? ????????????  demoAutmbNo
                    }else{
                        $req['Message']['info']['demoCarYn'] =  "N"; // ????????? ??????  demoCarYn
                    }
                }else  if($data['estmData']['mode']=="fince"){
                    $req['Message']['info']['cropAduAmt'] = (string)$data['estmData']['extraSum'];
                    if($data['fincCfg'][0]['deliveryIn']=="01" || $data['estmData']['brand']<"200") $req['Message']['info']['dgr1CndgmtAmt'] = (string)$data['estmData']['deliveryMaker'];// ??????????????????
                    else  $req['Message']['info']['dgr1CndgmtAmt'] = "0";// ??????????????????
                    $req['Message']['info']['spcDcRto'] = "0";  // ??????????????????	spcDcRto
                    $req['Message']['info']['spcDcAmt'] = "0";  // ??????????????????	spcDcAmt
                    
                    $dcSum = (int)$data['estmData']['discountMaker'];
                    if(isset($data['estmData']['vehicleTax'])) $dcSum += (int)$data['estmData']['vehicleTax'];
                    if(isset($data['estmData']['vehicleHev'])) $dcSum += (int)$data['estmData']['vehicleHev'];
                    $req['Message']['info']['gnDcAmt'] = (string)$dcSum;   //??????????????????	gnDcAmt // ???????????? ??????
                    $req['Message']['info']['gnDcRto'] = (string)$data['estmData']['discountRate'];   //??????????????????	gnDcRto
                    
                    $req['Message']['info']['rmbrMcnt'] = (string)$data['fincData'][$fno]['month'];// ???????????????	rmbrMcnt
                    $req['Message']['info']['agCmfeAmt'] = (string)$data['fincData'][$fno]['feeAg'];
                    $req['Message']['info']['cmCmfeAmt'] = (string)$data['fincData'][$fno]['feeCm'];
                    $req['Message']['info']['agCmfeRto'] = (string)$data['fincCfg'][0]['feeAgR'];// AG???????????????	agCmfeRto		Y	17			#N/A
                    $req['Message']['info']['cmCmfeRto'] = (string)$data['fincCfg'][0]['feeCmR'];// CM???????????????	cmCmfeRto
                    
                    $req['Message']['info']['pdebtCstAmt'] =  (string)$data['estmData']['bondCut'];       // ??????????????????	pdebtCstAmt
                    if($req['Message']['info']['pdebtCstAmt']=="0") $req['Message']['info']['pdebtCstAmtPrcsCd']="02"; // ?????? ????????? 02 ??????????????? ??????
                    else $req['Message']['info']['pdebtCstAmtPrcsCd'] = (string)$data['fincCfg'][0]['regBondIn'];       // ??????????????????????????????	pdebtCstAmtPrcsCd
                    $req['Message']['info']['pdebtPrtoArStdrCd'] = (string)$data['fincCfg'][0]['takeSidoHana'];       // ?????????????????????????????????	pdebtPrtoArStdrCd
                    $req['Message']['info']['pdebtPchsRto'] =  (string)$data['estmData']['bondRate'];      // ??????????????????	pdebtPchsRto
                    $req['Message']['info']['pdebtDcRto'] =  (string)$data['estmData']['bondDc'];      // ???????????????	pdebtDcRto  ?????????
                    $req['Message']['info']['regsMbgCd'] = (string)$data['fincCfg'][0]['regType'];     // ??????????????????	regsMbgCd
                    $req['Message']['info']['qtaxPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];     // ?????????????????????	qtaxPrcsCd
                    $req['Message']['info']['rgtxAmtPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];       // ???????????????????????????	rgtxAmtPrcsCd
                    $req['Message']['info']['regsEtxpDvCd'] = (string)$data['fincCfg'][0]['regExtrIn'];       // ??????????????????????????????	regsEtxpDvCd
                    $req['Message']['info']['catxPrcsCd'] =   (string)$data['fincCfg'][0]['cartaxAdd'];     // ????????????????????????	catxPrcsCd  // ????????? ????????????????????????	catxInclYn
                    
                    $req['Message']['info']['rntcCorYn'] =  (string)$data['fincCfg'][0]['useBiz'];      // ?????????????????????	rntcCorYn
                    
                    $req['Message']['info']['istmDvCd'] = (string)$data['fincData'][$fno]['finceType'];   // ??????????????????	istmDvCd
                    $req['Message']['info']['lnapAmt'] = (string)$data['fincData'][$fno]['capital'];    // ????????????	lnapAmt
                    $req['Message']['info']['sellCmfe'] = (string)$data['fincData'][$fno]['rateCover']; // ???????????????	sellCmfe
                    $req['Message']['info']['rmbrMcnt'] = (string)$data['fincData'][$fno]['month']; // ???????????????	rmbrMcnt
                    $req['Message']['info']['antAmt'] = (string)$data['fincData'][$fno]['prepay'];    // ????????????	antAmt
                    $req['Message']['info']['antRto'] = (string)$data['fincData'][$fno]['prepayR'];    // ????????????	antRto
                    $req['Message']['info']['stfAmtPrcsCd'] = (string)$data['fincData'][$fno]['stampYn'];  // ???????????????????????????	stfAmtPrcsCd
                    $req['Message']['info']['stfAmt'] = (string)$data['fincData'][$fno]['stamp']; // ???????????????	stfAmt
                    $req['Message']['info']['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtGrand']; // ??????????????????	evtmPyinAmt
                    // ???????????? ?????? 20220607 W/?????????
                    $req['Message']['info']['rmbrAplInrt'] = (string)$data['fincData'][$fno]['rate'];       // ????????????, ????????? ???????????? ?????? ??????
                    $req['Message']['info']['maxRmbrAplInrt'] = (string)$data['fincData'][$fno]['rateMax'];       // ????????????, ????????? ???????????? ?????? ??????
                    $req['Message']['info']['maxEvtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtGrandMax']; // ??????????????????	evtmPyinAmt
                    
                    $req['Message']['info']['estdReflCtnt'] = "";     // ?????????????????????	estdReflCtnt
                    
                    // etmtInfo ??????
                    $etmtInfoArr = array("aictEtmtNo", "etmtDt", "custNm","xtrClrtnNo","xtrClrtnAmt","xtrClrtnNm","itrClrtnNo","itrClrtnAmt","itrClrtnNm","cropNoList","cropNmList","cropAmtList","estdReflCtnt","evtmPyinAmt");
                    foreach($etmtInfoArr as $val){
                        $req['Message']['etmtInfo'][$val] = $req['Message']['info'][$val];
                    }
                }
                $reqJson = json_encode($req);
                //echo $url;
                if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
                else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
                $rtnd = json_decode($getJson, true);
                if(!isset($rtnd['Message'])){
                    $msg = "?????? ??????, ?????? ??????????????????.";
                }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                    $data = array(
                        "cState_Request" => "01",
                        "cCustomer_Estimate" => $_POST['custNm'],
                        "iFno_Request" => $_POST['fno'],
                        "cCode_Request" => $rtnd['Message']['resEtmtInfo']['hniEtmtNo'],
                        "dInsert_Request" => date("Y-m-d H:i:s")
                    );
                    $estimate_model->updateRequest($idx,$data);
                }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                    $msg = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
                }else{
                    $msg = "????????? ?????????????????????. ?????? ??????????????????.";
                }
                //$estimate_model->updateRequest($idx,$data);
                //if($_POST['type']=="estm"){
                    $data = array(
                        "no" => $_POST['no'],
                        "key" => $_POST['key'],
                        "type" => $_POST['type'],
                        "job" => $_POST['job']
                    );
                    if(isset($msg)){
                        $data['msg'] = $msg;
                    }
                    $data['Request'] = $reqJson;
                    $data['Response'] = $getJson;
                    $str = json_encode($data);
                    echo jxgcompress($str,true);
                    exit;
            }else{
                header('location: /error.html');
                exit;
            }
        }else if($_POST['job']=="agree"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/requestUrl"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'COMMI00011';   // COMMI00009
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "7";   // ????????????????????????
            
            $req['Message']['reqCrdtSrchAgrInfo']['aictEtmtNo'] = $_POST['key'].".".$_POST['fno']; // $estimate_data->iIdx_Estimate;
            $req['Message']['reqCrdtSrchAgrInfo']['agId'] = $_SESSION["id_Member"];    // agId ?????? ?????? ??????
            $req['Message']['reqCrdtSrchAgrInfo']['dptCd'] = $_SESSION["branch_Member"];
            $req['Message']['reqCrdtSrchAgrInfo']['custDvCd'] = $_POST['buy'];
            $req['Message']['reqCrdtSrchAgrInfo']['rcprNm'] = $_POST['custNm'];
            $req['Message']['reqCrdtSrchAgrInfo']['rcprTlno'] = $_POST['phone'];
            if($_POST['goods']=="rent") $req['Message']['reqCrdtSrchAgrInfo']['prdtLclsCd'] = "3";
            else $req['Message']['reqCrdtSrchAgrInfo']['prdtLclsCd'] = "1";
            $req['Message']['reqCrdtSrchAgrInfo']['bzrepRegsNo'] = "";
            $req['Message']['reqCrdtSrchAgrInfo']['recpCoNm'] = "";
            $req['Message']['reqCrdtSrchAgrInfo']['corRegsNo'] = "";
            $req['Message']['reqCrdtSrchAgrInfo']['rpsrAsmtDt'] = "";
            $req['Message']['reqCrdtSrchAgrInfo']['estDt'] = "";
            if($_POST['buy']=="2" || $_POST['buy']=="3"){
                $req['Message']['reqCrdtSrchAgrInfo']['bzrepRegsNo'] = $_POST['compNo'];
                $req['Message']['reqCrdtSrchAgrInfo']['recpCoNm'] = $_POST['compNm'];
                $req['Message']['reqCrdtSrchAgrInfo']['estDt'] = $_POST['estDt'];
            }
            if($_POST['buy']=="3"){
                $req['Message']['reqCrdtSrchAgrInfo']['corRegsNo'] = $_POST['corRegsNo'];
                $req['Message']['reqCrdtSrchAgrInfo']['rpsrAsmtDt'] = $_POST['rpsrAsmtDt'];
            }
            $req['Message']['reqCrdtSrchAgrInfo']['cidNm'] = $_POST['custNm'];
            $req['Message']['reqCrdtSrchAgrInfo']['resdBzno'] = $_POST['birth'];     // ?????? ????????? ?????? _> 8????????? ??????
            $reqJson = json_encode($req);
            
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            $rtnd = json_decode($getJson, true);
            
            if(!isset($rtnd['Message'])){
                $msg = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                $data = array(
                    "cCustomer_Estimate" => $_POST['custNm'],
                    "cState_Request" => "02"
                );
                $estimate_model->updateRequest($idx,$data);
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $msg = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $msg = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            if($path=="get"){
                $data = array(
                    "no" => $_POST['no'],
                    "key" => $_POST['key'],
                    "type" => $_POST['type'],
                    "job" => $_POST['job']
                );
                if(isset($msg)){
                    $data['msg'] = $msg;
                }
                $data['Request'] = $reqJson;
                $data['Response'] = $getJson;
                $str = json_encode($data);
                echo jxgcompress($str,true);
                exit;
            }else{
                echo '<meta charset="utf-8">';
                echo '<script>';
                if(isset($msg)) echo 'alert("'.$msg.'");';
                else echo 'alert("???????????? ?????? url??? ?????????????????????. \n???????????? ?????? ????????????.");';
                echo 'window.location.href = "/desk/save/confirm";';
                echo '</script>';
            }
        }else if($_POST['job']=="credit"){
            // ?????? ????????? ?????? 2022-04-28
            $estimate_data = $estimate_model->getDocumentRequest($idx);
            if($estimate_data && substr($estimate_data->dInsert_Estimate,-2)==$sec){
                $data = json_decode($estimate_data->tData_Estimate, true);
                $estmMode = $data['estmData']['mode'];
                if($estmMode=="fince"){
                    $estm['rate'] = $data['fincData'][$fno]['rate'];
                    $estm['pmtGrand'] = $data['fincData'][$fno]['pmtGrand'];
                }else if($estmMode=="lease"){
                    $estm['rate'] = $data['fincData'][$fno]['rate'];
                    $estm['pmtBase'] = $estmPmtBase = $data['fincData'][$fno]['pmtMon'];
                    $estm['pmtGrand'] = $data['fincData'][$fno]['pmtGrand'];
                }
            }
            
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/requestCredit"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00019';   // COMMI00009
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "5";   // ????????????
            
            $req['Message']['cslInfo']['aictEtmtNo'] = $_POST['key'].".".$_POST['fno']; // $estimate_data->iIdx_Estimate;
            $req['Message']['cslInfo']['agId'] = $_SESSION["id_Member"];    // agId ?????? ?????? ??????
            $req['Message']['cslInfo']['hniEtmtNo'] = $_POST['hno'];
            $reqJson = json_encode($req);
            
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            $rtnd = json_decode($getJson, true);
            if(!isset($rtnd['Message'])){
                $msg = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                $data = array(
                    "cState_Request" => $rtnd['Message']['cslInfo']['onlEtmtPrgsSttsCd']
                );
                // ?????? cChanged_Request 2022-04-28
                if(isset($rtnd['Message']['cslInfo']['rmbrAplInrt']) && $rtnd['Message']['cslInfo']['rmbrAplInrt']){
                    $temp['rate']= $rtnd['Message']['cslInfo']['rmbrAplInrt'];      // ????????????
                    if(isset($rtnd['Message']['cslInfo']['evtmPyinAmt'])){          // ??????????????????
                        if($estmMode=="fince") $temp['pmtGrand']= $rtnd['Message']['cslInfo']['evtmPyinAmt'];
                        else $temp['pmtBase']= $rtnd['Message']['cslInfo']['evtmPyinAmt'];
                    }
                    if(isset($rtnd['Message']['cslInfo']['evtmRlpnAmt'])){       // ?????????????????????
                        $temp['pmtGrand']= $rtnd['Message']['cslInfo']['evtmRlpnAmt'];
                    }
                    $creditChange =  json_encode($temp);
                    $data['cChanged_Request'] =  $creditChange;
                    
                    $msg = "????????? ?????????????????????.( ".(round($estm['rate']*100)/100)."% -> ".(round($temp['rate']*100)/100)."% )";
                    if(isset($temp['pmtGrand'])){
                        $msg .= "<br>??? ?????? ????????? ?????? :  ".number_format($estm['pmtGrand'])." -> ".number_format($temp['pmtGrand']);
                    }else{
                        $msg .= "<br>??? ?????? ???????????? ?????? ???????????? ?????? ????????????. ";
                    }
                }
                //if(isset($rtnd['Message']['cslInfo']['cslRsltCd'])){
                //    $data['cStateReq_Request'] = $rtnd['Message']['cslInfo']['cslRsltCd'];
                //}
                $estimate_model->updateRequest($idx,$data);
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $msg = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $msg = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            if($path=="get"){
                $data = array(
                    "no" => $_POST['no'],
                    "key" => $_POST['key'],
                    "type" => $_POST['type'],
                    "job" => $_POST['job']
                );
                if(isset($msg)){
                    $data['msg'] = $msg;
                }
                // ???????????? ?????? 2022-04-28
                if(isset($creditChange)){
                    $data['creditChange'] = $creditChange;
                }
                $data['Request'] = $reqJson;
                $data['Response'] = $getJson;
                $str = json_encode($data);
                echo jxgcompress($str,true);
            }else{  // ?????????
                echo '<meta charset="utf-8">';
                echo '<script>';
                if(isset($msg)){
                    echo 'alert("'.$msg.'");';
                    echo 'window.location.href = "/desk/save/confirm";';
                }else{
                    echo 'alert("??????????????? ?????????????????????. \n?????? ??????????????? ????????? ???????????? ????????? ????????????.");';
                    echo 'window.location.href = "/desk/save/counsel";';
                }
                echo '</script>';
            }
        }else if($_POST['job']=="order" || $_POST['job']=="cancle" || $_POST['job']=="delivery"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/requestOrder"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00015';   // COMMI00009
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            if($_POST['job']=="order"){
                $req['Message']['reqInfo']['dvCd'] = "1";   // ????????????
                $req['Message']['reqGoInfo']['agId'] = $_SESSION["id_Member"];    // agId ?????? ?????? ??????
                $req['Message']['reqGoInfo']['hniEtmtNo'] = $_POST['hno'];
                $req['Message']['reqGoInfo']['carGoDmndDt'] = date("Ymd"); // ????????????????????????	carGoDmndDt		Y	8
                $state = "07";
            }else if($_POST['job']=="cancle"){
                $req['Message']['reqInfo']['dvCd'] = "3";   // ????????????
                $req['Message']['reqGoInfo']['agId'] = $_SESSION["id_Member"];    // agId ?????? ?????? ??????
                $req['Message']['reqGoInfo']['hniEtmtNo'] = $_POST['hno'];
                $req['Message']['reqGoInfo']['carGoDmndDt'] = date("Ymd"); // ????????????????????????	carGoDmndDt		Y	8
                $state = "09";
            }else if($_POST['job']=="delivery"){
                $req['Message']['reqInfo']['dvCd'] = "2";   // ????????????
                $req['Message']['reqDlvryInfo']['hniEtmtNo'] = $_POST['hno'];// hniEtmtNo
                $req['Message']['reqDlvryInfo']['dlareaAsnpsNm'] = $_POST['name1']; // ?????????????????????dlareaAsnpsNm
                $phone1 = explode("-",phone_format($_POST['phone1']));
                $req['Message']['reqDlvryInfo']['dlareaArTlno'] = (string)$phone1[0]; // ???????????????????????????dlareaArTlno
                $req['Message']['reqDlvryInfo']['dlareaTonoTlno'] = (string)$phone1[1]; // ???????????????????????????dlareaTonoTlno
                $req['Message']['reqDlvryInfo']['dlareaDtlTlno'] = (string)$phone1[2]; // ???????????????????????????dlareaDtlTlno
                $req['Message']['reqDlvryInfo']['dlareaAsnpsN2Nm'] = $_POST['name2']; // ??????????????????2???dlareaAsnpsN2Nm
                if($_POST['phone2']){
                    $phone2 = explode("-",phone_format($_POST['phone2']));
                    $req['Message']['reqDlvryInfo']['dlareaN2ArTlno'] = (string)$phone2[0]; // ?????????2????????????dlareaN2ArTlno
                    $req['Message']['reqDlvryInfo']['dlareaN2TonoTlno'] = (string)$phone2[1]; // ?????????2??????????????????dlareaN2TonoTlno
                    $req['Message']['reqDlvryInfo']['dlareaN2DtlTlno'] = (string)$phone2[2]; // ?????????2??????????????????dlareaN2DtlTlno
                }else{
                    $req['Message']['reqDlvryInfo']['dlareaN2ArTlno'] = ""; // ?????????2????????????
                    $req['Message']['reqDlvryInfo']['dlareaN2TonoTlno'] = ""; // ?????????2??????????????????
                    $req['Message']['reqDlvryInfo']['dlareaN2DtlTlno'] = ""; // ?????????2??????????????????
                }
                $req['Message']['reqDlvryInfo']['dlvryDmndDt'] = (string)preg_replace("/[^0-9]*/s", "", $_POST['day']) ; // ??????????????????dlvryDmndDt
                $req['Message']['reqDlvryInfo']['dlvryDmndTime'] = (string)$_POST['hour'].(string)$_POST['minute']."00"; // ??????????????????dlvryDmndTime
                $req['Message']['reqDlvryInfo']['dlareaZip'] = (string)$_POST['post']; // ?????????????????????dlareaZip
                $req['Message']['reqDlvryInfo']['dlareaAddr'] = $_POST['addr1']; // ???????????????dlareaAddr
                $req['Message']['reqDlvryInfo']['dlareaDtlAddr'] = $_POST['addr2']; // ?????????????????????dlareaDtlAddr
                $req['Message']['reqDlvryInfo']['rmkCtnt'] = $_POST['memo']; // ????????????rmkCtnt
                $state = "11";
            }
            $reqJson = json_encode($req);
            
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            $rtnd = json_decode($getJson, true);
            
            if(!isset($rtnd['Message'])){
                $msg = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                $data = array(
                    "cState_Request" => $state
                );
                if($_POST['job']=="order" || $_POST['job']=="cancle"){
                    $data["dOrder_Request"] = date("Y-m-d");
                }
                //if(isset($rtnd['Message']['cslInfo']['cslRsltCd'])){
                //    $data['cStateReq_Request'] = $rtnd['Message']['cslInfo']['cslRsltCd'];
                //}
                $estimate_model->updateRequest($idx,$data);
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $msg = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $msg = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            
            if($path=="get"){
                $data = array(
                    "no" => $_POST['no'],
                    "key" => $_POST['key'],
                    "type" => $_POST['type'],
                    "job" => $_POST['job']
                );
                if(isset($msg)){
                    $data['msg'] = $msg;
                }
                $data['Request'] = $reqJson;
                $data['Response'] = $getJson;
                $str = json_encode($data);
                echo jxgcompress($str,true);
            }else{
                echo '<meta charset="utf-8">';
                echo '<script>';
                if(isset($msg)){
                    echo 'alert("'.$msg.'");';
                    echo 'window.location.href = "/desk/save/confirm";';
                }else{
                    if($_POST['job']=="order") {
                        echo 'alert("??????????????? ?????????????????????. \n?????? ??????????????? ????????? ???????????? ????????? ????????????.");';
                        echo 'window.location.href = "/desk/save/order";';
                    }else if($_POST['job']=="cancle") {
                        echo 'alert("???????????? ????????? ?????????????????????.");';
                        echo 'window.location.href = "/desk/save/order";';
                    }else if($_POST['job']=="delivery") {
                        echo 'alert("??????????????? ?????????????????????. \n?????? ??????????????? ????????? ???????????? ????????? ????????????.");';
                        echo 'window.location.href = "/desk/save/delivery";';
                    }
                }
                echo '</script>';
            }
        }
        
        
        
        //var_dump($_POST);
        //exit;
    }
    public function document($idx)
    {
        if(!isset($idx) || !isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
        $estimate_model = $this->loadModel('estimateModel');
        $estimate_data = $estimate_model->getEstimateView($idx);
        //var_dump($estimate_data->tData_Estimate);
        $data['result'] = "success";
        $data['data'] = $estimate_data->tData_Estimate;
        echo jxgcompress(json_encode($data), true);
    }
    public function hana($idx)
    {
        if(!isset($idx) || !isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
            exit;
        }
        
        if($idx=="remainData"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/remain"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00013';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = $_GET['dvCd'];
            // GET ?????? post ??????
            foreach($_GET as $key=>$val){
                if($key!="url" && $key!="token" && $key!="dvCd") $req['Message']['info'][$key] = $val;
            }
            $reqJson = json_encode($req);
            
            //echo $reqJson;
            
            //echo $url;
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            $rtnd = json_decode($getJson, true);
            if(isset($rtnd['Message']['mxRvInfo']['jnIscoNm'])) $data['insureCompany'] = $rtnd['Message']['mxRvInfo']['jnIscoNm']; // ??????
            if(isset($rtnd['Message']['mxRvInfo']['dlvyArDvCd'])) $data['deliveryShip'] = $rtnd['Message']['mxRvInfo']['dlvyArDvCd']; // ??????
            if(isset($rtnd['Message']['mxRvInfo']['mxRevalRto'])){
                $data['monthKm'] = $rtnd['Message']['mxRvInfo']['mxRevalRto'];
            }else{
                if(strpos($rtnd['Message']['resInfo']['rspnsMsgCtnt'],"????????????")!==false) {    // ???????????? ????????? ??????
                    $data['monthKm'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
                }else{
                    $data['monthKm'] = "";
                }
            }
            // ?????? ?????? ?????? ????????? ?????? 2022-04-28
            if(isset($rtnd['Message']['mxRvInfo']['crcltOutMngeNoLm'])) $data['fixEndExt'] = $rtnd['Message']['mxRvInfo']['crcltOutMngeNoLm']; // ???????????? ?????? ?????? ??????   2022-04-25 ??????
            if(isset($rtnd['Message']['mxRvInfo']['crcltInMngeNoLm'])) $data['fixEndInt'] = $rtnd['Message']['mxRvInfo']['crcltInMngeNoLm']; // ???????????? ?????? ?????? ??????   
            
            // ????????? ?????? ??????
            /*
            if($_GET['braNo']>"200") $data['deliveryShip'] = "030";   // ?????????
            else if($_GET['braNo']=="141") $data['deliveryShip'] = "029";   // ??????
            else if($_GET['braNo']=="151") $data['deliveryShip'] = "004";   // ??????
            else if($_GET['braNo']=="131" && ($_GET['mdlNo']=="10275" || $_GET['mdlNo']=="10275" || $_GET['mdlNo']=="10068" || $_GET['mdlNo']=="10069") ) $data['deliveryShip'] = "003";   // ??????
            else if($_GET['braNo']=="131") $data['deliveryShip'] = "027";   // ??????
            else if($_GET['braNo']=="121" && ($_GET['mdlNo']=="10324" || $_GET['mdlNo']=="10352" || $_GET['mdlNo']=="10371" || $_GET['mdlNo']=="10372") ) $data['deliveryShip'] = "022";   // ??????
            else if($_GET['braNo']=="111" || $_GET['braNo']=="112") $data['deliveryShip'] = "015";   // ??????
            
            else if($_GET['braNo']=="111" && ($_GET['mdlNo']=="10324" || $_GET['mdlNo']=="10352" || $_GET['mdlNo']=="10371" || $_GET['mdlNo']=="10372") ) $data['deliveryShip'] = "022";   // ??????
            else if($_GET['braNo']=="111" || $_GET['braNo']=="112") $data['deliveryShip'] = "015";   // ??????
            
            else if($_GET['braNo']=="") $data['deliveryShip'] = "";   // 
            else if($_GET['braNo']=="") $data['deliveryShip'] = "";   // 
            else if($_GET['braNo']=="") $data['deliveryShip'] = "";   // 
            else if($_GET['braNo']=="") $data['deliveryShip'] = "";   // 
            
            else $data['deliveryShip'] = "";   // ?????????
            */
            // $data['deliveryShip'] = $rtnd['Message']['mxRvInfo']['deliveryShip'];   // ??????
            /*
             * $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        $data['Message']['domestic']['dlvyArDvCd']['007'] = "??????";
	        $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        $data['Message']['domestic']['dlvyArDvCd']['023'] = "??????";
	        $data['Message']['domestic']['dlvyArDvCd']['024'] = "?????????";
	        $data['Message']['domestic']['dlvyArDvCd']['025'] = "??????";
	        $data['Message']['domestic']['dlvyArDvCd']['026'] = "??????";
	        $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        $data['Message']['domestic']['dlvyArDvCd']['028'] = "??????";
	        $data['Message']['domestic']['dlvyArDvCd'][''] = "";
	        
	        $data['Message']['imported']['dlvyArDvCd']['030'] = "?????????";
             */
            
            //$data = $rtnd['Message']['info'];
            $data['Request'] = $reqJson;
            $data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
            
        }else if($idx=="capitalData"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/capital"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00018';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "3";
            // $req['Message']['info']['nprvDvCd'] = "NP01";         // ?????????????????? NP01- ??????,    NP02- ?????????  script??? ??????
            // GET ?????? post ??????
            foreach($_GET as $key=>$val){
                if($key!="url" && $key!="token" && $key!="dvCd") $req['Message']['info'][$key] = $val;
            }
            $reqJson = json_encode($req);
            //echo $reqJson;
            //echo "<br>";
            //echo $url;
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            //echo $getJson;
            $rtnd = json_decode($getJson, true);
            if(isset($rtnd['Message']['info']['mxRevalRto'])){
                if(isset($rtnd['Message']['info']['mxRevalRto'])) $data['monthKm'] = $rtnd['Message']['info']['mxRevalRto'];
            }else{
                if(strpos($rtnd['Message']['resInfo']['rspnsMsgCtnt'],"????????????")!==false) {    // ???????????? ????????? ??????
                    $data['monthKm'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
                }else{
                    $data['monthKm'] = "";
                }
            }
            if(isset($rtnd['Message']['info']['acqCamt'])){
                if(isset($rtnd['Message']['info']['acqCamt'])) $data['capital'] = $rtnd['Message']['info']['acqCamt'];  // ????????????	acqCamt
                if(isset($rtnd['Message']['info']['qtaxAmt'])) $data['regTax2'] = $rtnd['Message']['info']['qtaxAmt'];  // ???????????????	qtaxAmt
                if(isset($rtnd['Message']['info']['rgtxAmt'])) $data['regTax5'] = $rtnd['Message']['info']['rgtxAmt'];  // ???????????????	rgtxAmt
                if(isset($rtnd['Message']['info']['spcDcAmt'])) $data['discountSpecial'] = $rtnd['Message']['info']['spcDcAmt']; // ??????????????????	spcDcAmt
                if(isset($rtnd['Message']['info']['spcDcRto'])) $data['discountSpecialR'] = $rtnd['Message']['info']['spcDcRto']; // ??????????????????	spcDcRto
                if(isset($rtnd['Message']['info']['cprnCmfeRto'])) $data['cprnCmfeRto'] = $rtnd['Message']['info']['cprnCmfeRto']; // ????????? ????????????	cprnCmfeRto
                //if(isset($rtnd['Message']['info']['eachCtaxDcAmt'])) $data['taxDc'] = $rtnd['Message']['info']['eachCtaxDcAmt']; // ????????? ?????? ??????	eachCtaxDcAmt
                if(isset($rtnd['Message']['info']['adCmfeTrgtList'])) $data['adCmfeTrgtList'] = $rtnd['Message']['info']['adCmfeTrgtList']; // ??????????????????????????????	adCmfeTrgtList
                if(isset($rtnd['Message']['info']['preBchKndCd'])) $data['preBchKndCd'] = $rtnd['Message']['info']['preBchKndCd']; // ????????????????????? ??????(??????)	preBchKndCd
                if(isset($rtnd['Message']['info']['dcSpptAmtTrgtYn'])) $data['dcSpptAmtTrgtYn'] = $rtnd['Message']['info']['dcSpptAmtTrgtYn']; // ??????????????????????????????	dcSpptAmtTrgtYn
            }
            
            //$data = $rtnd['Message']['info'];
            $data['Request'] = $reqJson;
            $data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
        }else if($idx=="costData"){
            if($_SESSION['mode']=="aict"){
                if($_GET['dvCd']=="2") $url = "http://ep.aictcorp.com/hana/api/costRent"; // ?????????????????? API ????????????
                else if($_GET['dvCd']=="3") $url = "http://ep.aictcorp.com/hana/api/costFince"; // ?????????????????? API ????????????
                else if($_GET['dvCd']=="4") $url = "http://ep.aictcorp.com/hana/api/costLease"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            
            // POST???????????? ?????? JSON????????? ??????
            if($_GET['dvCd']=="2"){
                $req['Header']['serviceID'] = 'UCARI00013';
                if($_GET['icarCcoCustCd']=="0" || $_GET['icarCcoCustCd']=="etc") $_GET['icarCcoCustCd']=""; // ????????? ?????????
                $req['Message']['reqInfo']['dvCd'] = $_GET['dvCd'];
            }else if($_GET['dvCd']=="3"){
                $req['Header']['serviceID'] = 'UCARI00022';
                if($_GET['cprnCustNo']=="0" || $_GET['cprnCustNo']=="etc") $_GET['cprnCustNo']=""; // ????????? ?????????
                $req['Message']['info']['agId'] = $_SESSION["id_Member"];
                $req['Message']['info']['spcDcAmt'] = "0"; // ??????????????????	spcDcAmt
                $req['Message']['info']['spcDcRto'] = "0"; // ??????????????????	spcDcRto
                $req['Message']['reqInfo']['dvCd'] = "1";
            }else if($_GET['dvCd']=="4"){   // ??????
                $req['Header']['serviceID'] = 'UCARI00018';
                if($_GET['cprnCustNo']=="0" || $_GET['cprnCustNo']=="etc") $_GET['cprnCustNo']=""; // ????????? ?????????
                $req['Message']['info']['agId'] = $_SESSION["id_Member"];
                $req['Message']['reqInfo']['dvCd'] = $_GET['dvCd'];
                // $req['Message']['info']['nprvDvCd'] = "NP01";         // ?????????????????? NP01- ??????,    NP02- ?????????  script??? ??????
            }
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            
            // GET ?????? post ??????
            // ?????? ?????????
            foreach($_GET as $key=>$val){
                if($key!="url" && $key!="token" && $key!="dvCd") $req['Message']['info'][$key] = $val;
            }
            $reqJson = json_encode($req);
            //echo $reqJson;
            //echo "<br>";
            //echo $url;
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            $rtnd = json_decode($getJson, true);
            //echo $getJson;
            //echo "<br>";
            
            if(!isset($rtnd['Message'])){
                $data['msg'] = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                if(isset($rtnd['Message']['info'])) $data = $rtnd['Message']['info'];
                else if(isset($rtnd['Message']['rentalFeeInfo'])) $data = $rtnd['Message']['rentalFeeInfo'];
                else if(isset($rtnd['Message']['lsfeInfo'])) $data = $rtnd['Message']['lsfeInfo'];
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $data['msg'] = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            $data['Request'] = $reqJson;
            $data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
            
        }else if($idx=="fastshipAdd"){
            // ????????? ?????? : estimate.js ?????? ??????
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/fastAdd"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00016';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "KYREG";
            $req['Message']['regList'] = json_decode($_POST['list'], true);
            $reqJson = json_encode($req);
            //echo $url;
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            $rtnd = json_decode($getJson, true);
            $data['jsonData']['state'] = $rtnd['Message']['resInfo']['rspnsCd'];
            $data['jsonData']['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            //if($rtnd['Message']['rspnsCd']!="1" && $rtnd['Message']['respnsMsqCtnt']) $data['jsonData'][''] = $rtnd['Message']['respnsMsqCtnt'];
            if(isset($rtnd['Message']['count'])) $data['jsonData']['count'] = $rtnd['Message']['resInfo']['count'];   // ?????????
            $data['jsonData']['Request'] = $reqJson;
            $data['jsonData']['Response'] = $getJson;
            $data["returnFunction"] = "returnFastship()";
            $str = json_encode($data);
            echo $str;
            exit;
        }else if($idx=="testdriveInfo"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/testdriveInfo"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00018';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "5";
            $req['Message']['info']['nprvDvCd'] = "NP01";         // ?????????????????? NP01- ??????,    NP02- ?????????
            // GET ?????? post ??????
            foreach($_GET as $key=>$val){
                if($key!="url" && $key!="token" && $key!="dvCd") $req['Message']['info'][$key] = $val;
            }
            $reqJson = json_encode($req);
            //echo $url;
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            $rtnd = json_decode($getJson, true);
            
            if(!isset($rtnd['Message'])){
                $data['msg'] = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
               $data = $rtnd['Message']['demoCarInfo'];
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $data['msg'] = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            $data['Request'] = $reqJson;
            $data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
        }else if($idx=="ucarList"){
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/ucarList"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'UCARI00021';
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['nprvDvCd'] = "NP02";         // ?????????????????? NP01- ??????,    NP02- ?????????
            $req['Message']['reqInfo']['cmnyCd'] = $_GET['ym'];
            $req['Message']['reqInfo']['autmbNm'] = $_GET['name'];
            $req['Message']['reqInfo']['ctfcUcarYn'] = $_GET['certify'];
            $reqJson = json_encode($req);
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            $rtnd = json_decode($getJson, true);
            if(!isset($rtnd['Message'])){
                $data['msg'] = "?????? ??????, ?????? ??????????????????.";
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000001"){
                $data['list'] = $rtnd['Message']['carInfo'];
            }else if($rtnd['Message']['resInfo']['rspnsCd']=="PS000002" || $rtnd['Message']['resInfo']['rspnsCd']=="PS000100"){
                $data['msg'] = $rtnd['Message']['resInfo']['rspnsMsgCtnt'];
            }else{
                $data['msg'] = "????????? ?????????????????????. ?????? ??????????????????.";
            }
            $data['Request'] = $reqJson;
            $data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
        }else{
            $data['result'] = "failure";
            $data['error'] = "404";
            echo jxgcompress(json_encode($data), true);
        }
    }
    
    public function pushview($idx)
    {
        if(!isset($_SESSION['idx_Member'])){
            exit;
        }
        $idx = decodeDocu($idx);
        $sec = substr($idx,-2);
        $idx = substr($idx,0,-2);
        if(isset($_SESSION['error']) && $_SESSION['error']>5){
            header('location: /');
            exit;
        }else if($idx=="" || !is_numeric($idx) || substr($idx,0,1)!=substr($idx,2,1) || substr($idx,1,1)!=substr($idx,-1)){
            if(isset($_SESSION['error'])) $_SESSION['error'] ++;
            else $_SESSION['error'] = 1;
            header('location: /');
            exit;
        }else{
            $idx = substr($idx,2);
            $service_model = $this->loadModel('serviceModel');
            $push_data = $service_model->getPushMessageView($idx);
            if($push_data && $sec=substr($push_data->iIdx_Member,-2)){
                $service_model->updatePushMessageRead($idx);
                $login_model = $this->loadModel('loginModel');
                $member_message = $login_model->getMemberMessageCount();
                $_SESSION['count_Message'] = $member_message->count;
                
                $_SESSION['error'] = 0;
                $data['message']['title'] = $push_data->cTitle_PushMessage;
                $data['message']['body'] = $push_data->tBody_PushMessage;
                $data['message']['url'] = $push_data->cUrl_PushMessage;
                $data['message']['count'] = $member_message->count;
                $data['result'] = "success";
                echo jxgcompress(json_encode($data), true);
            }else{
                if(isset($_SESSION['error'])) $_SESSION['error'] ++;
                else $_SESSION['error'] = 1;
                header('location: /');
                exit;
            }
        }
    }
    public function config($job)
    {
        $estimate_model = $this->loadModel('estimateModel');
        if(strpos($job,"permit")!==false && strpos(GRANT_AUTH,"M")===false){
            header('location: /');
            exit;
        }
        if($job=="estimate"){
            $cont = "";
            foreach($_POST as $key=>$val){
                if($cont) $cont .="\n";
                $cont .= $key."\t".$val;
            }
            $estimate_model -> setConfig($_SESSION['id_Member'],$job,$cont);
            $data = array();
            $data['result'] = "success";
            $data['returnFunction'] = "estmCfgReturn()";
            echo json_encode($data);
        }else if($job=="permit"){
            $cont = implode("",$_POST['permit']);
            $estimate_model -> setConfig($_POST['id'],$job,$cont);
            header('location: '.$_SERVER['HTTP_REFERER']);
        }else if($job=="permitDel"){
            $estimate_model -> deleteConfig($_POST['id'],'permit');
            header('location: '.$_SERVER['HTTP_REFERER']);
        }
    }
    public function estimate()
    {
        $job = $_POST['job'];
        $no = $_POST['no'];  // save  
        if($job=="mod"){
            $key = ""; 
            $type = ""; 
        }else{
            $key = $_POST['key'];  // docu
            $type = $_POST['type'];  // edit ??????, work ??????(??????)
        }
        $estimate_model = $this->loadModel('estimateModel');
       
        if($job=="del"){
            $data = array(
                "iState_Estimate" => 9
            );
            $estimate_model->updateEstimate($no,$data);
            header("location:/mypage/save/list");
            exit;
        }
        if($job=="mod" || $job=="save" || !$no){	// add
        	$data = array(
        	        "cCustomer_Estimate" => $_POST["name"],
        			"cSubject_Estimate" => $_POST["subject"],
        			"tCounsel_Estimate" => $_POST["counsel"]
        	);
        	if(isset($_POST['model'])){
        	    $data["cModel_Estimate"] = $_POST["model"];
        	    $docu["tData_Estimate"] = $_POST["data"];
        	    $docu["tDocument_Estimate"] = htmlspecialchars($_POST["document"]);
        	    $data["iHeight_Estimate"] = $_POST["height"];
        	    $data["cKind_Estimate"] = $_POST["kind"];
        	}
        	if(!$no){
        		$max = $estimate_model->getEstimateMax();
        		if($max->no) $no = $max->no + 1;
        		else $no = 1001;
        		if($no<1001) $no = 1001;
        		$data["iNo_Estimate"] = $no;
        		$data["cID_Member"] = $_SESSION['id_Member'];
        		$times = date("Y-m-d H:i:s");
        		$data["dInsert_Estimate"] = $times;
        		$act = "add";
        	}else{
        		$act = "mod";
        	}
        	/*
        	if($job!="mod"){
        		$data["cKind_Estimate"] = $_POST["kind"];
        		$data["cModel_Estimate"] = $_POST["model"];
        		$data["cCode_Estimate"] = $_POST["code"];
        		$data["tConfig_Estimate"] = $_POST["config"];
        		$data["tData_Estimate"] = $_POST["data"];
        	}
        	*/
        	if($act == "add"){
        		$idx = $estimate_model->addEstimate($data);
        		$sec = substr($times,-2);
        		$key = encodeDocu(substr($idx,0,1).substr($idx,-1).$idx.$sec);
        		
        		if(isset($docu)){
        		    $docu['iIdx_Estimate'] = $idx;
        		    $estimate_model->addEstimateDocu($docu);
        		}
        		
        		// ????????? ??????
        		if(0){    // ?????? ??????
        		    $data = json_decode($_POST["data"], true);
        		    $kindGoods = array("RG"=>"1","RF"=>"2","LG"=>"3","LK"=>"4","FG"=>"5");
        		    
        		    $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
        		    $req['Message']['reqInfo']['ccoCustSno'] = '0';
        		    $req['Header']['serviceID'] = 'UCARI00019';
        		    $req['Message']['reqInfo']['dvCd'] = '6'; // ????????? ??????
        		    // ?????? ??????
        		    $req['Message']['etmtInfo']['aictEtmtNo'] = $key; // $estimate_data->iIdx_Estimate;
        		    $req['Message']['etmtInfo']['etmtDt'] = substr($times,0,10);
        		    $req['Message']['etmtInfo']['etmtDt'] = str_replace("-","",$req['Message']['etmtInfo']['etmtDt']);
        		    $req['Message']['etmtInfo']['etmtTtlNm'] = $_POST["subject"];
        		    $req['Message']['etmtInfo']['custNm'] = $_POST["name"];
        		    $req['Message']['etmtInfo']['aictPrdtDv'] = $kindGoods[$_POST["kind"]];
        		    $req['Message']['etmtInfo']['estdReflCtnt'] = $_POST["counsel"];
        		    $req['Message']['etmtInfo']['mgdptCd'] = (string)$data['fincCfg'][0]['branchShop']; // mgdptCd ????????????
        		    $req['Message']['etmtInfo']['cprnCustNo'] = (string)$data['fincCfg'][0]['dealerShop']; // ????????? ???????????? dealerShop
        		    if($req['Message']['etmtInfo']['cprnCustNo']=="etc" || $req['Message']['etmtInfo']['cprnCustNo']=="0") $req['Message']['etmtInfo']['cprnCustNo'] = "";    // etc ?????????
        		    if(isset($data['estmData']['ucarCode'])){
        		        $req['Message']['etmtInfo']['nprvDvCd'] = "NP02";         // ?????????????????? NP01- ??????,    NP02- ?????????
        		        $req['Message']['etmtInfo']['ctfcUcarYn'] = (string)$data['estmData']['certifyYN'];
        		        $req['Message']['etmtInfo']['cmnyCd'] = (string)$data['estmData']['regYM'];
        		        $req['Message']['etmtInfo']['ucarMdlCd'] = (string)$data['estmData']['ucarCode'];
        		        $req['Message']['etmtInfo']['basAmt'] = (string)$data['estmData']['ucarPrice'];
        		        $carAge = "usedcar";
        		    }else{
        		        $req['Message']['etmtInfo']['nprvDvCd'] = "NP01";         // ?????????????????? NP01- ??????,    NP02- ?????????
            		    $req['Message']['etmtInfo']['braNo'] = (string)$data['estmData']['brand'];
            		    $req['Message']['etmtInfo']['braNm'] = (string)$data['estmData']['brandName'];
            		    $req['Message']['etmtInfo']['mdlNo'] = (string)$data['estmData']['model'];
            		    $req['Message']['etmtInfo']['mdlNm'] = (string)$data['estmData']['modelName'];
            		    $req['Message']['etmtInfo']['linupNo'] = (string)$data['estmData']['lineup'];
            		    $req['Message']['etmtInfo']['linupNm'] = (string)$data['estmData']['lineupName'];
            		    $req['Message']['etmtInfo']['trimNo'] = (string)$data['estmData']['trim'];
            		    $req['Message']['etmtInfo']['trimNm'] = (string)$data['estmData']['trimName'];
            		    $req['Message']['etmtInfo']['basAmt'] = (string)$data['estmData']['trimPrice'];
            		    $carAge = "newcar";
        		    
            		    $cropNm = "";
            		    $cropAmt = "";
            		    if($data['estmData']['optionList']){
            		        $opt = explode("\n",$data['estmData']['optionList']);
            		        foreach($opt as $dat){
            		            $da = explode("\t",$dat);
            		            if($cropNm){
            		                $cropNm .="^";
            		                $cropAmt .= "^";
            		            }
            		            $cropNm .=$da[0];
            		            $cropAmt .= $da[1];
            		        }
            		    }
            		    $req['Message']['etmtInfo']['cropNmList'] = (string)$cropNm;
            		    $req['Message']['etmtInfo']['cropAmtList'] = (string)$cropAmt;
            		    $req['Message']['etmtInfo']['cropNoList'] = (string)str_replace(",","^",$data['estmData']['option']);
            		    $req['Message']['etmtInfo']['xtrClrtnNo'] = (string)$data['estmData']['colorExt'];
            		    $req['Message']['etmtInfo']['xtrClrtnNm'] = (string)$data['estmData']['colorExtName'];
            		    if($req['Message']['etmtInfo']['xtrClrtnNo']) $req['Message']['etmtInfo']['xtrClrtnAmt'] = (string)$data['estmData']['colorExtPrice'];
            		    else $req['Message']['etmtInfo']['xtrClrtnAmt'] = "";
            		    $req['Message']['etmtInfo']['itrClrtnNo'] = (string)$data['estmData']['colorInt'];
            		    $req['Message']['etmtInfo']['itrClrtnNm'] = (string)$data['estmData']['colorIntName'];
            		    if($req['Message']['etmtInfo']['itrClrtnNo']) $req['Message']['etmtInfo']['itrClrtnAmt'] = (string)$data['estmData']['colorIntPrice'];
            		    else $req['Message']['etmtInfo']['itrClrtnAmt'] = "";
            		    
            		    $req['Message']['etmtInfo']['dlvyDvCd'] = (string)$data['fincCfg'][0]['takeType'];
            		    $req['Message']['etmtInfo']['rntcCorYn'] =  (string)$data['fincCfg'][0]['useBiz'];      // ?????????????????????	rntcCorYn
        		    }
        		    
        		    $req['Message']['etmtInfo']['custDvCd'] = $data['fincCfg'][0]['buyType']; // ???????????? ?????? 20220607 ?????????
        		    
        		    if($data['estmData']['mode']=="rent"){
        		        if($req['Message']['etmtInfo']['cropNoList']) $req['Message']['etmtInfo']['cropAduAmt'] = (string)$data['estmData']['optionSum'];
        		        else $req['Message']['etmtInfo']['cropAduAmt'] = "";
        		        // $req['Message']['etmtInfo']['custDvCd'] = $data['fincCfg'][0]['buyType'];      // ???????????? ?????? 20220607 ?????????
        		        $req['Message']['etmtInfo']['cndgmtMthCd'] = (string)$data['fincCfg'][0]['deliveryType'];
        		        $req['Message']['etmtInfo']['dlvyArDvCd'] = (string)$data['fincCfg'][0]['deliveryShip'];
        		        $req['Message']['etmtInfo']['cndgmtArDvCd'] = (string)$data['fincCfg'][0]['deliverySido'];
        		        $req['Message']['etmtInfo']['pmfeAmt'] = "0";       // ???????????????	pmfeAmt
        		        $req['Message']['etmtInfo']['pmfeRto'] = "0";       // ???????????????	pmfeRto
        		        
        		    }else if($data['estmData']['mode']=="lease"){
        		        $req['Message']['etmtInfo']['cropAduAmt'] = (string)$data['estmData']['extraSum'];
        		        //$req['Message']['etmtInfo']['custDvCd'] = "";     // ?????? ?????? ????????? ??????
        		        $req['Message']['etmtInfo']['carPrcSetlMthCd'] =  (string)$data['fincCfg'][0]['payType'];      // ??????????????????????????????	carPrcSetlMthCd
        		        $req['Message']['etmtInfo']['prdtDvCd'] = (string)$data['fincCfg'][0]['prdtDvCd'];       // ??????????????????	prdtDvCd
        		        $req['Message']['etmtInfo']['qtaxPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];     // ?????????????????????	qtaxPrcsCd
        		        $req['Message']['etmtInfo']['rgtxAmtPrcsCd'] = (string)$data['fincCfg'][0]['regTaxIn'];       // ???????????????????????????	rgtxAmtPrcsCd
        		        if($data['estmData']['bondCut']=="0") $req['Message']['etmtInfo']['pdebtCstAmtPrcsCd']="02"; // ?????? ????????? 02 ??????????????? ??????
        		        else $req['Message']['etmtInfo']['pdebtCstAmtPrcsCd'] = (string)$data['fincCfg'][0]['regBondIn'];       // ??????????????????????????????	pdebtCstAmtPrcsCd
        		        $req['Message']['etmtInfo']['regsEtxpDvCd'] = (string)$data['fincCfg'][0]['regExtrIn'];       // ??????????????????????????????	regsEtxpDvCd
        		        if(isset($data['fincCfg'][0]['testride']) && $data['fincCfg'][0]['testride']){
        		            $req['Message']['info']['demoCarYn'] =  "Y"; // ????????? ??????  demoCarYn
        		            $req['Message']['info']['demoAutmbNo'] =  $data['fincCfg'][0]['testride']; // ????????? ????????????  demoAutmbNo
        		        }else{
        		            $req['Message']['info']['demoCarYn'] =  "N"; // ????????? ??????  demoCarYn
        		        }
        		        
        		    }
        		    $cnt = 0;
        		    for($fno=1;$fno<=3;$fno++){
        		        if($data['fincCfg'][$fno]['star']=="O"){
        		            $req['Message']['etmtList'][$cnt]['aictEtmtNo'] = $key; // $estimate_data->iIdx_Estimate;
        		            $req['Message']['etmtList'][$cnt]['etmtSqn'] = $cnt+1;
        		            $req['Message']['etmtList'][$cnt]['agCmfeRto'] = (string)$data['fincCfg'][0]['feeAgR'];// AG???????????????	agCmfeRto		Y	17			#N/A
        		            $req['Message']['etmtList'][$cnt]['cmCmfeRto'] = (string)$data['fincCfg'][0]['feeCmR'];// CM???????????????	cmCmfeRto
        		            if($data['estmData']['mode']=="fince"){   // ?????? :
        		                $req['Message']['etmtList'][$cnt]['agCmfeAmt'] = (string)$data['fincData'][$fno]['feeAg'];
        		                $req['Message']['etmtList'][$cnt]['cmCmfeAmt'] = (string)$data['fincData'][$fno]['feeCm'];
        		                $req['Message']['etmtList'][$cnt]['lnapAmt'] = (string)$data['fincData'][$fno]['capital'];  //    ????????????	lnapAmt
        		                $req['Message']['etmtList'][$cnt]['antAmt'] = (string)$data['fincData'][$fno]['prepay']; //    ????????????	antAmt
        		                $req['Message']['etmtList'][$cnt]['antRto'] = (string)$data['fincData'][$fno]['prepayR'];//    ????????????	antRto
        		                $req['Message']['etmtList'][$cnt]['sellCmfe'] = (string)$data['fincData'][$fno]['rateCover'];//    ???????????????	sellCmfe
        		                $req['Message']['etmtList'][$cnt]['stfAmt'] = (string)$data['fincData'][$fno]['stamp'];//    ???????????????	stfAmt
        		                $req['Message']['etmtList'][$cnt]['stfAmtPrcsCd'] = (string)$data['fincData'][$fno]['stampYn'];//    ???????????????????????????	stfAmtPrcsCd
        		            }else{
        		                $req['Message']['etmtList'][$cnt]['endAftDutyPrcsCd'] = (string)$data['fincCfg'][$fno]['endType'];
        		                $req['Message']['etmtList'][$cnt]['agrTrvgDstnCd'] = (string)$data['fincData'][$fno]['km'];
        		                $req['Message']['etmtList'][$cnt]['gtamtRto'] = (string)$data['fincData'][$fno]['depositR'];
        		                $req['Message']['etmtList'][$cnt]['grtAmt'] = (string)$data['fincData'][$fno]['deposit'];
        		                $req['Message']['etmtList'][$cnt]['gtamtCalcStdrCd'] =  "02";      // ???????????????????????????	gtamtCalcStdrCd
        		                $req['Message']['etmtList'][$cnt]['prrpRto'] = (string)$data['fincData'][$fno]['prepayR'];
        		                $req['Message']['etmtList'][$cnt]['prrpAmt'] = (string)$data['fincData'][$fno]['prepay'];
        		                $req['Message']['etmtList'][$cnt]['prrpPrcsCd'] =  "01";      // ??????????????????	prrpPrcsCd
        		                $req['Message']['etmtList'][$cnt]['aplRcstRto'] = (string)$data['fincData'][$fno]['remainR'];
        		                $req['Message']['etmtList'][$cnt]['aplRcstAmt'] = (string)$data['fincData'][$fno]['remain'];
        		                $req['Message']['etmtList'][$cnt]['agCmfeAmt'] = (string)$data['estmData']['feeAg'];
        		                $req['Message']['etmtList'][$cnt]['cmCmfeAmt'] = (string)$data['estmData']['feeCm'];
        		            }
        		            $req['Message']['etmtList'][$cnt]['dfrMcnt'] = "0";// ???????????????
        		            $req['Message']['etmtList'][$cnt]['rmbrMcnt'] = (string)$data['fincData'][$fno]['month'];// ???????????????	rmbrMcnt
        		            if($data['estmData']['mode']=="rent"){
        		                $req['Message']['etmtList'][$cnt]['reprPrdtCd'] = (string)$data['fincCfg'][$fno]['careType'];
        		                $req['Message']['etmtList'][$cnt]['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtSum'];
        		            }else if($data['estmData']['mode']=="lease"){
        		                $req['Message']['etmtList'][$cnt]['adCmfeTrgtDvCd'] =  (string)$data['fincCfg'][$fno]['adCmfe']; // ?????????????????????????????????
        		                $req['Message']['etmtList'][$cnt]['dcSpptAmtDsbojDvCd'] =  (string)$data['fincCfg'][$fno]['dcSppt']; // ??????????????????????????????????????????
        		                $req['Message']['etmtList'][$cnt]['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtMon'];
        		            }else if($data['estmData']['mode']=="fince"){
        		                $req['Message']['etmtList'][$cnt]['evtmPyinAmt'] = (string)$data['fincData'][$fno]['pmtGrand'];
        		            }
        		            $cnt ++;
        		        }
        		    }
        		    //if($data['estmData']['mode']!="fince"){    // ?????? ??????){
        		    $reqJson = json_encode($req);
        		    $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
        		    // echo $reqJson."<br>";
        		    //echo $getJson."<br>";
        		    //}
        		}
        	}else{
        		$estimate_model->updateEstimate($no,$data);
        	}
        }
        /*
        if($job!="mod"){
        	if(!$key){
        		$times = date("Y-m-d H:i:s");
        		$sec = substr($times,-2);
        		$data = array(
        				"iIdx_Estimate" => $idx,
        				"iIdx_Member" => $_SESSION['idx_Member'],
        				"cTab_Document" => $_POST["tab"],
        				"tContent_Document" => htmlspecialchars($_POST["docu"]),
        				"iHeight_Document" => $_POST["height"],
        				"dInsert_Document" => $times
        		);
        		if(isset($_POST["set"])) $data['cSet_Document'] = $_POST["set"];
        		$doc = $estimate_model->addDocument($data);
        		$key = encodeDocu(substr($doc,0,1).substr($doc,-1).$doc.$sec);
        	}else{
        		$doc = decodeDocu($key);
        		$sec = substr($doc,-2);
        		$doc = substr($doc,0,-2);
        		if(!is_numeric($doc) || substr($doc,0,1)!=substr($doc,2,1) || substr($doc,1,1)!=substr($doc,-1)){
        			exit;
        		}else{
        			$doc = substr($doc,2);
        		}
        	}
        }
        */
        if($job=="finc"){
            // api ?????? ??????
            $data = array(
                "cState_Request" => "A000",
                "iFno_Request" => $_POST["fno"],
                "cBranch_Member" => $_SESSION["branch_Member"],
                "dInsert_Request" => date("Y-m-d H:i:s")
            );
            $estimate_model->updateEstimate($no,$data);
            
            if($_SESSION['mode']=="aict"){
                $url = "http://ep.aictcorp.com/hana/api/requestUrl"; // ?????????????????? API ????????????
                // ????????? aict ??? ??????
                $headers = array(
                    'Content-Type:application/json',
                    'Accept: application/json'
                );
            }
            
            // POST???????????? ?????? JSON????????? ??????
            $req['Header']['serviceID'] = 'COMMI00011';   // COMMI00009
            $req['Message']['reqInfo']['ccoCustNo'] = '6503417854';
            $req['Message']['reqInfo']['ccoCustSno'] = '0';
            $req['Message']['reqInfo']['dvCd'] = "7";   // ????????????????????????
            
            $req['Message']['reqCrdtSrchAgrInfo']['aictEtmtNo'] = $key.".".$_POST['fno'];
            $req['Message']['reqCrdtSrchAgrInfo']['agId'] = $_SESSION["id_Member"];    // agId ?????? ?????? ??????
            $req['Message']['reqCrdtSrchAgrInfo']['dptCd'] = $_SESSION["branch_Member"];;
            $req['Message']['reqCrdtSrchAgrInfo']['custDvCd'] = $_POST['buy'];
            $req['Message']['reqCrdtSrchAgrInfo']['rcprNm'] = $_POST['custNm'];
            $req['Message']['reqCrdtSrchAgrInfo']['rcprTlno'] = $_POST['phone1'].$_POST['phone2'].$_POST['phone3'];
            if($_POST['goods']=="rent") $req['Message']['reqCrdtSrchAgrInfo']['prdtLclsCd'] = "3"; 
            else $req['Message']['reqCrdtSrchAgrInfo']['prdtLclsCd'] = "1"; 
            if($_POST['buy']=="1"){
                $req['Message']['reqCrdtSrchAgrInfo']['bzrepRegsNo'] = "";
                $req['Message']['reqCrdtSrchAgrInfo']['recpCoNm'] = "";
            }else{
                $req['Message']['reqCrdtSrchAgrInfo']['bzrepRegsNo'] = $_POST['compNo'];
                $req['Message']['reqCrdtSrchAgrInfo']['recpCoNm'] = $_POST['compNm'];
            }
            $req['Message']['reqCrdtSrchAgrInfo']['cidNm'] = $_POST['custNm'];
            $req['Message']['reqCrdtSrchAgrInfo']['resdBzno'] = substr($_POST['year'],2).$_POST['month'].$_POST['day'];     // ?????? ????????? ??????
            $reqJson = json_encode($req);
            
            if($_SESSION['mode']=="aict") $getJson = connect_curl($url,$headers,$reqJson);   // ??????
            else $getJson = connect_hana($reqJson);   // ???????????? (header??? url ????????? ?????????)
            
            $rtnd = json_decode($getJson, true);
            $jsonData['url'] = "";  // ???????????? ????????? ?????? ?????? url ??????, ?????? ????????? ?????? ?????? ??????..
            
            $jsonData['Request'] = $reqJson;
            $jsonData['Response'] = $getJson;
            
        }else if($job=="sms" && $_POST['way']=="app"){  // SMS app ?????? ?????? ??????
            
        }else if($job=="sms" || $job=="fax"){
            if($job=="sms" && $_POST['jpg']==0) $device = "SMS";
            else if($job=="sms") $device = "MMS";
            else $device = "FAX";
            // ?????? ??????
            $data = array(
                "iIdx_Document" => $doc,
                "cDevice_Send" => $device,
                "cNumber_Send" => $_POST['to']
            );
            if($device=="MMS") $data["cSubject_Send"] = $_POST['subj'];
            if($device=="SMS" || $device=="MMS") $data["tMessage_Send"] = $_POST['msg']."\nhttp://m.ca8.kr/".$key;
            if($device=="FAX") $data["cEtc_Send"] = $_POST['page'];
            $send = $estimate_model->addSend($data);
            
            $sms_model = $this->loadModel('smsModel');
            if($job=="sms" && $_POST['jpg']==0){    // SMS
                $data = array(
                    "to" => $_POST['to'],
                    "from" => $_POST['from'],
                    "msg" => $_POST['msg']."\nhttp://m.ca8.kr/".$key,
                    "book" => date("Y-m-d H:i:s", strtotime("+3 seconds")),
                    "mem" => "S".$send
                );
                $sms_rslt = $sms_model->sendSmsUplus($data);
            }else{
                $document_data = $estimate_model->getDocumentViewN($doc);
                //var_dump($document_data);
                $makeType = "send";
                if($job=="sms") $docuType = "jpg";
                else $docuType = "pdf";
                require_once '../package/tcpdf/makeFile.php';
                if($job=="sms"){
                    $data = array(
                        "to" => $_POST['to'],
                        "from" => $_POST['from'],
                        "subj" => $_POST['subj'],
                        "msg" => $_POST['msg']."\nhttp://m.ca8.kr/".$key,
                        "file" => "/home/hosting_users/aict/mms/SendDoc/".$key.".jpg",
                        "book" => date("Y-m-d H:i:s", strtotime("+5 seconds")),
                        "mem" => "S".$send
                    );
                    $sms_rslt = $sms_model->sendMmsUplus($data);
                }else{
                    $data = array(
                        "to" => $_POST['to'],
                        "nameT" => "",
                        "from" => $_POST['from'],
                        "nameF" => "",
                        "subj" => "?????????",
                        "file" => $key.".pdf",
                        "book" => date("Y-m-d H:i:s", strtotime("+5 seconds")),
                        "mem" => "S".$send
                    );
                    $sms_rslt = $sms_model->sendFaxUplus($data);
                }
            }
            // ????????? ??????
            $service_model = $this->loadModel('serviceModel');
            $point_rslt = $service_model->lastPointSum();
            $sum = $point_rslt->sum;
            $sum -= $_POST['cost'];
            $data = array(
                "iIdx_Member" => $_SESSION['idx_Member'],
                "iPoint_Point" => -$_POST['cost'],
                "iSum_Point" => $sum,
                "cTable_Point" => "Send",
                "iIdx_Table" => $send
            );
            $service_model->addPoint($data);
        }
        if($job=="mod" && $job!="sms" && $job!="fax" && $job!="finc"){
            header('location: '.$_SERVER['HTTP_REFERER']);
        }else{
            $data = array();
            $data['result'] = "success";
            if(isset($jsonData)) $data['jsonData'] = $jsonData;
            $data['returnFunction'] = "estmActReturn('$job','$no','$key','$type')";
            echo json_encode($data);
        }
    }
    public function down($idx)
    {
        if(!isset($idx) || !isset($_GET['token']) || $_GET['token']!=$_SESSION['token']){
            header("location:/");
            exit;
        }
        
        $idx = decodeDocu($idx);
        $sec = substr($idx,-2);
        $idx = substr($idx,0,-2);
        if(isset($_SESSION['error']) && $_SESSION['error']>5){
            header('location: /');
            exit;
        }else if($idx=="" || !is_numeric($idx) || substr($idx,0,1)!=substr($idx,2,1) || substr($idx,1,1)!=substr($idx,-1)){
            if(isset($_SESSION['error'])) $_SESSION['error'] ++;
            else $_SESSION['error'] = 1;
            header('location: /');
            exit;
        }else{
            $idx = substr($idx,2);
        }
        $community_model = $this->loadModel('communityModel');
        $file_data = $community_model->getFileView($idx);
        
        $filepath = UPLOAD_PATH.$file_data->cDirectory_File.'/'.$file_data->cName_File;
        if(file_exists($filepath) && substr($file_data->iIdx_Board,-2)==$sec){
            
            $filesize = filesize($filepath);
            $path_parts = pathinfo($filepath);
            if($file_data->cSubject_File) $filename = $file_data->cSubject_File;
            else $filename = $file_data->cName_File;
            $filename = str_replace(",","",$filename);
            
            header("Pragma: public");
            header("Expires: 0");
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=$filename");
            header("Content-Transfer-Encoding: binary");
            header("Content-Length: $filesize");
            readfile($filepath);
            
        }
    }
    public function offer($path)
    {
        // ?????????
        if($path=="get"){
            $_POST = $_GET;
        }
        $url = URL."/D/E/".$_POST['key'];
        $idx = decodeDocu($_POST['key']);
        $sec = substr($idx,-2);
        $idx = substr($idx,0,-2);
        $estimate_model = $this->loadModel('estimateModel');
        if($idx=="" || !is_numeric($idx) || substr($idx,0,1)!=substr($idx,2,1) || substr($idx,1,1)!=substr($idx,-1)){
            if(isset($_SESSION['error'])) $_SESSION['error'] ++;
            else $_SESSION['error'] = 1;
            header('location: /error.html');
            exit;
        }else{
            $idx = substr($idx,2);
            $_SESSION['error'] = 0;
        }
        // ?????? ????????? API ??????, ?????? ??? ?????? ??????/?????? ?????? ??????, ????????? ?????????
        
        $msg = "????????? ???????????????  ?????????????????????.";
        
        // ?????? ??????
        if($path=="get"){
            $data = array(
                "no" => $_POST['no'],
                "key" => $_POST['key'],
                "type" => $_POST['type'],
                "job" => $_POST['job'],
                "msg" => $msg
            );
            //$data['Request'] = $reqJson;
            //$data['Response'] = $getJson;
            $str = json_encode($data);
            echo jxgcompress($str,true);
        }else{
            echo '<meta charset="utf-8">';
            echo '<script>';
            if(isset($msg)){
                echo 'alert("'.$msg.'");';
                echo 'window.location.href = "/desk/save/confirm";';
            }else{
                if($_POST['job']=="offer") {
                    echo 'alert("????????? ???????????????  ?????????????????????.");';
                    echo 'window.location.href = "'.$_SERVER['HTTP_REFERER'].'";';
                }
            }
            echo '</script>';
        }
        
        
    }
}
