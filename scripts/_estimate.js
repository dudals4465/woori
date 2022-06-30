estmNo = 2;	// Box 생성 번호
estmNow = 1;	// 현재 번호
estmSelf = 100;	// 현재 번호

start = new Object();
estmCode = new Object();	 // 계산 시작 임시 변수
estmData = new Object();	// 개별 데이터
estmRslt = new Object();	// 임시 저장
estmCfg = new Object();	// 트림별 계산 기준값(제원) 임시 저장
estmAdd = new Object();	// 견적 추가 코드 저장

estmCheck = new Object();	// 초기값 저장, 계산 중 변경 체크
estmConfig = new Object();	// 견적별 설정 값 보관
estmConfig[estmNow] = new Object();	// 견적별 설정 값 보관
fincConfig = new Object();	// 견적별 금융 설정 값 보관
fincConfig[estmNow] = new Object();	// 견적별 금융 설정 값 보관
fincConfig[estmNow][0] = new Object();
fincConfig[estmNow][1] = new Object();
fincConfig[estmNow][2] = new Object();
fincConfig[estmNow][3] = new Object();

estmAdd.brand = "";
estmAdd.model = "";
estmDoc = new Object();

fincNo = new Object();
fincNow = new Object();	 // 현재 번호

otherBrand = false;	// 타사 견적시 true, docuSalesInfo 에서 제외
userBrand = "";	// 회원 브랜드 선택

estmViewLeft = 0;

estmCountModel = ",";
estmCountMsg = "";
estmChangeKind = "";	// 모델 변경시 변경할 사항들..

alertPopupMsg = "";

fincData = new Object();

modeName = {CP:"일시불",FC:"할부 비교",FS:"할부 선택",RC:"렌트 비교",RS:"렌트 선택",LC:"리스 비교",LS:"리스 선택"};

careDesc = {Self:"자가정비(고객자체정비)",Semi:"부분정비 (고객 입고)",Standard:"입고정비 (고객 입고)",Special:"순회정비 (정비사 방문)"};

eventCheck = "";

garnishCheck = false;


// 상품정보 불러오기 (서버에서 json 캐싱한 것 로드)
function getGoodsConfig(){
	var Dpath = "goodsConfig";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		if(gnbPath=="usedcar") var url = "/api/auto/"+estmMode+"UConfig?token="+token;
		else var url = "/api/auto/"+estmMode+"Config?token="+token;
		getjsonData(url,Dpath);
	}
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
}


// 기본설정 불러오기
function getDefaultConfig(){
	var Dpath = "defaultCfg";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/defaultConfig?token="+token;
		getjsonData(url,Dpath);
	}
	for(var n in dataBank[Dpath]){
		defaultCfg[n] = dataBank[Dpath][n];
	}
}
// 시승차 정보 가져오기
function getApiTestdriveInfo(num){
	var Dpath = "carInfo";
	var url = "/api/hana/testdriveInfo?demoAutmbNo="+encodeURI(num)+"&token="+token;
	getjsonApi(url,Dpath);
	openLoading();
}
// 시승차 정보 입력하기
function setTestrideInfo(val){
	if(val=="error"){
		
	}else{
		var dat = "testride\t"+dataBank[val].demoAutmbNo;
		dat += "\nmodel\t"+dataBank[val].aictModelVl;
		dat += "\nlineup\t"+dataBank[val].aictLinupVl;
		dat += "\ntrim\t"+dataBank[val].aictTrimVl;
		dat += "\ncolorExt\t"+dataBank[val].aictCrcltMngeNoExt;
		dat += "\ncolorInt\t"+dataBank[val].aictCrcltMngeNoInt;
		dat += "\ntrimPrice\t"+dataBank[val].carSellAmt;
		dat += "\ndealerShop\t"+dataBank[val].cprnCustNo;
		startEstimate(dat);
	}
}
// 중고차 정보 가져오기
function getApiUsedcarList(name,ym,certify){
	var Dpath = "ucarList";
	var url = "/api/hana/ucarList?name="+encodeURI(name)+"&ym="+ym+"&certify="+certify+"&token="+token;
	getjsonApi(url,Dpath);
	openLoading();
	
}
// 중고차 리스트 표시하기
function setUsedCarList(val){
	if(val=="error"){
		
	}else{
		if(typeof(dataBank[val]['list'])!="undefined"){
			var str = "";
			for(var i in dataBank[val]['list']){
				var dat = dataBank[val]['list'][i];
				str += "<li codeB='"+dat['dmsdmDvCd']+"' code='"+dat['ucarMdlCd']+"'nameB='"+dat['objMkrNm']+"' name='"+dat['ucarMdlNm']+"'><button>"+dat['objMkrNm']+" "+dat['ucarMdlNm']+"</button></li>";
			}
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .carListSel").html(str);
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] [kind='carListSel']").attr("code","");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] [kind='carListSel'] > button").click();
		}
	}
}

// 모델 잔가율 가져오기
function getApiModelRemain(code){
	var Dpath = "remainLineup"+code.lineup;
	var goods = 1;	
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/hana/remainData?dvCd="+goods+"&braNo="+code.brand+"&mdlNo="+code.model+"&linupNo="+code.lineup+"&trimNo="+code.trim+"&token="+token;
		getjsonApi(url,Dpath);
	}
}
// 취득원가 계산하기
function getApiCostCapital(){
	var Dpath = "capitalData_"+estmNow;
	var url = "/api/hana/capitalData?dvCd=3&token="+token;
	if(gnbPath=="usedcar"){
		url += "&nprvDvCd=NP02";	// 차량구분코드
		url += "&cmnyCd="+fincConfig[estmNow][0]['regY']+fincConfig[estmNow][0]['regM'];	// 차량연식
	}else{
		url += "&nprvDvCd=NP01";	// 차량구분코드
	}
	// 계산 공통 값
	var rsltArr = new Object();
	if(gnbPath=="usedcar"){
		rsltArr.ucarMdlCd = "ucarCode";	//	모델번호
		rsltArr.ctfcUcarYn = "certifyYN";	//	인증중고차여부
		rsltArr.basAmt = "ucarPrice";		// 판매가격 (확인 필요)
		//rsltArr.dgr1CndgmtAmt = "deliveryMaker";	//	메이커탁송료	dgr1CndgmtAmt
	}else{
		rsltArr.braNo = "brand";	//	브랜드코드	braNo
		rsltArr.mdlNo = "model";	//	모델코드	mdlNo
		rsltArr.linupNo = "lineup";	//	라인업코드	linupNo
		rsltArr.trimNo = "trim";	//	트림코드	trimNo
		rsltArr.basAmt = "trimPrice";	//	기본금액	basAmt
		rsltArr.cropAduAmt = "extraSum";	//	차량옵션금액	cropAduAmt
		//rsltArr.gnDcAmt = "discountMaker";	//	일반할인금액	gnDcAmt
		//rsltArr.dgr1CndgmtAmt = "deliveryMaker";	//	메이커탁송료	dgr1CndgmtAmt
	}
	rsltArr.pdebtPchsRto = "bondRate";		// 공채매입비율	pdebtPchsRto
	rsltArr.pdebtCstAmt = "bondCut";		// 공채비용금액	pdebtCstAmt
	rsltArr.pdebtDcRto = "bondDc";		// 공채할인율	pdebtDcRto
	rsltArr.slfBrdnAmt = "takeSelf";		// 본인부담금액	slfBrdnAmt
	for(var k in rsltArr){
		url += "&"+k+"="+estmRslt[rsltArr[k]];
	}
	if(fincConfig[estmNow][0]['regExtrIn']=="01" && estmRslt.takeExtra){
		url += "&etcIcexpAmt="+estmRslt.takeExtra;
		url += "&regsEtxpDvCd=01";
	}else{
		url += "&etcIcexpAmt=0";// rsltArr.etcIcexpAmt = "takeExtra";		// 기타부대비용금액	etcIcexpAmt
		url += "&regsEtxpDvCd=02";	// 등록기타비용구분코드	regsEtxpDvCd			O
	}
	if(gnbPath=="usedcar"){
		if(fincConfig[estmNow][0]['deliveryIn']=="01"){
			url += "&dgr1CndgmtAmt="+estmRslt.deliveryMaker;
		}else{
			url += "&dgr1CndgmtAmt=0";	
		}
	}else if(gnbPath!="usedcar"){
		if(fincConfig[estmNow][0]['deliveryIn']=="01" || estmRslt.brand<200){
			url += "&dgr1CndgmtAmt="+estmRslt.deliveryMaker;
		}else{
			url += "&dgr1CndgmtAmt=0";	//rsltArr.dgr1CndgmtAmt = "deliveryMaker";	//	메이커탁송료	dgr1CndgmtAmt
		}
		url += "&gnDcAmt="+(estmRslt.discountMaker+estmRslt.vehicleTax+estmRslt.vehicleHev); 
	}
	// 설정 공통 값
	var cfgArr = new Object();
	if(gnbPath=="usedcar"){
		cfgArr.bioCarYn = "regFree";	// 취득세처리코드	qtaxPrcsCd 		O
	}
	cfgArr.qtaxPrcsCd = "regTaxIn";	// 취득세처리코드	qtaxPrcsCd 		O
	cfgArr.rgtxAmtPrcsCd = "regTaxIn";	// 등록세금액처리코드	rgtxAmtPrcsCd		O
	//cfgArr.regsEtxpDvCd = "regExtrIn";	// 등록기타비용구분코드	regsEtxpDvCd			O
	cfgArr.pdebtPrtoArStdrCd = "takeSidoHana";		// 공채매입율지역기준코드	pdebtPrtoArStdrCd		O
	cfgArr.regsMbgCd = "regType";		// 등록명의코드	regsMbgCd					01 포함, 02 제외
	
	cfgArr.bznCarYn = "useBiz";		// 영업차량여부	bznCarYn	
	cfgArr.prdtDvCd = "prdtDvCd"; // 상품구분코드	prdtDvCd goodsKind 변환, 1 금융, 2 리스
	cfgArr.cprnCustNo = "dealerShop";	//제휴선고객번호	cprnCustNo
	cfgArr.carPrcSetlMthCd = "payType"; //	차량가격결제방법코드	carPrcSetlMthCd
	
	
	
	for(var k in cfgArr){
		url += "&"+k+"="+fincConfig[estmNow][0][cfgArr[k]];
	}
	if(estmRslt.bondCut==0) url += "&pdebtCstAmtPrcsCd=02";
	else url += "&pdebtCstAmtPrcsCd="+fincConfig[estmNow][0]['regBondIn'];
	//cfgArr.pdebtCstAmtPrcsCd = "regBondIn";	// 공채비용금액처리코드	pdebtCstAmtPrcsCd		O
	// 시승차 여부 추가
	if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']){
		url += "&demoCarYn=Y&demoAutmbNo="+encodeURI(fincConfig[estmNow][0]['testride']);
	}else{
		url += "&demoCarYn=N";
	}
	url += "&raccAmt=0";	// 등록부대비용금액	raccAmt	=	0
	url += "&slfBrdnRto=0";	// 본인부담비율	slfBrdnRto
	getjsonApi(url,Dpath);
}
// 계산 결과 가져오기
function getApiCostResult(){
	var eVal = fincData[estmNow][fincNow[estmNow]];
	var Dpath = "costData_"+estmNow+"_"+fincNow[estmNow];
	if(estmMode=="rent") var goods = 2;
	else if(estmMode=="fince") var goods = 3;
	else if(estmMode=="lease") var goods = 4;
	else var goods = 0;
	var url = "/api/hana/costData?dvCd="+goods+"&token="+token;
	if(gnbPath=="usedcar"){
		url += "&nprvDvCd=NP02";	// 차량구분코드
		url += "&cmnyCd="+fincConfig[estmNow][0]['regY']+fincConfig[estmNow][0]['regM'];	// 차량연식
	}else{
		url += "&nprvDvCd=NP01";	// 차량구분코드
	}
	
	// 계산 공통 값
	var rsltArr = new Object();
	if(gnbPath=="usedcar"){
		rsltArr.ucarMdlCd = "ucarCode";	//	모델번호
		rsltArr.ctfcUcarYn = "certifyYN";	//	인증중고차여부
		rsltArr.basAmt = "ucarPrice";		// 판매가격 (확인 필요)
	}else{
		rsltArr.braNo = "brand";	//	브랜드코드	braNo
		rsltArr.mdlNo = "model";	//	모델코드	mdlNo
		rsltArr.linupNo = "lineup";	//	라인업코드	linupNo
		rsltArr.trimNo = "trim";	//	트림코드	trimNo
		rsltArr.gnDcAmt = "discountMaker";	//	일반할인금액	gnDcAmt
	}
	if(estmMode!="fince"){
		rsltArr.agCmfeAmt = "feeAg";	// CM수수료금액	cmCmfeAmt
		rsltArr.cmCmfeAmt = "feeCm";	// AG수수료금액	agCmfeAmt
	}
	if(estmMode=="rent"){
		rsltArr.puryCarAmt = "priceSum";
		rsltArr.mkrCsfe = "deliveryMaker";
		rsltArr.eachCtaxRto = "taxRate";
		rsltArr.vin = "vin";
	}else if(estmMode=="fince"){
		rsltArr.basAmt = "trimPrice";	//	기본금액	basAmt
		rsltArr.cropAduAmt = "extraSum";	//	차량옵션금액	cropAduAmt
		rsltArr.dgr1CndgmtAmt = "deliveryMaker";	//	메이커탁송료	dgr1CndgmtAmt
		rsltArr.pdebtPchsRto = "bondRate";		// 공채매입비율	pdebtPchsRto
		rsltArr.pdebtCstAmt = "bondCut";		// 공채비용금액	pdebtCstAmt
		rsltArr.gnDcRto = "discountRate"; // 일반할인비율		gnDcRto
	}else if(estmMode=="lease"){
		if(gnbPath!="usedcar"){
			rsltArr.basAmt = "trimPrice";	//	기본금액	basAmt
			rsltArr.cropAduAmt = "extraSum";	//	차량옵션금액	cropAduAmt
			rsltArr.dgr1CndgmtAmt = "deliveryMaker";	//	메이커탁송료	dgr1CndgmtAmt
			rsltArr.spcDcAmt = "discountSpecial";//	특별할인금액	spcDcAmt
		}
		rsltArr.pdebtPchsRto = "bondRate";		// 공채매입비율	pdebtPchsRto
		rsltArr.pdebtCstAmt = "bondCut";		// 공채비용금액	pdebtCstAmt
		rsltArr.qtaxAmt = "takeTax2";//	취득세금액	qtaxAmt
		rsltArr.rgtxAmt = "takeTax5";//	등록세금액	rgtxAmt
		rsltArr.acqCamt = "capital";//	취득원가	acqCamt
		rsltArr.slfBrdnAmt = "takeSelf";		// 본인부담금액	slfBrdnAmt
	}
	for(var k in rsltArr){
		url += "&"+k+"="+estmRslt[rsltArr[k]];
	}
	if(estmMode=="lease"){
		if(fincConfig[estmNow][0]['regExtrIn']=="01" && estmRslt.takeExtra){
			url += "&etcIcexpAmt="+estmRslt.takeExtra;
			url += "&regsEtxpDvCd=01";
		}else{
			url += "&etcIcexpAmt=0";// rsltArr.etcIcexpAmt = "takeExtra"; // 기타부대비용금액	etcIcexpAmt
			url += "&regsEtxpDvCd=02";	// 등록기타비용구분코드	regsEtxpDvCd
		}
	}
	// 설정 공통 값
	var cfgArr = new Object();
	cfgArr.custDvCd = "buyType";		// 2022-03-23 추가 // // 20220607 추가 W/유모현
	if(estmMode=="rent"){
		cfgArr.dlvyDvCd = "takeType";
		cfgArr.dlvyArDvCd = "deliveryShip";
		cfgArr.cndgmtArDvCd = "deliverySido";
		cfgArr.cndgmtMthCd = "deliveryType";
		cfgArr.sustRpraDvCd = "insureObj";
		cfgArr.ownBodyAcdDvCd = "insureCar";
		cfgArr.drvrAgeDvCd = "insureAge";
		cfgArr.mcarBnamtDvCd = "insureSelf";
		cfgArr.apemSconJnYn = "insureEmpYn";
		cfgArr.naviNo = "navigation";
		cfgArr.bkbxNo = "blackBox";
		cfgArr.snrWndtngNo = "sdrrTinting";
		cfgArr.cwsWndtngNo = "frtTinting";
		cfgArr.etcCarspNm = "etcAccessorie";
		cfgArr.etcCarspAmt = "etcAccessorieCost";
		cfgArr.sftrRmdlIemNm = "modify";
		cfgArr.sftrRmdlAmt = "modifyCost";
		cfgArr.agCmrt = "feeAgR";
		cfgArr.cmCmrt = "feeCmR";
		cfgArr.icarCcoCustCd = "dealerShop";
	}else if(estmMode=="fince"){
		//cfgArr.qtaxPrcsCd = "regTaxIn";	// 취득세처리코드	qtaxPrcsCd		불포함 고정 아래로 이동
		//cfgArr.rgtxAmtPrcsCd = "regTaxIn";	// 등록세금액처리코드	rgtxAmtPrcsCd	불포함 고정 아래로 이동
		cfgArr.regsEtxpDvCd = "regExtrIn";	// 등록기타비용구분코드	regsEtxpDvCd
		cfgArr.regsMbgCd = "regType";		// 등록명의코드	regsMbgCd
		cfgArr.rntcCorYn = "useBiz";		// 렌터카법인여부	rntcCorYn	?
		cfgArr.catxPrcsCd = "cartaxAdd"; //		자동차세처리코드	catxPrcsCd	?
		cfgArr.cprnCustNo = "dealerShop";	//제휴선고객번호	cprnCustNo
		//cfgArr.pdebtCstAmtPrcsCd = "regBondIn";		// 공채비용금액처리코드	pdebtCstAmtPrcsCd	불포함 고정 아래로 이동
		cfgArr.pdebtPrtoArStdrCd = "takeSidoHana";		// 공채매입율지역기준코드	pdebtPrtoArStdrCd
		cfgArr.cmCmfeRto = "feeCmR";	// CM수수료비율	cmCmfeRto
		cfgArr.agCmfeRto = "feeAgR"; // AG수수료비율	agCmfeRto
	}else if(estmMode=="lease"){
		if(gnbPath!="usedcar"){
			cfgArr.dlvyDvCd = "takeType";
		}
		cfgArr.prdtDvCd = "prdtDvCd"; // 상품구분코드	prdtDvCd goodsKind 변환, 1 금융, 2 리스
		cfgArr.qtaxPrcsCd = "regTaxIn";	// 취득세처리코드	qtaxPrcsCd
		cfgArr.rgtxAmtPrcsCd = "regTaxIn";	// 등록세금액처리코드	rgtxAmtPrcsCd
		//cfgArr.regsEtxpDvCd = "regExtrIn";	// 등록기타비용구분코드	regsEtxpDvCd
		cfgArr.pdebtPrtoArStdrCd = "takeSidoHana";		// 공채매입율지역기준코드	pdebtPrtoArStdrCd
		cfgArr.regsMbgCd = "regType";		// 등록명의코드	regsMbgCd
		cfgArr.bznCarYn = "useBiz";		// 영업차량여부	bznCarYn	
		cfgArr.cmCmfeRto = "feeCmR";	// CM수수료비율	cmCmfeRto
		cfgArr.agCmfeRto = "feeAgR";// AG수수료비율	agCmfeRto
		cfgArr.catxInclYn = "cartaxAdd"; //		자동차세포함여부	catxInclYn
		cfgArr.rntcCorYn = "useBiz"; //	렌터카법인여부	rntcCorYn
		cfgArr.carPrcSetlMthCd = "payType"; //	차량가격결제방법코드	carPrcSetlMthCd
		cfgArr.cprnCustNo = "dealerShop";	//제휴선고객번호	cprnCustNo
	}
	if(gnbPath=="usedcar"){
		cfgArr.bioCarYn = "regFree";	// 취득세처리코드	qtaxPrcsCd 		O
	}
	//cfgArr.ccoCmfeRto = "feeDcR";
	for(var k in cfgArr){
		if(k=="etcAccessorie" || k=="sftrRmdlIemNm") url += "&"+k+"="+encodeURI(fincConfig[estmNow][0][cfgArr[k]]);
		else url += "&"+k+"="+fincConfig[estmNow][0][cfgArr[k]];
	}
	if(fincConfig[estmNow][0]['etcAccessorie'] && estmMode=="rent") url += "&etcCarspNo=S";
	else if(estmMode!="fince") url += "&etcCarspNo=";
	if(estmMode=="fince"){
		url += "&qtaxPrcsCd=02&rgtxAmtPrcsCd=02&pdebtCstAmtPrcsCd=02";	// 불포함 기본값 적용
	}
	if(estmMode=="lease"){
		if(estmRslt.bondCut==0) url += "&pdebtCstAmtPrcsCd=02";
		else url += "&pdebtCstAmtPrcsCd="+fincConfig[estmNow][0]['regBondIn'];
		// cfgArr.pdebtCstAmtPrcsCd = "regBondIn";	// 공채비용금액처리코드	pdebtCstAmtPrcsCd
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']){
			url += "&demoCarYn=Y&demoAutmbNo="+encodeURI(fincConfig[estmNow][0]['testride']);
		}else{
			url += "&demoCarYn=N";
		}
	}
	// 계산 개별 값
	var valArr = new Object();
	if(estmMode=="rent"){
		valArr.agrTrvgDstnCd = "km";	//	약정주행거리코드	agrTrvgDstnCd
		valArr.prrpAmt = "prepay";	//	선납금액	prrpAmt
		valArr.grtAmt = "deposit";	//	보증금액	grtAmt
		valArr.endAftDutyPrcsCd = "endType";
		valArr.cntrPrid = "month";
		valArr.flflGisurSctsAmt = "depositS";		// 금액과 비율 모두 전송으로 변경해야 함, 조건에 따라.. api.php 참조..
		valArr.rcst = "remain";
		valArr.rcstPer = "remainR";
		valArr.aiIstmRcstYn = "remainType";
		valArr.reprPrdtCd = "careType";
	}else if(estmMode=="fince"){
		valArr.rmbrMcnt = "month"; //	상환개월수	rmbrMcnt
		valArr.antAmt = "prepay"; //	선수금액	antAmt
		valArr.antRto = "prepayR"; //	선수비율	antRto
		valArr.istmDvCd = "finceType"; //	할부구분코드	istmDvCd
		valArr.lnapAmt = "capital"; //	대출금액	lnapAmt
		valArr.sellCmfe = "rateCover"; // 판매수수료	sellCmfe	이손금
		valArr.agCmfeAmt = "feeAg";	// CM수수료금액	cmCmfeAmt
		valArr.cmCmfeAmt = "feeCm";	// AG수수료금액	agCmfeAmt
		valArr.stfAmtPrcsCd = "stampYn";// 인지대금액처리코드	stfAmtPrcsCd
		valArr.stfAmt = "stamp"; // 인지대금액	stfAmt
	}else if(estmMode=="lease"){
		valArr.agrTrvgDstnCd = "km";	//	약정주행거리코드	agrTrvgDstnCd
		valArr.prrpAmt = "prepay";	//	선납금액	prrpAmt
		valArr.grtAmt = "deposit";	//	보증금액	grtAmt
		valArr.rmbrMcnt = "month"; //	상환개월수	rmbrMcnt
		valArr.dfrMcnt = "monthH"; //		거치개월수	dfrMcnt
		valArr.flflGisurSctsRto = "depositS"; //	이행증권담보비율	flflGisurSctsRto
		valArr.mxRevalRto = "remainMax";//		최대잔존가치비율	mxRevalRto
		valArr.aplRcstAmt = "remain";	//		적용잔가금액	aplRcstAmt
		valArr.aplRcstRto = "remainR";//	적용잔가비율	aplRcstRto
		valArr.pstpPrnc = "respite";  //		유예원금	pstpPrnc
		valArr.pstpPrncRto = "respiteR";//		유예원금비율	pstpPrncRto
		//if(fincConfig[estmNow][0]['goodsKind']=="loan"){
		//	valArr.agCmfeAmt = "feeAg";	// CM수수료금액	cmCmfeAmt
		//	valArr.cmCmfeAmt = "feeCm";	// AG수수료금액	agCmfeAmt
		//}
	}
	for(var k in valArr){
		url += "&"+k+"="+eVal[valArr[k]];
	}
	if(estmMode=="rent"){
		url += "&tdpDvCd="+fincConfig[estmNow][fincNow[estmNow]]['kmPromotion']; // 주행거리 프로모션
	}else if(estmMode=="lease"){
		url += "&raccAmt=0";	// 등록부대비용금액	raccAmt
		url += "&yPmfeAmt=0";	//	년보험료금액	yPmfeAmt
		url += "&gtamtCalcStdrCd=02";	//	보증금산출기준코드	gtamtCalcStdrCd
		url += "&prrpPrcsCd=01";	//	선납처리코드	prrpPrcsCd
		url += "&setfeCalcStdrCd=02";	//	설정료산출기준코드	setfeCalcStdrCd
		//url += "&slfBrdnAmt=0";	// 본인부담금액	slfBrdnAmt
		url += "&slfBrdnRto=0";	// 본인부담비율	slfBrdnRto
		url += "&adCmfeTrgtDvCd="+fincConfig[estmNow][fincNow[estmNow]]['adCmfe']; // 주행거리 프로모션
		url += "&dcSpptAmtDsbojDvCd="+fincConfig[estmNow][fincNow[estmNow]]['dcSppt']; // 주행거리 프로모션
	}
	getjsonApi(url,Dpath);
}
// 즉시출고 리스트 보내기
function sendListFastship(){
	var data = new Object();
	var i = 0;
	var k= 0;
	var error = false;
	var vinSum = ",";
	var numSum = ",";
	$("#fastshipData > li:not(.blank)").each(function (){
		var sNo = $(this).attr("sNo");
		if(sNo!="0"){
			k += $(this).find(".contract li:not(.btn)").size();
			if($(this).find("input[type='radio']:checked").length==0){
				alert("선구매인지 즉시출고인지 선택해 주세요.");
				error = true;
				return false;
			}
			var kind = $(this).find("input[type='radio']:checked").val();
			if($(this).find("input[name='count']").val()==0 || $(this).find("input[name='count']").val()==""){
				alert("수량을 입력해 주세요.");
				error = true;
				return false;
			}
			// 계약번호/차대번호 입력 필수
			$(this).find(".contract li:not(.btn)").each(function (){
				var num = $.trim($(this).find("input[name='num']").val());
				var vin = $.trim($(this).find("input[name='vin']").val());
				var day =  $.trim($(this).find("input[name='day']").val()).replace(/[^0-9]/g,'');
				if(day=="00000000") day="";
				if(kind=="02" && num){
					vin = num;
					$(this).find("input[name='vin']").val(vin);
				}
				if(num=="" || vin=="" || day==""){
					alert("계약번호와 차대번호, 출고예정일을 입력해 주세요.");
					error = true;
					return false;
				}else if(vinSum.indexOf(','+vin+',')>=0 || numSum.indexOf(','+num+',')>=0){
					alert("중복되는 차대번호(계약번호)가 있습니다.");
					error = true;
					return false;
				}else{
					vinSum += vin+',';
					numSum += num+',';
					data[i] = JSON.parse(JSON.stringify(estmData[sNo]));
					data[i]['dlvyCntrNo'] = num;
					data[i]['vin'] = vin;
					data[i]['dlvyPremDt'] = day;
					data[i]['qntCnt'] = 1;
					data[i]['preBuyDvCd'] = kind;
					i++;
				}
			});
		}
	});
	if(i!=0 && i==k){
		if(confirm("입력하신 차량을 등록하시겠습니까?")){
			var str = "<form id='formPopupFastship' action='/api/hana/fastshipAdd?token="+token+"' method='POST'>\n";
			str += "<textarea name='list'>"+JSON.stringify(data)+"</textarea>";
			str += "</form>";
			$("#framePopup .content").html(str);
			ajaxSubmit("formPopupFastship");
		}
		return false;
	}else{
		if(error==false) alert("전송할 목록이 없습니다.");
		return false;
	}
}
// 즉시출고 수신
function returnFastship(){
	if(dataBank['jsonData']['state']=="1"){
		$("#fastshipData > li:not(.blank)").addClass("send");
		$("#fastshipData > li:not(.blank)").attr("sNo",0);
		$("#fastshipData > li:not(.blank) input[type='text']").prop("readonly",true);
	}
	alert(dataBank['jsonData']['msg']);
	viewApiData(dataBank['jsonData']);
}
//저장 견적에서 넘어와서 시작하기
function openEstimateU(no){
	var Dpath = "estmView"+no;
	if(typeof(dataBank[Dpath])=="undefined"){
		var url = "/api/document/"+no+"?token="+token;
		getjsonData(url,Dpath);
	}
	if(typeof(dataBank[Dpath]['data'])!="undefined"){
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		var data =  $.parseJSON(dataBank[Dpath]['data'].replace(/\\"/g, '"'));
		
		estmCode = {};
		estmCode['trim'] = data['estmData']['ucarPrice'];
		
		estmConfig[estmNow] = data['estmCfg'];
		fincConfig[estmNow] = data['fincCfg'];
		
		
		fincConfig[estmNow][0]['accountBank'] = defaultCfg['accountBank'];
		fincConfig[estmNow][0]['accountNum'] = defaultCfg['accountNum'];
		fincConfig[estmNow][0]['accountName'] = defaultCfg['accountName'];
		// 라디오 복원
		var kind = ["certifyYN","goodsKind","regType","cartaxAdd","regTaxIn","regFree","regBondIn","regExtrIn","deliveryIn"];	// 공통설정 항목
		for(var k in kind){
			if(typeof(fincConfig[estmNow][0][kind[k]])!="undefined"){
				$obj.find("input[name='"+kind[k]+"']").prop("checked",false);
				$obj.find("input[name='"+kind[k]+"'][value='"+fincConfig[estmNow][0][kind[k]]+"']").prop("checked",true);
			}
		}
		// 선택값 복원
		$obj.find(".selsub[kind='regYMSel'] li[regY='"+fincConfig[estmNow][0]['regY']+"']").addClass("on");
		$obj.find(".selsub[kind='regYMSel'] li[regM='"+fincConfig[estmNow][0]['regM']+"']").addClass("on");
		$obj.find("input[name='carName']").val(fincConfig[estmNow][0]['search']);
		$obj.find("input[name='ucarPrice']").val(fincConfig[estmNow][0]['ucarPrice']);
		
		estmChangeKind = "open";
		
		calculatorU();
		
	}else{
		alertPopup("<div>오류가 발생했습니다. 다시 시도해주세요....</div>");
	}
}

//저장 견적에서 넘어와서 시작하기
function openEstimate(no){
	var Dpath = "estmView"+no;
	if(typeof(dataBank[Dpath])=="undefined"){
		var url = "/api/document/"+no+"?token="+token;
		getjsonData(url,Dpath);
	}
	if(typeof(dataBank[Dpath]['data'])!="undefined"){
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		var data =  $.parseJSON(dataBank[Dpath]['data'].replace(/\\"/g, '"'));
		var trim = data['estmData']['trim'];
		var model = data['estmData']['model'];
		var Mpath = "modelData"+model;
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']) var url = "/api/auto/modelUsed_"+model+"?token="+token;
		else var url = "/api/auto/modelData_"+model+"?token="+token;
		getjsonData(url,Mpath);
		estmCode = {};
		estmCode['trim'] = trim;
		estmCode['lineup'] = dataBank[Mpath]['trim'][trim]['lineup'];
		estmCode['model'] = model;
		estmCode['brand'] = dataBank[Mpath]['model'][model]['brand'];
		
		$obj.find(".selbar[kind='trim']").attr("code",estmCode['trim']);
		$obj.find(".selbar[kind='lineup']").attr("code",estmCode['lineup']);
		$obj.find(".selbar[kind='model']").attr("code",estmCode['model']);
		$obj.find(".selbar[kind='brand']").attr("code",estmCode['brand']);
		estmConfig[estmNow] = data['estmCfg'];
		fincConfig[estmNow] = data['fincCfg'];
		
		// 기본 설정 복원
		$obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		$obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		//fincConfig[estmNow][0]['takeExtra'] = parseInt(defaultCfg['takeExtra']);
		//fincConfig[estmNow][0]['takeSelf'] = parseInt(defaultCfg['takeSelf']);
		fincConfig[estmNow][0]['accountBank'] = defaultCfg['accountBank'];
		fincConfig[estmNow][0]['accountNum'] = defaultCfg['accountNum'];
		fincConfig[estmNow][0]['accountName'] = defaultCfg['accountName'];
		if(estmMode=="lease"){
			if(fincConfig[estmNow][0]['takeSido']=="SU"){
				$obj.find("input[name='bondcut7']").val(fincConfig[estmNow][0]['bondDc']);
			}else{
				$obj.find("input[name='bondcut5']").val(fincConfig[estmNow][0]['bondDc']);
			}
			$obj.find(".takeSidoSel li").removeClass("on");
			$obj.find(".takeSidoSel li[takeSido='"+fincConfig[estmNow][0]['takeSido']+"']").addClass("on");
		}
		
		// radio 화면 변경
		if(estmMode=="rent" && fincConfig[estmNow][0]['goodsKind']=="lease"){
			fincConfig[estmNow][0]['goodsKind']="rent";
		}
		var kind = ["takeType","buyType","payType","regType","useBiz","goodsKind","cartaxAdd","insureAdd","careAdd","regTaxIn","regBondIn","regExtrIn","deliveryIn","insureEmpYn"];	// 공통설정 항목
		for(var k in kind){
			if(typeof(fincConfig[estmNow][0][kind[k]])!="undefined"){
				$obj.find("input[name='"+kind[k]+"']").prop("checked",false);
				$obj.find("input[name='"+kind[k]+"'][value='"+fincConfig[estmNow][0][kind[k]]+"']").prop("checked",true);
			}
		}
		var kindF = {"stampYn":"stamp"};
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));			
			if(fincConfig[estmNow][fNo]['star'] == "O"){
				$(this).find(".btnFincStar").addClass("on");
				$(this).find(".getResult").attr("openRslt",data['fincData'][fNo]['pmtGrand']);
			}else{
				$(this).find(".btnFincStar").removeClass("on");
			}
			for(var k in kindF){
				if(typeof(fincConfig[estmNow][fNo][k])!="undefined"){
					$(this).find("input[name='"+kindF[k]+fNo+"']").prop("checked",false);
					$(this).find("input[name='"+kindF[k]+fNo+"'][value='"+fincConfig[estmNow][fNo][k]+"']").prop("checked",true);
				}
			}
			
		});
		estmChangeKind = "open";
		arrangeEstmData("trim",estmCode['trim']);
	}else{
		alertPopup("<div>오류가 발생했습니다. 다시 시도해주세요....</div>");
	}
}
// 브랜드 목록 - common 참조
// 모델 목록 - common 참조

//라인업 목록
function getLineupList(model){
	var Dpath = "modelData"+model;
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']) var url = "/api/auto/modelUsed_"+model+"?token="+token;
		else var url = "/api/auto/modelData_"+model+"?token="+token;
		getjsonData(url,Dpath);
		if(typeof(dataBank[Dpath]['brand']['131'])!="undefined") dataBank[Dpath]['brand']['131']['name'] = "한국GM";
	}
	var str = "";
	var tmpL = dataBank[Dpath]['model'][model]['lineup'].split(",");
	for(var n in tmpL){
		var lineup = tmpL[n];
		var lineupD = dataBank[Dpath]['lineup'][lineup];
		var open = true;
		var cls = "";
		/*if(typeof(estmMode)!="undefined" && estmMode=="rent" && lineupD['cartype']=="T0") open = false;		// 렌트 화물차
		if(lineupD['open']>=dayCut) open = false;		// 1일전 오픈 표시하지 않음
		if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentDisLineup'])!="undefined" && defaultCfg['rentDisLineup']){
			if(defaultCfg['rentDisLineup'].indexOf(tmpL[n])>=0) open = false;
		}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseDisLineup'])!="undefined" && defaultCfg['leaseDisLineup']){
			if(defaultCfg['leaseDisLineup'].indexOf(tmpL[n])>=0) open = false;
		}
		if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentNotLineup'])!="undefined" && defaultCfg['rentNotLineup']){
			if(defaultCfg['rentNotLineup'].indexOf(tmpL[n])>=0) cls = "not";
		}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseNotLineup'])!="undefined" && defaultCfg['leaseNotLineup']){
			if(defaultCfg['leaseNotLineup'].indexOf(tmpL[n])>=0) cls = "not";
		}*/
		//if(dataBank[Dpath]['lineup'][tmpL[n]]['name'].indexOf("개소세 5% 기준")>=0 || dataBank[Dpath]['lineup'][tmpL[n]]['open'].substring(0,4)=="2021"){		// 2021 개소세 임시조치 
		//	open = false;
		//}
		if(open){
			var sub = "";
			if(lineupD['name'].indexOf("(")>=0){
				sub += lineupD['name'].substring(lineupD['name'].indexOf("(")+1).replace(")","");
				var name = lineupD['name'].substring(0, lineupD['name'].indexOf("("));
			}else{
				var name = lineupD['name'];
			}
			if(typeof(lineupD['open'])!="undefined"){
				if(sub) sub += ", ";
				sub += lineupD['open'].substring(0,4)+"."+lineupD['open'].substring(5,7)+"~";
			}
			if(sub) name += " <span class='sub'>("+sub+")</span>";
			str += "<li lineup='"+lineup+"' class='"+cls+"'><button><span class='state"+lineupD['state']+"'>"+name+"</span></button></li>";
		}
	}
	return str;
}
// 트림 목록
function getTrimList(model,lineup){
	var Dpath = "modelData"+model;
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']) var url = "/api/auto/modelUsed_"+model+"?token="+token;
		else var url = "/api/auto/modelData_"+model+"?token="+token;
		getjsonData(url,Dpath);
		if(typeof(dataBank[Dpath]['brand']['131'])!="undefined") dataBank[Dpath]['brand']['131']['name'] = "한국GM";
	}
	var str = "";
	var tmpT = dataBank[Dpath]['lineup'][lineup]['trim'].split(",");
	for(var m in tmpT){
		var trim = tmpT[m];
		var trimD = dataBank[Dpath]['trim'][trim];
		var open = true;
		var cls = "";
		/*if(typeof(estmMode)!="undefined" && estmMode=="rent" && trimD['cartype']=="T0") open = false;		// 렌트 화물차
		if(trimD['open']>=dayCut) open = false;		// 1일전 오픈 표시하지 않음
		if(trimD.division=="P" && trimD.name.indexOf("M/T")>0) open = false;
		if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentDisTrim'])!="undefined" && defaultCfg['rentDisTrim']){
			if(defaultCfg['rentDisTrim'].indexOf(tmpT[m])>=0) open = false;
		}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseDisTrim'])!="undefined" && defaultCfg['leaseDisTrim']){
			if(defaultCfg['leaseDisTrim'].indexOf(tmpT[m])>=0) open = false;
		}
		if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentNotTrim'])!="undefined" && defaultCfg['rentNotTrim']){
			if(defaultCfg['rentNotTrim'].indexOf(tmpT[m])>=0) cls = "not";
		}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseNotTrim'])!="undefined" && defaultCfg['leaseNotTrim']){
			if(defaultCfg['leaseNotTrim'].indexOf(tmpT[m])>=0) cls = "not";
		}*/
		if(open){
			str += "<li trim='"+trim+"' class='"+cls+"'><button>";
			str+= "<span class='name state"+trimD['state']+"'>"+trimD['name']+"</span> ";	
			str+= "<span class='info'>";
			if(typeof(trimD['spec'])!="undefined" && typeof(trimD['spec'][1855])!="undefined" && typeof(dataBank[Dpath]['spec'][trimD['spec'][1855]])!="undefined"){
				str+= dataBank[Dpath]['spec'][trimD['spec'][1855]][1872]+" "+dataBank[Dpath]['spec'][trimD['spec'][1855]][1873];
				if(dataBank[Dpath]['spec'][trimD['spec'][1855]][1872]=="전기") str+= "㎞/㎾h";
				else str+= "㎞/ℓ";
			}
			str+= "</span> ";	
			str+= "<span class='price'>"+number_format(trimD['price'])+"</span>";
			str += "</button></li>";
			dataCheck("Trm-"+trim,trimD['price']+"\t"+trimD['name']);
		}
	}
	return str;
}
//색상 목록
function getColorList( model, lineup, trim, kind ){
	var Dpath = 'modelData'+model;
	var color = "";
	var ttl = "";
	var guide = "";
	if(kind=="Ext"){
		if(typeof(dataBank[Dpath]['trim'][trim]['colorExt'])!="undefined") color = dataBank[Dpath]['trim'][trim]['colorExt'];
		else if(typeof(dataBank[Dpath]['lineup'][lineup]['colorExt'])!="undefined") color = dataBank[Dpath]['lineup'][lineup]['colorExt'];
		else color = dataBank[Dpath]['model'][model]['colorExt'];
		ttl = "외장";
		if(estmMode=="rent") guide = "※ 원색계열(빨강, 주황, 노랑, 초록, 보라)은 구매(인수)조건만 진행가능합니다.";
		if(typeof(dataBank[Dpath]['lineup'][lineup]['colorExtGuide'])!="undefined") guide += "<br>"+dataBank[Dpath]['lineup'][lineup]['colorExtGuide'].replace(/\n/g,"<br>").replace(/\\/g,"");
	}else if(kind=="Int"){
		if(typeof(dataBank[Dpath]['trim'][trim]['colorInt'])!="undefined") color = dataBank[Dpath]['trim'][trim]['colorInt'];
		else if(typeof(dataBank[Dpath]['lineup'][lineup]['colorInt'])!="undefined") color = dataBank[Dpath]['lineup'][lineup]['colorInt'];
		else color = dataBank[Dpath]['model'][model]['colorInt'];
		ttl = "내장";
		if(typeof(dataBank[Dpath]['lineup'][lineup]['colorIntGuide'])!="undefined") guide = dataBank[Dpath]['lineup'][lineup]['colorIntGuide'].replace(/\n/g,"<br>").replace(/\\/g,"");
	}
	var str = "";
	if(guide) str += "<li class='guide'>"+guide+"</li>";
	if(color){
		tmp = color.split("\n");
		for(var c in tmp){
			var val = tmp[c].split("\t");
			if(typeof(dataBank[Dpath]['color'+kind][val[0]])!="undefined"){
				var dat = dataBank[Dpath]['color'+kind][val[0]];
				if(dat.code) var code = "("+dat.code+")";
				else var code = "";
				if(dat.group) code += " - "+dat.group;
				var rgb =dat.rgb+"/"+dat.rgb2;
				if(typeof(val[2]) && val[2]==1) var stateCss = "state3";
				else var stateCss = "";
				var join = "";
				if(kind=="Ext"){
					if(typeof(dat['intNot'])!="undefined") join += " intNot='"+dat['intNot']+"'";
					if(typeof(dat['optionJoin'])!="undefined") join += " optionJoin='"+dat['optionJoin']+"'";
					if(typeof(dat['optionNot'])!="undefined") join += " optionNot='"+dat['optionNot']+"'";
				}else{
					if(typeof(dat['extNot'])!="undefined") join += " extNot='"+dat['extNot']+"'";
					if(typeof(dat['optionJoin'])!="undefined") join += " optionJoin='"+dat['optionJoin']+"'";
					if(typeof(dat['optionNot'])!="undefined") join += " optionNot='"+dat['optionNot']+"'";
				}
				str += "<li price='"+val[1]+"' color"+kind+"='"+val[0]+"' rgb='"+rgb+"' "+join+"><button>";
				str += "<span class='name "+stateCss+"'>"+dat.name+code+"</span>";
				str += "<span class='colorChip'><span class='colorMain' style='background-color:#"+dat.rgb+"'>&nbsp;</span>";
				if(dat.rgb2) str += "<span class='colorSub' style='background-color:#"+dat.rgb2+"'>&nbsp;</span>";
				str += "</span>";
				if(val[1]!="0") str += "<span class='price'>"+number_format(val[1])+"</span>";
				str += "</button></li>";
				dataCheck(kind+"-"+lineup+"-"+val[0],val[1]+"\t"+dat.name+code);
			}
		}
	}else{
		str += "<li class='blank'>아래 입력창에 명칭과 가격을 넣고 적용 버튼을 눌러주세요.</li>";
	}
	str += "<li class='selfBox' kind='color"+kind+"'>";
	str += "<div><span class='name'>명칭</span> <input type='text' name='name' value='' placeholder='"+ttl+" 색상 명칭'></div>";
	str += "<div><span class='name'>가격</span> <input type='text' name='price' class='numF numZ' value='' placeholder='금액'> 원 </div>";
	str += "<input type='button' value='적용'></button>";
	str += "</li>";
	return str;
}
// 색상 선택 제한
function changedColorExt(code){
	var $objE = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorExtSel");
	var $objI = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorIntSel");
	var $objO = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel");
	$objI.find("li.off").removeClass("off");
	var intNot = $objE.find("li[colorExt='"+code+"']").attr("intNot");
	var optionJoin = $objE.find("li[colorExt='"+code+"']").attr("optionJoin");
	var optionNot = $objE.find("li[colorExt='"+code+"']").attr("optionNot");
	var msg = "";
	if(intNot){
		var not = intNot.split(",");
		for(var n in not){
			if($objI.find("li[colorInt='"+not[n]+"']").hasClass("on")){		// 조건 발생하지 않음
				msg += "<span class='desc'>『"+$objI.find("li.on span.name").text()+"』 내장은 『"+$objE.find("li.on span.name").text()+"』 외장과 함께 선택되지 않습니다.</span><br>내장색상을 다시 선택해 주세요.";
				$objI.find("li[colorInt='"+not[n]+"']").removeClass("on");
				getColorIntCode();
			}
			$objI.find("li[colorInt='"+not[n]+"']").addClass("off");
		}
	}
	if(optionJoin){
		var join = optionJoin.split(",");
		var opt = "";
		for(var n in join){
			if($objO.find("li[option='"+join[n]+"']").length){
				if(opt) opt +="이나 ";
				opt += "『"+$objO.find("li[option='"+join[n]+"'] span.name").text()+"』";
			}
		}
		if(opt) msg +="<span class='desc'>『"+$objE.find("li.on span.name").text()+"』 외장은 "+opt+" 옵션과 함께 선택되어야 합니다.</span><br>옵션을 확인해 주세요.";
	}
	if(optionNot){
		var not = optionNot.split(",");
		for(var n in not){
			if($objO.find("li[option='"+not[n]+"']").hasClass("on")){		// 조건 발생하지 않음
				if(msg) msg +="<br>";
				msg += "<span class='desc'>『"+$objO.find("li.on span.name").text()+"』 옵션은 『"+$objE.find("li.on span.name").text()+"』 외장과 함께 선택되지 않습니다.</span><br>옵션을 확인해 주세요.";
				$objO.find("li[option='"+not[n]+"']").removeClass("on");
				getColorIntCode( );
			}
		}
	}
	if(msg) alertPopup(msg);
}
//색상 선택 제한
function changedColorInt(code){
	var $objE = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorExtSel");
	var $objI = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorIntSel");
	var $objO = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel");
	$objE.find("li.off").removeClass("off");
	var extNot = $objI.find("li[colorInt='"+code+"']").attr("extNot");
	var optionJoin = $objI.find("li[colorInt='"+code+"']").attr("optionJoin");
	var optionNot = $objI.find("li[colorInt='"+code+"']").attr("optionNot");
	var msg = "";
	if(extNot){
		var not = extNot.split(",");
		for(var n in not){
			if($objE.find("li[colorExt='"+not[n]+"']").hasClass("on")){	// 조건 발생하지 않음
				msg += "<span class='desc'>『"+$objE.find("li.on span.name").text()+"』 외장은 『"+$objI.find("li.on span.name").text()+"』 내장과 함께 선택되지 않습니다.</span><br>외장색상을 다시 선택해 주세요.";
				$objE.find("li[colorExt='"+not[n]+"']").removeClass("on");
				getColorExtCode( );
			}
			$objE.find("li[colorExt='"+not[n]+"']").addClass("off");
		}
	}
	if(optionJoin){
		var join = optionJoin.split(",");
		var opt = "";
		for(var n in join){
			if($objO.find("li[option='"+join[n]+"']").length){
				if(opt) opt +="이나 ";
				opt += "『"+$objO.find("li[option='"+join[n]+"'] span.name").text()+"』";
			}
		}
		if(opt) msg +="<span class='desc'>『"+$objI.find("li.on span.name").text()+"』 내장은 "+opt+" 옵션과 함께 선택되어야 합니다.</span><br>옵션을 확인해 주세요.";
	}
	if(optionNot){
		var not = optionNot.split(",");
		var opt = "";
		for(var n in not){
			if($objO.find("li[option='"+not[n]+"']").hasClass("on")){
				if(opt) opt +="이나 ";
				opt += "『"+$objO.find("li[option='"+not[n]+"'] span.name").text()+"』";
				$objO.find("li[option='"+not[n]+"']").removeClass("on")
				getOptionCode( );
			}
		}
		if(opt) msg +="<span class='desc'>『"+$objI.find("li.on span.name").text()+"』 내장은 "+opt+" 옵션은 함께 선택되지 않습니다.</span><br>옵션을 확인해 주세요.";
	}
	if(msg) alertPopup(msg);
}
// 색상 직접
function makeSelfColor(kind,code,name,price){
	var str = "<li price='"+price+"' "+kind+"='"+code+"' rgb=''>";
	str +="<button><span class='name'>"+name+"</span>";
	if(price!=0) str +="<span class='price'>"+number_format(price)+"</span></span>";
	str +="</button>";
	str +="<span class='del btnDelSelf' kind='"+kind+"'>삭제</span></li>";
	return str;
}
// 옵션 목록
function getOptionList(model, lineup, trim){
	var Dpath = 'modelData'+model;
	var option = "";
	if(typeof(dataBank[Dpath]['trim'][trim]['option'])!="undefined") option = dataBank[Dpath]['trim'][trim]['option'];
	var str = "";
	if(option){
		tmp = option.split("\n");
		for(var c in tmp){
			var val = tmp[c].split("\t");
			var dat = dataBank[Dpath]['option'][val[0]];
			var open = true;
			if(typeof(estmMode)!="undefined" && estmMode=="rent" && dat.name.indexOf("트레일러")>=0) open = false;		// 렌트 화물차
			if(open){
				if(typeof(val[3]) && val[3]==1) var stateCss = "state3";
				else var stateCss = "";
				var join = "";
				if(typeof(dat['extNot'])!="undefined") join += " extNot='"+dat['extNot']+"'";
				if(typeof(dat['extJoin'])!="undefined") join += " extJoin='"+dat['extJoin']+"'";
				if(typeof(dat['intNot'])!="undefined") join += " intNot='"+dat['intNot']+"'";
				if(typeof(dat['intJoin'])!="undefined") join += " intJoin='"+dat['intJoin']+"'";
				str += "<li apply='"+$.trim(val[2])+"' price='"+val[1]+"' option='"+val[0]+"' "+join+"><button>";
				str += "<span class='name "+stateCss+"'>"+dat.name+"</span>";
				str += "<span class='price'>"+number_format(val[1])+"</span>";
				if(typeof(dat.package)!="undefined") str += "<div class='info'>"+dat.package.replace(/\n/g,"<br>")+"</div>";
				else if(typeof(dat.items)!="undefined") str += "<div class='info'>"+dat.items.replace(/\n/g,"<br>")+"</div>";
				else if(typeof(dat.guide)!="undefined") str += "<div class='info'>"+dat.guide.replace(/\n/g,"<br>")+"</div>";
				str += "</button></li>";
				dataCheck("Opt-"+trim+"-"+val[0],val[1]+"\t"+dat.name);
			}
		}
	}else{
		str += "<li class='blank'>아래 입력창에 명칭과 가격을 넣고 적용 버튼을 눌러주세요.</li>";
	}
	str += "<li class='selfBox' kind='option'>";
	str += "<div><span class='name'>명칭</span> <input type='text' name='name' value='' placeholder='옵션 명칭'></div>";
	str += "<div><span class='name'>가격</span> <input type='text' name='price' class='numF numZ' value='' placeholder='금액'> 원 ";
	if(estmMode!="rent" && estmMode!="fastship" && priceSelf) str += "&nbsp;  <label><input type='checkbox' name='optionType' value='B'><span>최종차량가(+/-)</span> &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  </label>";
	str += "</div>";
	str += "<input type='button' value='적용'></button>";
	str += "</li>";
	return str;
}
// 옵션 직접
function makeSelfOption(code,name,price){
	var str = "<li price='"+price+"' option='"+code+"' apply=''>";
	str +="<button><span class='name'>"+name+"</span><span class='price'>"+number_format(price)+"</span></button>";
	str +="<span class='del btnDelSelf' kind='option'>삭제</span></li>";
	return str;
}
// 외장/내장/색상 연결 안내
function checkContentJoin(kind,code,type){
	var model = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='model']").attr("code");
	var trim = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='trim']").attr("code");
	var Dpath = "modelData" + model;
	
	if(kind=="colorExt" && typeof(dataBank[Dpath]['colorExt'][code]['optionJoin']) != "undefined"){		// 외장 -> 옵션
		var join = dataBank[Dpath]['colorExt'][code]['optionJoin'].split(",");
		var option = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code");
		if(typeof(dataBank[Dpath]['trim'][trim]['option'])!="undefined") var optionList = dataBank[Dpath]['trim'][trim]['option'];
		else var optionList = "";
		if(optionList){
			for (var n in join) {
				if(optionList.indexOf(join[n])>=0 && option.indexOf(join[n])<0){
					var msg = "【"+dataBank[Dpath]['colorExt'][code]['name']+"】 외장색상은 ";
					msg += "【"+dataBank[Dpath]['option'][join[n]]['name']+"】 옵션은 함께 적용됩니다.";
					if(option) option += ",";
					option += join[n];
					$("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code",option);
					getOptionCode();
					alertPopup(msg);
				}
			}
		}
	}else if(kind=="colorInt" && typeof(dataBank[Dpath]['colorInt'][code]['optionJoin']) != "undefined"){		// 외장 -> 옵션
		var join = dataBank[Dpath]['colorInt'][code]['optionJoin'].split(",");
		var option = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code");
		if(typeof(dataBank[Dpath]['trim'][trim]['option'])!="undefined") var optionList = dataBank[Dpath]['trim'][trim]['option'];
		else var optionList = "";
		if(optionList){
			for (var n in join) {
				if(optionList.indexOf(join[n])>=0 && option.indexOf(join[n])<0){
					var msg = "【"+dataBank[Dpath]['colorInt'][code]['name']+"】 내장색상은 ";
					msg += "【"+dataBank[Dpath]['option'][join[n]]['name']+"】 옵션은 함께 적용됩니다.";
					if(option) option += ",";
					option += join[n];
					$("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code",option);
					getOptionCode();
					alertPopup(msg);
				}
			}
		}
	}
}

// 외장/내장/옵션 선택 제한 안내
function disabledMessage(kind,code,type){
	var model = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='model']").attr("code");
	var trim = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='trim']").attr("code");
	var Dpath = "modelData" + model;
	var optionList = dataBank[Dpath]['trim'][trim]['option'];
	var $objO = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .optionSel");
	if(kind=="colorInt") var msg = "【"+dataBank[Dpath]['colorInt'][code]['name']+"】 내장색상은 ";
	else if(kind=="colorExt") var msg = "【"+dataBank[Dpath]['colorExt'][code]['name']+"】 외장색상은 ";
	else if(kind=="option") var msg = "【"+dataBank[Dpath]['option'][code]['name']+"】 옵션은 ";
	if(type=="extNot"){
		var colorExt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorExt']").attr("code");
		msg += "【"+dataBank[Dpath]['colorExt'][colorExt]['name']+"】 외장색상과 함께 적용되지 않습니다.";
	}else if(type=="intNot"){
		var colorInt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorInt']").attr("code");
		msg += "【"+dataBank[Dpath]['colorInt'][colorInt]['name']+"】 내장색상과 함께 적용되지 않습니다.";
	}else if(type=="optionNot"){
		var option = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code");
		var not = dataBank[Dpath][kind][code]['optionNot'].split(",");
		var name = "";
		for (var n in not) {
			if(option.indexOf(not[n])>=0) {
				if(name)  name+=", ";
				name += "【"+dataBank[Dpath]['option'][not[n]]['name']+"】";
			}
		}
		msg +=   name+" 옵션과 함께 적용되지 않습니다.";
	}else if(type=="optionJoin"){
		var join = dataBank[Dpath][kind][code]['optionJoin'].split(",");
		var name = "";
		for (var j in join) {
			if(optionList.indexOf(join[j])>=0) {
				if(name)  name+="이나 ";
				name += "【"+dataBank[Dpath]['option'][join[j]]['name']+"】";
			}
		}
		msg +=   name+" 옵션과 함께 적용됩니다. 옵션을 먼저 선택해 주세요.";
	}else if(type=="anti"){
		var comp = $objO.find("li[option='" + code + "']").attr("apply").replace(/[^A-Z]/g,"");
		var name = "";
		var check = "";
		for(ot = 0; ot < comp.length; ot ++){
			os = comp.substring(ot,ot+1);
			if($objO.find("li.on[apply*='"+os+"']").length){
				var anti = $objO.find("li.on[apply*='"+os+"']").attr("option");
				if(check=="" || check.indexOf(anti)<0){
					check += anti+",";
					if(name) name += "이나 ";
					name += "【"+dataBank[Dpath]['option'][anti]['name']+"】";
				}
			}
		}
		msg += name+" 옵션과 함께 적용되지 않습니다. ";
	}else if(type=="sub"){
		var comp = $objO.find("li[option='" + code + "']").attr("apply").replace(/[^a-z]/g,"");
		var name = "";
		var check = "";
		for(ot = 0; ot < comp.length; ot ++){
			os = comp.substring(ot,ot+1);
			if($objO.find("li:not(.on)[apply*='"+os.toUpperCase()+"']").length){
				$objO.find("li:not(.on)[apply*='"+os.toUpperCase()+"']").each(function(){
					var sub = $(this).attr("option");
					if(check=="" || check.indexOf(sub)<0){
						check += sub+",";
						if(name) name += "이나 ";
						name += "【"+dataBank[Dpath]['option'][sub]['name']+"】";
					}
				});
			}
		}
		msg += name+" 옵션을 선택한 후 적용될 수 있습니다.";
	}
	alertPopup(msg);
}

// 내외장/옵션 선택 변경
function disabledContent(kind){
	var model = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='model']").attr("code");
	var trim = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='trim']").attr("code");
	var Dpath = "modelData" + model;
	var colorExt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorExt']").attr("code");
	var colorInt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorInt']").attr("code");
	var option = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selpop[kind='option']").attr("code");			// 변경됨
	var $objE = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorExtSel");
	var $objI = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorIntSel");
	var $objO = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .optionSel"); // $("#optionList");	// 변경됨
	var optionList = dataBank[Dpath]['trim'][trim]['option'];
	// 외장 제한 ( 내장과 )
	if(kind=="colorExt"){
		$objE.find("li").removeClass("dis");
		$objE.find("li").attr("dis","");
		// 내장 선택 확인
		if(colorInt && colorInt[0]!="S" && typeof(dataBank[Dpath]['colorInt'][colorInt]['extNot'])!="undefined"){
			var not = dataBank[Dpath]['colorInt'][colorInt]['extNot'].split(",");
			for (var n in not) {
				$objE.find("li[colorExt='" + not[n] + "']").addClass("dis");
				$objE.find("li[colorExt='" + not[n] + "']").attr("dis","intNot");
			}
		}
		// 옵션 선택 확인
		if(option){
			var opt = option.split(",");
			for (var o in opt) {
				if(opt[o] && opt[o][0]!="S" &&  typeof(dataBank[Dpath]['option'][opt[o]]['extNot'])!="undefined"){
					var not = dataBank[Dpath]['option'][opt[o]]['extNot'].split(",");
					for (var n in not) {
						$objE.find("li[colorExt='" + not[n] + "']").addClass("dis");
						$objE.find("li[colorExt='" + not[n] + "']").attr("dis","optionNot");
					}
				}
			}
		}
		// 옵션 연결 확인
		$objE.find("li:not(.on,.selfBox,.selNot,.guide,.blank)").each(function (){
			var ext = $(this).attr("colorExt");
			 if(ext[0]!="S" && !$(this).hasClass("dis") && typeof(dataBank[Dpath]['colorExt'][ext]['optionJoin'])!="undefined"){
				var ckd = false;
				var cnt = 0;	// 관련 있는 옵션 갯수
				var join = dataBank[Dpath]['colorExt'][ext]['optionJoin'].split(",");
				for (var j in join) {
					if(option.indexOf(join[j])>=0 ) ckd = true;
					else if(optionList.indexOf(join[j])>=0) cnt ++;
				}
				if(cnt && !ckd){
					$(this).addClass("dis");
					$(this).attr("dis","optionJoin");
				}
			}
		});
	}else if(kind=="colorInt"){
		$objI.find("li").removeClass("dis");
		$objI.find("li").attr("dis","");
		// 외장 선택 확인
		if(colorExt && colorExt[0]!="S" && typeof(dataBank[Dpath]['colorExt'][colorExt]['intNot'])!="undefined"){
			var not = dataBank[Dpath]['colorExt'][colorExt]['intNot'].split(",");
			for (var n in not) {
				$objI.find("li[colorInt='" + not[n] + "']").addClass("dis");
				$objI.find("li[colorInt='" + not[n] + "']").attr("dis","extNot");
			}
		}
		// 옵션 선택 확인
		if(option){
			var opt = option.split(",");
			for (var o in opt) {
				if(opt[o] && opt[o][0]!="S" &&  typeof(dataBank[Dpath]['option'][opt[o]]['intNot'])!="undefined"){
					var not = dataBank[Dpath]['option'][opt[o]]['intNot'].split(",");
					for (var n in not) {
						$objI.find("li[colorInt='" + not[n] + "']").addClass("dis");
						$objI.find("li[colorInt='" + not[n] + "']").attr("dis","optionNot");
					}
				}
			}
		}
		// 옵션 연결 확인
		$objI.find("li:not(.on,.selfBox,.selNot,.guide,.blank)").each(function (){
			var int = $(this).attr("colorInt");
			 if(int[0]!="S" && !$(this).hasClass("dis") && typeof(dataBank[Dpath]['colorInt'][int]['optionJoin'])!="undefined"){
				var ckd = false;
				var cnt = 0;	// 관련 있는 옵션 갯수
				var join = dataBank[Dpath]['colorInt'][int]['optionJoin'].split(",");
				for (var j in join) {
					if(option.indexOf(join[j])>=0 ) ckd = true;
					else if(optionList.indexOf(join[j])>=0) cnt ++;
				}
				if(cnt && !ckd){
					$(this).addClass("dis");
					$(this).attr("dis","optionJoin");
				}
			}
		});
	}else if(kind=="option"){
		$objO.find("li").removeClass("dis");
		$objO.find("li").attr("dis","");
		// 외장 제한 확인
		if(colorExt && colorExt[0]!="S" && typeof(dataBank[Dpath]['colorExt'][colorExt]['optionNot'])!="undefined"){
			var not = dataBank[Dpath]['colorExt'][colorExt]['optionNot'].split(",");
			for (var n in not) {
				$objO.find("li[option='" + not[n] + "']").addClass("dis");
				$objO.find("li[option='" + not[n] + "']").attr("dis","extNot");
			}
		}
		// 내장 제한 확인
		if(colorInt && colorInt[0]!="S" && typeof(dataBank[Dpath]['colorInt'][colorInt]['optionNot'])!="undefined"){
			var not = dataBank[Dpath]['colorInt'][colorInt]['optionNot'].split(",");
			for (var n in not) {
				$objO.find("li[option='" + not[n] + "']").addClass("dis");
				$objO.find("li[option='" + not[n] + "']").attr("dis","intNot");
			}
		}
		// 중복 배제
		var apply = "";
		if(option){
			// apply 중복 선택자 확인
			var applyOn = "";
			var child = "";
			var opt = option.split(",");
			for (var n in opt) {
				apply += $objO.find("li[option='"+opt[n]+"']").attr("apply");
			}
			apply = apply.replace(/[^A-Z]/g,"");
			if(apply){
				for(ot = 0; ot < apply.length; ot ++){
					os = apply.substring(ot,ot+1);
					$objO.find("li:not(.on)[apply*='"+os+"']").addClass("dis");
					$objO.find("li:not(.on)[apply*='"+os+"']").attr("dis","anti");
				}
			}
		}
		// 의존 있으면 제한
		$objO.find("li:not(.on,.selfBox,.blank)").each(function (){
			var comp = $(this).attr("apply").replace(/[^a-z]/g,"");
			if(comp){
				var ckdOn = false;
				if(apply){
					for(ot = 0; ot < comp.length; ot ++){
						os = comp.substring(ot,ot+1);
						if(apply.indexOf( os.toUpperCase())>=0) ckdOn = true;
					}
				}
				if(!ckdOn){
					$(this).addClass("dis");
					$(this).attr("dis","sub");
				}
			}
		});
		// 불가 선택 있으면 해제
		if($objO.find("li.on.dis").length){
			$objO.find("li.on.dis").removeClass("on");
			getOptionCode();
		}
		// 가니쉬 체크
		garnishCheck = false;
		if(estmConfig[estmNow]['option'].indexOf('(가니쉬')<0){
			var $objO2 = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li:not(.dis)");
			$objO2.each(function (){
				var name = $(this).find(".name").text();
				if(name.indexOf('(가니쉬')==0){
					garnishCheck = true;
				}
			});
		}
	}
}
//리스/렌트 공통 설정 표시
function getComnForm(kind,code){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .comnCell");
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	var str = "";
	if(kind=="regY" || kind=="regM"){
		if(kind=="regY"){
			$obj.find(".regM li.on").removeClass("on");
		}
		$obj.find("."+kind+" li.on").removeClass("on");
		$obj.find("."+kind+" li["+kind+"='"+fincConfig[estmNow][0][kind]+"']").addClass("on");
	}else if(kind=="incentive"){
		if(estmMode=="fince" || fincConfig[estmNow][0]['goodsKind']=="loan"){
			var agMax = parseFloat(defaultCfg['agFeeMax']);
			var cmMax = parseFloat(defaultCfg['cmFeeMax']);
			var maxFee = 0;
			if(estmRslt.capital){
				var sumMax = parseFloat(defaultCfg['sumMax']);
			}else{
				var sumMax = 0;
			}
			var sumMaxA = parseFloat(defaultCfg['sumMaxA']);
			var sumMaxB = parseFloat(defaultCfg['sumMaxB']);
		}else if(estmMode=="lease"){
			var feeC = parseFloat(fincConfig[estmNow][0]['feeCmR']);
			var feeA = parseFloat(fincConfig[estmNow][0]['feeAgR']);
			if(gnbPath=="usedcar"){
				var cmMax = 0;
				var agMax = 0;
				if(fincConfig[estmNow][0]['certifyYN']=="Y"){
					var cmMax = 9;
					var sumMax = 13;
				}else{
					var sumMax = 9;
				}
			}else if(local == "imported"){
				/*if(feeC==14){
					defaultCfg['cmFeeMax'] = 14;
					if(defaultCfg['typeAg']=="3"){
						var agMax = 1.1;
						var sumMax = 15.1;
					}else{
						var agMax = 1;
						var sumMax = 15;
					}
				}else{
					var cmMax = 14;
					if(defaultCfg['typeAg']=="3"){
						var agMax = 1.1;
					}else{
						var agMax = 1;
					}
					var sumMax = 14;
				}*/
				var cmMax = 0;	// 수입차 예외 제한, 
				var agMax = 3;	// 수입차 AG 1% 제한 해제 (2021.04.05)	// 2022년 변경 0 -> 3
				var sumMax = 13;	// 2022년 변경 14 -> 13
			}else{
				var cmMax = 0;
				var agMax = 3;		// 2022년 변경 0 -> 3
				var sumMax = 12;	// 2022년 변경 13 -> 12
			}
		}else{
			var agMax = parseFloat(dataBank['goodsConfig'][local]['agFeeMax']);
			var cmMax = parseFloat(dataBank['goodsConfig'][local]['cmFeeMax']);
			var sumMax = parseFloat(dataBank['goodsConfig'][local]['agcmFeeMax']);
		}
		str += "<div class='info'><span class='name'>한도 :</span>";
		if(gnbPath=="usedcar") var cmdr = "딜러";
		else var cmdr = "CM";
		if(estmMode=="fince" || fincConfig[estmNow][0]['goodsKind']=="loan"){
			//if(sumMax!="0")  str += " AG+CM "+sumMax+"% 이내 ( 500만원 까지 "+sumMaxA+"%, 500만원 초과 최대 "+sumMaxB+"%)";
			//else 
			str += "  500만원까지 "+sumMaxA+"%, 500만원 초과 최대 "+sumMaxB+"%";
		}else{
			if(sumMax!="0")  str += " AG+"+cmdr+" "+sumMax+"% 이내";
			if(str && (agMax!="0" || cmMax!="0")){
				str += "(단 ";
				if(agMax!="0")  str += "AG "+agMax+"% 이내";
				if(agMax!="0" && cmMax!="0") str += ", ";
				if(cmMax!="0")  str += cmdr+" "+cmMax+"% 이내";
				str += ")";
			}else{
				if(agMax!="0")  str += "AG "+agMax+"% 이내";
				if(agMax!="0" && cmMax!="0") str += ", ";
				if(cmMax!="0")  str += cmdr+" "+cmMax+"% 이내";
			}
		}
		str += "</div>";
		str += "<div class='check'>"+cmdr+" : <input class='fee numF numZ' type='text' name='feeCmR' value=''> % <span class='price estmRslt_feeCm'>0</span></div>";
		str += "<div class='check'>AG : <input class='fee numF numZ' type='text' name='feeAgR' value=''> % <span class='price estmRslt_feeAg'>0</span></div>";
		//if(local=="imported"){
		//	str += "<div class='check'>제휴사 : <input class='fee numF numZ' type='text' name='feeDcR' value=''> % <span class='price estmRslt_feeDc'>0</span></div>";
		//}
		if(typeof(fincConfig[estmNow][fincNow[estmNow]]['feeAgAdd']!="undefined") && fincConfig[estmNow][fincNow[estmNow]]['feeAgAdd']){
			var rat = "";
			var amt = "";
			// 금융 정보
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
				var fNo = parseInt($(this).attr("fincNo"));
				if(rat){
					rat += " / ";
					amt += " / ";
				}
				if(fincConfig[estmNow][fNo]['feeAgAdd']){
					rat += fincConfig[estmNow][fNo]['feeAgAddR']+"%";
					amt += number_format(fincConfig[estmNow][fNo]['feeAgAdd']);
				}else{
					rat += "?";
					amt += "?";
				}
			});
			str += "<div class='check'>AG 추가수수료 : "+rat+" <span class='price'>"+amt+"</span></div>";
		}
		$obj.find("."+kind+"Sel").html(str);
		$obj.find("input[name='feeCmR']").val(fincConfig[estmNow][0]['feeCmR']);
		$obj.find("input[name='feeAgR']").val(fincConfig[estmNow][0]['feeAgR']);
		if(estmMode=="fince"){
			$obj.find(".estmRslt_feeAg").text(estmRslt.feeAg);
			$obj.find(".estmRslt_feeCm").text(estmRslt.feeCm);
		}else{
			$obj.find(".estmRslt_feeAg").text(number_format(estmRslt.feeAg));
			$obj.find(".estmRslt_feeCm").text(number_format(estmRslt.feeCm));
		}
		//$obj.find(".estmRslt_feeDc").text(number_format(estmRslt.feeDc));
	}else if(kind=="insure"){
		var insure = {insureAge:"운전연령",insureObj:"대물",insureCar:"자손",insureSelf:"면책금"};
		// if(fincConfig[estmNow][0]['buyType']!="1" && estmCfg.division=="P") insure['insureEmpYn']="임직원 운전자 한정운전 특약";
		for(var s in insure){
			var list = "";
			var choice = dataBank['goodsConfig'][local][s];
			str += "<div class='info'><span class='name'>"+insure[s]+"</span></div>";
			if(s=="insureEmpYn"){
				str += "<div class='check'>";
				//if(choice=="Y,N"){
					str += "<label><input type='checkbox' value='Y' name='"+s+"'><span>가입 (임직원외 운행시 보상 불가)</span></label>";
					if(fincConfig[estmNow][0]['buyType']=="2") str += "<br>※ 미가입시 비용의 50%만 인정 가능";
				//}
				str += "</div>";
			}else{
				//if(s=="insureCar") var css = "both";
				//else 
				if(Object.keys(choice).length==1) var css = "both";
				else if(Object.keys(choice).length==2) var css = "half";
				else if(Object.keys(choice).length==3) var css = "triple";
				else var css = "";
				if(typeof(dataBank['goodsConfig'][local][s+"List"])!="undefined"){
					var items = dataBank['goodsConfig'][local][s+"List"].split(",");
					for(var x in items){
						n = items[x];
						list += "<li class='"+css+"' "+s+"='"+n+"'><button>"+choice[n]+"</button></li>";
					}
				}else{
					for(var n in choice){
						list += "<li class='"+css+"' "+s+"='"+n+"'><button>"+choice[n]+"</button></li>";
					}
				}
				
				str += "<ul class='insureList' etc='"+s+"'>"+list+"</ul>\n";
			}
		}
		$obj.find("."+kind+"Sel").html(str);
		for(var s in insure){
			if(s=="insureEmpYn"){
				if(fincConfig[estmNow][0][s]=="Y"){
					$obj.find("input[name='"+s+"'][value='"+fincConfig[estmNow][0][s]+"']").prop("checked", true);
				}
			}else{
				$obj.find(".insureList li["+s+"='"+fincConfig[estmNow][0][s]+"']").addClass("on");
			}
		}
	}else if(kind=="accessory"){
		var accessory = {navigation:"내비게이션",blackBox:"블랙박스",sdrrTinting:"측후면썬팅",frtTinting:"전면썬팅"};
		for(var s in accessory){
			var list = "";
			var choice = dataBank['goodsConfig'][local][s];
			str += "<div class='info'><span class='name'>"+accessory[s]+"</span>";
			if(s=="sdrrTinting" || s=="frtTinting"){
				str += "<span class='select'><span>투과율(농도)</span> <select name='"+s+"Ratio'>";
				str += "<option value=''>선택</option>";
				var ratio = dataBank['goodsConfig'][local][s+'Ratio'];
				for(var r in ratio){
					//for(var x in ratio[r]){
						str += "<option value='"+r+"'>"+ratio[r]+"</option>";
					//}
				}
				str += "</select></span>";
			}
			str += "</div>";
			if(Object.keys(choice).length==1) var css = "both";
			else if(Object.keys(choice).length==2) var css = "half";
			else if(Object.keys(choice).length==3) var css = "triple";
			else var css = "";
			for(var n in choice){
				//for(var x in choice[n]){
					list += "<li class='"+css+"' "+s+"='"+n+"'><button>"+choice[n]+"</button></li>";
				//}
			}
			str += "<ul class='accessoryList' etc='"+s+"'>"+list+"</ul>\n";
		}

		str += "<div class='info'><span class='name'>추가용품</span></div>";
		str += "<div class='check'>품목 <input type='text' name='etcAccessorie' value=''></div>";
		str += "<div class='check'>금액 <input type='text' name='etcAccessorieCost' value='0' class='price priceL numF'></div>";
		str += "<div class='notice'>※ 품목, 금액 모두 입력해주세요.</div>"
		$obj.find("."+kind+"Sel").html(str);
		for(var s in accessory){
			/*if(s=="navigation"){
				if(fincConfig[estmNow][0][s]=="Y"){
					$obj.find("input[name='"+s+"'][value='"+fincConfig[estmNow][0][s]+"']").prop("checked", true);
				}
			}else{
			*/
			$obj.find(".accessoryList li["+s+"='"+fincConfig[estmNow][0][s]+"']").addClass("on");
			//}
		}
		if(typeof(fincConfig[estmNow][0]['sdrrTintingRatio'])!="undefined" && fincConfig[estmNow][0]['sdrrTintingRatio']){
			$obj.find(".accessorySel select[name='sdrrTintingRatio']").val(fincConfig[estmNow][0]['sdrrTintingRatio']);
		}
		if(typeof(fincConfig[estmNow][0]['frtTintingRatio'])!="undefined" && fincConfig[estmNow][0]['frtTintingRatio']){
			$obj.find(".accessorySel select[name='frtTintingRatio']").val(fincConfig[estmNow][0]['frtTintingRatio']);
		}
		if(typeof(fincConfig[estmNow][0]['etcAccessorie'])!="undefined" && fincConfig[estmNow][0]['etcAccessorie']){
			$obj.find(".accessorySel input[name='etcAccessorie']").val(fincConfig[estmNow][0]['etcAccessorie']);
		}
		if(typeof(fincConfig[estmNow][0]['etcAccessorieCost'])!="undefined" && fincConfig[estmNow][0]['etcAccessorieCost']){
			$obj.find(".accessorySel input[name='etcAccessorieCost']").val(number_format(fincConfig[estmNow][0]['etcAccessorieCost']));
		}
	}else if(kind=="modify"){
		str += "<div class='check'>품목 <input type='text' name='modify' value=''></div>";
		str += "<div class='check'>금액 <input type='text' name='modifyCost' value='0' class='price priceL numF'></div>";
		str += "<div class='notice'>※ 품목, 금액 모두 입력해주세요.</div>"
		$obj.find("."+kind+"Sel").html(str);
		if(typeof(fincConfig[estmNow][0]['modify'])!="undefined" && fincConfig[estmNow][0]['modify']){
			$obj.find(".modifySel input[name='modify']").val(fincConfig[estmNow][0]['modify']);
		}
		if(typeof(fincConfig[estmNow][0]['modifyCost'])!="undefined" && fincConfig[estmNow][0]['modifyCost']){
			$obj.find(".modifySel input[name='modifyCost']").val(number_format(fincConfig[estmNow][0]['modifyCost']));
		}
	}else if(kind=="deliveryType"){
		var choice = dataBank['goodsConfig'][local][kind];
		var list = "";
		for(var n in choice){
			//for(var x in choice[n]){
				list += "<li class='both' deliveryType='"+n+"'><button>"+choice[n]+"</button></li>";
			//}
		}
		str += "<ul class='deliveryList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".deliveryList li[deliveryType='"+fincConfig[estmNow][0]['deliveryType']+"']").addClass("on");
	}else if(kind=="deliveryShip"){
		var choice = dataBank['goodsConfig'][local][kind];
		var list = "";
		for(var n in choice){
			//for(var x in choice[n]){
				list += "<li class='half' deliveryShip='"+n+"'><button>"+choice[n]+"</button></li>";
			//}
		}
		str += "<ul class='deliveryList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".deliveryList li[deliveryShip='"+fincConfig[estmNow][0]['deliveryShip']+"']").addClass("on");
		/* 출고장 라인업에 정보 사용할 경우 
		if(typeof(dataBank['remainLineup'+code][kind])=="undefined"){
			str += "<div class='info'>출고장 정보 없음</div>\n";
		}else{
			var choice = dataBank['remainLineup'+code][kind];
			var list = "";
			for(var n in choice){
				list += "<li class='half' deliveryShip='"+n+"'><button>"+choice[n]+"</button></li>";
			}
			str += "<ul class='deliveryList'>"+list+"</ul>\n";
			$obj.find("."+kind+"Sel").html(str);
			$obj.find(".deliveryList li[deliveryShip='"+fincConfig[estmNow][0]['deliveryShip']+"']").addClass("on");
		}*/
	}else if(kind=="deliverySido"){
		var choice = dataBank['goodsConfig'][local][kind];
		var list = "";
		for(var n in choice){
			//for(var x in choice[n]){
				list += "<li class='triple' deliverySido='"+n+"'><button>"+choice[n]+"</button></li>";
			//}
		}
		str += "<ul class='deliveryList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".deliveryList li[deliverySido='"+fincConfig[estmNow][0]['deliverySido']+"']").addClass("on");
	}else if(kind=="dealerShop"){
		if(gnbPath=="usedcar") var brnd = "ucar";
		else var brnd = estmRslt.brand;
		if(typeof(dataBank['goodsConfig'][local][kind])!="undefined" && typeof(dataBank['goodsConfig'][local][kind][brnd])!="undefined"){
			var choice = dataBank['goodsConfig'][local][kind][brnd];
			var list = "";
			for(var n in choice){
				//for(var x in choice[n]){
					if(estmMode=="fince"){
						var tmp = choice[n].split(";");
						list += "<li class='both' dealerShop='"+n+"' etc='"+tmp[1]+"_"+tmp[2]+"_"+tmp[3]+"'><button>"+tmp[0]+"</button></li>";
					}else{
						list += "<li class='both' dealerShop='"+n+"' etc=''><button>"+choice[n]+"</button></li>";
					}
				//}
			}
			/*var sList = dataBank['goodsConfig'][local]['dealerShopList'][estmRslt.brand].split(",");	// 제휴사 정렬시 사용
			for(var x in sList){
				n = sList[x];
				list += "<li class='both' dealerShop='"+n+"'><button>"+choice[n]+"</button></li>";
			}*/
			if(gnbPath!="usedcar") list += "<li class='both' dealerShop='etc' etc=''><button>선택하지 않음</button></li>";
		}else{
			list = "<li class='both' dealerShop='0' yn=''><button>제휴사 없음</button></li>";
		}
		str += "<ul class='dealerList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".dealerList li[dealerShop='"+fincConfig[estmNow][0]['dealerShop']+"']").addClass("on");
	}else if(kind=="branchShop"){
		if(typeof(branchList)!="undefined"){
			var list = "";
			for(var n in branchList){
				list += "<li class='' branchShop='"+n+"'><button>"+branchList[n]['dptNm']+"</button></li>";
			}
		}else{
			list = "<li class='both' branchShop='"+defaultCfg['branchShop']+"'><button>"+defaultCfg['branchName']+"</button></li>";
		}
		str += "<ul class='branchList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".branchList li[branchShop='"+fincConfig[estmNow][0]['branchShop']+"']").addClass("on");
	}else if(kind=="carList"){
		$obj.find(".carListSel li").removeClass("on")
		$obj.find(".carListSel li[code='"+fincConfig[estmNow][0]['ucarCode']+"']").addClass("on");
	}
	
}
// 리스/렌트 상품 설정 표시
function getLoanForm(kind,code){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincCell[fincNo='"+fincNow[estmNow]+"']");
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	var str = "";
	if(kind=="endType" || kind=="month" || kind=="km"){
		// if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		/*
		 * $data['imported'][$key]['fnnLeas'] = $rtnd['Message']['imported'][$val];
                        $data['imported'][$key]['opLeas'] = $rtnd['Message']['imported'][$val];
                        if($key=="endType") $data['imported'][$key]['fnnLeasPstp'] = $rtnd['Message']['imported'][$val];
		 */
		if(estmMode=="lease"){
			if(fincConfig[estmNow][0]['goodsKind']=="lease"){
				var choice = dataBank['goodsConfig'][local][kind]['opLeas'];
			}else if(fincConfig[estmNow][0]['goodsKind']=="loan"){
				if(kind=="endType" && typeof(fincConfig[estmNow][fincNow[estmNow]]['respite'])!="undefined" && fincConfig[estmNow][fincNow[estmNow]]['respite']!="0"){
					var choice = dataBank['goodsConfig'][local][kind]['fnnLeasPstp'];
				}else{
					var choice = dataBank['goodsConfig'][local][kind]['fnnLeas'];
				}
			}
		}else{
			var choice = dataBank['goodsConfig'][local][kind];
		}
		if(kind=="endType") var css = "half";
		else if(kind=="month") var css = "triple";
		else if(kind=="km") var css = "triple";
		else var css = "";
		var list = "";
		for(var n in choice){	// 리스 4만 제외
			if(estmMode!="rent" || (fincConfig[estmNow][fincNow[estmNow]]['remainType']=="Y" && n=="50000") || (fincConfig[estmNow][fincNow[estmNow]]['remainType']=="N" && n!="00000" && n!="40000")){
				if(kind!="month" || n%12==0){
			//for(var x in choice[n]){
				list += "<li class='"+css+"' "+kind+"='"+n+"'><button>"+choice[n]+"</button></li>";
			//}
				}
			}
		}
		str += "<ul class='"+kind+"List'>"+list+"</ul>\n";
		if(0 && kind=="km" && typeof(dataBank['goodsConfig'][local]['kmPromotion'])!="undefined"){
			// 현대,기아 경차제외 전차종(주행거리 10만km 이내) 로 되어 있습니다
			if(typeof(start.fastship)!="undefined"){
				
			}else if((estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121") && estmCfg.extra.indexOf("0")<0){
				var km = fincConfig[estmNow][fincNow[estmNow]]['km'];
				var mon = fincConfig[estmNow][fincNow[estmNow]]['month'];
				if(km!="00000" && parseInt(km)*parseInt(mon)/12<=100000 ){
					str += "<div class='info'><span class='name'>주행거리 프로모션</span></div>";
					var choice = dataBank['goodsConfig'][local]['kmPromotion'];
					var list = "";
					for(var n in choice){
						//for(var x in choice[n]){
							list += "<li class='triple' kmPromotion='"+n+"'><button>"+choice[n]+"</button></li>";
						//}
					}
					str += "<ul class='kmPromotionList'>"+list+"</ul>\n";
				}
			}
		}
		$obj.find("."+kind+"Sel").html(str);
		$obj.find("."+kind+"List li["+kind+"='"+fincConfig[estmNow][fincNow[estmNow]][kind]+"']").addClass("on");
		if(typeof(fincConfig[estmNow][fincNow[estmNow]]['kmPromotion'])!="undefined") $obj.find(".kmPromotionList li[kmPromotion='"+fincConfig[estmNow][fincNow[estmNow]]['kmPromotion']+"']").addClass("on");
	}else if(kind=="monthH"){
		var css = "triple";
		var list = "";
		var limit = parseInt($obj.find(".selsub[kind='monthHSel']").attr("code"));
		limit = number_cut(limit/6/2,1,'floor');
		list += "<li class='"+css+"' "+kind+"='0'><button>없음</button></li>";
		for(i=1;i<=limit;i++){
			m = i *6;
			list += "<li class='"+css+"' "+kind+"='"+m+"'><button>"+m+"개월</button></li>";
		}
		str += "<ul class='"+kind+"List'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find("."+kind+"List li["+kind+"='"+fincConfig[estmNow][fincNow[estmNow]][kind]+"']").addClass("on");
	}else if(kind=="capital"){
		var limit = $obj.find(".selsub[kind='capitalSel']").attr("code").split(":");
		var minSel = parseInt(limit[1]);
		var maxSel = parseInt(limit[2]);
		var minR = number_cut(100-(parseInt(limit[2])/parseInt(limit[0])*100),1,'ceil');
		var maxR = number_cut(100-(parseInt(limit[1])/parseInt(limit[0])*100),1,'ceil');;
		//var list = "";
		//var optnR = "";
		var optnC = "";
		/*for(i=minR;i<=maxR;i++){
			if(i == 0){
				list += "<li "+kind+"='"+i+"'><button>없음</button></li>";
				optnR += "<option value='"+i+"'>없음</option>";
			}else{
				if((i % 5 == 0 || i == minR) && i <=50) list += "<li "+kind+"='"+i+"'><button>"+i+"%</button></li>";
				optnR += "<option value='"+i+"'>"+i+"%</option>";
			}
		}*/
		var rat = number_cut(minSel / 1000000 , 1, "ceil");;
		var step = number_cut(maxSel / 1000000 , 1, "floor");
		if(rat*1000000>minSel){
			optnC += "<option value='"+minSel+"'>"+number_format(minSel/10000)+"만원</option>";
		}
		for(i=rat;i<=step;i++){
			rat = i * 1000000;
			if(rat == 0) optnC += "<option value='"+rat+"'>없음</option>";
			else optnC += "<option value='"+rat+"'>"+number_format(rat/10000)+"만원</option>";
		}
		if(rat<maxSel){
			optnC += "<option value='"+maxSel+"'>"+number_format(maxSel/10000)+"만원</option>";
		}
		//str += "<ul class='"+kind+"List'>"+list+"</ul>\n"; <span class='name'>선수율</span> <select name='"+kind+"R'><option value='' selected>선택</option>"+optnR+"</select>
		str += "<div class='select'> <span class='name'>금액</span> <select name='"+kind+"C'><option value='' selected>선택</option>"+optnC+"</select></div>\n";
		str += "<div class='selfBox' kind='"+kind+"' max='"+maxSel+"' min='"+minSel+"'><div>";
		str += "<input type='text' class='"+kind+" numF numZ' name='"+kind+"' value='' placeholder='금액 입력'> 원 </div><input type='button' value='적용' kind='capital'></div>";	// 직접입력
		$obj.find("."+kind+"Sel").html(str);
		var val = fincConfig[estmNow][fincNow[estmNow]][kind];
		if(val==""){
			
		}else 	if(val<100){
			$obj.find("."+kind+"List li["+kind+"='"+val+"']").addClass("on");
			if($obj.find("."+kind+"List li.on").length==0){
				$obj.find("select[name='"+kind+"R']").val(val);
			}
		}else{
			if($obj.find("select[name='"+kind+"C'] option[value='"+val+"']").length) $obj.find("select[name='"+kind+"C']").val(val);
			else $obj.find("input[name='"+kind+"']").val(number_format(val));
		}
	}else if(estmMode=="fince" &&  kind=="prepay"){
		var limit = $obj.find(".selsub[kind='capitalSel']").attr("code").split(":");
		var maxSel = parseInt(limit[0]) - parseInt(limit[1]);
		var minSel = parseInt(limit[0]) - parseInt(limit[2]);
		var minR = number_cut(100-(parseInt(limit[2])/parseInt(limit[0])*100),1,'ceil');
		var maxR = number_cut(100-(parseInt(limit[1])/parseInt(limit[0])*100),1,'ceil');;
		var list = "";
		var optnR = "";
		var optnC = "";
		for(i=minR;i<=maxR;i++){
			if(i == 0){
				list += "<li "+kind+"='"+i+"'><button>없음</button></li>";
				optnR += "<option value='"+i+"'>없음</option>";
			}else{
				if((i % 5 == 0 || i == minR) && i <=50) list += "<li "+kind+"='"+i+"'><button>"+i+"%</button></li>";
				optnR += "<option value='"+i+"'>"+i+"%</option>";
			}
		}
		var rat = number_cut(minSel / 1000000 , 1, "ceil");;
		var step = number_cut(maxSel / 1000000 , 1, "floor");
		if(rat*1000000>minSel){
			optnC += "<option value='"+minSel+"'>"+number_format(minSel/10000)+"만원</option>";
		}
		for(i=rat;i<=step;i++){
			rat = i * 1000000;
			if(rat == 0) optnC += "<option value='"+rat+"'>없음</option>";
			else optnC += "<option value='"+rat+"'>"+number_format(rat/10000)+"만원</option>";
		}
		if(rat<maxSel){
			optnC += "<option value='"+maxSel+"'>"+number_format(maxSel/10000)+"만원</option>";
		}
		str += "<ul class='"+kind+"List'>"+list+"</ul>\n";
		str += "<div class='select'><span class='name'>선수율</span> <select name='"+kind+"R'><option value='' selected>선택</option>"+optnR+"</select> <span class='name'>선수금</span> <select name='"+kind+"C'><option value='' selected>선택</option>"+optnC+"</select></div>\n";
		str += "<div class='selfBox' kind='"+kind+"' max='"+maxSel+"' min='"+minSel+"'><div>";
		str += "<input type='text' class='"+kind+" numF numZ' name='"+kind+"' value='' placeholder='금액 입력'> 원 </div><input type='button' value='적용' kind='capital'></div>";	// 직접입력
		$obj.find("."+kind+"Sel").html(str);
		var val = fincConfig[estmNow][fincNow[estmNow]][kind];
		if(val==""){
			
		}else 	if(val<100){
			$obj.find("."+kind+"List li["+kind+"='"+val+"']").addClass("on");
			if($obj.find("."+kind+"List li.on").length==0){
				$obj.find("select[name='"+kind+"R']").val(val);
			}
		}else{
			if($obj.find("select[name='"+kind+"C'] option[value='"+val+"']").length) $obj.find("select[name='"+kind+"C']").val(val);
			else $obj.find("input[name='"+kind+"']").val(number_format(val));
		}
	}else if(kind=="prepay" || kind=="deposit" || kind=="respite"){
		if(kind=="deposit"){
			str += "<div class='info depositType'>";
			str += "<label><input type='radio' name='depositType' value='cash'><span>보증금액 예치</span></label>";
			str += "<label><input type='radio' name='depositType' value='stock' ><span>이행보증보험증권</span></label>";
			str += "</div>";
		}
		var limit = parseInt($obj.find(".selsub[kind='"+kind+"Sel']").attr("code"));
		if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
			var maxRate = parseInt(defaultCfg['preSumMax']);
			var sum = parseInt(defaultCfg['preSumMax']);
		}else if(estmMode=="fince"){
			var maxRate = 100-parseInt($obj.find(".selsub[kind='"+kind+"Sel']").attr("rateCut"));
			var sum = 0;
		}else{
			var maxRate = parseInt(dataBank['goodsConfig'][local][kind+'Max']);
			var sum = parseInt(dataBank['goodsConfig'][local]['preSumMax']);
		}
		var rat = parseFloat($obj.find(".selsub[kind='"+kind+"Sel']").attr("ratoDis"));
		if(maxRate+rat>sum) maxRate = sum - rat;
		var maxSel = number_cut(maxRate * limit / 100, 10000, "floor");
		var list = "";
		var optnR = "";
		var optnC = "";
		for(i=0;i<=maxRate;i++){
			if(i == 0){
				list += "<li "+kind+"='"+i+"'><button>없음</button></li>";
				optnR += "<option value='"+i+"'>없음</option>";
			}else{
				if(i % 5 == 0 || i == maxRate) list += "<li "+kind+"='"+i+"'><button>"+i+"%</button></li>";
				optnR += "<option value='"+i+"'>"+i+"%</option>";
			}
		}
		var rat = 0;
		var step = number_cut(maxSel / 1000000 , 1, "floor");
		for(i=0;i<=step;i++){
			rat = i * 1000000;
			if(rat == 0) optnC += "<option value='"+rat+"'>없음</option>";
			else optnC += "<option value='"+rat+"'>"+number_format(rat/10000)+"만원</option>";
		}
		if(rat<maxSel){
			optnC += "<option value='"+maxSel+"'>"+number_format(maxSel/10000)+"만원</option>";
		}
		str += "<ul class='"+kind+"List'>"+list+"</ul>\n";
		str += "<div class='select'><span class='name'>비율</span> <select name='"+kind+"R'><option value='' selected>선택</option>"+optnR+"</select> <span class='name'>금액</span> <select name='"+kind+"C'><option value='' selected>선택</option>"+optnC+"</select></div>\n";
		str += "<div class='selfBox' kind='"+kind+"' max='"+maxSel+"'><div>";
		str += "<input type='text' class='"+kind+" numF numZ' name='"+kind+"' value='' placeholder='금액 입력'> 원 </div><input type='button' value='적용'></div>";	// 직접입력
		$obj.find("."+kind+"Sel").html(str);
		var val = fincConfig[estmNow][fincNow[estmNow]][kind];
		if(val<100){
			$obj.find("."+kind+"List li["+kind+"='"+val+"']").addClass("on");
			if($obj.find("."+kind+"List li.on").length==0){
				$obj.find("select[name='"+kind+"R']").val(val);
			}
		}else{
			if($obj.find("select[name='"+kind+"C'] option[value='"+val+"']").length) $obj.find("select[name='"+kind+"C']").val(val);
			else $obj.find("input[name='"+kind+"']").val(number_format(val));
		}
		if(kind=="deposit"){
			$obj.find("input[name='depositType'][value='"+fincConfig[estmNow][fincNow[estmNow]]['depositType']+"']").prop("checked", true);
		}
	}else if(kind=="remain"){
		var max = parseInt($obj.find(".selsub[kind='"+kind+"Sel']").attr("code"));
		var cutMax = parseInt($obj.find(".selsub[kind='"+kind+"Sel']").attr("cutMax"));
		var cutMin = parseInt($obj.find(".selsub[kind='"+kind+"Sel']").attr("cutMin"));
		var minArr = extractValue(defaultCfg['remainMin'],',',':');
		var min = parseInt(minArr[fincConfig[estmNow][fincNow[estmNow]]['month']]);
		var list = "<li "+kind+"='100' class='both'><button>최대 ("+max+"%)</button></li>";
		var optnR = "<option value='100'>최대</option>";
		for(i=max-1;i>=min;i--){
			if(max-i<=20) list += "<li "+kind+"='"+i+"' class='fifth'><button>"+i+"%</button></li>";
			optnR += "<option value='"+i+"'>"+i+"%</option>";
		}
		str += "<ul class='"+kind+"List'>"+list+"</ul>\n";
		str += "<div class='select'><span class='name'>비율</span> <select name='"+kind+"R'><option value='' selected>선택</option>"+optnR+"</select>";
		// if(estmMode=="rent") str += " <span class='right'><label><input type='checkbox' name='remainType' value='Y' ><span>할부형(잔가 9,900)</span></label></span>";
		str += "</div>\n";
		str += "<div class='selfBox' kind='"+kind+"' max='"+cutMax+"' min='"+cutMin+"'><div>";
		str += "<input type='text' class='"+kind+" numF numZ' name='"+kind+"' value='' placeholder='금액 입력'> 원 </div><input type='button' value='적용'></div>";	// 직접입력
		$obj.find("."+kind+"Sel").html(str);
		var val = fincConfig[estmNow][fincNow[estmNow]][kind];
		$obj.find("."+kind+"List li["+kind+"='"+val+"']").addClass("on");
		if($obj.find("."+kind+"List li.on").length==0){
			if(val<100) $obj.find("select[name='"+kind+"R']").val(val);
			else $obj.find("input[name='"+kind+"']").val(number_format(val));
		}
		if(fincConfig[estmNow][fincNow[estmNow]]['remainType']=="Y"){
			$obj.find("input[name='remainType']").prop("checked",true);
			$obj.find("."+kind+"List li").removeClass("on");
		}
	}else if(kind=="careType"){
		var choice = dataBank['goodsConfig'][local][kind];
		var list = "";
		for(var n in choice){
			if(n=="01" || n=="05"){
			//for(var x in choice[n]){
				list += "<li class='both' careType='"+n+"'><button>"+choice[n];
				if(typeof(careDesc[choice[n]])!="undefined") list += "<span class='desc'>"+careDesc[choice[n]]+"</span>";
				list += "</button></li>";
			//}
			}
		}
		str += "<ul class='careList'>"+list+"</ul>\n";
		$obj.find("."+kind+"Sel").html(str);
		$obj.find(".careList li[careType='"+fincConfig[estmNow][fincNow[estmNow]]['careType']+"']").addClass("on");
	}
}
//견적 설정 
function getConfigForm(){
	var str = "<form id='formEstmConfig' action='/api/config/estimate' method='POST' enctype='multipart/form-data'>\n";
	str += "<div class='editBox'>";
	str += "<dl>";
	for(i=1;i<=3;i++){
		str += "<dt>견적 "+i+"</dt><dd>";
		str += "기간 <select name='month"+i+"'><option value='36'>36개월</option><option value='48'>48개월</option><option value='60'>60개월</option></select> ";
		str += "선납금 <select name='prepay"+i+"'><option value='0'>0%</option><option value='10'>10%</option><option value='20'>20%</option><option value='30'>30%</option></select> ";
		str += "보증금 <select name='deposit"+i+"'><option value='0'>0%</option><option value='10'>10%</option><option value='20'>20%</option><option value='30'>30%</option></select> ";
		str += "</dd>";
	}
	str += "<dt>약정거리</dt><dd>";
	str += "<label><input type='radio' name='km' value='20000'><span>2만km/년</span></label><label><input type='radio' name='km' value='30000'><span>3만km/년</span></label>";
	str += "</dd>";
	str += "<dt>수수료율</dt><dd class='rate'>";
		str += "CM <input type='text' name='feeCmR' value=''>%, AG <input type='text' name='feeAgR' value=''>%";
	str += "</dd>";
	if(typeof(branchList)!="undefined"){
		str += "<dt>취급지점</dt><dd class=''><select name='branch'>";
		for(var n in branchList){
			str += "<option value='"+n+"'>"+branchList[n]['dptNm']+"</option>";
		}
		str += "</select></dd>";
	}
	str += "<dt>표시제한</dt><dd>";
	str += "<div><label><input type='checkbox' name='feeView' value='N'><span>수수료액 화면표시하지 않음</span></label><br>※ 수수료가 기타로 표시되며, 클릭하여 수정할 수 있습니다.</div>";
	str += "<div><label><input type='checkbox' name='cardView' value='X'><span>연락처 표시하지 않고 숨김</span></label><br>※ 견적서 상단에서 선택하실 수 있습니다.</div>";
	str += "</dd>";
	str += "</dl>";
	str += "<div class='buttonBox'><button>저장하기</button></div>";
	$("#framePopup .content").html(str);
	// 설정 초기화
	for(i=1;i<=3;i++){
		$("#formEstmConfig select[name='month"+i+"']").val(defaultCfg['month'+i]);
		$("#formEstmConfig select[name='prepay"+i+"']").val(defaultCfg['prepay'+i]);
		$("#formEstmConfig select[name='deposit"+i+"']").val(defaultCfg['deposit'+i]);
	}
	$("#formEstmConfig input[name='km'][value='"+defaultCfg['km']+"']").prop('checked',true);
	$("#formEstmConfig input[name='feeCmR']").val(defaultCfg['feeCmR']);
	$("#formEstmConfig input[name='feeAgR']").val(defaultCfg['feeAgR']);
	$("#formEstmConfig select[name='branch']").val(defaultCfg['branchShop']);
	$("#formEstmConfig input[name='feeView'][value='"+defaultCfg['feeView']+"']").prop('checked',true);
	$("#formEstmConfig input[name='cardView'][value='"+defaultCfg['cardView']+"']").prop('checked',true);
	$("#framePopup h3").text("견적 기본설정");
	
    openPopupView(600,'framePopup');
}
function estmCfgReturn(){
	for(i=1;i<=3;i++){
		defaultCfg['month'+i] = $("#formEstmConfig select[name='month"+i+"']").val();
		defaultCfg['prepay'+i] = $("#formEstmConfig select[name='prepay"+i+"']").val();
		defaultCfg['deposit'+i] = $("#formEstmConfig select[name='deposit"+i+"']").val();
	}
	defaultCfg['km'] = $("#formEstmConfig input[name='km']:checked").val();
	defaultCfg['feeCmR']= $("#formEstmConfig input[name='feeCmR']").val();
	defaultCfg['feeAgR'] = $("#formEstmConfig input[name='feeAgR']").val();
	if($("#formEstmConfig input[name='feeView']").prop("checked")==true) defaultCfg['feeView'] = "N";
	else defaultCfg['feeView'] = "Y";
	$('.layerPopup').fadeOut();
}

function addFastshipInput(kind,sNo,cnt){
	if(cnt=="" || cnt==0){
		
	}else{
		var $obj = $("#fastshipData li[sNo='"+sNo+"'] .contract");
		var str = "";
		for(i=0;i<cnt;i++){
			str += "<li><input type='text' name='num' value='' placeholder='계약번호'>";
			if(kind=="02"){
				str += " <input type='text' name='vin' value='' placeholder='차대번호(계약번호)' readonly>";
			}else{
				str += " <input type='text' name='vin' value='' placeholder='차대번호'>";
			}
			str += " <input type='text' name='day' class='datepicker dateForm' value='' placeholder='출고예정일'></li>";
		}
		str += "<li class='btn'><button class='round addBatchList'>일괄입력</button></li>";
		$obj.html(str);
	}
	$(".ui-datepicker-trigger").remove();
	$(".datepicker").removeClass('hasDatepicker').datepicker({
		showOtherMonths: true,
      	selectOtherMonths: true,
      	showButtonPanel: true,
      	showMonthAfterYear:true,
        currentText: '오늘 날짜',
        closeText: '닫기',
        dateFormat: "yy-mm-dd",
        dayNames: [ '일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], 
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    });
}
function alertFashship(){
	alertPopup("선구매•즉시출고는 지정된 선택에 대해서만 유효합니다. 선택을 변경하실 수 없으며, 다른 사양을 원하시면 선구매•즉시출고 화면에서 다시 확인하고 선택해 주셔야 합니다.<br><br><a href='/newcar/fastship/"+estmRslt.model+"'>선구매•즉시출고 이동</a> &nbsp; <a href='/newcar/estimate/rent'>새 견적 시작</a>");
}
function alertTestride(){
	alertPopup("시승차 견적은 차량 번호로 조회하여 선택하실 수 있습니다.");
}
function alertRentTake(){
	alertPopup("차종/옵션에 따라 추가 탁송료가 발생될 수 있습니다. <br><br>추가 탁송료 발생시 담당자 별도 회신 예정입니다.");
}
function alertUcarStart(){
	alertPopup("차량을 검색하여 선택하신 후 판매가격을 입력해주세요.");
}



$(function () {
	
	// 목록 펼치기
	$(document).on("click", ".selbar > button, .selsub > button, .seltop > button:not(.star)", function () {
		var $obj = $(this).parent();
		var code = $(this).parent().attr("code");
		if(code=="not") return false;
		// 아래 탁송료 임시
		var kind = $obj.attr("kind");
		if(gnbPath=="usedcar" && kind!="regYMSel" && kind!="carListSel" && (typeof(estmRslt.ucarPrice)=="undefined" || estmRslt.ucarPrice==0)){
			alertUcarStart();
			return false;
		}else if(estmMode=="rent" && defaultCfg['takeType']==20 && (kind=="brand" || kind=="model" || kind=="lineup" || kind=="trim" || kind=="colorExt" || kind=="colorInt")){
			alertFashship();
			return false;
		}else if(estmMode=="lease" && $("#btnCarnumSearch").length){
			if(typeof(estmCode['trim'])=="undefined" || kind=="brand" || kind=="model" || kind=="lineup" || kind=="trim" || kind=="colorExt" || kind=="colorInt"){
				alertTestride();
				return false;
			}
		}
		if(kind=="deliveryMSel"){
			if($(".comnCell .transBD").css("display")=="block") $(".comnCell .transBD").css("display","none");
			else $(".comnCell .transBD").css("display","block");
			return false;
		}
		if($obj.find(".list").css("display")!="block"){
			var kind = $obj.attr("kind");
			if(kind=="brand"){
				var brand = $obj.attr("code");
				var $objB = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .brandSel");
				if($objB.html()==""){
					$objB.html(getBrandList("estm"));
					if(brand) $objB.find("li[brand='"+brand+"']").addClass("on");
					// 브랜드 없으면 지역 삭제(off)
					$objB.find(".brandList").each(function (){
						if($(this).find("li").length==0){
							$(this).parent().addClass("off");
						}
					});
				}
			}else if(kind=="model"){
				var model = $obj.attr("code");
				var brand = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='brand']").attr("code");
				if(brand==""){
					alert("브랜드를 먼저 선택해 주세요.");
					return false;
				}
				var $objM = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .modelSel");
				if($objM.html()=="" || brand!=$objM.attr("brand")){
					$objM.html(getModelList(brand,"estm"));
					$objM.attr("brand",brand);
					if(model) $objM.find("li[model='"+model+"']").addClass("on");
				}
			}else if(kind=="lineup"){
				var lineup = $obj.attr("code");
				var model = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='model']").attr("code");
				if(model==""){
					alert("모델을 먼저 선택해 주세요.");
					return false;
				}
				var $objL = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .lineupSel");
				if($objL.html()=="" || model!=$objL.attr("model")){
					$objL.html(getLineupList(model));
					$objL.attr("model",model);
					if(lineup) $objL.find("li[lineup='"+lineup+"']").addClass("on");
				}
			}else if(kind=="trim"){
				var trim = $obj.attr("code");
				var lineup = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='lineup']").attr("code");
				var model = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='model']").attr("code");
				if(lineup==""){
					alert("라인업을 먼저 선택해 주세요.");
					return false;
				}
				var $objT = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .trimSel");
				if($objT.html()=="" || lineup!=$objT.attr("lineup")){
					$objT.html(getTrimList(model, lineup));
					$objT.attr("lineup",lineup);
					if(trim) $objT.find("li[trim='"+trim+"']").addClass("on");
				}
			}else if(kind=="colorExt" || kind=="colorInt"){
				var trim = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='trim']").attr("code");
				if(trim==""){
					alert("트림을 먼저 선택해 주세요.");
					return false;
				}
				disabledContent(kind);
			}else if(kind=="takeSidoSel"){
				if(typeof(estmCode.trim)=="undefined") return false;
			}else if(kind=="insureSel" || kind=="accessorySel" || kind=="modifySel" || kind=="incentiveSel" || kind=="deliveryTypeSel" || kind=="deliveryShipSel" || kind=="deliverySidoSel" || kind=="dealerShopSel" || kind=="branchShopSel"){
				if(typeof(estmCode.trim)=="undefined") return false;
				kind = kind.replace("Sel","");
				if(kind=="deliveryShip"){
					var lineup = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='lineup']").attr("code");
					getComnForm(kind,lineup);
				}
				else getComnForm(kind,"");
			}else if(kind=="mode"){
				var trim = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='trim']").attr("code");
				var mode = $obj.attr("code");
				if(trim==""){
					alert("트림을 먼저 선택해 주세요.");
					return false;
				}else{
					var brand = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='brand']").attr("code");
					var $objM = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .modeSel");
					$objM.html(getModeList(brand));
					if(mode) $objM.find("li[mode='"+mode+"']").addClass("on");
				}
			}else if(kind=="careTypeSel" || kind=="endTypeSel" || kind=="monthSel" || kind=="monthHSel" || kind=="kmSel" || kind=="prepaySel" || kind=="depositSel" || kind=="respiteSel" || kind=="remainSel" || kind=="capitalSel"  || kind=="rateSel" || kind=="backSel" || kind=="giftSel" || kind=="endSel"){
				if(typeof(estmCode.trim)=="undefined") return false;
				fincNow[estmNow] = parseInt($(this).closest(".fincCell").attr("fincNo"));
				var goods = fincConfig[estmNow][fincNow[estmNow]]['goods'];
				kind = kind.replace("Sel","");
				//if(goods[0]=="FS") getFinceForm(kind,goods[1]);
				getLoanForm(kind,goods);
			}else if(kind=="carListSel"){
				kind = kind.replace("Sel","");
				getComnForm(kind,"");
			}
			// useNot 선택 취소 옵션 삽입
			if($obj.hasClass("useNot")){
				var $objU = $obj.find(".list ul");
				if($objU.find("li.on").length && $objU.find("li.selNot").length==0){
					$objU.prepend("<li class='selNot'><button>선택 취소</button></li>");
				}
			}
			$(".selbar .list").css("display","none");
			$(".selbar").removeClass("open");
			$(".selsub .list").css("display","none");
			$(".selsub").removeClass("open");
			$(this).parent().addClass("open");
			$obj.find(".list").slideDown("fast");
			
		}else{
			$(this).parent().removeClass("open");
			$obj.find(".list").css("display","none");
			//$obj.find(".list").slideUp("fast");
		}
		// 스크롤 이동
		if($(window).width()<=760 && !$(this).parent().hasClass("fincView")){		// 2단 840/760, 1단 670/600
			var top = $(this).offset().top;
			if(deviceType=="app") top -= 60;
			$("html, body").animate({
	    		scrollTop: top
	    	}, 500);
		}
		return false;
	});
	$(document).on("click", ".selbar .list > button, .selsub .list > button, .seltop .list > button", function () {
		$(this).parent().prev().click();
		return false;
	});
	$(document).on("click", ".selbar .list li button, .selsub .list li button, .seltop .list li button", function () {
		/*
		var $obj = $(this).closest(".list");
		$obj.parent().removeClass("open");
		$obj.css("display","none");
		return false;
		*/
	});
	// 옵션/할인 업다운 조절
	$(document).on("click", ".unitA button.updown", function () {
		var $obj = $(this).parent().next();
		if(deviceSize=="mobile"){
			if($(this).hasClass("open")){
				$(this).removeClass("open");
				$obj.removeClass("open");
			}else{
				$(this).addClass("open");
				$obj.addClass("open");
			}
		}else{
			if($(this).hasClass("open")){
				var height = 275;
				$(this).removeClass("open");
				$obj.removeClass("open");
				$obj.find(".cont").css("height",height+"px");
			}else{
				var height = $obj.find("ul").height()+40;
				if(height>275){
					$(this).addClass("open");
					$obj.addClass("open");
					$obj.find(".cont").animate({
						"height": height+"px"
					},100);
				}
			}
		}
	});
	$(document).on("click", ".unitA button.slideup", function () {
		var $obj = $(this).parent().parent();
		if(deviceSize=="mobile"){
			$(this).parent().parent().parent().find("button.updown").removeClass("open");
			$obj.removeClass("open");
		}else{
			var height = 275;
			$(this).parent().parent().parent().find("button.updown").removeClass("open");
			$obj.removeClass("open");
			$obj.find(".cont").animate({
				"height": height+"px"
			},100);
		}
		
	});
	
	
	
	// 견적 브랜드 선택
	$(document).on("click", ".brandSel button", function () {
		if($(this).parent().hasClass("not")){
			alert("취급불가 차종입니다. 영업점에 문의 바랍니다.");
			return false;
		}else if(!$(this).parent().hasClass("on")){
			arrangeEstmData('brand',$(this).parent().attr("brand"));
		}
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='model'] > button").click();
	});
	// 견적 모델 선택
	$(document).on("click", ".modelSel button", function () {
		if($(this).parent().hasClass("not")){
			alert("취급불가 차종입니다. 영업점에 문의 바랍니다.");
			return false;
		}else if(parseInt($("#cntSet").val()) && parseInt($("#cntSet").val())<=parseInt($("#cntUse").val()) && estmCountModel.indexOf($(this).parent().attr("model"))<0){
			alertPopup("이용한도가 소진되었습니다. 문의 바랍니다.");
			return false;
		}else{
			if(!$(this).parent().hasClass("on")){
				arrangeEstmData('model',$(this).parent().attr("model"));
			}
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='lineup'] > button").click();
		}
	});
	// 견적 라인업 선택
	$(document).on("click", ".lineupSel button", function () {
		if($(this).parent().hasClass("not")){
			alert("취급불가 차종입니다. 영업점에 문의 바랍니다.");
			return false;
		}else if(!$(this).parent().hasClass("on")){
			arrangeEstmData('lineup',$(this).parent().attr("lineup"));
		}
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='trim'] > button").click();
	});
	// 견적 트림 선택
	$(document).on("click", ".trimSel button", function () {
		if($(this).parent().hasClass("not")){
			alert("취급불가 차종입니다. 영업점에 문의 바랍니다.");
			return false;
		}else if(!$(this).parent().hasClass("on")){
			arrangeEstmData('trim',$(this).parent().attr("trim"));
		}
		if(estmMode=="rent"){
			if(typeof(estmConfig[estmNow]['colorExt'])=="undefined" || estmConfig[estmNow]['colorExt']=="") $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorExt'] > button").click();
		}
	});
	// 견적 외장 선택
	$(document).on("click", ".colorExtSel button", function () {
		if($(this).parent().hasClass("dis")){
			disabledMessage('colorExt',$(this).parent().attr("colorExt"),$(this).parent().attr("dis"));
			return false;
		}
		if(!$(this).parent().hasClass("on")){
			var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorExtSel");
			//var code = $(this).parent().attr("colorExt");
			$obj.find("li.on").removeClass("on");
			if($(this).parent().hasClass("selNot")) $(this).parent().remove();
			else $(this).parent().addClass("on");
			estmChangeKind = "colorExt";
			//changedColorExt(code);
			getColorExtCode();
			disabledContent("option");
			calculator();
		}
		if(estmMode=="rent"){
			if(typeof(estmConfig[estmNow]['colorInt'])=="undefined" || estmConfig[estmNow]['colorInt']=="") $("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorInt'] > button").click();
		}
	});
	// 견적 내장 선택
	$(document).on("click", ".colorIntSel button", function () {
		if($(this).parent().hasClass("dis")){
			disabledMessage('colorInt',$(this).parent().attr("colorInt"),$(this).parent().attr("dis"));
			return false;
		}
		if(!$(this).parent().hasClass("on")){
			var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorIntSel");
			//var code = $(this).parent().attr("colorInt");
			$obj.find("li.on").removeClass("on");
			if($(this).parent().hasClass("selNot")) $(this).parent().remove();
			else $(this).parent().addClass("on");
			estmChangeKind = "colorInt";
			//changedColorInt(code);
			getColorIntCode( );
			disabledContent("option");
			calculator();
		}
		if(deviceSize=="mobile" && estmRslt.brand<200 && (typeof(estmConfig[estmNow]['option'])=="undefined" || estmConfig[estmNow]['option']=="")){
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .unitA.option .top > button").click();
		}
	});
	// 견적 옵션 선택
	$(document).on("click", ".optionSel li button", function () {
		if(estmMode=="rent" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
		var option = $(this).parent().attr("option");
		var apply = $(this).parent().attr("apply");
		var extNot = $(this).parent().attr("extNot");
		var extJoin = $(this).parent().attr("extJoin");
		var intNot = $(this).parent().attr("intNot");
		var intJoin = $(this).parent().attr("intJoin");
		var colorExt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorExt']").attr("code");
		var colorInt = $("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorInt']").attr("code");
		var nameSel = $(this).find(".name").text().replace(" ?","");
		var msg = "";
		var $objO = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel");
		if($(this).parent().hasClass("dis")){
			disabledMessage('option',$(this).parent().attr("option"),$(this).parent().attr("dis"));
			return false;
		}
		if($(this).parent().hasClass("on")) {	// 선택 해제
			if (apply.indexOf("*") == 0) {
				msg += " 필수로 선택해야 하는 항목입니다.";
				alertPopup(msg);
				return false;
			}
			$(this).parent().removeClass("on");
			// 배타 있는 경우 의존 확인
			var comp = apply.replace(/[^A-Z]/g,"");
			if(comp){
				var name = "";
				for(ot = 0; ot < comp.length; ot ++){
					os = comp.substring(ot,ot+1);
					if($objO.find("li.on[apply*='"+os.toLowerCase()+"']").length && !$objO.find("li.on[apply*='"+os+"']").length){
						$objO.find("li.on[apply*='"+os.toLowerCase()+"']").each(function() {
							var sub = $(this).attr("apply").replace(/[^a-z]/g,"");
							sub = sub.replace(os.toLowerCase(),"");
							var subOn = false;
							if(sub){
								for(ov = 0; ov < sub.length; ov ++){
									ou = sub.substring(ov,ov+1);
									if($objO.find("li.on[apply*='"+ou.toUpperCase()+"']").length) subOn = true;
								}
							}
							if(!subOn){
								if(name)  name+="이나  ";
								name += "【"+$(this).find(".name").text()+"】";
								$(this).removeClass("on");
							}
						});
					}
				}
				if(name){
					msg += name+" 옵션은  【"+nameSel+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
				}
			}
			// 외장 연결
			if(colorExt && extJoin && extJoin.indexOf(colorExt)>=0){
				if(msg) msg += "<br>";
				msg +="【"+$("#estmBody .estmCell[estmNo='" + estmNow + "'] .estmRslt_colorExt span.name").text()+"】 외장색상은  【"+nameSel+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorExt']").attr("code","");
				estmConfig[estmNow]['colorExt'] = "";
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorExtSel li").removeClass("on");
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorExtSel li.selNot").remove();
			}
			// 내장 연결
			if(colorInt && intJoin && intJoin.indexOf(colorInt)>=0){
				if(msg) msg += "<br>";
				msg +="【"+$("#estmBody .estmCell[estmNo='" + estmNow + "'] .estmRslt_colorInt span.name").text()+"】 내장색상은  【"+nameSel+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .selbar[kind='colorInt']").attr("code","");
				estmConfig[estmNow]['colorInt'] = "";
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorIntSel li").removeClass("on");
				$("#estmBody .estmCell[estmNo='" + estmNow + "'] .colorIntSel li.selNot").remove();
			}
		}else{
			$(this).parent().addClass("on");
		}
		if(msg) alertPopup(msg);
		estmChangeKind = "option";
		getOptionCode();
		disabledContent("option");
		calculator();
	});
	// 견적 할인 선택
	$(document).on("click", ".discountSel li button", function () {
		if(typeof(estmCode.trim)=="undefined") return false;	
		if(estmMode=="rent" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
		var discount = $(this).parent().parent().parent().attr("discount");
		var name = $(this).parent().parent().parent().find(".name").text();
		if($(this).parent().hasClass("on") && eventCheck != "input"){
			$(this).parent().removeClass("on");
			$(this).parent().parent().parent().removeClass("on");
		}else{
			$(this).parent().parent().find("li").removeClass("on");
			$(this).parent().addClass("on");
			$(this).parent().parent().parent().addClass("on");
		}
		eventCheck = "";
		getDiscountCode();
		calculator();
	});
	$(document).on("focus", ".discountSel input[type='text']", function () {
		if(typeof(estmCode.trim)=="undefined") return false;	
		if(estmMode=="rent" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
		eventCheck = "input";
	});
	$(document).on("blur", ".discountSel input[type='text']", function () {
		if(typeof(estmCode.trim)=="undefined"){
			$(this).val(0);
			return false;	
		}
		if(estmMode=="rent" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
		var data = number_filter($(this).val());
		if(($(this).attr("name")=="discountR" && data>50) || ($(this).attr("name")=="discountP" && data<100)){
			alertPopup("입력하신 금액이 잘못되었습니다. 다시 확인해주세요.");
			$(this).val(0);
		}
		eventCheck = "input";
		getDiscountCode();
		calculator();
	});
	// 견적 할인 선택
	$(document).on("click", ".discountSel input[type='checkbox']", function () {
		if(typeof(estmCode.trim)=="undefined") return false;	
		getDiscountCode();
		calculator();
	});
	// 출고/구입 선택 (라디오 버튼)
	$(document).on("click", ".boxA input[type='radio']", function () {
		var ckd = $(this).val();
		var kind = $(this).attr("name");
		if(gnbPath=="usedcar"){
			fincConfig[estmNow][0][kind] = ckd;
			if(kind=="certifyYN"){
				var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
				fincConfig[estmNow][0]['ucarCode'] = "";
				fincConfig[estmNow][0]['ucarCodeB'] = "";
				fincConfig[estmNow][0]['ucarName'] = "";
				fincConfig[estmNow][0]['ucarNameB'] = "";
				$obj.find(".selsub[kind='carListSel']").attr("code","not");
				$obj.find(".carListSel").html("");
				estmChangeKind = kind;
				calculatorU();
			}else if(typeof(estmRslt.ucarPrice)!="undefined" && estmRslt.ucarPrice){
				estmChangeKind = kind;
				// 인증 여부 선택시
				calculatorU();
			}else{
				 return false;	
			}
		}else{
			if(typeof(estmCode.trim)=="undefined") return false;	
			var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
			var ckd = $(this).val();
			var kind = $(this).attr("name");
			if(estmMode=="rent" && defaultCfg['takeType']==20 && kind=="takeType"){
				alertFashship();
				return false;
			}else if(estmMode=="rent" && $(this).val()=="20"){
				alertRentTake();
			}
			$obj.find("input[name='"+kind+"']:not([value='"+ckd+"'])").prop("checked",false);
			fincConfig[estmNow][0][kind] = ckd;
			estmChangeKind = kind;
			calculator();
		}
	});
	// 등록 지역 선택
	$(document).on("click", ".takeSidoSel button", function () {
		if(typeof(estmCode.trim)=="undefined") return false;	
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		$obj.find(".takeSidoSel li.on").removeClass("on");
		$(this).parent().addClass("on");
		fincConfig[estmNow][0]['takeSido'] = $(this).parent().attr("takeSido");
		if($(this).parent().attr("takeSido")=="SU"){
			$obj.find(".bond7yr").removeClass("off");
			$obj.find(".bond5yr").addClass("off");
		}else{
			$obj.find(".bond7yr").addClass("off");
			$obj.find(".bond5yr").removeClass("off");
		}
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	// 견적 채권 할인율 변경
	$(document).on("blur", ".bondType input[type='text']", function () {
		if(typeof(estmCode.trim)=="undefined") return false;
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		if($obj.find("input[name='bondcut7']").val()=="") $obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		if($obj.find("input[name='bondcut5']").val()=="") $obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		//if(gnbPath=="usedcar") calculatorU();
		//else calculator();
	});
	// 부대비용 값 변경
	$(document).on("blur", "input[name='takeExtra'], input[name='bondCut'],  input[name='takeSelf']", function () {
		if(typeof(estmCode.trim)=="undefined") return false;
		var nam = $(this).attr("name");
		if($(this).val()=="") $(this).val(defaultCfg[nam]);
		fincConfig[estmNow][0][nam] = number_filter($(this).val()); 
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	
	// 공통조건 설정 변경
	$(document).on("click", ".comnCell ul li button", function () {
		var kind = $(this).closest(".selsub").attr("kind").replace("Sel","");
		if(kind=="insure" || kind=="accessory" || kind=="regYM"){
			var etc = $(this).closest("ul").attr("etc");
			getComnConfig(kind,$(this).parent().attr(etc),etc);
			if(etc=="regM"){
				$(this).parent().parent().parent().prev().click();	// 월이면 닫기
			}
		}else if(kind=="dealerShop" && estmMode=="fince"){
			getComnConfig(kind,$(this).parent().attr(kind),$(this).parent().attr('etc'));
		}else if(kind=="carList"){
			getComnConfig(kind,$(this).parent().attr("code")+"_"+$(this).parent().attr("codeB"),$(this).parent().attr("name")+"_"+$(this).parent().attr("nameB"));
		}else{
			var etc = "";
			getComnConfig(kind,$(this).parent().attr(kind),etc);
		}
		estmChangeKind = kind;
		if(kind=="branchShop"){
			estmChangeKind = "branchShop";
			output();
		}else{
			if(gnbPath=="usedcar") calculatorU();
			else calculator();
		}
		if(kind=="insure" || kind=="accessory"){
			getComnForm(kind,"");
		}else if(kind=="regYM"){
			getComnForm(etc,"");
		}
	});
	// 공통조건 설정 변경
	$(document).on("click", ".comnCell input[type='checkbox']", function () {
		var name = $(this).attr("name");
		if(name=="regTaxIn" || name=="regBondIn" || name=="regExtrIn" || name=="deliveryIn"){
			if($(this).prop("checked")) var data = $(this).val();
			else var data = "02";
			getComnConfig(name,data,'');
			estmChangeKind = name;
		}else if(name=="regFree"){
			if($(this).prop("checked")){
				var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
				$obj.find("input[name='regFree']").prop("checked",false);
				$(this).prop("checked",true);
				var data = $(this).val();
			}else{
				var data = "N";
			}
			getComnConfig(name,data,'');
			estmChangeKind = name;
		}else if(name=="useBiz"){
			if($(this).prop("checked")) var data = $(this).val();
			else var data = "N";
			getComnConfig(name,data,'');
			estmChangeKind = name;
		}else if(name=="insureEmpYn"){
			var data = $(this).val();
			getComnConfig(name,data,'');
			estmChangeKind = "insure";
		}else{
			var kind = $(this).closest(".selsub").attr("kind").replace("Sel","");
			if(kind=="insure" || kind=="accessory"){
				var etc = $(this).attr("name");
				if($(this).prop("checked")) var data = $(this).val();
				else var data = "N";
				getComnConfig(kind,data,etc);
			}else{
				var etc = "";
				getComnConfig(kind,$(this).parent().attr(kind),etc);
			}
			if(kind=="insure" || kind=="accessory"){
				getComnForm(kind,"");
			}
			estmChangeKind = kind;
		}
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	// 공통조건 설정 변경
	$(document).on("change", ".comnCell select", function () {
		var etc = $(this).attr("name");
		if(etc=="sdrrTintingRatio" || etc=="frtTintingRatio"){
			var kind = "accessory";
			var data = $(this).val();
			getComnConfig(kind,data,etc);
		}
		estmChangeKind = kind;
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
		if(etc=="sdrrTintingRatio" || etc=="frtTintingRatio"){
			getComnForm(kind,"");
		}
	});
	$(document).on("click", "input[name='deliveryMaker']", function () {
		if(estmMode=="rent" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
	});
	$(document).on("click", "input[name='ucarPrice']", function () {
		if(typeof(fincConfig[estmNow][0]['ucarCode'])=="undefined" || fincConfig[estmNow][0]['ucarCode']==""){
			alertPopup("차량을 검색하여 선택하신 후 가격을 입력해주세요.");
			return false;
		}
	});
	// 공통조건 설정 변경
	$(document).on("blur", ".comnCell input[type='text'], input[name='deliveryMaker']", function () {
		if(estmMode=="rent" && $(this).attr("name")=="deliveryMaker" && defaultCfg['takeType']==20){
			alertFashship();
			return false;
		}
		var etc = $(this).attr("name");
		if(etc=="carName"){
			return false;
		}else if(etc=="ucarPrice"){
			estmCode = {};
			var kind = etc;
			var data = number_filter($(this).val());
			if(typeof(fincConfig[estmNow][0]['ucarCode'])=="undefined" || fincConfig[estmNow][0]['ucarCode']==""){
				return false;
			}
			if(data < 1000000){
				alertPopup("<span class='desc'>판매가격을 원 단위로 입력해주세요.</span> <br> 금액을 다시 확인하여 주시기 바랍니다.");
				return false;
			}else{
	    		estmCode['trim'] = data;
				getComnConfig(kind,data,"");
			}
		}else 	if(etc=="etcAccessorie" || etc=="etcAccessorieCost"){
			var kind = "accessory";
			if(etc=="etcAccessorieCost"){
				var data = number_filter($(this).val());
				if(data > 500000){
					alertPopup("<span class='desc'>입력하신 금액이 너무 많습니다.</span> <br> 금액을 다시 확인하여 주시기 바랍니다.");
					$(this).val(0);
					return false;
				}
			}
			else var data = $(this).val();
			getComnConfig(kind,data,etc);
			estmChangeKind = kind;
		}else if(etc=="modify" || etc=="modifyCost"){
			var kind = "modify";
			if(etc=="modifyCost"){
				var data = number_filter($(this).val());
				if(data > 3000000){
					alertPopup("<span class='desc'>입력하신 금액이 너무 많습니다.</span> <br> 금액을 다시 확인하여 주시기 바랍니다.");
					$(this).val(0);
					return false;
				}
			}
			else var data = $(this).val();
			getComnConfig(kind,data,etc);
			estmChangeKind = kind;
		}else if(etc=="feeCmR" || etc=="feeAgR"){
			var data = parseFloat(number_filter($(this).val()));
			if(data<0){
				alertPopup("수수료 입력값 오류");
				$(this).val(0);
				return false;
			}
			if(estmRslt.brand<200) var local = "domestic";
			else var local = "imported";
			/*
			if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				var agMax = parseFloat(defaultCfg['agFeeMax']);
				var cmMax = parseFloat(defaultCfg['cmFeeMax']);
				var sumMax = parseFloat(defaultCfg['sumMax']);
				if(typeof(fincConfig[estmNow][0]['feeDsR'])!="undefined") sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
			}else{
				var agMax = parseFloat(dataBank['goodsConfig'][local]['agFeeMax']);
				var cmMax = parseFloat(dataBank['goodsConfig'][local]['cmFeeMax']);
				var sumMax = parseFloat(dataBank['goodsConfig'][local]['agcmFeeMax']);
			}
			*/
			if(estmMode=="fince" ||  fincConfig[estmNow][0]['goodsKind']=="loan"){
				var agMax = parseFloat(defaultCfg['agFeeMax']);
				var cmMax = parseFloat(defaultCfg['cmFeeMax']);
				var sumMax = parseFloat(defaultCfg['sumMax']);
				/*if(typeof(fincConfig[estmNow][0]['feeDsR'])!="undefined"){
					sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
					sumMax = number_cut(sumMax * 100,1,'round')/100;
				}*/
			}else if(estmMode=="lease"){
				var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
				var feeC = parseFloat(number_filter($obj.find("input[name='feeCmR']").val()));
				var feeA = parseFloat(number_filter($obj.find("input[name='feeAgR']").val()));
				if(gnbPath=="usedcar"){
					var cmMax = 0;
					var agMax = 0;
					if(fincConfig[estmNow][0]['certifyYN']=="Y"){
						var cmMax = 9;
						var sumMax = 13;
					}else{
						var sumMax = 9;
					}
				}else if(local == "imported"){
					/*if(feeC==14){
						var cmMax = 14;
						if(defaultCfg['typeAg']=="3"){
							var agMax = 1.1;
							var sumMax = 15.1;
						}else{
							var agMax = 1;
							var sumMax = 15;
						}
					}else{
						var cmMax = 14;
						if(defaultCfg['typeAg']=="3"){
							var agMax = 1.1;
						}else{
							var agMax = 1;
						}
						var sumMax = 14;
					}*/
					var cmMax = 0;	// 수입차 예외 제한, 
					var agMax = 3;	// 수입차 AG 1% 제한 해제 (2021.04.05)	// 2022년 변경 0 -> 3
					var sumMax = 13;	// 2022년 변경 14 -> 13
				}else{
					var cmMax = 0;
					var agMax = 3;		// 2022년 변경 0 -> 3
					var sumMax = 12;	// 2022년 변경 13 -> 12
				}
			}else{
				var agMax = parseFloat(dataBank['goodsConfig'][local]['agFeeMax']);
				var cmMax = parseFloat(dataBank['goodsConfig'][local]['cmFeeMax']);
				var sumMax = parseFloat(dataBank['goodsConfig'][local]['agcmFeeMax']);
			}
			
			var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
			var kind = "incentive";
			if(etc=="feeAgR" && (estmMode=="fince" ||  fincConfig[estmNow][0]['goodsKind']=="loan")) var sum = data + parseFloat(number_filter($obj.find("input[name='feeCmR']").val()))  * 1.03412;		// 할부, 금융리스
			else if(etc=="feeAgR") var sum = data + parseFloat(number_filter($obj.find("input[name='feeCmR']").val()));
			else var sum = data + parseFloat(number_filter($obj.find("input[name='feeAgR']").val()));
			if(sum>sumMax){
				//alertPopup("CM+AG 수수료는 "+sumMax+"% 이내로 제한되어 있습니다.");
				alertPopup("수수료 상한제 금액 초과");
				if(etc=="feeAgR" && (estmMode=="fince" ||  fincConfig[estmNow][0]['goodsKind']=="loan")) data = number_cut((data-sum+sumMax)/1.03412*100,1,'floor')/100;
				else data = number_cut((data-sum+sumMax)*100,1,'floor')/100;
				$(this).val(data);
			}else if(etc=="feeCmR" && cmMax!="0" &&  data>cmMax){
				//alertPopup("CM 수수료는 "+cmMax+"% 이내로 제한되어 있습니다.");
				alertPopup("수수료 상한제 금액 초과");
				$(this).val(cmMax);
				data = cmMax;
			}else if(etc=="feeAgR" && agMax!="0" &&  data>agMax){
				//alertPopup("AG 수수료는 "+agMax+"% 이내로 제한되어 있습니다.");
				alertPopup("수수료 상한제 금액 초과");
				$(this).val(agMax);
				data = agMax;
			}
			getComnConfig(kind,data,etc);
			estmChangeKind = kind;
		}else if(etc=="deliveryMaker"){
			var kind = "deliveryMaker";
			var data = number_filter($(this).val());
			if(data>1000000){
				alertPopup("입력하신 금액이 잘못되었습니다. 다시 확인해주세요.");
				data = 0;
				$(this).val(0);
			}
			getComnConfig(kind,data,'');
		}
		if(typeof(kind)=="undefined") estmChangeKind = etc;
		else estmChangeKind = kind;
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
		getComnForm(kind,"");
	});
	// 금융상품 설정 변경 (선택 변경)
	$(document).on("click", ".finceSub ul li button", function () {
		var kind = $(this).closest(".selsub").attr("kind").replace("Sel","");
		var goods = fincConfig[estmNow][fincNow[estmNow]]['goods'];
		if(kind=="km" && $(this).parent().parent().hasClass("kmPromotionList")) var etc = "kmPromotion";
		else var etc = "";
		if(kind=="remain" && fincConfig[estmNow][fincNow[estmNow]]['remainType']=="Y"){
			alertPopup("<span class='desc'>할부형이 선택되어 있어 잔존가치를 변경하실 수 없습니다.</span> <br> 할부형 선택을 해제하신 후 선택해 주세요.");
		}else{
			if(etc) getLoanConfig(kind,$(this).parent().attr(etc),etc);
			else getLoanConfig(kind,$(this).parent().attr(kind),etc);
			estmChangeKind = kind;
			if(gnbPath=="usedcar") calculatorU();
			else calculator();
		}
	});
	$(document).on("change", ".finceSub select", function () {
		var kind = $(this).attr("name");
		var goods = fincConfig[estmNow][fincNow[estmNow]]['goods'];
		if(kind=="prepayR" || kind=="prepayC") kind = "prepay";
		else if(kind=="depositR" || kind=="depositC") kind = "deposit";
		else if(kind=="capitalR" || kind=="capitalC") kind = "capital";
		else if(kind=="respiteR" || kind=="respiteC") kind = "respite";
		else if(kind=="remainR") kind = "remain";
		//if(goods[0]=="FS") getFinceConfig(kind,$(this).val(),'');
		//else 
		getLoanConfig(kind,$(this).val(),'');
		estmChangeKind = kind;
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	$(document).on("click", "input[name='depositType']", function () {
		var kind = $(this).attr("name");
		getLoanConfig(kind,$(this).val(),'');
		estmChangeKind = "deposit";
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	$(document).on("click", "input[name='remainType']", function () {
		var kind = $(this).attr("name");
		if($(this).prop("checked")==true) var val = $(this).val();
		else var val = "N";
		getLoanConfig(kind,val,'');
		estmChangeKind = "remain";
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	$(document).on("click", ".fincCell input[type='radio']", function () {
		var kind = $(this).closest(".fincView").attr("kind");
		fincNow[estmNow] = parseInt($(this).closest(".fincCell").attr("fincNo"));
		if(kind=="stampYn") getLoanConfig(kind,$(this).val(),'');
		estmChangeKind = kind;
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	$(document).on("blur", ".fincCell input[name='rateCover']", function () {
		fincNow[estmNow] = parseInt($(this).closest(".fincCell").attr("fincNo"));
		var kind = "rateCover";
		val = number_filter($(this).val());
		getLoanConfig(kind,val,'');
		estmChangeKind = "rateCover";
		if(gnbPath=="usedcar") calculatorU();
		else calculator();
	});
	
	// 직접입력
	$(document).on("click", ".selfBox input[type='button']", function () {
		var $obj = $(this).parent();
		var kind = $obj.attr('kind');
		if(kind=="prepay" || kind=="deposit" || kind=="respite" || kind=="remain" || kind=="capital"){
			var data = number_only($obj.find("input[name='"+kind+"']").val());
			var max = parseInt($obj.attr('max'));
			if(kind=="remain" || kind=="capital") var min = parseInt($obj.attr('min'));
			if(data=="" || data>max){
				if(kind=="prepay" && estmMode=="fince") alertPopup("최소 이용금액..  "+number_format(parseInt(defaultCfg['minCap'])/10000)+"만원 입니다.");
				else alertPopup("<span class='desc'>입력하신 금액이  "+number_format(max)+"원을 벗어났습니다.</span> <br> 금액을 다시 확인하여 주시기 바랍니다.");
			}else if(kind=="remain" && (data=="" || data<min)){
				alertPopup("<span class='desc'>입력하신 금액이  "+number_format(min)+"원보다 높아야합니다.</span> <br> 금액을 다시 확인하여 주시기 바랍니다.");
			}else if(kind=="capital" && (data=="" || data<min)){
				alertPopup("최소 이용금액  "+number_format(min/10000)+"만원 입니다.");
			}else{
				getLoanConfig(kind,data,'');
				estmChangeKind = kind;
				if(gnbPath=="usedcar") calculatorU();
				else calculator();
			}
		}else{
			if(kind=="option" && $obj.find("input[name='optionType']").prop("checked")==true){
				$obj.find("input[name='name']").val("최종차량가(+/-) 반영");
			}
			var name = $.trim($obj.find("input[name='name']").val());
			var price = number_filter($obj.find("input[name='price']").val());
			if(name){
				if(price=="") price = 0;
				if(kind=="colorExt" || kind=="colorInt"){
					$obj.before(makeSelfColor(kind,"S",name,price));
				}else{
					if(kind=="option" && price==0){
						alert("금액을 정확히 입력해 주세요.");
						$obj.find("input[name='price']").focus();
						return false;
					}else{
						$obj.before(makeSelfOption("S",name,price));
					}
				}
				$(this).parent().addClass("off");
				$obj.find("input[name='name']").val("");
				$obj.find("input[name='price']").val("");
				$obj.prev().find("button").click();
				$obj.parent().find(".blank").remove();
			}else{
				alert("명칭을 먼저 입력해 주세요.");
				$obj.find("input[name='name']").focus();
			}
		}
	});
	$(document).on("click", ".btnDelSelf", function () {
		var kind = $(this).attr("kind");
		$(this).parent().next().removeClass("off");
		$(this).parent().remove();
		if(kind=="colorExt") getColorExtCode();
		else if(kind=="colorInt") getColorIntCode();
		else if(kind=="option") getOptionCode();
		$(this).parent().next().removeClass("off");
		calculator();
	});
	$(document).on("keydown", ".selfBox input[type='text']", function (e) {		// 엔터키
    	if (e.keyCode == 13){
    		$(this).parent().parent().find("input[type='button']").click();
    	}
    });
	// 취득원가 계산하기
	$(document).on("click", ".comnCell button.getCapital", function () {
		if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
			if(gnbPath=="usedcar") var cap = estmRslt.ucarPrice - estmRslt.takeSelf
			else var cap = estmRslt.vehicleSale - estmRslt.takeSelf;
		}
		if(typeof(estmCode.trim)=="undefined"){
			if(gnbPath=="usedcar") alertUcarStart();
			return false;
		}
		if(estmMode=="rent" && estmRslt.colorExt==""){	// estmRslt.brand<200 && 
			alertPopup("<div>외장 색상을 선택하여 주세요.</div>");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorExt'] > button").click();
			return false;
		}else if(estmMode=="rent" && estmRslt.colorInt==""){	// estmRslt.brand<200 && 
			alertPopup("<div>내장 색상을 선택하여 주세요.</div>"); 
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorInt'] > button").click();
			return false;
		}else if(fincConfig[estmNow][0]["dealerShop"]==""){	// 제휴사 있는데 선택하지 않음(etc)도 아닐 경우
			alertPopup("<div>제휴사를 선택하여 주세요.</div>"); 
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selsub[kind='dealerShopSel'] > button").click();
			return false;
		}else if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan" && cap<parseInt(defaultCfg['minCap'])){	// 제휴사 있는데 선택하지 않음(etc)도 아닐 경우
			alertPopup("최소 이용금액  "+number_format(parseInt(defaultCfg['minCap'])/10000)+"만원 입니다.");
			return false;
		}
		$(this).text("계산중…");
		getApiCostCapital();
	});
	// 견적 계산하기
	$(document).on("click", ".fincCell button.getResult", function () {
		if(estmMode=="rent" && estmRslt.colorExt==""){	// estmRslt.brand<200 && 
			alertPopup("<div>외장 색상을 선택하여 주세요.</div>");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorExt'] > button").click();
		}else if(estmMode=="rent" && estmRslt.colorInt==""){	// estmRslt.brand<200 && 
			alertPopup("<div>내장 색상을 선택하여 주세요.</div>");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorInt'] > button").click();
		}else if(estmMode=="rent" && garnishCheck){	// estmRslt.brand<200 && 
			alertPopup("<div>옵션에서 가니쉬를 선택하여 주세요.</div>");
		}else if(estmMode=="rent" && estmRslt.brand<200 && fincConfig[estmNow][0]["deliveryShip"]=="") {
			alertPopup("<div>출고장이 선택되지 않았습니다. 출고장을 확인하여 주세요.</div>");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selsub[kind='deliveryShipSel'] > button").click();
		}else if(fincConfig[estmNow][0]["dealerShop"]==""){	// 제휴사 있는데 선택하지 않음(etc)도 아닐 경우
			alertPopup("<div>제휴사를 선택하여 주세요.</div>"); 
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selsub[kind='dealerShopSel'] > button").click();
			return false;
		}else if(estmMode=="lease" && fincConfig[estmNow][0]["goodsKind"]=="loan" && $(this).attr("loan")=="0") {
			alertPopup("<div>대출원금이 차량가격보다 높습니다. 선수금이나 등록부대비용 포함을 조정하여 주세요.</div>");
		}else if(estmMode=="lease" && fincConfig[estmNow][0]["goodsKind"]=="lease" && $(this).attr("loan")=="0") {
			alertPopup("<div>선수금 + 보증금 + 잔존가치가 차량가격보다 높습니다. 금액을 조정하여 주세요.</div>");
		}else if((estmMode=="rent" || fincConfig[estmNow][0]["goodsKind"]=="lease") && $(this).attr("remain")=="0"){
			if(dataBank["remainLineup"+estmRslt.lineup]['monthKm']) var msg = dataBank["remainLineup"+estmRslt.lineup]['monthKm'];
			else var msg = "잔가율이 확정되지 않아 견적을 산출할 수 없습니다. 다른 차종을 선택하여 주세요.";
			alertPopup("<div>"+msg+"</div>");
		}else if(estmMode=="lease" && $(this).attr("dcSppt")=="X"){
			alertPopup("<div>할인지원금 지급여부를 먼저 선택해 주세요.</div>");
		}else if(estmMode=="lease" && $(this).attr("adCmfe")=="X"){
			alertPopup("<div>추가수수료 지급 대상을 먼저 선택해 주세요.</div>");
		}else{
			$(this).text("계산중…");
			fincNow[estmNow] = parseInt($(this).closest(".fincCell").attr("fincNo"));
			getApiCostResult();
		}
	});
	// 견적 별표 - 금융
    $(document).on("click", ".estmCell button.btnFincStar", function () {
		if(typeof(estmCode.trim)=="undefined") return false;
    	var fNo = parseInt($(this).closest(".fincCell").attr("fincNo"));
    	if($(this).hasClass("on")){
    		$(this).removeClass("on");
    	}else{
			if($("#estmBody .estmCell[estmNo='"+estmNow+"'] .btnFincStar.on").length==3){
				alert("3개 까지만 선택할 수 있습니다. 다른 선택을 취소한 후 다시 선택해 주세요.");
				return false;
			}else{
				$(this).addClass("on");
			}
    	}
		if(estmMode=="fince"){
			estmChangeKind = "incentive";
			if(gnbPath=="usedcar") calculatorU();
			else calculator();
		}else if(deviceType=="app"){
			//sendDataToRight("sets",estmNow+"\t"+doc+"\t"+tabSel+"\t"+$obj.attr("saveNo")+"\t"+$("#estmBody").attr("saveM"));
			//sendDataToRight("tab",window.btoa(encodeURIComponent(tab)));
			//sendDataToRight("docu",window.btoa(encodeURIComponent(docu)));
			sendDataToRight("html",window.btoa(encodeURIComponent(viewLoanDocu())));
			//sendDataToRight("config",window.btoa(encodeURIComponent($obj.find(".estmRslt_data").html())));
			//sendDataToRight("edit",window.btoa(encodeURIComponent($("#docuEdit").html())));
			//sendDataToRight("star",$("#estmBody").attr("starLen")+"\t"+$("#estmBody").attr("tabM"));
		}else{
			$("#estmDocu .estmRslt_estmDocu").html(viewLoanDocu());
		}
    });
	
	// 제원 보기
	$(document).on("click", ".specViewEstm", function (event) {
    	$("#framePopup h3").text("제원 보기");
		$("#framePopup .content").html(viewSpecEstm($(this).attr("model"),$(this).attr("spec")));
		openPopupView(720,'framePopup');
    });
	// 앱 가격표 보기
	$(document).on("click", ".btnOpenInfo", function () {
		window.app.changeWebView('left');
		return false;
    });
	// 견적서 열기
	$(document).on("click", ".btnOpenDocu", function () {
		if(deviceType=="app"){
			sendDataToRight("edit",window.btoa(encodeURIComponent($("#docuEdit").html())));
			/*
			var tabM = $("#estmBody").attr("tabM");
			if(estmStart['mode']=="leaserent" && tabM) outputMLR();
			else if(estmStart['mode']=="leaserent") outputLR();
			else if(estmStart['mode']=="usedcar") outputU();
			else if(tabM) outputM();
			else output();
			*/
			window.app.changeWebView('right');
			return false;
		}else{
			$("#estmBox").addClass("open");
			var scrollPosition = $("#estmDocu").offset().top+27;
	    	$("html, body").animate({
	    		scrollTop: scrollPosition
	    	}, 500);
		}
    });
	$(document).on("click", ".btnCloseDocu", function () {
		$("#estmBox").removeClass("open");
    });
	$(document).on("click", ".docuEdit input[name='cardView']", function () {
		fincConfig[estmNow][0]['cardView'] = $(this).val();
		if(deviceType=="app"){
			sendConfigToMain("cardView",$(this).val(),"");
			sendDataToRight("html",window.btoa(encodeURIComponent(viewLoanDocu())));
		}else{
			defaultCfg['cardView'] = $(this).val();
			$("#estmDocu .estmRslt_estmDocu").html(viewLoanDocu());
		}
    });
	
	// 즉시출고 목록 추가
	$(document).on("click", "#addFashship", function () {
		if(typeof(estmCode.trim)=="undefined"){
			alert("모델을 먼저 선택해 주세요.");
			return false;	
		}else if(estmRslt.colorExt==""){
			alert("외장색상을 먼저 선택해 주세요.");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorExt'] > button").click();
			return false;	
		}else if(estmRslt.colorInt==""){
			alert("내장색상을 먼저 선택해 주세요.");
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selbar[kind='colorInt'] > button").click();
			return false;	
		}
		$("#fastshipData li.blank").addClass("off");
		addListFastship();
    });
	$(document).on("click", ".btnDelFashship", function () {
		$(this).parent().parent().remove();
		if($("#fastshipData li").length==1)  $("#fastshipData li.blank").removeClass("off");
    });
	$(document).on("click", "#fastshipData input[type='radio']", function () {
		var sNo = $(this).closest("li").attr("sNo");
		var cnt = number_only($(this).parent().parent().parent().find("input[type='text']").val());
		var kind = $(this).val();
		addFastshipInput(kind,sNo,cnt);
    });
	$(document).on("blur", "#fastshipData input[name='count']", function () {
		if($(this).parent().parent().find("input[type='radio']:checked").length==0){
			alert("선구매인지 즉시출고인지 먼저 선택해 주세요.");
			return false;
		}
		var cnt = number_only($(this).val());
		if(cnt=="" || cnt==0){
			alert("수량을 정확히 입력해 주세요.");
		}else{
			var sNo = $(this).closest("li").attr("sNo");
			var kind = $(this).parent().parent().find("input[type='radio']:checked").val();
			addFastshipInput(kind,sNo,cnt);
		}
    });
	$(document).on("click", "#fastshipData button.addBatchList", function () {	
		var sNo = $(this).parent().parent().parent().attr("sNo");
		var str = "<div class='infoPopup'>";
		str += "<div>아래 입력칸에 엑셀을 복사하여 붙여 넣으세요. <br>※ 1열 계약번호 2열 차대번호 순, 한줄에 한건씩 기록</div>";
		str += "<div><textarea name='contract' id='addBatchData'></textarea></div>";
		str += "<div class='buttonBox'><button id='addBatchBtn' sNo='"+sNo+"'>입력하기</button></div>";
		str += "</div>";
		$("#framePopup h3").text("계약번호 차대번호 일괄입력");
		$("#framePopup .content").html(str);
		openPopupView(400,'framePopup');
    });
	$(document).on("click", "#addBatchBtn", function () {		// 미사용
		var val = $.trim($("#addBatchData").val());
		if(val==""){
			alert("계약번호와 차대번호를 입력해주세요.");
		}else{
			var sNo = $(this).attr("sNo");
			var dat = val.split("\n");
			var $obj = $("#fastshipData li[sNo='"+sNo+"'] ol li:not(.btn)");
			var i = 0;
			$obj.each(function (){
				if(typeof(dat[i])!="undefined" && dat[i]){
					da = dat[i].split("\t");
					$(this).find("input[name='num']").val(da[0]);
					if(typeof(da[1])!=undefined) $(this).find("input[name='vin']").val(da[1]);
					if(typeof(da[2])!=undefined) $(this).find("input[name='day']").val(da[2]);
				}
				i++;
			});
			$('.layerPopup').fadeOut();
		}
    });
	// 즉시출고 목록 추가
	$(document).on("click", "#sendFashship", function () {
		sendListFastship();
    });
	// ■ 견적서 공유
	$(document).on("click", "button.btnEstmAct2", function () {
		// 견적 계산 없는 것 확인 후 처리 예정	type 견적 edit->estm , 저장 work->save
		var job = $(this).attr("job");
		if(job=="mod") var type = "save";
		else var type = $(this).parent().attr("type");
		
		if(job=="mod"){
			var no = $(this).attr("no");
			var key = $(this).attr("key");
    	}else if(type == "save"){
			var no = $(this).parent().attr("no");
			var key = $(this).parent().attr("key");
    	}else{
    		if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
    			var no = estmConfig[estmNow]['saveNo'];
    			var key = estmConfig[estmNow]['viewKey'];
    		}else{
    			var no = "";
    			var key = "";
    		}
    	}

		if(type=="estm"){
    		if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var name = estmConfig['name'];
    		else var name = "";
    	}else if(job=="mod"){
    		var name = $.trim($("dd[save='customer']").text());
    	}

		//var no = "1009";
		//var key = "QbfcRZ";
		if(no==""){
			alertPopup("<div>견적을 먼저 저장하신 후 이용하실 수 있습니다.</div>");
			return false;
		}else if(job=="share"){
			var url = urlHost+"/D/E/"+key;
			if(deviceType=="app") var href = url+"?webview=layer";
			else var href = url;
			var str = "<div class='shareBox' ><div class='button' type='estm'>";
			str +="<button class='btnEstmAct2' job='talk'>카톡</button>";
			str +="<button class='btnEstmAct2' job='pdf'>PDF</button>";
			str +="<button class='btnEstmAct2' job='jpg'>JPG</button>";
			str +="<button class='btnEstmAct2' job='print'>인쇄</button>";
			str +="<a href='"+href+"' class='urlOpen' target='_blank'>열기</a>";
			str += "</div><div class='url'>";
			str += "<input type='text' value='"+url+"' name='shortcut'>";
			str += "<button class='urlCopy'>Url 복사</button>";
			str += "</div></div>";
			$("#framePopup h3").text("공유하기");
			$("#framePopup .content").html(str);
        	openPopupView(500,'framePopup');
		}else if(job=="pdf" || job=="jpg" || job=="print"){
			estmActReturn(job,no,key,type);
		}else if(job=="talk"){
			sendKakao(key,type);
		}
		
	});
	// 견적서 제공
	$(document).on("click", "a.btnEstmOffer", function (event) {
		if($(this).hasClass('gray')){
			alertPopup("<div>견적을 먼저 저장하신 후 이용하실 수 있습니다.</div>");
			event.preventDefault();
			return false;
		}
		/*else if(deviceSize!="mobile"){
			alertPopup("<div>모바일에서만 사용하실 수 있습니다. <br><br>모바일로 로그인하시고 가견적에서 견적서를 발송하여 주세요.</div>");
			event.preventDefault();
			return false;
		}*/
	});	
	/*// 견적서 제공 (미사용)
	$(document).on("click", "button.btnEstmOffer", function () {
		var type=$(this).attr("page");
		if(type=="save"){
			var no = $(this).parent().attr("no");
			$obj = $("#list_"+no);
			var key = $obj.attr("key");
			var name = $obj.find(".customer").text();
		}else{
			$obj = $("#estmDocu .estmRslt_estmDocu");
			if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
    			var no = estmConfig[estmNow]['saveNo'];
    			var key = estmConfig[estmNow]['viewKey'];
    		}else{
    			var no = "";
    			var key = "";
    		}
			if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var name = estmConfig['name'];
    		else var name = "";
		}
		if(no==""){
			alertPopup("<div>견적을 먼저 저장하신 후 이용하실 수 있습니다.</div>");
			return false;
		}
		var str = "<form id='formEstmOffer' action='/api/offer/post' method='POST'>\n";
		str += "<div class='editBox'>";
		str += "<div class='notice'>견적서 제공을 위해 아래 정보를 입력해주세요. <br>입력하신  번호로 견적서 Url이 전송됩니다.</div>";
		str += "<dl>";
    	str += "<dt>고객 이름</dt><dd><input type='text' name='custNm' value='"+name+"' placeholder='이름 입력'></dd>";
    	str += "<dt>고객 휴대폰</dt><dd><input type='text' name='phone' value='' maxlength='11'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='휴대폰, 숫자만 입력'></dd>";
    	str += "</dl>";
    	str += "<input type='hidden' name='job' value='offer'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='type' value='"+type+"'>\n";
    	str += "<div class='buttonBox'><button id='submit'>제공하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("견적서 제공");
    	openPopupView(500,'framePopup');
	});
	// 견적서 제공
	$(document).on("click", "#formEstmOffer button#submit", function () {
		if((!$("#formEstmOffer input[name='custNm']").val() || $("#formEstmOffer input[name='custNm']").val().length<2)){
			alert("고객명을 입력해주세요.");
			$("#formEstmOffer input[name='custNm']").focus();
			return false;
		}else if((!$("#formEstmOffer input[name='phone']").val() || $("#formEstmOffer input[name='phone']").val().length<10)){
			alert("고객 휴대폰을 입력해주세요.");
			$("#formEstmOffer input[name='phone']").focus();
			return false;
		}else{
			$('.layerPopup').css("display","none");
			 openLoading();
			 var Dpath = "request";
			 var url = "/api/offer/get";
			 url +="?custNm="+encodeURI($("#formEstmOffer input[name='custNm']").val());
			 url +="&job="+$('#formEstmOffer [name="job"]').val();
			 url +="&no="+$('#formEstmOffer [name="no"]').val();
			 url +="&key="+$('#formEstmOffer [name="key"]').val();
			 url +="&type="+$('#formEstmOffer [name="type"]').val();
			 url +="&phone="+$('#formEstmOffer [name="phone"]').val();
			 getjsonApi(url,Dpath);
			 //ajaxSubmit("formEstmConfirm");
			 return false;
		}
	});*/
	
	// ■ 견적서 발송 저장
	$(document).on("click", "button.btnEstmAct", function () {
		// 견적 계산 없는 것 확인 후 처리 예정	type 견적 edit->estm , 저장 work->save
		var job = $(this).attr("job");
		if(job=="mod") var type = "save";
		else var type = $(this).parent().attr("type");
		if(job=="finc" && $(this).text()=="심사 신청됨"){
			alertPopup("심사신청이 접수되었습니다.");
			return false;
		}
		if(type == "estm") $obj = $("#estmDocu .estmRslt_estmDocu");
		else $obj = $("#docuViewBox");
		var pmtErr = 0;
		$obj.find("td[fno^='G']").each(function (){
    		var pmt = number_only($(this).text());
    		if(pmt=="") pmtErr ++;
    	});
		if(pmtErr){
			alertPopup("<div>계산이 완료되지 않은 견적이 있습니다. <br>계산하기 버튼을 클릭하여 월 납입금을 확인해 주세요.</div>");
			return false;
		}
		if(job=="mod"){
			var no = $(this).attr("no");
			var key = $(this).attr("key");
    	}else if(type == "save"){
			var no = $(this).parent().attr("no");
			var key = $(this).parent().attr("key");
    	}else{
    		if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
    			var no = estmConfig[estmNow]['saveNo'];
    			var key = estmConfig[estmNow]['viewKey'];
    		}else{
    			var no = "";
    			var key = "";
    		}
    	}
		
		if(job=="mod" || job=="save" || job=="fax" || job=="sms" || job=="mail" || job=="finc" || !no){	// 창 오픈			job=="talk" || 
    		if(job=="fax" || job=="sms" || job=="mail"){
    			if(job=="fax") var head = "Fax 발송";
    			else if(job=="sms") var head = "문자 발송";
    			else if(job=="mail") var head = "메일 발송";
    			if(!no) head = "견적 저장하고 "+head;
    			if(job=="sms" && grantApp.indexOf("M")>=0) var bTxt = "Web 발송";
    			else var bTxt = "발송하기";
    			// sms text web  if(grantApp.indexOf("M")>=0) str +="<button class='send' way='app'  id='msgWayApp'>App 발송</button>";
    		}else if(job=="mod" || job=="save"){
    			if(no) var head = "저장 견적 ("+no+")";
    			else var head = "견적 저장";
    			if(job=="mod") var bTxt = "수정하기";
    			else var bTxt = "저장하기";
    		}else if(job=="url"){
    			var head = "Url 생성";
    			if(!no) head = "견적 저장하고 "+head;
    			var bTxt = "생성하기";
    		}else if(job=="talk"){
    			var head = "카톡 공유";
    			if(!no) head = "견적 저장하고 "+head;
    			var bTxt = "공유하기";
    		}else if(job=="pdf" || job=="jpg"){
    			if(job=="pdf") var head = "PDF 파일 다운";
    			else if(job=="jpg") var head = "JPG 파일 다운";
    			if(!no) head = "견적 저장하고 "+head;
    			var bTxt = "다운받기";
    		}else if(job=="print"){
    			var head = "인쇄";
    			if(!no) head = "견적 저장하고 "+head;
    			var bTxt = "인쇄하기";
    		}else if(job=="finc"){
    			var head = "심사 신청";
    			if(!no) head = "견적 저장하고 "+head;
    			var bTxt = "신청하기";
    		}
    	}else if(no && key){	// 추가 저장 없이 바로 실행
    		if(job=="url" || job=="pdf" || job=="jpg" || job=="print"){
				//newWindow = window.open("about:blank", "_blank");
			}
    		estmActReturn(job,no,key,type);
    		return false;
    	}else if(no){	// 추가 저장 없이 바로 실행
    		if(job=="url" || job=="pdf" || job=="jpg" || job=="print"){
				//newWindow = window.open("about:blank", "_blank");
			}
    		var head = "";
    	}else{
    		var head = "";
    	}
		
		var str = "<form id='formEstmSave' action='/api/estimate' method='POST' enctype='multipart/form-data'>\n";
		str += "<div class='editBox'>";
    	str += "<dl>";
    	if(type=="estm"){
    		if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var name = estmConfig['name'];
    		else var name = "";
    		if(typeof(estmConfig['subject'])!="undefined" && estmConfig['subject']) var subject = estmConfig['subject'];
    		else var subject = "";
    		if(typeof(estmConfig['counsel'])!="undefined" && estmConfig['counsel']) var counsel = estmConfig['counsel'];
    		else var counsel = "";
    	}else if(job=="mod"){
    		var name = $.trim($("dd[save='customer']").text());
    		var subject = $.trim($("dd[save='subject']").text());
    		var counsel = $.trim($("dd[save='counsel']").text());
    	}
    	if(job=="mod" || job=="save" || !no){	// 기본항목
    		str += "<dt>고객</dt><dd class='small'><input type='text' name='name' value='"+name+"' placeholder='고객명'>님 귀중</dd>";
    		str += "<dt>견적 제목</dt><dd class='full'><input type='text' name='subject' value='"+subject+"' placeholder='견적을 구분할 수 있는 간단한 문구'></dd>";
        	str += "<dt>상담 기록</dt><dd><textarea name='counsel'>"+counsel+"</textarea></dd>";
    	}
    	var notice = "";
    	if(job=="fax" || job=="sms"){
    		if(!no) str += "</dl><div id='saveDesc' class='saveDesc'><div class='guide'>※ 아래의 발송 정보를 입력해 주세요.</div></div><dl class='editBox'>";
    		var url = "/api/infos/"+job;
    		getjsonData(url,"infos");
    		var pointNow = parseInt(dataBank["infos"]['now']);
    		if(job=="fax"){
    			if(type=="estm"){
    				var height = $("#docuViewBox input[name='height']").val();
    			}else{
    				var height = $obj.height();
    				$obj.addClass("noZoom");
    				var height = $obj.height();
    				$obj.removeClass("noZoom");
    			}
    			if(height<=1100) var page = 1;
    			else var page = 2;
    			var cost = page * 50;
        		str += "<dt>팩스번호</dt><dd><input type='text' class='phoneF' name='to' value='' placeholder='번호만 입력'></dd>";
        		str += "<dt>페이지 수</dt><dd>"+page+" page (페이지 당 50 point 차감) <input type='hidden' name='page' value='"+page+"'></dd>";
        		str += "<dt>발신번호</dt><dd>";
        		if(dataBank["infos"]['fax']) str += "<input type='hidden' name='from' value='"+dataBank["infos"]['fax']+"'>"+dataBank["infos"]['fax'];
        		else str += "<input type='hidden' name='from' value='02-6008-6404'>팩스번호 정보 없어 카판 회신용 팩스번호 <b>02-6008-6404</b> 로 표시됨";
        		str += "</dd>";
        	}else if(job=="sms"){
        		if(key) var url = "http://m.ca8.kr/"+key;
        		else var url = "http://m.ca8.kr/******";
        		var cost = 20;
        		str += "<dt>휴대폰</dt><dd><input type='text' class='phoneF' name='to' value='' placeholder='번호만 입력'></dd>";
        		str += "<dt>첨부 선택</dt><dd><label><input type='radio' name='jpg' value='0' checked><span>SMS (20 Point, 첨부 없음)</span></label><label><input type='radio' name='jpg' value='1'><span>MMS (100 Point, JPG 첨부)</span></label></dd>";
        		str += "<dt class='mms off'>문자 제목</dt><dd class='mms off'><input type='text' name='subj' value='요청하신 견적서를 보내드립니다.' placeholder=''></dd>";
        		str += "<dt>문자 본문</dt><dd class='msgBox'><textarea name='msg' id='commentMsg'  placeholder='60 Byte 이내' onkeyup='commentLength()'>카마스터 "+$("#userName").text()+"입니다. 요청하신 견적서를 보내드립니다.</textarea>";
        		str += "<div class='length'><span id='commentLen'>47</span> / <span id='commentMax'>60</span> Byte</div>※ 위 문자 뒤에 url <b style='color:#ff7a00'>"+url+"</b> 이 추가됩니다. </dd>";
        		str += "<dt>발신번호</dt><dd>";
        		if(dataBank["infos"]['phone']){
        			var tmp = dataBank["infos"]['phone'].split(',');
        			var i = 0;
        			for(var p in tmp){
        				if(i==0) var ckd = "checked";
        				else var ckd = "";
        				str += "<label><input type='radio' name='from' value='"+tmp[p]+"' "+ckd+"><span>"+tmp[p]+"</span></label>";
        				i ++;
        			}
        			//if(grantApp.indexOf("M")>=0) str +="<label><input type='radio' name='from' value='app'><span>App 발송</span></label>";
        		}else{
        			str += "<div class='guide'>";
        			//if(grantApp.indexOf("M")>=0) str +="<label><input type='radio' name='from' value='app' checked><span>App 발송</span></label> ";
        			str += "발신번호 사전 등록 필수 <input type='button' name='noFrom' onclick=\"openFormQuestion('sms')\" value='등록 신청'></div>";
        		}
        		str += "<input type='hidden' name='way' value='web'>";
        		str += "</dd>";
        		// <textarea name="message" id="commentMsg" placeholder="내용을 입력해주세요." onkeyup="commentLength(70)"></textarea>
        	}
    		notice += "<div class='saveDesc'><div class='guide' id='sendNotice'>";
    		if(pointNow<cost){
    			notice += "※ 보유하신 "+number_format(pointNow)+" Point 가 부족하여 발송할 수 없습니다.";
    		}else{
    			notice += "※ 보유하신 "+number_format(pointNow)+" Point 에서 "+cost+" Point 차감됩니다.";
    		}
    		notice += "</div></div>";
    		notice += "<input type='hidden' name='pointNow' value='"+pointNow+"'><input type='hidden' name='cost' value='"+cost+"'>";
    	}else if(job=="mail"){
    		str += "<dt>이메일</dt><dd><input type='text' name='to' value='' placeholder='email'></dd>";
    		str += "<dt>제목</dt><dd><input type='text' name='msg' value='' placeholder='메일 제목'></dd>";
    	}else if(job=="finc"){
        	str += "<dt>견적 선택</dt><dd>";
        	var i = 0;
        	$obj.find("td[fno^='G']").each(function (){
        		i ++;
        		var fNo = $(this).attr("fno").substring(1);
        		var pmt = $(this).text();
        		var mon = $obj.find("td[fno='M"+fNo+"']").text();
        		str += "<label><input type='radio' name='fno' value='"+fNo+"'><span>견적 "+i+" : "+mon+" "+pmt+"원</span></label><br>";
        	});
        	if($obj.find(".eTitle").text().indexOf("장기렌트")>=0) var goodsKind = "rent";
        	else if($obj.find(".eTitle").text().indexOf("운용리스")>=0) var goodsKind = "lease";
        	else if($obj.find(".eTitle").text().indexOf("금융리스")>=0) var goodsKind = "loan";
        	else var goodsKind = "rent";
        	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
        	str += "</dd>";
        	str += "</dl>";
        	str += "<div class='notice'>고객님의 신용정보조회 동의를 위하여 고객님께 url 을 보내드립니다. 고객구분을 먼저 선택하시고, 아래 정보를 입력해 주세요.</div>";
        	str += "<dl>";
        	str += "<dt>고객 구분</dt><dd><label><input type='radio' name='buy' value='1'><span>개인</span></label><label><input type='radio' name='buy' value='2'><span>개인사업자</span></label><label><input type='radio' name='buy' value='3'><span>법인</span></label></dd>";
        	if(goodsKind == "rent") str += "<dt class='fincBuy off' kind='C'>취급제한업종</dt><dd class='fincBuy off' kind='C' style='padding-left: 10px;'>경비보안업체, 여행사, 렌터카업체, 캠핑카업체, 엔터테인먼트사, 건설업, 토목업 등 공사현장 출입차량</dd>";
			str += "<dt class='fincBuy off' kind='C'>회사명</dt><dd class='fincBuy off' kind='C'><input type='text' name='compNm' value=''></dd>";
        	str += "<dt class='fincBuy off' kind='C'>사업자번호</dt><dd class='fincBuy off' kind='C'><input type='text' name='compNo' value='' maxlength='10'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");'> (숫자만 입력)</dd>";
        	str += "<dt class='fincBuy off' kind='B'>법인등록번호</dt><dd class='fincBuy off' kind='B'><input type='text' name='corRegsNo' value='' maxlength='13'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");'> (숫자만 입력)</dd>";
        	str += "<dt class='fincBuy off name' kind='N'>고객 이름</dt><dd class='fincBuy off' kind='N'><input type='text' name='custNm' value=''></dd>";
        	str += "<dt class='fincBuy off phone' kind='N'>고객 휴대폰</dt><dd class='fincBuy off' kind='N'>";
        	str += "<select name='phone1'><option value='010'>010</option><option value='011'>011</option><option value='016'>016</option><option value='017'>017</option><option value='018'>018</option><option value='019'>019</option></select> - ";
        	str += "<input type='text' name='phone2' value='' maxlength='4'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");'> - ";
        	str += "<input type='text' name='phone3' value='' maxlength='4'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");'>";
        	str += "</dd>";
        	str += "<dt class='fincBuy off birth' kind='N'>고객 생년월일</dt><dd class='fincBuy off date' kind='N'>";
        	str += "<select name='year'><option value=''>연도</option>";
        	var sY = yyyy - 18;
        	var eY = sY-42;
        	for(y=sY;y>eY;y--){
        		str += "<option value='"+y+"'>"+y+"</option>";
        	}
        	str += "</select> - ";
        	str += "<select name='month'><option value=''>월</option>";
        	for(m=1;m<=12;m++){
        		if(m<10) m2 = "0"+m;
			    else m2 = m;
        		str += "<option value='"+m2+"'>"+m+"</option>";
        	}
        	str += "</select> - ";
        	str += "<select name='day'><option value=''>일</option>";
        	for(d=1;d<=31;d++){
        		if(d<10) d2 = "0"+d;
			    else d2 = d;
        		str += "<option value='"+d2+"'>"+d+"</option>";
        	}
        	str += "</select>";
        	str += "</dd>";
    	}
    	//alert("btnEstmAct 2 "+no+"/"+tabs+"/"+key+"/");
    	str += "</dl>";
    	str += "</div>";
    	str += notice;
    	str += "<div class='data off'>";
    	str += "<input type='text' name='job' value='"+job+"'>\n";
    	str += "<input type='text' name='no' value='"+no+"'>\n";
    	str += "<input type='text' name='key' value='"+key+"'>\n";
    	str += "<input type='text' name='type' value='"+type+"'>\n";
    	if(job=="save" || !no || !key){	// 설정
    		str += "<input type='text' name='model' value=''>";
    		str += "<input type='text' name='kind' value=''>";
    		str += "<textarea name='data'></textarea>";
    		str += "<textarea name='document'></textarea>";
    	}
    	if(job!="mod" && (job=="save" || !no || !key )){
    		if(deviceType!="app"){
    			$obj.addClass("noZoom");
    		}
    		str += "<input type='text' name='height' value='"+$obj.height()+"'>";
    		if(deviceType!="app"){
    			$obj.removeClass("noZoom");
    		}
    	}
    	str += "</div>";
    	if(head){
    		str += "<div class='buttonBox'><button id='submit'>"+bTxt+"</button>";
    		if(job=="sms" && grantApp.indexOf("M")>=0) str += " <button id='submitM' class=''>App 발송</button>";
    		str += "</div>\n";
    	}
    	str += "</form>";
    	str += "</div>";
    	$("#framePopup .content").html(str);
    	if(job=="sms"){
    		commentLength();
    		if($("#formEstmSave input[name='phone']").length && $("#formEstmSave input[name='phone']").val()){
    			$("#formEstmSave input[name='to']").val($("#formEstmSave input[name='phone']").val());
    		}
    	}
    	/*if(job=="save" || !no || !key){
    		if(deviceType=="app")  window.app.callWebToWeb("main","saveEstmDocuForm","");
    		else saveEstmDocuForm();
    	}
    	*/
    	if(head){
    		$("#framePopup h3").text(head);
        	openPopupView(600,'framePopup');
        	if(job=="finc" && $obj.find(".cName").is("[type]")){
        		$("#formEstmSave input[name='buy']:input[value='"+$obj.find(".cName").attr("type")+"']").click();
        	}
    	}else{
    		if(deviceType=="app"){
				setTimeout(function() {
					ajaxSubmit("formEstmSave");
	    		}, 500);
			}else{
				ajaxSubmit("formEstmSave");
			}
    	}
    });
	// 견적 확정
	$(document).on("click", "button.btnEstmConfirm", function () {
		var type=$(this).attr("page");
		if(type=="save"){
			var no = $(this).parent().attr("no");
			$obj = $("#list_"+no);
			var key = $obj.attr("key");
			var name = $obj.find(".customer").text();
			if($obj.attr("goods")=="LK") var goodsKind = "loan";
			else if($obj.attr("goods")=="LG") var goodsKind = "lease";
			else var goodsKind = "rent";
		}else{
			$obj = $("#estmDocu .estmRslt_estmDocu");
			if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
    			var no = estmConfig[estmNow]['saveNo'];
    			var key = estmConfig[estmNow]['viewKey'];
    		}else{
    			var no = "";
    			var key = "";
    		}
			if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var name = estmConfig['name'];
    		else var name = "";
			if($obj.find(".eTitle").text().indexOf("장기렌트")>=0) var goodsKind = "rent";
        	else if($obj.find(".eTitle").text().indexOf("운용리스")>=0) var goodsKind = "lease";
        	else if($obj.find(".eTitle").text().indexOf("금융리스")>=0) var goodsKind = "loan";
        	else var goodsKind = "rent";
		}
		//var no = "1026";
		//var key = "UcaPm4";
		if(no==""){
			alertPopup("<div>견적을 먼저 저장하신 후 이용하실 수 있습니다.</div>");
			return false;
		}
		var str = "<form id='formEstmConfirm' action='/api/apply/post' method='POST'>\n";
		str += "<div class='editBox'>";
    	str += "<dl>";
    	str += "<dt>고객 이름</dt><dd class='full'><input type='text' name='custNm' value='"+name+"' placeholder='고객명'></dd>";
    	str += "<dt>견적 선택</dt><dd>";
    	var i = 0;
    	if(type=="save"){
    		$obj.find("ul.estm li").each(function (){
        		i ++;
        		var fNo = $(this).attr("fno");
        		var pmt = $(this).find(".pmt").text();
        		var mon = $(this).find(".month").text();
        		str += "<label><input type='radio' name='fno' value='"+fNo+"'><span>견적 "+i+" : "+mon+" "+pmt+"원</span></label><br>";
        	});
    	}else{
    		$obj.find("td[fno^='G']").each(function (){
        		i ++;
        		var fNo = $(this).attr("fno").substring(1);
        		var pmt = $(this).text();
        		var mon = $obj.find("td[fno='M"+fNo+"']").text();
        		str += "<label><input type='radio' name='fno' value='"+fNo+"'><span>견적 "+i+" : "+mon+" "+pmt+"원</span></label><br>";
        	});
    	}
    	
    	str += "</dd>";
    	str += "</dl>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='confirm'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='type' value='"+type+"'>\n";
    	str += "<div class='buttonBox'><button id='submit'>확정하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("견적 확정");
    	openPopupView(600,'framePopup');
    	if($("#formEstmConfirm input[name='fno']").length==1) $("#formEstmConfirm input[name='fno']").prop("checked",true);
    	
	});
	// 견적 확정 버튼
	$(document).on("click", "#formEstmConfirm button#submit", function () {
		if(!$("#formEstmConfirm input[name='custNm']").val() || $("#formEstmConfirm input[name='custNm']").val().length<2){
			alert("고객명을 입력해주세요.");
			$("#formEstmConfirm input[name='custNm']").focus();
			return false;
		}else if($('#formEstmConfirm [name="fno"]:checked').length==0 && $('#formEstmConfirm [name="fno"]:checked').length==0){
			 alert("최종 견적을 선택해 주세요.");
			 return false;
		 }else{
			 $('.layerPopup').css("display","none");
			 openLoading();
			 if($("#formEstmConfirm input[name='type']").val()=="estm"){
				 estmConfig[estmNow]['fno'] = $('#formEstmConfirm [name="fno"]:checked').val();
				 estmConfig['name'] = $("#formEstmConfirm input[name='custNm']").val();
			 }
			 var Dpath = "request";
			 var url = "/api/apply/get";
			 url +="?custNm="+encodeURI($("#formEstmConfirm input[name='custNm']").val());
			 url +="&fno="+$('#formEstmConfirm [name="fno"]:checked').val();
			 url +="&goods="+$('#formEstmConfirm [name="goods"]').val();
			 url +="&job="+$('#formEstmConfirm [name="job"]').val();
			 url +="&no="+$('#formEstmConfirm [name="no"]').val();
			 url +="&key="+$('#formEstmConfirm [name="key"]').val();
			 url +="&type="+$('#formEstmConfirm [name="type"]').val();
			 getjsonApi(url,Dpath);
			 //ajaxSubmit("formEstmConfirm");
			 return false;
		}
	});
	// 신용정보조회 동의
	$(document).on("click", "button.btnEstmAgree", function () {
		var type=$(this).attr("page");
		if($(this).hasClass('resend') && !confirm("이미 신용정보조회동의 요청 상태입니다. 재 요청시, 고객은 새로운 URL 수신 후 조회 동의를 진행해야 합니다.")){
			return false;
		}
		if(type=="save"){
			var no = $(this).parent().attr("no");
			$obj = $("#list_"+no);
			var key = $obj.attr("key");
			var name = $obj.find(".customer").text();
			if($obj.attr("goods")=="LK") var goodsKind = "loan";
			else if($obj.attr("goods")=="LG") var goodsKind = "lease";
			else if($obj.attr("goods")=="FG") var goodsKind = "fince";
			else var goodsKind = "rent";
			var fno = $obj.attr("fno");
			var buy = $obj.attr("buy");
			var ageCut = $obj.attr("ageCut");
		}else{
			$obj = $("#estmDocu .estmRslt_estmDocu");
			if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
    			var no = estmConfig[estmNow]['saveNo'];
    			var key = estmConfig[estmNow]['viewKey'];
    			var fno = estmConfig[estmNow]['fno'];
    			var buy = $obj.find(".cName").attr("type");
    		}else{
    			var no = "";
    			var key = "";
    			var fno = $(this).attr("fno");
    		}
			if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var name = estmConfig['name'];
    		else var name = "";
			if($obj.find(".eTitle").text().indexOf("장기렌트")>=0) var goodsKind = "rent";
        	else if($obj.find(".eTitle").text().indexOf("운용리스")>=0) var goodsKind = "lease";
        	else if($obj.find(".eTitle").text().indexOf("금융리스")>=0) var goodsKind = "loan";
        	else if($obj.find(".eTitle").text().indexOf("할부금융")>=0) var goodsKind = "fince";
        	else var goodsKind = "rent";
			if(goodsKind!="rent") var ageCut = "";
			else if(estmRslt.brand<200 && estmRslt.priceSum>50000000) var ageCut = "76";
	        else if(estmRslt.brand<200) var ageCut = "76";
	        else var ageCut = "76";
		}
		if($(this).hasClass("gray")){
			alertPopup("<div>신용조회 동의를 위한 Url 이 발송되었습니다. 고객님께 안내하여 주시기 바랍니다.</div>");
			return false;
		}else if(no==""){
			alertPopup("<div>견적을 먼저 저장하신 후 이용하실 수 있습니다.</div>");
			return false;
		}
		var str = "<form id='formEstmAgree' action='/api/apply/post' method='POST'>\n";
		str += "<div class='editBox'>";
		if($(this).hasClass('resend')) str += "<div class='notice'>고객님의 신용정보조회 동의를 위하여 고객님께 URL을 보내드립니다. <br> 재요청시, 고객은 새로운 URL 수신 후 조회 동의를 진행해야 합니다.<br> 아래 정보를 입력해주세요.</div>";
		else str += "<div class='notice'>고객님의 신용정보조회 동의를 위하여 고객님께 URL을 보내드립니다. <br> 아래 정보를 입력해주세요.</div>";
		str += "<dl>";
    	str += "<dt>고객 구분</dt><dd><label><input type='radio' name='buy' value='1'><span>개인</span></label><label><input type='radio' name='buy' value='2'><span>개인사업자</span></label><label><input type='radio' name='buy' value='3'><span>법인</span></label></dd>";
		if(goodsKind == "rent") str += "<dt class='fincBuy off' kind='C'>취급제한업종</dt><dd class='fincBuy off' kind='C' ><div style='padding-left: 10px;'>경비보안업체, 여행사, 렌터카업체, 캠핑카업체, 엔터테인먼트사, 건설업, 토목업 등 공사현장 출입차량<br>※ 취급시 영업점에 문의하시기 바랍니다. </div></dd>";
		str += "<dt class='fincBuy off' kind='C'>회사명</dt><dd class='fincBuy full off' kind='C'><input type='text' name='compNm' value='' placeholder='회사명'></dd>";
    	str += "<dt class='fincBuy off' kind='C'>사업자번호</dt><dd class='fincBuy full off' kind='C'><input type='text' name='compNo' value='' maxlength='10'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='사업자등록번호, 10자리 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy off' kind='C'>설립일자</dt><dd class='fincBuy full off date' kind='C'><input type='text' name='estDt' value='' maxlength='8'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='년월일 8자리, 숫자만'></dd>";
    	str += "<dt class='fincBuy off' kind='B'>법인등록번호</dt><dd class='fincBuy full off' kind='B'><input type='text' name='corRegsNo' value='' maxlength='13'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='법인등록번호, 13자리 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy off name' kind='N'>고객 이름</dt><dd class='fincBuy full off' kind='N'><input type='text' name='custNm' value='"+name+"' placeholder='이름 입력'></dd>";
    	str += "<dt class='fincBuy off phone' kind='N'>고객 휴대폰</dt><dd class='fincBuy full off' kind='N'><input type='text' name='phone' value='' maxlength='11'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='휴대폰, 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy off birth' kind='N'>고객 생년월일</dt><dd class='fincBuy full off date' kind='N'><input type='text' name='birth' value='' maxlength='8'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='년월일 8자리, 숫자만'></dd>";
    	str += "<dt class='fincBuy off' kind='B'>대표 취임일자</dt><dd class='fincBuy full off date' kind='B'><input type='text' name='rpsrAsmtDt' value='' maxlength='8'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='년월일 8자리, 숫자만'></dd>";
    	str += "</dl>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='agree'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='fno' value='"+fno+"'>\n";
    	str += "<input type='hidden' name='type' value='"+type+"'>\n";
    	str += "<input type='hidden' name='ageCut' value='"+ageCut+"'>\n";
    	str += "<div class='buttonBox'><button id='submit'>요청하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	if($(this).hasClass('resend')) $("#framePopup h3").text("신용정보조회 동의 재요청");
    	else $("#framePopup h3").text("신용정보조회 동의 요청");
    	openPopupView(600,'framePopup');
    	$("#formEstmAgree input[name='buy']:input[value='"+buy+"']").click();
	});
	// 신용정보조회 동의
	$(document).on("click", "#formEstmAgree button#submit", function () {
		if($('#formEstmAgree [name="buy"]:checked').length==0 && $('#formEstmAgree [name="buy"]:checked').length==0){
			alert("고객 구분을 먼저 선택해 주세요.");
			return false;
		}else if($('#formEstmAgree [name="buy"]:checked').val()!="1" && (!$("#formEstmAgree input[name='compNm']").val() || $("#formEstmAgree input[name='compNm']").val().length<2)){
			alert("회사명을 입력해주세요.");
			$("#formEstmAgree input[name='compNm']").focus();
			return false;
		}else if($('#formEstmAgree [name="buy"]:checked').val()!="1" && (!$("#formEstmAgree input[name='compNo']").val() || $("#formEstmAgree input[name='compNo']").val().length<10)){
			alert("사업자 번호를 입력해주세요.");
			$("#formEstmAgree input[name='compNo']").focus();
			return false;
		}else if($('#formEstmAgree [name="buy"]:checked').val()!="1" && (!$("#formEstmAgree input[name='estDt']").val() || $("#formEstmAgree input[name='estDt']").val().length<8)){
			alert("설립일자를 입력해주세요.");
			$("#formEstmAgree input[name='estDt']").focus();
			return false;
		}else if($('#formEstmAgree [name="buy"]:checked').val()=="3" && (!$("#formEstmAgree input[name='corRegsNo']").val() || $("#formEstmAgree input[name='corRegsNo']").val().length<13)){
			alert("법인등록번호를 입력해주세요.");
			$("#formEstmAgree input[name='corRegsNo']").focus();
			return false;
		}else if((!$("#formEstmAgree input[name='custNm']").val() || $("#formEstmAgree input[name='custNm']").val().length<2)){
			alert($("#formEstmAgree .fincBuy.name").text()+"을 입력해주세요.");
			$("#formEstmAgree input[name='custNm']").focus();
			return false;
		}else if((!$("#formEstmAgree input[name='phone']").val() || $("#formEstmAgree input[name='phone']").val().length<10)){
			alert($("#formEstmAgree .fincBuy.phone").text()+"를 입력해주세요.");
			$("#formEstmAgree input[name='phone']").focus();
			return false;
		}else if((!$("#formEstmAgree input[name='birth']").val() || $("#formEstmAgree input[name='birth']").val().length<8)){
			alert($("#formEstmAgree .fincBuy.birth").text()+"를 입력해주세요.");
			$("#formEstmAgree input[name='birth']").focus();
			return false;
		}else if($("#formEstmAgree input[name='ageCut']").val() && $("#formEstmAgree input[name='birth']").val()<(yyyy-parseInt($("#formEstmAgree input[name='ageCut']").val())-1)+""+mm+""+dd){
			alert("만 "+($("#formEstmAgree input[name='ageCut']").val())+"세 초과는 신청이 제한됩니다.");
			$("#formEstmAgree input[name='birth']").focus();
			return false;
		}else if($('#formEstmAgree [name="buy"]:checked').val()=="3" && (!$("#formEstmAgree input[name='rpsrAsmtDt']").val() || $("#formEstmAgree input[name='rpsrAsmtDt']").val().length<8)){
			alert("대표자 취임일자를 입력해주세요.");
			$("#formEstmAgree input[name='rpsrAsmtDt']").focus();
			return false;
		}else{
			$('.layerPopup').css("display","none");
			 openLoading();
			 if($("#formEstmConfirm input[name='type']").val()=="estm"){
				 estmConfig['name'] = $("#formEstmAgree input[name='custNm']").val();
			 }
			 var Dpath = "request";
			 var url = "/api/apply/get";
			 url +="?custNm="+encodeURI($("#formEstmAgree input[name='custNm']").val());
			 url +="&fno="+$('#formEstmAgree [name="fno"]').val();
			 url +="&goods="+$('#formEstmAgree [name="goods"]').val();
			 url +="&job="+$('#formEstmAgree [name="job"]').val();
			 url +="&no="+$('#formEstmAgree [name="no"]').val();
			 url +="&key="+$('#formEstmAgree [name="key"]').val();
			 url +="&type="+$('#formEstmAgree [name="type"]').val();
			 url +="&buy="+$('#formEstmAgree [name="buy"]:checked').val();
			 url +="&phone="+$('#formEstmAgree [name="phone"]').val();
			 url +="&compNo="+$('#formEstmAgree [name="compNo"]').val();
			 url +="&compNm="+encodeURI($('#formEstmAgree [name="compNm"]').val());
			 url +="&corRegsNo="+$('#formEstmAgree [name="corRegsNo"]').val();
			 url +="&rpsrAsmtDt="+$('#formEstmAgree [name="rpsrAsmtDt"]').val();
			 url +="&estDt="+$('#formEstmAgree [name="estDt"]').val();
			 url +="&birth="+$('#formEstmAgree [name="birth"]').val();
			 getjsonApi(url,Dpath);
			 //ajaxSubmit("formEstmConfirm");
			 return false;
		}
	});
	// 심사신청 신청
	$(document).on("click", "button.btnEstmCredit", function () {
		if($(this).hasClass("gray")){
			return false;
		}
		var no = $(this).parent().attr("no");
		$obj = $("#list_"+no);
		var key = $obj.attr("key");
		if($obj.attr("goods")=="LK") var goodsKind = "loan";
		else if($obj.attr("goods")=="LG") var goodsKind = "lease";
		else var goodsKind = "rent";
		var fno = $obj.attr("fno");
		var hno = $obj.attr("hno");
		
		var str = "<form id='formEstmCerdit' action='/api/apply/post' method='POST'>\n";
		str += "<div>하나캐피탈 심사를 신청합니다.</div>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='credit'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='fno' value='"+fno+"'>\n";
    	str += "<input type='hidden' name='hno' value='"+hno+"'>\n";
    	str += "<input type='hidden' name='type' value='save'>\n";
    	str += "<div class='buttonBox'><button id='submit'>신청하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("심사 신청");
    	openPopupView(600,'framePopup');
	});
	// 심사 신청
	$(document).on("click", "#formEstmCerdit button#submit", function () {
		$('.layerPopup').css("display","none");
		 openLoading();
		 var Dpath = "request";
		 var url = "/api/apply/get";
		 url +="?fno="+$('#formEstmCerdit [name="fno"]').val();
		 url +="&goods="+$('#formEstmCerdit [name="goods"]').val();
		 url +="&job="+$('#formEstmCerdit [name="job"]').val();
		 url +="&no="+$('#formEstmCerdit [name="no"]').val();
		 url +="&key="+$('#formEstmCerdit [name="key"]').val();
		 url +="&type="+$('#formEstmCerdit [name="type"]').val();
		 url +="&hno="+$('#formEstmCerdit [name="hno"]').val();
		 getjsonApi(url,Dpath);
		 //ajaxSubmit("formEstmConfirm");
		 return false;
	});
	// 발주 요청 신청
	$(document).on("click", "button.btnEstmOrder", function () {
		var no = $(this).parent().attr("no");
		$obj = $("#list_"+no);
		var key = $obj.attr("key");
		if($obj.attr("goods")=="LK") var goodsKind = "loan";
		else if($obj.attr("goods")=="LG") var goodsKind = "lease";
		else var goodsKind = "rent";
		var fno = $obj.attr("fno");
		var hno = $obj.attr("hno");
		
		var str = "<form id='formEstmOrder' action='/api/apply/order' method='POST'>\n";
		str += "<div>하나캐피탈 발주를 요청합니다.</div>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='order'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='fno' value='"+fno+"'>\n";
    	str += "<input type='hidden' name='hno' value='"+hno+"'>\n";
    	str += "<input type='hidden' name='type' value='save'>\n";
    	str += "<div class='buttonBox'><button id='submit'>발주 요청하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("발주 요청");
    	openPopupView(600,'framePopup');
	});
	$(document).on("click", "#formEstmOrder button#submit", function () {
		$('.layerPopup').css("display","none");
		 openLoading();
		 var Dpath = "requestOrder";
		 var url = "/api/apply/get";
		 url +="?fno="+$('#formEstmOrder [name="fno"]').val();
		 url +="&goods="+$('#formEstmOrder [name="goods"]').val();
		 url +="&job="+$('#formEstmOrder [name="job"]').val();
		 url +="&no="+$('#formEstmOrder [name="no"]').val();
		 url +="&key="+$('#formEstmOrder [name="key"]').val();
		 url +="&type="+$('#formEstmOrder [name="type"]').val();
		 url +="&hno="+$('#formEstmOrder [name="hno"]').val();
		 getjsonApi(url,Dpath);
		 return false;
	});
	// 발주 요청 신청
	$(document).on("click", "button.btnEstmCancle", function () {
		var no = $(this).parent().attr("no");
		$obj = $("#list_"+no);
		var key = $obj.attr("key");
		if($obj.attr("goods")=="LK") var goodsKind = "loan";
		else if($obj.attr("goods")=="LG") var goodsKind = "lease";
		else var goodsKind = "rent";
		var fno = $obj.attr("fno");
		var hno = $obj.attr("hno");
		var str = "<form id='formEstmCancle' action='/api/apply/cancle' method='POST'>\n";
		str += "<div>하나캐피탈 발주요청을 취소합니다.</div>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='cancle'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='fno' value='"+fno+"'>\n";
    	str += "<input type='hidden' name='hno' value='"+hno+"'>\n";
    	str += "<input type='hidden' name='type' value='save'>\n";
    	str += "<div class='buttonBox'><button id='submit'>요청 취소하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("발주요청 취소");
    	openPopupView(600,'framePopup');
	});
	$(document).on("click", "#formEstmCancle button#submit", function () {
		$('.layerPopup').css("display","none");
		 openLoading();
		 var Dpath = "requestCancle";
		 var url = "/api/apply/get";
		 url +="?fno="+$('#formEstmCancle [name="fno"]').val();
		 url +="&goods="+$('#formEstmCancle [name="goods"]').val();
		 url +="&job="+$('#formEstmCancle [name="job"]').val();
		 url +="&no="+$('#formEstmCancle [name="no"]').val();
		 url +="&key="+$('#formEstmCancle [name="key"]').val();
		 url +="&type="+$('#formEstmCancle [name="type"]').val();
		 url +="&hno="+$('#formEstmCancle [name="hno"]').val();
		 getjsonApi(url,Dpath);
		 return false;
	});
	// 인도 요청
	$(document).on("click", "button.btnEstmDelivery", function () {
		var no = $(this).parent().attr("no");
		$obj = $("#list_"+no);
		var key = $obj.attr("key");
		if($obj.attr("goods")=="LK") var goodsKind = "loan";
		else if($obj.attr("goods")=="LG") var goodsKind = "lease";
		else var goodsKind = "rent";
		var fno = $obj.attr("fno");
		var hno = $obj.attr("hno");
		var str = "<form id='formEstmDelivery' action='/api/apply/delivery' method='POST'>\n";
		str += "<div class='editBox'>";
		str += "<div>하나캐피탈 탁송을 신청합니다.</div>";
		str += "<dl>";
    	str += "<dt class='fincBuy'>인도지 담당자</dt><dd class='fincBuy full' kind='C'><input type='text' name='name1' value='' placeholder='담당자명'></dd>";
    	str += "<dt class='fincBuy phone'>담당자 연락처</dt><dd class='fincBuy full' kind='N'><input type='text' name='phone1' value='' maxlength='11'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='전화번호, 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy'>인도지 담당자2</dt><dd class='fincBuy full' kind='C'><input type='text' name='name2' value='' placeholder='담당자명'></dd>";
    	str += "<dt class='fincBuy phone'>담당자 연락처2</dt><dd class='fincBuy full' kind='N'><input type='text' name='phone2' value='' maxlength='11'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='전화번호, 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy'>인도 요청일</dt>";
    	str += "<dd class='fincBuy' kind='C'>";
    	str += "<input type='text' name='day' class='datepicker dateForm' value='' placeholder='인도요청일'>";
    	str += " <select name='hour'><option value=''>시간</option>";
    	for(h=8;h<=20;h++){
    		if(h<10) h2 = "0"+h;
    		else h2 = h;
    		str += "<option value='"+h2+"'>"+h+"시</option>";
    	}
    	str += "</select>";
    	str += " <select name='minute'><option value=''>분</option>";
    	for(m=0;m<5;m++){
    		if(m==0) m2 = "00";
    		else m2 = m*10;
    		str += "<option value='"+m2+"'>"+(m*10)+"분</option>";
    	}
    	str += "</select>";
    	str += "</dd>";
    	str += "<dt class='fincBuy phone'>인도지 우편번호</dt><dd class='fincBuy full' kind='N'><input type='text' name='post' value='' maxlength='5'  onkeypress='onlyNumber();' pattern='[0-9]*' inputmode='numeric' onKeyup='this.value=this.value.replace(/[^0-9]/g,\"\");' placeholder='5자리 숫자만 입력'></dd>";
    	str += "<dt class='fincBuy'>인도지 주소</dt><dd class='fincBuy full' kind='C'><input type='text' name='addr1' value='' placeholder='주소'></dd>";
    	str += "<dt class='fincBuy'>인도지 상세주소</dt><dd class='fincBuy full' kind='C'><input type='text' name='addr2' value='' placeholder='상세 주소'></dd>";
    	str += "<dt class='fincBuy'>비고</dt><dd class='fincBuy full' kind='C'><input type='text' name='memo' value='' placeholder=''></dd>";
    	str += "</dl>";
    	str += "<input type='hidden' name='goods' value='"+goodsKind+"'>";
    	str += "<input type='hidden' name='job' value='delivery'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<input type='hidden' name='key' value='"+key+"'>\n";
    	str += "<input type='hidden' name='fno' value='"+fno+"'>\n";
    	str += "<input type='hidden' name='hno' value='"+hno+"'>\n";
    	str += "<input type='hidden' name='type' value='save'>\n";
    	str += "<div class='buttonBox'><button id='submit'>인도 요청하기</button>";
    	str += "</div>\n";
    	str += "</div>";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("인도요청");
    	openPopupView(600,'framePopup');
    	$(".layerPopup").css("z-index",10);
    	
    	$(".ui-datepicker-trigger").remove();
    	$(".datepicker").removeClass('hasDatepicker').datepicker({
    		showOtherMonths: true,
          	selectOtherMonths: true,
          	showButtonPanel: true,
          	showMonthAfterYear:true,
            currentText: '오늘 날짜',
            closeText: '닫기',
            dateFormat: "yy-mm-dd",
            minDate: new Date(),
            dayNames: [ '일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], 
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
        });
    	
	});
	$(document).on("click", "#formEstmDelivery button#submit", function () {
		if(!$("#formEstmDelivery input[name='name1']").val() || $("#formEstmDelivery input[name='name1']").val().length<2){
			alert("담당자를 입력해주세요.");
			$("#formEstmDelivery input[name='name1']").focus();
			return false;
		}else if(!$("#formEstmDelivery input[name='phone1']").val() || $("#formEstmDelivery input[name='phone1']").val().length<9){
			alert("담당자 연락처를 입력해주세요.");
			$("#formEstmDelivery input[name='phone1']").focus();
			return false;
		}else if($("#formEstmDelivery input[name='phone2']").val() && $("#formEstmDelivery input[name='phone2']").val().length<9){
			alert("담당자 연락처2를 정확히 입력해주세요.");
			$("#formEstmDelivery input[name='phone2']").focus();
			return false;
		}else if(!$("#formEstmDelivery input[name='day']").val()){
			alert("인도 요청일을 입력해주세요.");
			$("#formEstmDelivery input[name='day']").focus();
			return false;
		}else if(!$("#formEstmDelivery select[name='hour']").val() || !$("#formEstmDelivery select[name='minute']").val()){
			alert("인도 시간을 선택해주세요.");
			return false;
		}else if(!$("#formEstmDelivery input[name='post']").val() || $("#formEstmDelivery input[name='post']").val().length<5){
			alert("우편번호를 입력해주세요.");
			$("#formEstmDelivery input[name='post']").focus();
			return false;
		}else if(!$("#formEstmDelivery input[name='addr1']").val() || $("#formEstmDelivery input[name='addr1']").val().length<10){
			alert("인도지 주소를 정확하게 입력해주세요.");
			$("#formEstmDelivery input[name='addr1']").focus();
			return false;
		}else if(!$("#formEstmDelivery input[name='addr2']").val() || $("#formEstmDelivery input[name='addr2']").val().length<2){
			alert("인도지 상세주소를 입력해주세요.");
			$("#formEstmDelivery input[name='addr2']").focus();
			return false;
		}else{
			//$('.layerPopup').css("display","none");
			 //openLoading();
			 var Dpath = "requestDelivery";
			 var url = "/api/apply/get";
			 url +="?fno="+$('#formEstmDelivery [name="fno"]').val();
			 url +="&goods="+$('#formEstmDelivery [name="goods"]').val();
			 url +="&job="+$('#formEstmDelivery [name="job"]').val();
			 url +="&no="+$('#formEstmDelivery [name="no"]').val();
			 url +="&key="+$('#formEstmDelivery [name="key"]').val();
			 url +="&type="+$('#formEstmDelivery [name="type"]').val();
			 url +="&hno="+$('#formEstmDelivery [name="hno"]').val();
			 url +="&name1="+encodeURI($('#formEstmDelivery [name="name1"]').val());
			 url +="&phone1="+$('#formEstmDelivery [name="phone1"]').val();
			 url +="&name2="+encodeURI($('#formEstmDelivery [name="name2"]').val());
			 url +="&phone2="+$('#formEstmDelivery [name="phone2"]').val();
			 url +="&day="+$('#formEstmDelivery [name="day"]').val();
			 url +="&hour="+$('#formEstmDelivery [name="hour"]').val();
			 url +="&minute="+$('#formEstmDelivery [name="minute"]').val();
			 url +="&post="+$('#formEstmDelivery [name="post"]').val();
			 url +="&addr1="+encodeURI($('#formEstmDelivery [name="addr1"]').val());
			 url +="&addr2="+encodeURI($('#formEstmDelivery [name="addr2"]').val());
			 url +="&memo="+encodeURI($('#formEstmDelivery [name="memo"]').val());
			 getjsonApi(url,Dpath);
			 return false;
		}
	});
	
	// 심사 신청
	$(document).on("click", "button.btnEstmMemo", function () {
		var no = $(this).attr("no");
		$obj = $("#list_"+no);
		var name = $obj.find(".customer").text();
		var subject = $obj.find(".subj").text();
		var counsel = $obj.find(".memo span").text();
		
		var str = "<form id='formEstmMemo' action='/api/estimate' method='POST'>\n";
		str += "<div class='editBox'>";
    	str += "<dl>";
		str += "<dt>고객</dt><dd class='small'><input type='text' name='name' value='"+name+"' placeholder='고객명'>님 귀중</dd>";
		str += "<dt>견적 제목</dt><dd class='full'><input type='text' name='subject' value='"+subject+"' placeholder='견적을 구분할 수 있는 간단한 문구'></dd>";
    	str += "<dt>상담 기록</dt><dd><textarea name='counsel'>"+counsel+"</textarea></dd>";
    	str += "</dl>";
    	str += "<input type='hidden' name='job' value='mod'>\n";
    	str += "<input type='hidden' name='no' value='"+no+"'>\n";
    	str += "<div class='buttonBox'><button id='submit'>기록하기</button>";
    	str += "</div>\n";
    	str += "</form>";
    	$("#framePopup .content").html(str);
    	$("#framePopup h3").text("견적 기록");
    	openPopupView(600,'framePopup');
	});
	// 견적 확정 버튼
	$(document).on("click", "#formEstmMemo button#submit", function () {
		if(!$("#formEstmMemo input[name='name']").val() || $("#formEstmMemo input[name='name']").val().length<2){
			alert("고객명을 입력해주세요.");
			$("#formEstmMemo input[name='name']").focus();
			return false;
		}
	});
	// 견적서 입력 폼 변경
	$(document).on("blur", "#formEstmSave input[type='text'], #formEstmSave textarea", function () {
		var job = $("#formEstmSave input[name='job']").val();
		if(job!='mod'){
			var name = $(this).attr('name');
			var val = $(this).val();
			estmConfig[name] = val;
			if(name=="name"){
				if(val) $("#estmDocu .cName").text(val);
				else $("#estmDocu .cName").text("VIP 고객");
				if(deviceType=="app"){
					sendConfigToMain("customer",val,"");
				}
			}
		}
    });
	// 견적서 입력 폼 변경
	$(document).on("click", "#formEstmAgree input[name='buy']", function () {
		var kind = $(this).val();
		$("#formEstmAgree .fincBuy").addClass('off');
		if(kind=="3"){
			$("#formEstmAgree .fincBuy[kind='C']").removeClass('off');
			$("#formEstmAgree .fincBuy[kind='B']").removeClass('off');
			$("#formEstmAgree .fincBuy.name").text("대표자 이름");
			$("#formEstmAgree .fincBuy.phone").text("대표자 휴대폰");
			$("#formEstmAgree .fincBuy.birth").text("대표 생년월일");
		}else if(kind=="2"){
			$("#formEstmAgree .fincBuy[kind='C']").removeClass('off');
			$("#formEstmAgree .fincBuy.name").text("대표자 이름");
			$("#formEstmAgree .fincBuy.phone").text("대표자 휴대폰");
			$("#formEstmAgree .fincBuy.birth").text("대표 생년월일");
		}else{
			$("#formEstmAgree .fincBuy.name").text("고객 이름");
			$("#formEstmAgree .fincBuy.phone").text("고객 휴대폰");
			$("#formEstmAgree .fincBuy.birth").text("고객 생년월일");
		}
		$("#formEstmAgree .fincBuy[kind='N']").removeClass('off');
		openPopupView(600,'framePopup');
    });
	// 견적 저장 버튼
	$(document).on("click", "#formEstmSave button#submit, #formEstmSave button#submitM", function () {
		popupReload = false;
		var job = $("#formEstmSave input[name='job']").val();
		var type = $("#formEstmSave input[name='type']").val();
		if(job=="sms" || job=="fax"){
			var phone = number_only($("#formEstmSave input[name='to']").val());
			if($(this).attr("id")=="submitM"){
				var from = "app";
				$("#formEstmSave input[name='way']").val("app");
			}else if(job=="sms"){
				var from = $("#formEstmSave input[name='from']:checked").val();
				$("#formEstmSave input[name='way']").val("web");
			}else{
				var from = $("#formEstmSave input[name='from']").val();
			}
		}
		
		if( ($("#formEstmSave input[name='name']").length && !$("#formEstmSave input[name='name']").val()) && ($("#formEstmSave input[name='subject']").length && !$("#formEstmSave input[name='subject']").val()) ){
			alert("고객 이름이나 견적 제목을 입력해 주세요.");
			if($("#formEstmSave input[name='name']").length && !$("#formEstmSave input[name='name']").val()) $("#formEstmSave input[name='name']").focus();
			else $("#formEstmSave input[name='subject']").focus();
			return false;
		}else if(job=="fax" && phone.length<8){
			alert("팩스번호를 정확히 입력해 주세요.");
			$("#formEstmSave input[name='to']").focus();
			return false;
		}else if(job=="sms" && (phone.length<10 || phone.substring(0,1))!=0){
			alert("휴대폰 번호를 정확히 입력해 주세요.");
			$("#formEstmSave input[name='to']").focus();
			return false;
		}else if(job=="sms" && parseInt($("#commentLen").text())>parseInt($("#commentMax").text())){
			alert("문자 메세지를 "+$("#commentMax").text()+" Byte 이내로 입력해 주세요.");
			$("#formEstmSave textarea[name='msg']").focus();
			return false;
		}else if(job=="sms" && $("#formEstmSave input[name='cost']").val()==100 && $("#formEstmSave input[name='subj']").val()==""){
			alert("문자 메세지를 제목을 입력해 주세요.");
			$("#formEstmSave input[name='subj']").focus();
			return false;
		}else if(job=="sms" && from=="app" && $("#formEstmSave input[name='jpg']:checked").val()==1){
			alert("App 발송은 SMS 만 가능합니다. MMS는 Web발신으로 처리되니 발신번호를 변경하여 주시기 바랍니다.");
			return false;
		}else if((job=="sms" || job=="fax") && parseInt($("#formEstmSave input[name='pointNow']").val())<parseInt($("#formEstmSave input[name='cost']").val()) && from!="app"){
			alert("포인트가 부족하여 발송할 수 없습니다.");
			return false;
		}else if((job=="sms" || job=="fax") && $("#formEstmSave input[name='noFrom']").length && from!="app"){
			alert("발신번호가 등록되지 않아 발송되지 않습니다.");
			return false;
		}else if(job=="mail" && (!$("#formEstmSave input[name='to']").val() || !validateEmail($("#formEstmSave input[name='to']").val()))){
			alert("email을 정확히 입력해 주세요.");
			$("#formEstmSave input[name='to']").focus();
			return false;
		}else if(job=="mail" && !$("#formEstmSave input[name='msg']").val()){
			alert("메일 제목을 입력해 주세요.");
			$("#formEstmSave input[name='msg']").focus();
			return false;
		}else if(job=="finc" && $('#formEstmSave [name="fno"]:checked').length==0 && $('#formEstmSave [name="fno"]:checked').length==0){
			alert("심사를 진행할 최종 견적을 선택해 주세요.");
			return false;
		}else if(job=="finc" && $('#formEstmSave [name="buy"]:checked').length==0 && $('#formEstmSave [name="buy"]:checked').length==0){
			alert("고객 구분을 먼저 선택해 주세요.");
			return false;
		}else if(job=="finc" && $('#formEstmSave [name="buy"]:checked').val()!="1" && (!$("#formEstmSave input[name='compNm']").val() || $("#formEstmSave input[name='compNm']").val().length<2)){
			alert("회사명을 입력해주세요.");
			$("#formEstmSave input[name='compNm']").focus();
			return false;
		}else if(job=="finc" && $('#formEstmSave [name="buy"]:checked').val()!="1" && (!$("#formEstmSave input[name='compNo']").val() || $("#formEstmSave input[name='compNo']").val().length<10)){
			alert("사업자 번호를 입력해주세요.");
			$("#formEstmSave input[name='compNo']").focus();
			return false;
		}else if(job=="finc" && (!$("#formEstmSave input[name='custNm']").val() || $("#formEstmSave input[name='custNm']").val().length<2)){
			alert($("#formEstmSave .fincBuy.name").text()+"을 입력해주세요.");
			$("#formEstmSave input[name='custNm']").focus();
			return false;
		}else if(job=="finc" && (!$("#formEstmSave input[name='phone2']").val() || $("#formEstmSave input[name='phone2']").val().length<3)){
			alert($("#formEstmSave .fincBuy.phone").text()+"를 입력해주세요.");
			$("#formEstmSave input[name='phone2']").focus();
			return false;
		}else if(job=="finc" && (!$("#formEstmSave input[name='phone3']").val() || $("#formEstmSave input[name='phone3']").val().length<4)){
			alert($("#formEstmSave .fincBuy.phone").text()+"를 입력해주세요.");
			$("#formEstmSave input[name='phone3']").focus();
			return false;
		}else if(job=="finc" && (!$("#formEstmSave select[name='year']").val() || !$("#formEstmSave select[name='month']").val() || !$("#formEstmSave select[name='day']").val())){
			alert($("#formEstmSave .fincBuy.birth").text()+"을 선택해주세요.");
			return false;
		}else{
			/*if($("#formEstmSave input[name='name']").length && $("#formEstmSave input[name='name']").val()){
				var infoC = $("#formEstmSave input[name='name']").val()+"\t"+$("#formEstmSave input[name='title']").val()+"\t"+$("#formEstmSave input[name='phone']").val();
				if($("#formEstmSave input[name='type']").val()=="save" &&  $("#customerEdit").val()!=infoC){
					$("#customerEdit").val(infoC);
					if(deviceType=="app"){
						sendConfigToMain("customer",infoC);
						window.app.callWebToWeb("main","saveEstmDocuForm","");
					}else{
						saveEstmDocuForm();
					}
				}
			}
			*/
			if(type=="estm"){
	        	if(deviceType=="app"){
	        		window.app.callWebToWeb("main","saveEstmDataForm","");
	        	}else{
	        		saveEstmDataForm();
	        	}
	        	saveEstmDocuForm();
			}
			if(job=="url" || job=="pdf" || job=="jpg" || job=="print"){
				//newWindow = window.open("about:blank", "_blank");
			}
			if(job=="finc"){
				$('.layerPopup').css("display","none");
				ajaxSubmit("formEstmSave");
				return false;
			}else if(job!="mod"){
				$('.layerPopup').fadeOut();
				if(deviceType=="app"){
					setTimeout(function() {
						ajaxSubmit("formEstmSave");
		    		}, 500);
				}else{
					ajaxSubmit("formEstmSave");
				}
				return false;
			}
		}
	});
	
	// 기본 설정
	$(document).on("click", "#estmBtnConfig", function () {
		getConfigForm();
	});
	$(document).on("click", "#formEstmConfig button", function () {
		if(confirm("다음 견적부터 반영됩니다. 설정을 저장하시겠습니까?")){
			ajaxSubmit("formEstmConfig");
		}
		return false;
	});
	
	// 견적 모드 변경
    $(document).on("click", "#changeGoods", function () {
    	if(typeof(estmCode.trim)=="undefined"){
    		window.location.href = "/newcar/estimate/"+$(this).attr("goods");
		}else{
			if(confirm("트림과 색상, 옵션까지만 승계됩니다(할인, 직접입력 제외). 현재 페이지가 "+$(this).text()+"으로 이동되어 작성하던 견적이 사라집니다. "+$(this).text()+"로 이동하시겠습니까?")){
				var str = "model\t"+estmRslt.model;
		    	str += "\ntrim\t"+estmRslt.trim+"\noption\t"+estmRslt.option+"\ncolorExt\t"+estmRslt.colorExt+"\ncolorInt\t"+estmRslt.colorInt;
		    	$.cookie("start", str, {path: "/", domain: location.host});
		    	window.location.href = "/newcar/estimate/"+$(this).attr("goods");
	    	}
		}
    });
    // 즉시출고에서 이동
    $(document).on("click", "#fastshipView .contract > button", function () {
		if(confirm("견적으로 이동됩니다. 다른 트림이나 옵션, 색상으로 변경하면 선구매•즉시출고로 취급되지 않습니다. 다른 차량으로 변경하시려면 이 화면에서 다시 선택해 주셔야 합니다.")){
			var model = $(this).parent().parent().attr('model');
			var trim = $(this).parent().parent().attr('trim');
			var colorExt = $(this).parent().parent().attr('colorExt');
			var colorInt = $(this).parent().parent().attr('colorInt');
			var option = $(this).parent().parent().attr('option');
			var delivery = $(this).parent().parent().attr('delivery');
			var kind = $(this).parent().parent().attr('kind');
			var str = "model\t"+model;
	    	str += "\ntrim\t"+trim+"\noption\t"+option+"\ncolorExt\t"+colorExt+"\ncolorInt\t"+colorInt+"\ndelivery\t"+delivery;
	    	str += "\nfastship\t"+$(this).attr("vin");
	    	str += "\nfastKind\t"+kind;
	    	$.cookie("start", str, {path: "/", domain: location.host});
	    	window.location.href = "/newcar/estimate/rent";
    	}
    });

	$(document).on("click", "#btnCarnumSearch", function () {
		var num = $(this).prev().val();
		if((num.length==8 && number_only(num).length==7)  || (num.length==7 && number_only(num).length==6)){
			getApiTestdriveInfo(num);
		}else{
			alertPopup("차량번호를 정확히 입력해주세요.");
			return false;
		}
    });

	$(document).on("click", "#btnCarnameSearch", function () {
		var name = $(this).prev().val();
		var regYM = "";
		var certify = fincConfig[estmNow][0]['certifyYN'];
		if(typeof(fincConfig[estmNow][0]['regY'])!="undefined" && fincConfig[estmNow][0]['regY']) regYM += fincConfig[estmNow][0]['regY'];
		if(typeof(fincConfig[estmNow][0]['regM'])!="undefined" && fincConfig[estmNow][0]['regM']) regYM += fincConfig[estmNow][0]['regM'];
		if(regYM.length<6){
			alertPopup("등록년월을 선택해주세요..");
			$obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
			$obj.find(".selsub[kind='regYMSel'] > button").click();
			return false;
		}else if(name.length<2){
			alertPopup("차량명칭을 2글자 이상 정확히 입력해주세요.");
			return false;
		}else{
			fincConfig[estmNow][0]['search'] = name;
			getApiUsedcarList(name,regYM,certify);
		}
    });

});
// 가격표에서 넘어와서 견적 시작하기
function startEstimate(dat){
	estmChangeKind = "start";
	var tmp = dat.split("\n");
	start = {};
	for(var t in tmp){
		var val = tmp[t].split("\t");
		start[val[0]] = val[1];
	}
	if(typeof(start.fastship)!="undefined"){
		defaultCfg['takeType'] = "20";		// 출고(직판)
		$obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		$obj.find("input[name='takeType']").prop("checked",false);
		$obj.find("input[name='takeType'][value='20']").prop("checked",true);
	}
	if(typeof(start.model)!="undefined"){
		if(typeof(start.testride)!="undefined" && start.testride) var url = "/api/auto/modelUsed_"+start.model+"?token="+token;
		else var url = "/api/auto/modelData_"+start.model+"?token="+token;
		var Dpath = "modelData"+start.model;
		getjsonData(url,Dpath);
		if(typeof(dataBank[Dpath]['brand']['131'])!="undefined") dataBank[Dpath]['brand']['131']['name'] = "한국GM";
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
		if(typeof(start.trim)!="undefined"){
			estmCode = {};
	    	estmCode['trim'] = start.trim;
	    	estmCode['lineup'] =  dataBank[Dpath]['trim'][start.trim]['lineup'];
	    	estmCode['model'] = start.model;
	    	estmCode['brand'] = dataBank[Dpath]['model'][start.model]['brand'];
	    	
	    	$obj.find(".selbar[kind='trim']").attr("code",estmCode.trim);
	    	$obj.find(".selbar[kind='lineup']").attr("code",estmCode.lineup);
	    	$obj.find(".selbar[kind='model']").attr("code",estmCode.model);
	    	$obj.find(".selbar[kind='brand']").attr("code",estmCode.brand);
	    	var oList = "";
			if(typeof(start.option)!="undefined" && start.option){
				tmp =  dataBank[Dpath]['trim'][start.trim]['option'].split("\n");
				for(var c in tmp){
					var val = tmp[c].split("\t");
					if(start.option.indexOf(val[0])>=0){
						var dat = dataBank[Dpath]['option'][val[0]];
						if(oList != "") oList +="\n";
						oList += val[0]+"\t"+val[1]+"\t"+dat.name+"\t"+val[2];
					}
				}
			}
			if(typeof(start.trimPrice)!="undefined" && start.trimPrice!=dataBank[Dpath]['trim'][estmCode['trim']]['price']){
				if(oList != "") oList +="\n";
				oList += "S\t"+(start.trimPrice-dataBank[Dpath]['trim'][estmCode['trim']]['price'])+"\t최종차량가(+/-) 반영\t";
			}
			estmConfig[estmNow]['option'] = oList;
			var ext = "";
			if(typeof(start.colorExt)!="undefined" && start.colorExt && start.colorExt.substring(0,1)!="S"){
				if(typeof(dataBank[Dpath]['trim'][estmCode['trim']]['colorExt'])!="undefined") color = dataBank[Dpath]['trim'][estmCode['trim']]['colorExt'];
				else if(typeof(dataBank[Dpath]['lineup'][estmCode['lineup']]['colorExt'])!="undefined") color = dataBank[Dpath]['lineup'][estmCode['lineup']]['colorExt'];
				else color = dataBank[Dpath]['model'][estmCode['model']]['colorExt'];
				tmp = color.split("\n");
				for(var c in tmp){
					var val = tmp[c].split("\t");
					if(start.colorExt==val[0]){
						var dat = dataBank[Dpath]['colorExt'][val[0]];
						if(dat.code) var code = "("+dat.code+")";
						else var code = "";
						if(dat.group) code += " - "+dat.group;
						var rgb =dat.rgb+"/"+dat.rgb2;
						ext = val[0]+"\t"+val[1]+"\t"+dat.name+code+"\t"+rgb; 
					}
				}
			}
			estmConfig[estmNow]['colorExt'] = ext;
			var int = "";
			if(typeof(start.colorInt)!="undefined" && start.colorInt && start.colorInt.substring(0,1)!="S"){
				if(typeof(dataBank[Dpath]['trim'][estmCode['trim']]['colorInt'])!="undefined") color = dataBank[Dpath]['trim'][estmCode['trim']]['colorInt'];
				else if(typeof(dataBank[Dpath]['lineup'][estmCode['lineup']]['colorInt'])!="undefined") color = dataBank[Dpath]['lineup'][estmCode['lineup']]['colorInt'];
				else color = dataBank[Dpath]['model'][estmCode['model']]['colorInt'];
				tmp = color.split("\n");
				for(var c in tmp){
					var val = tmp[c].split("\t");
					if(start.colorInt==val[0]){
						var dat = dataBank[Dpath]['colorInt'][val[0]];
						if(dat.code) var code = "("+dat.code+")";
						else var code = "";
						if(dat.group) code += " - "+dat.group;
						var rgb =dat.rgb+"/"+dat.rgb2;
						int = val[0]+"\t"+val[1]+"\t"+dat.name+code+"\t"+rgb; 
					}
				}
			}
			estmConfig[estmNow]['colorInt'] = int;
			
			if(typeof(start.delivery)!="undefined" && start.delivery){
				fincConfig[estmNow][0]['deliveryMaker'] = start.delivery;
			}
			if(typeof(start.dealerShop)!="undefined" && start.dealerShop){
				defaultCfg['dealerShop'] = start.dealerShop;
				$obj.find(".selsub[kind='dealerShopSel']").attr("code","not");
			}
			if(typeof(start.testride)!="undefined" && start.testride){
				fincConfig[estmNow][0]['testride'] = start.testride;
			}
			// 카판 연동 추가
			if(typeof(start.finc)!="undefined" && start.finc){
				var msg = "";
				var sidoArr = {"SU":"001","KG":"011","IC":"009","KW":"034","DJ":"006","SJ":"032","CB":"013","CN":"012","BS":"004","DG":"005","US":"015","GB":"017","GN":"016","KJ":"007","JB":"019","JN":"018"}; 				// 카판 시도 변환
				var val = start.finc.split("_");
				if(estmCode.brand<200) var local = "domestic";
				else var local = "imported";
	
				// estmStart['open'] = "carpan";	// defaultCfg
				// var kind = ["takeType","buyType","payType","regType","useBiz","goodsKind","cartaxAdd","insureAdd","careAdd","regTaxIn","regBondIn","regExtrIn","deliveryIn","insureAge","insureObj","insureCar","insureSelf","insureEmpYn","navigation","blackBox","sdrrTinting","frtTinting","feeAgR","feeCmR","deliveryType","deliverySido","deliveryShip","dealerShop","takeSido","branchShop","branchName","accountNum"];	// 공통설정 항목
				if(estmMode=="lease" && start.issue=="S"){
					if(msg) msg += "<br>";
					msg += "리스는 특판출고가 없습니다. 대리점 출고로 계산됩니다.";
					start.issue = "D";
					start.trans = 0;
					start.discount = 0;
				}
				
				if(start.issue=="S"){
					defaultCfg['takeType']="20";
					defaultCfg['deliveryType'] = "01";
					defaultCfg['deliverySido'] = sidoArr[start.trans];
					estmConfig[estmNow]['discount'] = 0;
				}else{
					defaultCfg['takeType']="10";
					fincConfig[estmNow][0]['deliveryMaker'] = start.trans;
					defaultCfg['deliveryType'] = "02"; 
					if(start.discount) estmConfig[estmNow]['discount'] = parseInt(start.discount) * -1;
					else estmConfig[estmNow]['discount'] = 0;
				}
				if(estmMode=="lease"){
					if(val[0].substring(0,1)=="U")  defaultCfg['regType'] = "2";
					if(val[0].substring(1,2)!="C"){
						if(msg) msg += "<br>";
						msg += "리스는 인수나 반납 선택이 없습니다. 선택형으로만 진행됩니다.";
					}
					if(val[8]=="O") defaultCfg['cartaxAdd'] = "Y"; 
				}else{
					if(val[0].substring(2,3)=="B")  defaultCfg['buyType'] = "2";
					else if(val[0].substring(2,3)=="C")  defaultCfg['buyType'] = "3";
					if(val[0].substring(3,4)=="Y")  defaultCfg['insureEmpYn'] = "Y";
					if(val[0].substring(1,2)=="F"){
						if(msg) msg += "<br>";
						msg += "렌트는 할부형 선택이 없습니다. 선택형으로 변경하여 진행됩니다.";
					}
					else if(val[0].substring(1,2)=="G")  defaultCfg['endType'] = "0002";
					else if(val[0].substring(1,2)=="T")  defaultCfg['endType'] = "0003";
					if(val[12]=="21") defaultCfg['insureAge'] = "02";
					if(val[13]>"3"){
						if(msg) msg += "<br>";
						msg += "대물 한도는 3억이 최대 입니다.";
						defaultCfg['insureObj'] = "06";
					}
					else if(val[13]=="3") defaultCfg['insureObj'] = "06";
					else if(val[13]=="2") defaultCfg['insureObj'] = "05";
					
				}
				// endType
				defaultCfg['month1'] = val[2];
				if(val[3]=="self")  defaultCfg['prepay1'] = val[4];
				else if(val[3].substring(0,1)=="F")  defaultCfg['prepay1'] = val[3].substring(1);
				else defaultCfg['prepay1'] = val[3];
				if(val[5]=="self")  defaultCfg['deposit1'] = val[6];
				else if(val[5].substring(0,1)=="F")  defaultCfg['deposit1'] = val[5].substring(1);
				else defaultCfg['deposit1'] = val[5];
				
				if(val[7]=="max") defaultCfg['remain'] = "100";		// 잔가율
				else if(val[7].substring(0,1)=="F")  defaultCfg['remain'] = val[7].substring(1);
				else defaultCfg['remain'] = val[7];
				
				
				defaultCfg['feeCmR'] = val[9];
				defaultCfg['feeAgR'] = val[10];
				if(val[11]=="0") {
					if(msg) msg += "<br>";
					msg += "약정거리 무제한은 적용되지 않습니다.";
				}
				else{
					var km = ""+parseFloat(val[11]*10000);
					if((estmMode=="rent" && typeof(dataBank['goodsConfig'][local]['km'][km])!="undefined") ||  (estmMode=="lease" && typeof(dataBank['goodsConfig'][local]['km']['opLeas'][km])!="undefined")){
						defaultCfg['km'] = km;
					}else{
						if(msg) msg += "<br>";
						msg += "약정거리 "+val[11]+"만km는 적용되지 않습니다.";
					}
				}
				var kind = ["takeType","buyType","regType","insureEmpYn","cartaxAdd"];	// 공통설정 항목
				for(var k in kind){
					if(typeof(defaultCfg[kind[k]])!="undefined"){
						$obj.find("input[name='"+kind[k]+"']").prop("checked",false);
						$obj.find("input[name='"+kind[k]+"'][value='"+defaultCfg[kind[k]]+"']").prop("checked",true);
					}
				}
				if(msg) alertPopup(msg);
			}
	    	arrangeEstmData("trim",estmCode['trim'])
			if(typeof(start.finc)!="undefined" && start.finc){
				defaultCfg['takeType']="10";
				defaultCfg['deliveryType'] = "01";
			}
			//arrangeView();
		}
	}
	//$.cookie("start", "", {path: "/", domain: location.host});
	//$.removeCookie("start", {path: "/", domain: location.host});
}
//견적 변수 저장
function saveEstmDataForm(){
	var dat = {};
	dat['estmData'] = estmData[estmNow];
	dat['estmCfg'] = estmConfig[estmNow];
	dat['fincData'] = fincData[estmNow];
	dat['fincCfg'] = fincConfig[estmNow];
	if(deviceType=="app"){
		sendDataToRight("data",window.btoa(encodeURIComponent(JSON.stringify(dat))));
	}else{
		$("#formEstmSave textarea[name='data']").val(JSON.stringify(dat));
	}
}
//견적 변수 저장
function saveEstmDocuForm(){
	var model = $("#estmDocu .eModel").text();
	var kind = $("#estmDocu .eHead").attr("kind");
	var docu = $("#estmDocu .estmRslt_estmDocu").html();
	$("#formEstmSave input[name='model']").val(model);
	$("#formEstmSave input[name='kind']").val(kind);
	$("#formEstmSave textarea[name='document']").val(docu);
}

// 견적 저장 리턴
function estmActReturn(job,no,key,type){
	var url = urlHost+"/D/E/"+key;
	if(job=="mod"){
		window.location.href = $("#metaUrl").attr("content");
		return false;
	}else if(job=="confirm"){
		$("#estmDocu .btnEstmConfirm").addClass("off");
		$("#estmDocu .btnEstmAgree").removeClass("off");
	}else if(job=="agree"){
		$("#estmDocu .btnEstmAgree").text("동의 요청됨");
		$("#estmDocu .btnEstmAgree").addClass("gray");
		$("#estmDocu .btnEstmAgree").removeClass("cyan");
	}else{
		estmConfig[estmNow]['saveNo'] = no;
		estmConfig[estmNow]['viewKey'] = key;
		
		//$("#estmDocu .urlBox").removeClass("off");
		//$("#estmDocu .urlBox input[name='shortcut']").val(url);
		//if(deviceType=="app") $("#estmDocu .urlBox .urlOpen").attr("href",url+"?webview=layer");
		//else $("#estmDocu .urlBox .urlOpen").attr("href",url);
		//$("#estmDocu .urlBox .urlSave").attr("href","/mypage/save/"+no);
		//$("#estmDocu .btnEstmAct[job='url']").addClass("off");
		$("#estmDocu .btnEstmAct[job='save']").text("저장됨");
		$("#estmDocu .btnEstmAct").addClass("gray");
		$("#estmDocu .btnEstmAct").removeClass("cyan");
		$("#estmDocu .btnEstmAct2").removeClass("gray");
		$("#estmDocu .btnEstmAct2").addClass("cyan");
		$("#estmDocu .btnEstmOffer").removeClass("gray");
		$("#estmDocu .btnEstmOffer").addClass("cyan");
		$("#estmDocu .btnEstmOffer").removeClass("off");
		$("#estmDocu .btnEstmOffer").attr("href",offerUrl+"&estdKey="+key);
		$("#estmDocu .btnEstmConfirm").removeClass("gray");
		$("#estmDocu .btnEstmConfirm").addClass("cyan");
		$("#estmDocu .btnEstmConfirm").removeClass("off");
		$("#estmDocu .btnEstmAgree").removeClass("gray");
		$("#estmDocu .btnEstmAgree").addClass("cyan");
		$("#estmDocu .btnEstmAgree").addClass("off");
		
		if(deviceType=="app"){
			sendConfigToMain("saveNo",no,"");
		}
	}
	/*
	if(type=="save" || type=="right"){
		if(deviceType=="app" && type=="save"){
			$obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
			if(tab.substring(0,1)=="M") $("#estmBody").attr("saveM",no);
			else $obj.attr("saveNo",no);
			var view = "main";
			var func = "estmActReturn";
			var cfg = {};
			cfg['job']=job;
			cfg['no']=no;
			cfg['key']=key;
			cfg['tab']=tab;
			cfg['type']="right";
			cfg['cNo']=cNo;
			cfg['subj']=subj;
			cfg['vars']="job,no,key,tab,type,cNo,subj";
			var dataJ = JSON.stringify(cfg);
			window.app.callWebToWeb(view,func,dataJ);
		}
		if(type!="right"){
			if(tab.substring(0,1)=="M") estmDoc['M'][tab] = key;
			else estmDoc[estmNow][tab] = key;
			$("#estmDocu .urlBox").removeClass("off");
			$("#estmDocu .urlBox input[name='shortcut']").val("http://m.ca8.kr/"+key);
			if(deviceType=="app") $("#estmDocu .urlBox .urlOpen").attr("href","http://m.ca8.kr/"+key+"?webview=layer");
			else $("#estmDocu .urlBox .urlOpen").attr("href","http://m.ca8.kr/"+key);
			$("#estmDocu .btnEstmAct[job='url']").addClass("off");
			$("#estmDocu .btnEstmAct[job='save']").text("저장됨");
			if(job=="save"){
				alertPopup("<div>견적이 저장되었습니다. <br><br>저장된 견적은 마이페이지에서 확인하실 수 있습니다.</div>");
			}
		}
		if(deviceType!="app" || type=="right"){
			if(tab.substring(0,1)=="M"){
				$("#estmBody").attr("saveM",no);
			}else{
				$obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
				if(subj) $obj.find(".estmSave_subject").text(subj);
				else $obj.find(".estmSave_subject").text("차량선택");
				$obj.attr("saveNo",no);
				$obj.find(".estmRslt_estmNo").text(no);
				$("#estmList li[estmNo='"+estmNow+"'] .no").text(no);
				$("#saveSubject").val(subj);
			}
		}
	}
	*/
	if(job=="save"){
		alertPopup("<div>견적이 저장되었습니다. 저장견적에서 확인하실 수 있습니다.</div>");
	}else if(job=="url" || job=="pdf" || job=="jpg" || job=="print"){
		$('.layerPopup').css("display","none");
		//var url = "http://m.ca8.kr/"+key;
		//$("#framePopup h3").text(url);
		url +="?v="+job;
		if(deviceType=="app"){
			url +="&webview=layer";
			window.location.href = url;
		}else if(type!="right"){
			newWindow = window.open(url, "_blank");
			newWindow.focus();
		}
		
    	/*
		var str ='<iframe src="'+url+'" style="width:100%; height:600px" srcrolling="auto" onload="" frameborder="0" border="0" bordercolor="#000000" marginwidth="0" marginheight="0" name="carpanPopup" ></iframe>';
		$("#framePopup .content").html(str);
		openPopupView(920,'framePopup');
		*/
	}else if(job=="talk"){
		$('.layerPopup').css("display","none");
		//if(deviceType=="app"){
		//	alert(window.app.isInstalledKakaotalk());		true false
		//}
		sendKakao(key,type);
	}else if(job=="finc"){
		viewApiData(dataBank['jsonData']);
		alertPopup("<div>고객님께 동의 url이 전송되었습니다. <br><br>고객님께 안내 바랍니다.<br><a href='"+dataBank['jsonData']['url']+"' target='_blank'>"+dataBank['jsonData']['url']+"</a></div>");
		$("button.btnEstmAct[job='finc']").text("심사 신청됨");
	}else if(job=="confirm"){
		if(type=="save"){
			if(confirm("견적이 확정되었습니다. \n심사 진행을 위해서는 신용정보 조회 동의가 필요합니다. \n 확정견적으로 이동하시겠습니까?")){
				window.location.href="/desk/save/confirm";
			}else{
				window.location.reload();
			}
		}else{
			if($(".btnEstmAgree").length==0) alertPopup("<div>견적이 확정되었습니다.</div>");
			else alertPopup("<div>견적이 확정되었습니다. <br>심사 진행을 위해서는 신용정보 조회 동의가 필요합니다.</div>");
		}
	}else if(job=="agree"){
		if(type=="save"){
			alert("고객님께 동의 url이 전송되었습니다. \n고객님께 안내 바랍니다.");
			window.location.reload();
		}else{
			alertPopup("<div>고객님께 동의 url이 전송되었습니다. <br><br>고객님께 안내 바랍니다.</div>");
		}
	}else if(job=="credit"){
		if(type=="save"){
			if(confirm("심사신청이 완료되었습니다. \n심사 페이지에서 결과를 확인하여 주시기 바랍니다. \n 심사페이지로 이동하시겠습니까?")){
				window.location.href="/desk/save/counsel";
			}else{
				window.location.reload();
			}
			//alert("한도조회가 완료되었습니다. \n한도조회 페이지에서 결과를 확인하여 주시기 바랍니다.");
			//window.location.href="/desk/save/counsel";
		}else{
			alertPopup("<div>심사신청이 완료되었습니다. \n심사 페이지에서 결과를 확인하여 주시기 바랍니다.</div>");
		}
	}else if(job=="order"){
		if(confirm("발주요청이 완료되었습니다. \n발주 페이지에서 결과를 확인하여 주시기 바랍니다. \n 발주페이지로 이동하시겠습니까?")){
			window.location.href="/desk/save/order";
		}else{
			window.location.reload();
		}
	}else if(job=="cancle"){
		alert("발주취소 요청이 완료되었습니다.");
		window.location.reload();
	}else if(job=="delivery"){
		if(confirm("인도요청이 완료되었습니다. \n인도 페이지에서 결과를 확인하여 주시기 바랍니다. \n인도페이지로 이동하시겠습니까?")){
			window.location.href="/desk/save/delivery";
		}else{
			window.location.reload();
		}
	}else if(job=="sms" && $("#formEstmSave input[name='way']").val()=="app"){
		var num = number_only($("#formEstmSave input[name='to']").val()).replace(/-/g,'');
		var msg = $("#formEstmSave textarea[name='msg']").val();
		msg +="\nhttp://m.ca8.kr/"+key;
		window.app.sendSMS(msg,num);
	}else if(job=="sms"){
		alertPopup("<div>문자 발송이 접수되었습니다.<br><br>발송에 약간의 시간이 소요됩니다. 저장발송에서 발송 결과를 확인하실 수 있습니다.</div>");
	}else if(job=="fax"){
		alertPopup("<div>팩스 발송이 접수되었습니다.<br><br>발송에 약간의 시간이 소요됩니다. 저장발송에서 발송 결과를 확인하실 수 있습니다.</div>");
	}
}

// 제원 보기
function viewSpecEstm(model,spc){
	var spec = spc.split(",");
	var str = "<div class='infoPopup'>";
	if(spec[0] || spec[1] || spec[2]){
		str += "<div class='spec'>";
		str += "<div class='left'>\n";
		if(spec[0]){
			str += "<div class='name'>외관</div><dl>";
			var tmp = dataBank['modelData'+model]['specGroup'][1853]['list'].split(",");
			var dat = dataBank['modelData'+model]['spec'][spec[0]];
			for(var s in tmp){
				var set = dataBank['modelData'+model]['specDefine'][tmp[s]];
				if(typeof(dat[tmp[s]])!="undefined" && set.name.indexOf("윤거")<0){
					if(set.unit) str += "<dt>"+set.name+"("+set.unit+")</dt> <dd>"+dat[tmp[s]]+"</dd>";
					else str += "<dt>"+set.name+"</dt> <dd>"+dat[tmp[s]]+"</dd>";
				}
			}
			str += "</dl>\n";
		}
		if(spec[1]){
			str += "<div class='name'>엔진</div><dl>";
			var tmp = dataBank['modelData'+model]['specGroup'][1854]['list'].split(",");
			var dat = dataBank['modelData'+model]['spec'][spec[1]];
			for(var s in tmp){
				var set = dataBank['modelData'+model]['specDefine'][tmp[s]];
				if(typeof(dat[tmp[s]])!="undefined"){
					//if(set.unit) set.name+= "("+set.unit+")";
					//str += "<dt>"+set.name+"</dt> <dd>"+dat[tmp[s]]+"</dd>";
					if(set.unit) str += "<dt>"+set.name+"("+set.unit+")</dt> <dd>"+dat[tmp[s]]+"</dd>";
					else str += "<dt>"+set.name+"</dt> <dd>"+dat[tmp[s]]+"</dd>";
				}
			}
			str += "</dl>\n";
		}
		str += "</div>\n";
		str += "<div class='right'>\n";
		if(spec[2]){
			str += "<div class='name'>연비</div><dl>";
			var tmp = dataBank['modelData'+model]['specGroup'][1855]['list'].split(",");
			var dat = dataBank['modelData'+model]['spec'][spec[2]];
			for(var s in tmp){
				var set = dataBank['modelData'+model]['specDefine'][tmp[s]];
				if(typeof(dat[tmp[s]])!="undefined"){
					//if(set.unit) set.name+= "("+set.unit+")";
					//str += "<dt>"+set.name+"</dt> <dd>"+dat[tmp[s]]+"</dd>";
					if(set.unit) str += "<dt>"+set.name+"("+set.unit+")</dt> <dd>"+dat[tmp[s]]+"</dd>";
					else str += "<dt>"+set.name+"</dt> <dd>"+dat[tmp[s]]+"</dd>";
				}
			}
			str += "</dl>\n";
		}
		str += "</div>";
		str += "</div>\n";
	}
	
	return str;
}
//외장색상 선택 저장
function getColorExtCode(){
	var code = "";
	$col = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorExtSel li.on");
	if($col.length){
		code += $col.attr("colorExt")+"\t";
		code += $col.attr("price")+"\t";
		code += $col.find(".name").text()+"\t";
		code += $col.attr("rgb");
		colorExt = $col.attr("colorExt");
	}else{
		colorExt = "";
	}
	$("#estmBody .estmCell[estmNo='" + estmNow + "']").find(".selbar[kind='colorExt']").attr("code", colorExt);
	estmConfig[estmNow]['colorExt'] = code;
}
// 내장색상 선택 저장
function getColorIntCode(){
	var code = "";
	$col = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorIntSel li.on");
	if($col.length){
		code += $col.attr("colorInt")+"\t";
		code += $col.attr("price")+"\t";
		code += $col.find(".name").text()+"\t";
		code += $col.attr("rgb");
		colorInt = $col.attr("colorInt");
	}else{
		colorInt = "";
	}
	$("#estmBody .estmCell[estmNo='" + estmNow + "']").find(".selbar[kind='colorInt']").attr("code", colorInt);
	estmConfig[estmNow]['colorInt'] = code;
}
//옵션 선택 저장
function getOptionCode(){
	var code = "";
	var option = "";
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li.on:not(.off)");
	$obj.each(function (){
		var idx = $(this).attr("option");
		var price = $(this).attr("price");
		var name = $(this).find(".name").text();
		var apply = $(this).attr("apply");
		if(code){
			code +="\n";
			option += ",";
		} 
		option += idx;
		code +=idx+"\t"+parseInt(price)+"\t"+name+"\t"+apply;
	});
	$("#estmBody .estmCell[estmNo='" + estmNow + "']").find(".selpop[kind='option']").attr("code",option);
	estmConfig[estmNow]['option'] = code;
}
//할인 선택 저장
function getDiscountCode(){
	var code = 0;
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .discountSel > li:not(.off) > ul > li.on");
	$obj.each(function (){
		code = number_filter($(this).find("input").val());
		if(code!=0 && $("#estmBody .estmCell[estmNo='"+estmNow+"'] input[name='discountType']:checked").length) code += "T";
	});
	estmConfig[estmNow]['discount'] = code;
}
// 공통선택 저장
function getComnConfig(kind,data,etc){
	if(kind=="insure" || kind=="accessory" || kind=="modify" || kind=="incentive"){
		fincConfig[estmNow][0][etc] = data;
	}else if(kind=="regYM"){
		if(etc=="regY") fincConfig[estmNow][0]["regM"] = "";
		fincConfig[estmNow][0][etc] = data;
	}else if(kind=="carList"){
		var tmpC = data.split("_");
		var tmpN = etc.split("_");
		fincConfig[estmNow][0]['ucarCode'] = tmpC[0];
		fincConfig[estmNow][0]['ucarCodeB'] = tmpC[1];
		fincConfig[estmNow][0]['ucarName'] =  tmpN[0];
		fincConfig[estmNow][0]['ucarNameB'] = tmpN[1];
	}else if(kind=="branchShop"){
		fincConfig[estmNow][0]['branchShop'] = data;
		fincConfig[estmNow][0]['branchName'] = branchList[data]['dptNm'];
		fincConfig[estmNow][0]['accountNum'] = branchList[data]['vaccNo'];
	}else if(kind=="dealerShop" && estmMode=="fince"){
		if(etc){
			var tmp = etc.split("_");
			if(tmp[0]=="Y") fincConfig[estmNow][0]['goodsKind'] = "istm";
			else fincConfig[estmNow][0]['goodsKind'] = "loan";
			fincConfig[estmNow][0]['feeDsRate'] = tmp[1];
			fincConfig[estmNow][0]['feeDsAmt'] = tmp[2];
		}else{
			fincConfig[estmNow][0]['goodsKind'] = "loan";
			fincConfig[estmNow][0]['feeDsRate'] = 0
			fincConfig[estmNow][0]['feeDsAmt'] = 0;
		}
		
		fincConfig[estmNow][0][kind] = data;
	}else{
		fincConfig[estmNow][0][kind] = data;
	}
}
// 리스렌트 비교 저장
function getLoanConfig(kind,data,etc){		// kind, data, etc
	if(kind=="mode"){
		
	}else{
		if(etc) fincConfig[estmNow][fincNow[estmNow]][etc] = data;
		else fincConfig[estmNow][fincNow[estmNow]][kind] = data;
		if(estmMode=="fince" && kind=="prepay") {
			fincConfig[estmNow][fincNow[estmNow]]["capital"] = "";
		}else if(estmMode=="fince" && kind=="capital") {
			fincConfig[estmNow][fincNow[estmNow]]["prepay"] = "";
		}
	}
}

// 선택 클릭 후 변경시 실행
function arrangeEstmData(kind,code){
	// arrangeEstmData('brand',$(this).parent().attr("brand"));
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	// console.log(kind+" => "+code);
	var $objS = $obj.find("."+kind+"Sel");
	$objS.find("li.on").removeClass("on");
	var $objN = $objS.find("li["+kind+"='"+code+"']");
	$objN.addClass("on");
	var $objD = $obj.find(".selbar[kind='"+kind+"']");
	$objD.attr("code",code);
	// 선택된 데이터 표시하기
	if(kind=="brand"){
		$objD.find(".bar").html($objN.find("button").html());
	}else if(kind=="model"){
		estmChangeKind = "model";
		$objD.find(".bar").html($objN.find(".name").html());
	}else if(kind=="lineup"){
		$objD.find(".bar").html($objN.find("span").html());
	}else if(kind=="trim"){
		$objD.find(".bar").html($objN.find(".name").text()+" <span class='price'>"+$objN.find(".price").text()+"</span>");
	}
	
	if(kind=="brand"){	// 모델 초기화
		$obj.find(".selbar[kind='model']").attr("code","");
		var $objM = $obj.find(".modelSel");
		$objM.html("");
		$objM.attr("brand","");
		$obj.find(".selbar[kind='model'] .bar").html("<span class='blank'>선택해 주세요.</span>");
	}
	if(kind=="brand" || kind=="model"){	// 라인업 초기화
		$obj.find(".selbar[kind='lineup']").attr("code","");
		var $objL = $obj.find(".lineupSel");
		$objL.html("");
		$objL.attr("model","");
		$obj.find(".selbar[kind='lineup'] .bar").html("<span class='blank'>선택해 주세요.</span>");
		estmCode = {};
	}
	if(kind=="brand" || kind=="model" || kind=="lineup"){	// 트림 초기화
		$obj.find(".selbar[kind='trim']").attr("code","");
		$obj.find(".selbar[kind='colorExt']").attr("code","");
		$obj.find(".selbar[kind='colorInt']").attr("code","");
		$obj.find(".selpop[kind='option']").attr("code","");
		var $objT = $obj.find(".trimSel");
		$objT.html("");
		$objT.attr("lineup","");
		$obj.find(".selbar[kind='trim'] .bar").html("<span class='blank'>선택해 주세요.</span>");
		resetEstmUnit();
	}
	if(kind=='trim'){	// 견적 계산 시작
		var modelOld = 0;
		if(typeof(estmCode['model'])!="undefined")  modelOld = estmCode['model'];
		var trimOld = 0;
		if(typeof(estmCode['trim'])!="undefined")  trimOld = estmCode['trim'];
		estmCode = {};
		estmCode['trim'] = parseInt(code);
    	estmCode['lineup'] = parseInt($obj.find(".selbar[kind='lineup']").attr("code"));
    	estmCode['model'] = parseInt($obj.find(".selbar[kind='model']").attr("code"));
    	estmCode['brand'] = parseInt($obj.find(".selbar[kind='brand']").attr("code"));
    	//console.log(estmCode);
    	// 외장/내장/옵션/할인/탁송료 목록 작성
    	$obj.find(".colorExtSel").html(getColorList( estmCode.model, estmCode.lineup, estmCode.trim, 'Ext' ));
    	$obj.find(".colorIntSel").html(getColorList( estmCode.model, estmCode.lineup, estmCode.trim, 'Int' ));
    	$obj.find(".optionSel").html(getOptionList( estmCode.model, estmCode.lineup, estmCode.trim ));
    	// $obj.find(".discountSel").html(getDiscountList(estmCode.brand, estmCode.model,  estmCode.lineup, estmCode.trim ));	미사용
    	// 잔가율 가져요기
    	if(estmMode=="rent") getApiModelRemain(estmCode);
    	if(trimOld==0 || estmChangeKind=="startUrl"  || estmChangeKind=="start"){
    		// 계산 처음 시작
    		estmCode['change'] = "start";
    	}else if(trimOld == estmCode['trim']){
    		estmCode['change'] = "open";
    	}else{
    		estmCode['change'] = "trim";
    	}
    	if(estmMode != "fastship" && estmCode['model']==modelOld){	// 불러오기, 기존 승계
    		if(typeof(estmConfig[estmNow]['colorExt'])!="undefined" && estmConfig[estmNow]['colorExt']){
    			var val = estmConfig[estmNow]['colorExt'].split("\t");
            	if(val[0].substr(0,1)=="S"){
            		$obj.find(".colorExtSel .selfBox").before(makeSelfColor("colorExt",val[0],val[2],val[1]));
					$obj.find(".colorExtSel .selfBox").addClass("off");
            	}
    			$obj.find(".colorExtSel li[colorExt='"+val[0]+"']").addClass("on");
    			getColorExtCode();
    		}
    		if(typeof(estmConfig[estmNow]['colorInt'])!="undefined" && estmConfig[estmNow]['colorInt']){
    			var val = estmConfig[estmNow]['colorInt'].split("\t");
    			if(val[0].substr(0,1)=="S"){
    				$obj.find(".colorIntSel .selfBox").before(makeSelfColor("colorInt",val[0],val[2],val[1]));
					$obj.find(".colorIntSel .selfBox").addClass("off");
    			}
    			$obj.find(".colorIntSel li[colorInt='"+val[0]+"']").addClass("on");
    			getColorIntCode();
    		}
    		if(typeof(estmConfig[estmNow]['option'])!="undefined" && estmConfig[estmNow]['option']){
    			var dat = estmConfig[estmNow]['option'].split("\n");
    			for(var n in dat){
    				var val = dat[n].split("\t");
    				if(val[0].substr(0,1)=="S"){
    					$obj.find(".optionSel .selfBox").before(makeSelfOption(val[0],val[2],val[1]));
    					$obj.find(".optionSel .selfBox").addClass("off");
    				}
        			$obj.find(".optionSel li[option='"+val[0]+"']").addClass("on");
    			}
    			getOptionCode();
    		}
    		if(typeof(estmConfig[estmNow]['discount'])!="undefined" && estmConfig[estmNow]['discount']){
    			$obj.find(".discountSel li[discount='S']").addClass("on");
				estmConfig[estmNow]['discount'] += "";
				if(estmConfig[estmNow]['discount'].indexOf('T')>0){
					$("#estmBody .estmCell[estmNo='"+estmNow+"'] input[name='discountType']").prop("checked",true);
				}
    			if(parseFloat(estmConfig[estmNow]['discount']) && parseFloat(estmConfig[estmNow]['discount'])<100){
    				$obj.find(".discountSel li[code='R']").addClass("on");
    				$obj.find(".discountSel li[code='R'] input").val(parseFloat(estmConfig[estmNow]['discount']));
    			}else if(parseFloat(estmConfig[estmNow]['discount'])){
    				$obj.find(".discountSel li[code='P']").addClass("on");
    				$obj.find(".discountSel li[code='P'] input").val(number_format(parseInt(estmConfig[estmNow]['discount'])));
    			}
				
    		}
    	}else{
    		estmConfig[estmNow]['colorExt']="";
    		estmConfig[estmNow]['colorInt']="";
    		estmConfig[estmNow]['option']="";
    		estmConfig[estmNow]['discount'] = 0;
    		$obj.find(".discountSel li").removeClass("on");
    	}
    	// 필수 선택 옵션 체크 (* 으로 시작 apply)
    	if($obj.find(".optionSel li[apply^='*']").length){
    		$obj.find(".optionSel li[apply^='*']").addClass("on");
    		getOptionCode();
    	}
		disabledContent("option");
    	// 리스렌트 전용 승계
    	if(estmStart['mode']=="leaserent" && estmCode['trim']==trimOld){
    		var issue = $obj.find(".estmRslt_data [name='issue']").val();
    		$obj.find(".issueType input[type='radio']").prop("checked",false);
			$obj.find(".issueType input[type='radio'][value='"+issue+"']").prop("checked",true);
			if(issue=="D"){
				$obj.find(".transType input[type='radio'][value='BD']").prop("checked",true);
				$obj.find(".transType input[type='radio'][value='BD']").prop("disabled",false);
				$obj.find(".transType input[type='radio'][value='OD']").prop("checked",false);
				$obj.find(".transType input[type='radio'][value='OD']").prop("disabled",true);
				$obj.find(".transBD").removeClass("off");
	    		$obj.find(".transOD").addClass("off");
			}else{
				$obj.find(".transType input[type='radio'][value='BD']").prop("checked",false);
				$obj.find(".transType input[type='radio'][value='BD']").prop("disabled",true);
				$obj.find(".transType input[type='radio'][value='OD']").prop("checked",true);
				$obj.find(".transType input[type='radio'][value='OD']").prop("disabled",false);
				$obj.find(".transBD").addClass("off");
	    		$obj.find(".transOD").removeClass("off");
			}
			var val = $obj.find(".estmRslt_data [name='taxFree']").val().split("\t");
			if(val[0].indexOf("T")>1) $obj.find("input[name='tax5']").prop("checked",true);
			if(val[0].indexOf("S")>1) $obj.find("input[name='tax3']").prop("checked",true);
			if(val[0].indexOf("Q")>1) $obj.find("input[name='tax7']").prop("checked",true);
    	}
    	// scrollUp
    	$obj.find(".scroll .cont").scrollTop(0);
    	$obj.find(".selsub[kind='taxfreeSel']").attr("code","");
    	$obj.find(".selsub[kind='taxfreeSel']").attr("code","");
    	
    	if(estmChangeKind != "startUrl") calculator();
	}
	
}
// 선택 변경시 화면 표시 초기화
function resetEstmUnit(){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	$obj.find(".estmRslt_colorExt").html("<span class='blank'>선택해 주세요.</span>");
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorExtSel").html("");
	$obj.find(".estmRslt_colorInt").html("<span class='blank'>선택해 주세요.</span>");
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .colorIntSel").html("");
	$obj.find(".estmRslt_trimPrice").html("0");
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel").html("");
	
	$obj.find(".estmRslt_taxFreeCost").text("0");
	$obj.find(".estmRslt_vehicleVat").text("0");
	$obj.find(".estmRslt_vehiclePay").text("0");
	$obj.find(".estmRslt_takeSum").text("0");
	$obj.find(".estmRslt_costSum").text("0");
	$obj.find(".estmRslt_pmtPay").text("0");
	$obj.find(".estmRslt_pmtHPay").text("");
	$obj.find(".estmRslt_finceRate").text("");
	$obj.find(".estmRslt_paySum").text("0");
	
	$(".wrapper").removeClass("use");
	$("#estmBox").removeClass("open");
}



