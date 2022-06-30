function calculatorU(){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	$(".wrapper").addClass("use");
	if(typeof(estmRslt.mode)=="undefined" && estmStart['open']==""){
		var kind = ["certifyYN","regY","regM","nameKey","goodsKind","buyType","payType","regType","useBiz","cartaxAdd","regTaxIn","regFree","regBondIn","regExtrIn","deliveryIn","feeAgR","feeCmR","takeSido","branchShop","branchName","accountNum"]; 
		//,""insureAdd","deliveryIn","insureAge","insureObj","insureCar","insureSelf","insureEmpYn","navigation","blackBox","sdrrTinting","frtTinting","deliveryType","deliverySido","deliveryShip"];	// 공통설정 항목
		for(var k in kind){
			if(typeof(fincConfig[estmNow][0][kind[k]])=="undefined"){
				if(typeof(defaultCfg[kind[k]])!="undefined") fincConfig[estmNow][0][kind[k]] = defaultCfg[kind[k]];
				else fincConfig[estmNow][0][kind[k]] = "";
			}
		}
		$obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		$obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		fincConfig[estmNow][0]['takeExtra'] = parseInt(defaultCfg['takeExtra']);
		fincConfig[estmNow][0]['takeSelf'] = parseInt(defaultCfg['takeSelf']);
		fincConfig[estmNow][0]['accountBank'] = defaultCfg['accountBank'];
		fincConfig[estmNow][0]['accountName'] = defaultCfg['accountName'];
		fincConfig[estmNow][0]['dealerShop'] = "0";
		if(typeof(fincConfig[estmNow][0]['deliveryMaker'])=="undefined") fincConfig[estmNow][0]['deliveryMaker'] = 0;
	}
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']!="loan"){
		fincConfig[estmNow][0]['takeSelf'] = 0;
	}
	
	estmRslt = {};
	estmRslt.mode = estmMode;
	if(typeof(fincConfig[estmNow][0]['ucarName'])!="undefined" && fincConfig[estmNow][0]['ucarName']) estmRslt.ucarName = fincConfig[estmNow][0]['ucarName'];
	else estmRslt.ucarName = "";
	if(typeof(fincConfig[estmNow][0]['ucarNameB'])!="undefined" && fincConfig[estmNow][0]['ucarNameB']) estmRslt.ucarNameB = fincConfig[estmNow][0]['ucarNameB'];
	else estmRslt.ucarNameB = "";
	if(typeof(fincConfig[estmNow][0]['ucarCode'])!="undefined" && fincConfig[estmNow][0]['ucarCode']) estmRslt.ucarCode = fincConfig[estmNow][0]['ucarCode'];
	else estmRslt.ucarCode = "";
	if(typeof(fincConfig[estmNow][0]['ucarCodeB'])!="undefined" && fincConfig[estmNow][0]['ucarCodeB']) estmRslt.ucarCodeB = fincConfig[estmNow][0]['ucarCodeB'];
	else estmRslt.ucarCodeB = "";
	if(typeof(fincConfig[estmNow][0]['ucarPrice'])!="undefined" && fincConfig[estmNow][0]['ucarPrice']) estmRslt.ucarPrice = parseInt(fincConfig[estmNow][0]['ucarPrice']);
	else estmRslt.ucarPrice = 0;
	if(estmRslt.ucarCodeB=="DOM") estmRslt.brand = 100;
	else if(estmRslt.ucarCodeB=="ICM") estmRslt.brand = 200;
	else estmRslt.brand = 999;
	estmRslt.lineup = estmRslt.ucarCode;
	estmRslt.vehicleSale = estmRslt.ucarPrice;
	estmRslt.certifyYN = fincConfig[estmNow][0]['certifyYN'];
	estmRslt.regYM = fincConfig[estmNow][0]['regY']+fincConfig[estmNow][0]['regM'];
	estmRslt.deliveryMaker = parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	
	if(estmRslt.certifyYN== "N"){
		fincConfig[estmNow][0]['dealerShop'] = "0";
	}else if(fincConfig[estmNow][0]['dealerShop'] == "0"){
		fincConfig[estmNow][0]['dealerShop'] = "";
	}
	
	if(estmMode!="fince" && (estmChangeKind=="goodsKind" || estmChangeKind=="capitalLease" || estmChangeKind=="dealerShop") && (estmMode!="lease" || fincConfig[estmNow][0]['goodsKind']!="loan")){
		if(estmMode=="lease"){
			var feeC = parseFloat(fincConfig[estmNow][0]['feeCmR']);
			var feeA = parseFloat(fincConfig[estmNow][0]['feeAgR']);
			var cmMax = 0;
			var agMax = 0;
			if(fincConfig[estmNow][0]['certifyYN']=="Y"){
				var cmMax = 9;
				var sumMax = 13;
			}else{
				var sumMax = 9;
			}
		}
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']);
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR)*100,1,'floor')/100;;
			if(cmR<0){
				cmR = 0;
				agR = sumMax;
			}
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
		}
	}
	if(estmChangeKind=="goodsKind"){	// open시 기본값 유지로 변경  estmChangeKind=="open" || 
		var kind = ["regTaxIn","regBondIn"];	// 금융/운용 기본값 지정		// ,"regExtrIn","deliveryIn"  제외
		for(var k in kind){
			$obj.find("input[name='"+kind[k]+"']").prop("checked",false);
			if(fincConfig[estmNow][0]['goodsKind']=="loan"){
				var va = "02";
				$obj.find("input[name='"+kind[k]+"'][value='01']").parent().css("display","none");
			}else{
				if(kind[k]=="regTaxIn") var va = "01";
				else var va = "02";
				$obj.find("input[name='"+kind[k]+"'][value='01']").parent().css("display","");
			}
			fincConfig[estmNow][0][kind[k]] = va;
			$obj.find("input[name='"+kind[k]+"'][value='"+va+"']").prop("checked",true);
		}
	}
	
	
	if(estmMode=="lease"){
		if($obj.find(".estmRslt_capital").attr("capital")!="0" && (estmChangeKind=="capitalLease" || estmChangeKind=="cartaxAdd" || estmChangeKind=="insureAdd" || estmChangeKind=="careAdd" || estmChangeKind=="incentive" || estmChangeKind=='endType' || estmChangeKind=='stampYn' || estmChangeKind=='month' || estmChangeKind=='monthH' || estmChangeKind=='capital' || estmChangeKind=='rateCover' || estmChangeKind=='km' || estmChangeKind=='prepay' || estmChangeKind=='deposit' || estmChangeKind=='respite' || estmChangeKind=='remain' || estmChangeKind=='careType' || estmChangeKind=='adCmfe' || estmChangeKind=='dcSppt')){	 // estmChangeKind=="payType" || 결제방식 변경시 취득원가 재계산으로 변경 2021-04-23 
			var path = "capitalData_"+estmNow;
			estmRslt.capital = parseInt(dataBank[path]['capital']);
			estmRslt.takeTax = parseInt(dataBank[path]['regTax2']) + parseInt(dataBank[path]['regTax5']);
			estmRslt.takeTax2 = parseInt(dataBank[path]['regTax2']);
			estmRslt.takeTax5 = parseInt(dataBank[path]['regTax5']);
			//estmRslt.vehicleTax = parseInt(dataBank[path]['taxDc']);
			fincConfig[estmNow][0]['capitalCal'] = "Y";
		}else{
			fincConfig[estmNow][0]['capitalCal'] = "N";
			estmRslt.capital = 0;
			estmRslt.takeTax = 0;
		}
		if(fincConfig[estmNow][0]['goodsKind']=="loan") fincConfig[estmNow][0]['prdtDvCd'] = "1";
		else fincConfig[estmNow][0]['prdtDvCd'] = "2";
		
		var sido = fincConfig[estmNow][0]['takeSido'];
		fincConfig[estmNow][0]['takeSidoName'] =$obj.find(".takeSidoSel li[takeSido='"+fincConfig[estmNow][0]['takeSido']+"']").text();
		fincConfig[estmNow][0]['takeSidoHana'] =$obj.find(".takeSidoSel li[takeSido='"+fincConfig[estmNow][0]['takeSido']+"']").attr('hana');
		var use = "P";
		// 채권	
		/*
			// bond = calculatorBondU(sido, use, estmCfg.displace, estmCfg.carry, estmCfg.person, estmCfg.extra, estmCfg.division, estmCfg.engine, estmRslt.vehicleSupply);
			bond = calculatorBondU();
			if(fincConfig[estmNow][0]['takeSido']=="SU") fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut7']").val();
			else fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut5']").val();
		
			estmRslt.bondRate = bond[0];
			estmRslt.bondBuy = bond[1];
			estmRslt.bondKind = bond[2];
			
			estmRslt.bondDc = parseFloat(fincConfig[estmNow][0]['bondDc']);
			estmRslt.bondCut = number_cut(estmRslt.bondBuy * estmRslt.bondDc / 100, 1, "floor"); // 5% 할인
		*/
		estmRslt.bondRate = 0;
		estmRslt.bondDc = 0;
		if(typeof(fincConfig[estmNow][0]['bondCut'])=="undefined") estmRslt.bondCut = 0;
		else estmRslt.bondCut = parseInt(fincConfig[estmNow][0]['bondCut']);
		fincConfig[estmNow][0]['takeSidoHana'] = "";
		
		if(fincConfig[estmNow][0]['regTaxIn']=="00") estmRslt.takeTax = 0;
		if(fincConfig[estmNow][0]['regBondIn']=="00") estmRslt.bondCut = 0;
		
		estmRslt.takeExtra = parseInt(fincConfig[estmNow][0]['takeExtra']);
		estmRslt.takeSelf = parseInt(fincConfig[estmNow][0]['takeSelf']);
		estmRslt.addCost = 0;
		estmRslt.payCost = 0;
		
		if(fincConfig[estmNow][0]['regTaxIn']=="01") estmRslt.addCost += estmRslt.takeTax;
		else estmRslt.payCost += estmRslt.takeTax;
		if(fincConfig[estmNow][0]['regBondIn']=="01") estmRslt.addCost += estmRslt.bondCut; 
		else estmRslt.payCost += estmRslt.bondCut;
		if(fincConfig[estmNow][0]['regExtrIn']=="01") estmRslt.addCost += estmRslt.takeExtra;
		else estmRslt.payCost += estmRslt.takeExtra;
		if(fincConfig[estmNow][0]['deliveryIn']=="01") estmRslt.addCost += estmRslt.deliveryMaker;
		else estmRslt.payCost += estmRslt.deliveryMaker;	// 수입차 탁송료
		var feeBase = estmRslt.capital;
	}
	// 제휴사 수수료 초기화 금융리스 수정 2 (위치 변경)
	// 수수료율 위치 변경
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan" && feeBase){
		var agMax = parseFloat(defaultCfg['agFeeMax']);
		var cmMax = parseFloat(defaultCfg['cmFeeMax']);
		var maxFee = 0;
		if(feeBase<=5000000) maxFee += feeBase * parseFloat(defaultCfg['sumMaxA']) / 100;
		else maxFee += 5000000 * parseFloat(defaultCfg['sumMaxA']) / 100 + (feeBase - 5000000) * parseFloat(defaultCfg['sumMaxB']) / 100;
		
		var sumMax = number_cut(maxFee / feeBase * 10000, 1, 'floor')/100;
		if(typeof(fincConfig[estmNow][0]['feeDsR'])!="undefined"){
			sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
			sumMax = number_cut(sumMax * 100,1,'floor')/100;
		}
		defaultCfg['sumMax'] = sumMax;
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']) * 1.03412; // 3.3% 지원 및 부가세 포함시
		
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR) / 1.03412 * 100,1,'floor')/100 ;
			if(cmR<0){
				cmR = 0;
				agR = sumMax;
			}
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
		}
	}
	
	if(estmMode=="fince"){
		estmRslt.feeAg = "";
		estmRslt.feeCm = "";
		estmRslt.feeSum = "";
	}else{
		estmRslt.feeAg = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeAgR']) / 100,100,'floor');
		estmRslt.feeCm = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeCmR']) / 100,100,'floor');
			//estmRslt.feeDc = feeBase * parseFloat(fincConfig[estmNow][0]['feeDcR']) / 100;
		estmRslt.feeSum = estmRslt.feeAg + estmRslt.feeCm;
	}
	
	
	//console.log(fincConfig[estmNow]);
	//console.log(estmRslt);
	
	if(estmMode=="fince" ||  typeof(dataBank["remainLineup"+estmRslt.lineup]) != 'undefined' ){
		calculatorFinance('');
	}else{
		outputU();
	}
	estmData[estmNow] = estmRslt;
}
function calculator(){
	msgPopup = "";
	//console.log(estmChangeKind);
	// 초기값 설정
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	if(typeof(estmRslt.brand)=="undefined" && estmMode != "fastship" && estmStart['open']==""){
		var kind = ["takeType","buyType","payType","regType","useBiz","goodsKind","cartaxAdd","insureAdd","careAdd","regTaxIn","regBondIn","regExtrIn","deliveryIn","insureAge","insureObj","insureCar","insureSelf","insureEmpYn","navigation","blackBox","sdrrTinting","frtTinting","feeAgR","feeCmR","deliveryType","deliverySido","deliveryShip","dealerShop","takeSido","branchShop","branchName","accountNum"];	// 공통설정 항목
		for(var k in kind){
			if(typeof(fincConfig[estmNow][0][kind[k]])=="undefined") fincConfig[estmNow][0][kind[k]] = defaultCfg[kind[k]];
			else fincConfig[estmNow][0][kind[k]] = "";
		}
		var localOld = "none";
		var brandOld = "none";
		var modelOld = "none";
		var lineupOld = "none";
		
		if(typeof(fincConfig[estmNow][0]['deliveryMaker'])=="undefined") fincConfig[estmNow][0]['deliveryMaker'] = 0;
		fincConfig[estmNow][0]['etcAccessorie'] = "";
		fincConfig[estmNow][0]['etcAccessorieCost'] = 0;
		fincConfig[estmNow][0]['modify'] = "";
		fincConfig[estmNow][0]['modifyCost'] = 0;
		$(".wrapper").addClass("use");
		//fincConfig[estmNow][0]['fastKind'] = "";	// 선구매/즉시출고
		//fincConfig[estmNow][0]['vin'] = "";
		$obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		$obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		fincConfig[estmNow][0]['takeExtra'] = parseInt(defaultCfg['takeExtra']);
		fincConfig[estmNow][0]['takeSelf'] = parseInt(defaultCfg['takeSelf']);
		// alert(1);
		fincConfig[estmNow][0]['accountBank'] = defaultCfg['accountBank'];
		fincConfig[estmNow][0]['accountName'] = defaultCfg['accountName'];
		if(estmMode=="rent" && defaultCfg['takeType']==20 && parseInt(fincConfig[estmNow][0]['deliveryMaker'])){		
			// fincConfig[estmNow][0]['deliveryType'] = "03";	// 선구매시 탁송료 있을 경우 복합으로 지정?
		}
	}else if(estmMode != "fastship"){
		if(estmRslt.brand<200) localOld = "domestic";
		else localOld = "imported";
		brandOld = estmRslt.brand;
		modelOld = estmRslt.model;
		lineupOld = estmRslt.lineup;
	}
	if(estmMode == "fastship"){
		fincConfig[estmNow][0]['deliveryType'] = "03";
		if(typeof(fincConfig[estmNow][0]['deliveryMaker'])=="undefined") fincConfig[estmNow][0]['deliveryMaker'] = 0;
	}
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']!="loan"){
		fincConfig[estmNow][0]['takeSelf'] = 0;
	}
	if(fincConfig[estmNow][0]['regType']=="2"){	// 이용자 명의 자동차세 포함 불가
		fincConfig[estmNow][0]['cartaxAdd'] = "N";
		fincConfig[estmNow][0]['payType'] = "02";
	}
	if(fincConfig[estmNow][0]['deliveryType']=="02"){	// 제조사 탁송시 용품 불가
		fincConfig[estmNow][0]['navigation'] = "01";
		fincConfig[estmNow][0]['blackBox'] = "01";
		fincConfig[estmNow][0]['sdrrTinting'] = "01";
		fincConfig[estmNow][0]['frtTinting'] = "01";
		fincConfig[estmNow][0]['sdrrTintingRatio'] = "";
		fincConfig[estmNow][0]['frtTintingRatio'] = "";
		fincConfig[estmNow][0]['etcAccessorie'] = "";
		fincConfig[estmNow][0]['etcAccessorieCost'] = "";
	}
	// 기본 설정
	estmRslt = {};
	estmRslt.mode = estmMode;
	
	estmRslt.trim = parseInt($obj.find(".selbar[kind='trim']").attr("code"));
	estmRslt.lineup = parseInt($obj.find(".selbar[kind='lineup']").attr("code"));
	estmRslt.model = parseInt($obj.find(".selbar[kind='model']").attr("code"));
	estmRslt.brand = parseInt($obj.find(".selbar[kind='brand']").attr("code"));
	
	Dpath = 'modelData'+estmRslt.model;

	// 명칭
	estmRslt.logo = dataBank[Dpath]['brand'][estmRslt.brand]['logo'];
	estmRslt.brandName = dataBank[Dpath]['brand'][estmRslt.brand]['name'];
	estmRslt.modelName = dataBank[Dpath]['model'][estmRslt.model]['name'];
	estmRslt.lineupName = dataBank[Dpath]['lineup'][estmRslt.lineup]['name'];
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['year'])!="undefined") estmRslt.lineupYear = number_filter(dataBank[Dpath]['lineup'][estmRslt.lineup]['year']);
	else estmRslt.lineupYear = "";
	estmRslt.trimName = dataBank[Dpath]['trim'][estmRslt.trim]['name']; 
	
	// 계산 설정
	estmCfg.tax = parseFloat(dataBank[Dpath]['trim'][estmRslt.trim]['tax']);
	estmCfg.extra = dataBank[Dpath]['trim'][estmRslt.trim]['extra'];
	estmCfg.carry = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['carry']);
	estmCfg.displace = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['displace']);
	estmCfg.person = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['person']);
	estmCfg.division = dataBank[Dpath]['trim'][estmRslt.trim]['division'];
	estmCfg.cartype = dataBank[Dpath]['trim'][estmRslt.trim]['cartype'];
	estmCfg.engine = dataBank[Dpath]['trim'][estmRslt.trim]['engine'];
	
	// 국산 수입 변경 확인
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	if(estmMode != "fastship" && localOld!=local){
		if(estmMode == "rent"){
			var kind = ["insureAge","insureObj","insureCar","insureSelf","navigation","blackBox","sdrrTinting","frtTinting"];	// 국산 수입 변경 항목 체크
			for(var k in kind){
				if(typeof(dataBank['goodsConfig'][local][kind[k]][fincConfig[estmNow][0][kind[k]]])=="undefined"){
					if(kind[k]=="insureSelf" && local == "imported") fincConfig[estmNow][0][kind[k]] = defaultCfg['importSelf'];
					else if(typeof(defaultCfg[kind[k]])!="undefined") fincConfig[estmNow][0][kind[k]] = defaultCfg[kind[k]];
					else fincConfig[estmNow][0][kind[k]] = "";
				}
			}
			if(localOld!="none"){	// 정비 변경.. careType
				$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
					var fNo = parseInt($(this).attr("fincNo"));
					if(typeof(dataBank['goodsConfig'][local]['careType'][fincConfig[estmNow][fNo]['careType']])=="undefined"){
						fincConfig[estmNow][fNo]['careType'] = defaultCfg['careType'];
					}
				});
			}
		}else if(estmMode == "lease"){
			if(local == "domestic" && fincConfig[estmNow][0]['goodsKind']=="lease" && fincConfig[estmNow][0]['regType']=="1") fincConfig[estmNow][0]['payType'] = "01";
			else fincConfig[estmNow][0]['payType'] = "02";
			$obj.find("input[name='payType'][value='"+fincConfig[estmNow][0]['payType']+"']").prop("checked",true);
			/*if(local=="domestic") fincConfig[estmNow][0]['regBondIn'] = "01";		// 2022년 변경 수입은 불포함 기본으로, 단 선택은 가능, 아래 3줄 포함
			else fincConfig[estmNow][0]['regBondIn'] = "02";
			$obj.find("input[name='regBondIn'][value='"+fincConfig[estmNow][0]['regBondIn']+"']").prop("checked",true);*/
		}
	}
	
	if(estmRslt.brand>200 && estmMode=="rent" ) fincConfig[estmNow][0]['deliveryType']="02";	// 수입차 제조사탁송으로 강제 조정
	if(estmMode=="lease" && estmRslt.brand<"200" && estmCfg.tax=="5.0"){
		$obj.find(".discountSel .check").removeClass("off");
	}else{
		$obj.find(".discountSel .check").addClass("off");
	}
	if(estmMode != "fastship" && brandOld!=estmRslt.brand){
		if(local == "domestic") fincConfig[estmNow][0]["dealerShop"] = "0";
		else if(typeof(dataBank['goodsConfig'][local]['dealerShop'])!="undefined" && typeof(dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand])!="undefined") {
			if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand][fincConfig[estmNow][0]["dealerShop"]])!="undefined"){
			}else fincConfig[estmNow][0]["dealerShop"] = "";
		}else fincConfig[estmNow][0]["dealerShop"] = "0";
		if(estmMode == "fince") fincConfig[estmNow][0]['goodsKind']="loan";
		if(estmMode == "fince" && estmChangeKind=="open"){	// 불러오기 일때는 오토할부 제휴사일때만 할부로 지정  22.01.21
			if(typeof(dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand])!="undefined" && typeof(dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand][fincConfig[estmNow][0]['dealerShop']])!="undefined"){
				var tmp = dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand][fincConfig[estmNow][0]['dealerShop']].split(";");
				if(tmp[1]=="Y") fincConfig[estmNow][0]['goodsKind']="istm";
			}
		}
	}
	if(estmMode != "fastship" && modelOld!=estmRslt.model){
		fincConfig[estmNow][0]["deliveryShip"] = "";
	}
	if(estmRslt.brand>200 && fincConfig[estmNow][0]['takeType']=="20"){	/// 국산차 전체 특판출고 해제
		fincConfig[estmNow][0]['takeType']="10";
		$obj.find(".unitA input[name='takeType'][value='10']").prop("checked",true);
	}
	if(estmRslt.brand!=111 && estmRslt.brand!=112 && estmRslt.brand!=121 && fincConfig[estmNow][0]['takeType']=="30"){
		fincConfig[estmNow][0]['takeType']="10";
		$obj.find(".unitA input[name='takeType'][value='10']").prop("checked",true);
	}
	// 사업자 이외 보험 선택시 제외
	if(fincConfig[estmNow][0]['buyType']=="1" || estmCfg.division!="P"){
		fincConfig[estmNow][0]['insureEmpYn'] = "N";
		$obj.find(".unitD .insEmp").addClass("off");
	}else{
		fincConfig[estmNow][0]['insureEmpYn'] = $obj.find(".unitD input[name='insureEmpYn']:checked").val();
		$obj.find(".unitD .insEmp").removeClass("off");
		if(fincConfig[estmNow][0]['buyType']=="2") $obj.find(".unitD .insEmp2").removeClass("off");
		else $obj.find(".unitD .insEmp2").addClass("off");
	}
	// 제휴사 수수료 초기화 금융리스 수정 1 (제외)
	// 
	//if(local != "imported")  fincConfig[estmNow][0]['feeDcR'] = 0;
	if(estmMode != "fastship" && estmMode!="fince" && (estmChangeKind=="goodsKind" || estmChangeKind=="capitalLease" || estmChangeKind=="dealerShop" || localOld!=local) && (estmMode!="lease" || fincConfig[estmNow][0]['goodsKind']!="loan")){
		if(estmMode=="lease"){
			var feeC = parseFloat(fincConfig[estmNow][0]['feeCmR']);
			var feeA = parseFloat(fincConfig[estmNow][0]['feeAgR']);
			if(local == "imported"){
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
			if(estmMode == "fince" && typeof(defaultCfg['istmFeeDsR'])!="undefined"){		// 추후 삭제 예정 API 제휴선수수료율 정상화 되면 istmFeeDsR
				if(fincConfig[estmNow][0]['goodsKind']=="istm" && estmRslt.brand!=211)  fincConfig[estmNow][0]['feeDsR'] = parseFloat(defaultCfg['istmFeeDsR']);
				else fincConfig[estmNow][0]['feeDsR'] = 0;
			}
			if(estmMode == "fince" && typeof(fincConfig[estmNow][0]['feeDsR'])!="undefined") {
				sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
			}
		}
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']);
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR)*100,1,'floor')/100;;
			if(cmR<0){
				cmR = 0;
				agR = sumMax;
			}
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
		}
	}
	if(estmMode!="fince" && (estmChangeKind=="goodsKind" || (typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']))){	// open시 기본값 유지로 변경  estmChangeKind=="open" || 
		var kind = ["regTaxIn","regBondIn"];	// 금융/운용 기본값 지정		// ,"regExtrIn","deliveryIn"  제외
		for(var k in kind){
			$obj.find("input[name='"+kind[k]+"']").prop("checked",false);
			if(fincConfig[estmNow][0]['goodsKind']=="loan" || (typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride'])){
				var va = "02";
				$obj.find("input[name='"+kind[k]+"'][value='01']").parent().css("display","none");
			}else{
				if(kind[k]=="regTaxIn") var va = "01";
				else var va = "02";
				$obj.find("input[name='"+kind[k]+"'][value='01']").parent().css("display","");
			}
			fincConfig[estmNow][0][kind[k]] = va;
			$obj.find("input[name='"+kind[k]+"'][value='"+va+"']").prop("checked",true);
		}
	}
	if(estmMode=="fince"){	// 상품 선택 고정
		$obj.find("input[name='goodsKind']").parent().css("display","none");
		$obj.find("input[name='goodsKind']").prop("checked",false);
		$obj.find("input[name='goodsKind'][value='"+fincConfig[estmNow][0]['goodsKind']+"']").parent().css("display","");
		$obj.find("input[name='goodsKind'][value='"+fincConfig[estmNow][0]['goodsKind']+"']").prop("checked",true);
	}
	// 자동차세 승용만 포함 선택 가능하게 변경
	if(estmCfg.displace==0 || estmCfg.division!="P"){
		fincConfig[estmNow][0]['cartaxAdd'] = "N";
		$obj.find("input[name='cartaxAdd'][value='Y']").parent().css("display","none");
		$obj.find("input[name='cartaxAdd'][value='N']").prop("checked",true);
	}else{
		$obj.find("input[name='cartaxAdd'][value='Y']").parent().css("display","");
	}
	if(estmChangeKind=="regType" || estmChangeKind=="goodsKind"){
		if(local == "domestic" && fincConfig[estmNow][0]['goodsKind']=="lease" && fincConfig[estmNow][0]['regType']=="1") fincConfig[estmNow][0]['payType'] = "01";
		else fincConfig[estmNow][0]['payType'] = "02";
		$obj.find("input[name='payType'][value='"+fincConfig[estmNow][0]['payType']+"']").prop("checked",true);
	}
	// 이미지
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['image'])!="undefined") estmRslt.image = dataBank[Dpath]['trim'][estmRslt.trim]['image'];
	else if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['image'])!="undefined") estmRslt.image = dataBank[Dpath]['lineup'][estmRslt.lineup]['image'];
	else estmRslt.image = dataBank[Dpath]['model'][estmRslt.model]['image'];
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['cover'])!="undefined") estmRslt.cover = dataBank[Dpath]['trim'][estmRslt.trim]['cover'];
	else if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['cover'])!="undefined") estmRslt.cover = dataBank[Dpath]['lineup'][estmRslt.lineup]['cover'];
	else estmRslt.cover = dataBank[Dpath]['model'][estmRslt.model]['cover'];
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['priceF'])!="undefined") estmRslt.priceF = dataBank[Dpath]['lineup'][estmRslt.lineup]['priceF'];
	else estmRslt.priceF = "";
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['catalogF'])!="undefined") estmRslt.catalogF = dataBank[Dpath]['lineup'][estmRslt.lineup]['catalogF'];
	else estmRslt.catalogF = "";
	
	estmRslt.taxRate = estmCfg.tax;
	
	calculatorPrice();
	if(estmMode=="fince" ||  typeof(dataBank["remainLineup"+estmRslt.lineup]) != 'undefined' ){
		calculatorFinance('');
	}else{
		output();
	}
	
	estmData[estmNow] = estmRslt;
	calculatorCheck();
	
}

function calculatorPrice(){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	if(estmMode=="lease"){
		if($obj.find(".estmRslt_capital").attr("capital")!="0" && (estmChangeKind=="capitalLease" || estmChangeKind=="cartaxAdd" || estmChangeKind=="insureAdd" || estmChangeKind=="careAdd" || estmChangeKind=="incentive" || estmChangeKind=='endType' || estmChangeKind=='stampYn' || estmChangeKind=='month' || estmChangeKind=='monthH' || estmChangeKind=='capital' || estmChangeKind=='rateCover' || estmChangeKind=='km' || estmChangeKind=='prepay' || estmChangeKind=='deposit' || estmChangeKind=='respite' || estmChangeKind=='remain' || estmChangeKind=='careType' || estmChangeKind=='adCmfe' || estmChangeKind=='dcSppt')){	 // estmChangeKind=="payType" || 결제방식 변경시 취득원가 재계산으로 변경 2021-04-23 
			var path = "capitalData_"+estmNow;
			estmRslt.capital = parseInt(dataBank[path]['capital']);
			estmRslt.takeTax = parseInt(dataBank[path]['regTax2']) + parseInt(dataBank[path]['regTax5']);
			estmRslt.takeTax2 = parseInt(dataBank[path]['regTax2']);
			estmRslt.takeTax5 = parseInt(dataBank[path]['regTax5']);
			if(fincConfig[estmNow][0]['takeType']=="20"){
				estmRslt.discountSpecial = parseInt(dataBank[path]['discountSpecial']);
				estmRslt.discountSpecialR = parseInt(dataBank[path]['discountSpecialR']);
			}else{
				estmRslt.discountSpecial = 0;
				estmRslt.discountSpecialR = 0;
			}
			//estmRslt.vehicleTax = parseInt(dataBank[path]['taxDc']);
			fincConfig[estmNow][0]['capitalCal'] = "Y";
		}else{
			fincConfig[estmNow][0]['capitalCal'] = "N";
			estmRslt.capital = 0;
			estmRslt.takeTax = 0;
			estmRslt.discountSpecial = 0;
			estmRslt.vehicleDc = 0;
		}
		// 코드 변환	금융 1, 운용 2  leasAcctDvCd => prdtDvCd 
		if(fincConfig[estmNow][0]['goodsKind']=="loan") fincConfig[estmNow][0]['prdtDvCd'] = "1";
		else fincConfig[estmNow][0]['prdtDvCd'] = "2";
	}else{
		estmRslt.discountSpecial = 0;
		estmRslt.vehicleDc = 0;
	}
	
	// 개소세 인하/환원시 금액, 현재 사용하지 않음, 11월 중 재사용 예정
	estmRslt.vehiclePriceAdd = 0;
	
	// 기본가격
	estmRslt.trimPrice = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['price']);
	
	// 외장색상
	estmRslt.colorExt = "";
	estmRslt.colorExtPrice = 0;
	estmRslt.colorExtName = "";
	estmRslt.colorExtRgb = "";
	if(typeof(estmConfig[estmNow]['colorExt'])!="undefined" && estmConfig[estmNow]['colorExt']){
		var val = estmConfig[estmNow]['colorExt'].split("\t");
		estmRslt.colorExt = val[0];
		estmRslt.colorExtPrice =  parseInt(val[1]);
		estmRslt.colorExtName =  val[2];
		estmRslt.colorExtRgb =  val[3];
		
	}
	// 내장색상
	estmRslt.colorInt = "";
	estmRslt.colorIntPrice = 0;
	estmRslt.colorIntName = "";
	estmRslt.colorIntRgb = "";
	if(typeof(estmConfig[estmNow]['colorInt'])!="undefined" && estmConfig[estmNow]['colorInt']){
		var val = estmConfig[estmNow]['colorInt'].split("\t");
		estmRslt.colorInt = val[0];
		estmRslt.colorIntPrice = parseInt(val[1]);
		estmRslt.colorIntName = val[2];
		estmRslt.colorIntRgb = val[3];
	}
	// 옵션
	estmRslt.option = "";
	estmRslt.optionSum = 0;
	estmRslt.optionExtra = 0;
	estmRslt.optionAcc = 0;	// 쌍용 DC 반영하지 않아서..
	estmRslt.optionList = "";
	estmRslt.optionName = "";
	estmRslt.optionSpec = "";
	if(typeof(estmConfig[estmNow]['option'])!="undefined" && estmConfig[estmNow]['option']){
		var dat = estmConfig[estmNow]['option'].split("\n");
		for(var n in dat){
			var val = dat[n].split("\t");
			if(estmMode!="rent"&& val[2].indexOf("(+/-)")>0) val[3]="-";
			if(val[3]=="-"){	// 가격에 반영시 - 표시 적용
				estmRslt.trimPrice += parseInt(val[1]);
			}else{
				if(estmRslt.option) estmRslt.option +=",";
				estmRslt.option +=val[0];
				if(estmStart['mode']=="common" && val[3].indexOf("+")>=0) estmRslt.optionExtra += parseInt(val[1]); // 별도 납입 옵션
				estmRslt.optionSum += parseInt(val[1]);
				if(val[3].indexOf("~")>=0){
					if(estmRslt.optionSpec) estmRslt.optionSpec +="_";
					estmRslt.optionSpec +=val[0];
				}
				if(estmRslt.optionList){
					estmRslt.optionList +="\n";
					estmRslt.optionName +="^";
				}
				estmRslt.optionList += val[2]+"\t"+val[1];
				estmRslt.optionName += val[2];
				if(val[2].substring(0,1)=="[") estmRslt.optionAcc += parseInt(val[1]);
			}
		}
	}
	
	// 가격 합계
	estmRslt.priceSum = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;	// 선택금액(차량가격)
	estmRslt.extraSum = estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;
	// 면세가격
	if(estmMode=="lease") estmRslt.vehicleFree = estmRslt.priceSum;
	else if(estmCfg.tax<=0 || estmCfg.tax==100) estmRslt.vehicleFree = estmRslt.priceSum;
	else estmRslt.vehicleFree = number_cut(estmRslt.priceSum / (1 + estmCfg.tax * 1.3 / 100),1,'round');
	// 대리점 할인금액
	estmRslt.discountMaker = 0;
	estmRslt.discountRate = 0;
	if(typeof(estmConfig[estmNow]['discount'])=="undefined") estmConfig[estmNow]['discount'] = 0;
	estmConfig[estmNow]['discount'] = estmConfig[estmNow]['discount'].toString();
	if((estmMode=="fastship" || fincConfig[estmNow][0]['takeType']!="20") && typeof(estmConfig[estmNow]['discount'])!="undefined" && estmConfig[estmNow]['discount']){
		estmRslt.discountMaker = parseFloat(estmConfig[estmNow]['discount']);
		if(estmRslt.discountMaker<100){
			estmRslt.discountRate = estmRslt.discountMaker;
			estmRslt.discountMaker = number_cut(estmRslt.vehicleFree * estmRslt.discountMaker / 100,1000,'floor');
		}else{
			estmRslt.discountRate = 0;
		}
		estmRslt.discountSpecial = 0;
	}
	// estmConfig[estmNow]['discount'] += "";		// 왜 넣었는지 확인 필요.. 2021-11-13 
	// 개소세 30% 감면 계산
	if(estmMode=="lease" && estmRslt.brand<"200" && estmCfg.tax=="5.0" && estmConfig[estmNow]['discount'].indexOf('T')<0){
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum - estmRslt.discountMaker;
		var free30 = number_cut(taxFreeBase - taxFreeBase / 1.065 * 1.0455,1,'round');
		if(free30>1430000)  free30 = 1430000;
		estmRslt.vehicleTax = free30;
	}else{
		estmRslt.vehicleTax = 0;
	}
	//estmRslt.vehicleTax
	// hev 혜택
	estmRslt.vehicleHev = 0;
	if(estmMode=="lease" && (estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("F")>=0) && estmConfig[estmNow]['discount'].indexOf('T')<0){
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum - estmRslt.discountMaker;
		var free = number_cut(taxFreeBase / (1 + estmCfg.tax * 1.3 / 100),1,'round');
		var taxAdd = taxFreeBase - free - estmRslt.vehicleTax;
		if(estmCfg.extra.indexOf("E")>=0 && taxAdd > 3000000*1.3*1.1){
			taxAdd = 3000000*1.3*1.1;
		}else if(estmCfg.extra.indexOf("F")>=0 && taxAdd > 4000000*1.3*1.1){
			taxAdd = 4000000*1.3*1.1;
		}else if((estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0) && taxAdd > 1000000*1.3*1.1){
			taxAdd = 1000000*1.3*1.1;
		}
		estmRslt.vehicleHev = taxAdd;	
	}
	/*
	if(fincConfig[estmNow][0]['deliveryType']=="01"){
		estmRslt.deliveryMaker = 0;
	}else{
		estmRslt.deliveryMaker = parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	}
	*/
	estmRslt.deliveryMaker = parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	estmRslt.vehicleSale = estmRslt.vehicleFree - estmRslt.discountMaker - estmRslt.discountSpecial - estmRslt.vehicleTax - estmRslt.vehicleHev;	// 선택금액(차량가격)
	if(estmMode=="rent" || estmRslt.brand<200) estmRslt.vehicleSale += estmRslt.deliveryMaker;
	estmRslt.vehicleSupply = number_cut(estmRslt.vehicleSale/1.1,1,'round');
	
	
	// 제원
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1853'])!="undefined") estmRslt.spec1853 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1853'];
	else estmRslt.spec1853 = "";	// 크기
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1854'])!="undefined") estmRslt.spec1854 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1854'];
	else estmRslt.spec1854 = "";	// 엔진
	if(estmRslt.spec1854){
		if(estmRslt.optionSpec && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'][estmRslt.optionSpec])!="undefined"){
			estmRslt.spec1854 = dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'][estmRslt.optionSpec];
		}
	}
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1855'])!="undefined") estmRslt.spec1855 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1855'];
	else estmRslt.spec1855 = "";	// 연비
	if(estmRslt.spec1855){
		if(estmRslt.optionSpec && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'][estmRslt.optionSpec])!="undefined"){
			estmRslt.spec1855 = dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'][estmRslt.optionSpec];
		}
		if(typeof(dataBank[Dpath]['spec'][estmRslt.spec1855])!="undefined"){
			var eff = dataBank[Dpath]['spec'][estmRslt.spec1855];
			if(eff['1872']=="전기") var unit = "㎞/㎾h";
			else if(eff['1872']=="수소") var unit = "㎞/㎏";
			else var unit = "㎞/ℓ";
			estmRslt.fuelEff = "복합 "+eff['1873']+unit+"(도심 "+eff['1874']+", 고속도로 "+eff['1875']+")";
		}else{
			estmRslt.spec1855 = "";
		}
	}
	estmConfig[estmNow]['specS'] = estmRslt.spec1853+","+estmRslt.spec1854+","+estmRslt.spec1855;
	
	// 즉시출고 동일성 확인
	estmRslt.vin = "";
	estmRslt.fastKind = "";
	if(typeof(start.fastship)!="undefined"){
		//if(start.model==estmRslt.model && start.trim==estmRslt.trim && start.colorExt==estmRslt.colorExt && start.colorInt==estmRslt.colorInt && start.option==estmRslt.option){
			estmRslt.vin = start.fastship;
			estmRslt.fastKind = start.fastKind;
		//}
	}
	// publish.js:571 capitalData_1
	
	if(estmMode=="lease" || estmMode=="fince"){
		
		if(estmMode=="fince"){
			// 취득원가 계산
			// 취득세율
			if(estmCfg.division=="P"){	// 가. 비영업용 승용자동차
				estmRslt.takeRate = 7;
				if(estmCfg.extra.indexOf("0")>=0) estmRslt.takeRate = 4;	// 경자동차 (전기차 배기량 없음 처리)
			}else{	// 나. 1) 비영업용
				estmRslt.takeRate = 5;	
				if(estmCfg.extra.indexOf("0")>=0) estmRslt.takeRate = 4;	// 경자동차
			}
			if(fincConfig[estmNow][0]['regType']=="2" && fincConfig[estmNow][0]['useBiz']=="Y")  estmRslt.takeRate = 4;
			estmRslt.takeTax = number_cut(estmRslt.takeRate * estmRslt.vehicleSupply / 100 , 10, "floor");	// 취득세액
			estmRslt.takeFreeName = "";
			if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){	
				if(estmRslt.takeTax>400000){
					estmRslt.takeTax = estmRslt.takeTax - 400000;
				}else{
					estmRslt.takeTax = 0;
				}
				estmRslt.takeFreeName = "하이브리드 감면";
			}else if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0){	
				if(estmRslt.takeTax>1400000){
					estmRslt.takeTax = estmRslt.takeTax - 1400000;
				}else{
					estmRslt.takeTax = 0;
				}
				if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0){
					estmRslt.takeFreeName = "전기차 감면";
				}else{
					estmRslt.takeFreeName = "수소차 감면";
				}
			}else if(estmCfg.extra.indexOf("0")>=0){	 // 경차	비영업용 승용자동차로 취득하는 경우에는 취득세를 2021년 12월 31일까지 면제한다.
				if(estmRslt.takeTax>750000){
					estmRslt.takeTax = estmRslt.takeTax - 750000;
				}else{
					estmRslt.takeTax = 0;
				}
				estmRslt.takeFreeName = "경차 감면";
			}
		}
		
		var sido = fincConfig[estmNow][0]['takeSido'];
		fincConfig[estmNow][0]['takeSidoName'] =$obj.find(".takeSidoSel li[takeSido='"+fincConfig[estmNow][0]['takeSido']+"']").text();
		fincConfig[estmNow][0]['takeSidoHana'] =$obj.find(".takeSidoSel li[takeSido='"+fincConfig[estmNow][0]['takeSido']+"']").attr('hana');
		var use = "P";
		if(fincConfig[estmNow][0]['regType']=="2" && fincConfig[estmNow][0]['useBiz']=="Y") use = "C";
		// 채권
		bond = calculatorBond(sido, use, estmCfg.displace, estmCfg.carry, estmCfg.person, estmCfg.extra, estmCfg.division, estmCfg.engine, estmRslt.vehicleSupply);
		if(fincConfig[estmNow][0]['takeSido']=="SU") fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut7']").val();
		else fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut5']").val();
	
		estmRslt.bondRate = bond[0];
		estmRslt.bondBuy = bond[1];
		estmRslt.bondKind = bond[2];
		// 하이브리드 감면..
		if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0 || estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){	// Hev/전기자동차 감면
			if(estmRslt.bondKind == "subway"){	
				if(estmCfg.division=="P" && estmCfg.person<7){		// 승용 7인승 이하만 대상임 2022-04-18 수정
					if((estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0) && estmRslt.bondBuy>2500000){	// 도시철도 전기/수소 250만원 한도
						estmRslt.bondBuy = estmRslt.bondBuy - 2500000;
					}else if((estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0) && estmRslt.bondBuy>2000000){	// 도시철도 하이브리드 250만원 한도
						estmRslt.bondBuy = estmRslt.bondBuy - 2000000;
					}else{
						estmRslt.bondBuy = 0;
					}
				}
			}else{	// 지역개발 150만원
				if(estmRslt.bondBuy>1500000){
					estmRslt.bondBuy = estmRslt.bondBuy - 1500000;
				}else{
					estmRslt.bondBuy = 0;
				}
			}
		}
		
		estmRslt.bondDc = parseFloat(fincConfig[estmNow][0]['bondDc']);
		estmRslt.bondCut = number_cut(estmRslt.bondBuy * estmRslt.bondDc / 100, 1, "floor"); // 5% 할인
		
		if(fincConfig[estmNow][0]['regTaxIn']=="00") estmRslt.takeTax = 0;
		if(fincConfig[estmNow][0]['regBondIn']=="00") estmRslt.bondCut = 0;
		
		estmRslt.takeExtra = parseInt(fincConfig[estmNow][0]['takeExtra']);
		estmRslt.takeSelf = parseInt(fincConfig[estmNow][0]['takeSelf']);
		estmRslt.addCost = 0;
		estmRslt.payCost = 0;
		
		if(fincConfig[estmNow][0]['regTaxIn']=="01") estmRslt.addCost += estmRslt.takeTax;
		else estmRslt.payCost += estmRslt.takeTax;
		if(fincConfig[estmNow][0]['regBondIn']=="01") estmRslt.addCost += estmRslt.bondCut; 
		else estmRslt.payCost += estmRslt.bondCut;
		if(fincConfig[estmNow][0]['regExtrIn']=="01") estmRslt.addCost += estmRslt.takeExtra;
		else estmRslt.payCost += estmRslt.takeExtra;
		if(estmRslt.brand>200 && fincConfig[estmNow][0]['deliveryIn']=="01") estmRslt.addCost += estmRslt.deliveryMaker;
		else if(estmRslt.brand>200) estmRslt.payCost += estmRslt.deliveryMaker;	// 수입차 탁송료
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']) estmRslt.payCost = 0;	// 시승차 예외처리, 불포함 표시하지 않음
		// if(estmRslt.brand>200) estmRslt.addCost += estmRslt.deliveryMaker;	// 수입차 탁송료
		var feeBase = estmRslt.capital;
		if(estmMode=="fince"){
			estmRslt.takeSum = estmRslt.payCost;
			estmRslt.cashSum = estmRslt.vehicleSale+estmRslt.takeSum;
		}
	}else{
		var feeBase = estmRslt.priceSum;
	}
	// 제휴사 수수료 초기화 금융리스 수정 2 (위치 변경)
	// 수수료율 위치 변경
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan" && feeBase){
		var agMax = parseFloat(defaultCfg['agFeeMax']);
		var cmMax = parseFloat(defaultCfg['cmFeeMax']);
		var maxFee = 0;
		if(feeBase<=5000000) maxFee += feeBase * parseFloat(defaultCfg['sumMaxA']) / 100;
		else maxFee += 5000000 * parseFloat(defaultCfg['sumMaxA']) / 100 + (feeBase - 5000000) * parseFloat(defaultCfg['sumMaxB']) / 100;
		
		var sumMax = number_cut(maxFee / feeBase * 10000, 1, 'floor')/100;
		if(typeof(fincConfig[estmNow][0]['feeDsR'])!="undefined"){
			sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
			sumMax = number_cut(sumMax * 100,1,'floor')/100;
		}
		defaultCfg['sumMax'] = sumMax;
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']) * 1.03412; // 3.3% 지원 및 부가세 포함시
		
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR) / 1.03412 * 100,1,'floor')/100 ;
			if(cmR<0){
				cmR = 0;
				agR = sumMax;
			}
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
		}
	}
	
	
	if(estmMode=="fince"){
		estmRslt.feeAg = "";
		estmRslt.feeCm = "";
		estmRslt.feeSum = "";
	}else{
		estmRslt.feeAg = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeAgR']) / 100,100,'floor');
		estmRslt.feeCm = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeCmR']) / 100,100,'floor');
			//estmRslt.feeDc = feeBase * parseFloat(fincConfig[estmNow][0]['feeDcR']) / 100;
		estmRslt.feeSum = estmRslt.feeAg + estmRslt.feeCm;
	}
}

function calculatorFinance(kd){
	if(estmMode=="fince"){
		estmRslt.capitalBase = estmRslt.vehicleSale;		// 선수율 기준
		if(estmRslt.brand<200){
			estmRslt.capitalBase -= estmRslt.deliveryMaker;		// 국산차 탁송료 제외
			estmRslt.payCost += estmRslt.deliveryMaker;
		}
		estmRslt.capitalMax = estmRslt.capitalBase;
		estmRslt.capitalMin = parseInt(defaultCfg['minCap']);
	}
	if(kd=="remain" && typeof(dataBank["remainLineup"+estmRslt.lineup]['deliveryShip'])!="undefined"){
		fincConfig[estmNow][0]['deliveryShip'] = dataBank["remainLineup"+estmRslt.lineup]['deliveryShip'];
	}
	if(kd=="remain") estmChangeKind = "remainApi";
	// 구매(인수) 고정 선택 확인
	if(typeof(dataBank["remainLineup"+estmRslt.lineup])!="undefined"){
		var fixEnd = "";
		if(estmRslt.colorExt && typeof(dataBank["remainLineup"+estmRslt.lineup]['fixEndExt'])!="undefined" && dataBank["remainLineup"+estmRslt.lineup]['fixEndExt'] && dataBank["remainLineup"+estmRslt.lineup]['fixEndExt'].indexOf(estmRslt.colorExt)>=0){
			fixEnd = "외장색상";
		}else if(estmRslt.colorInt && typeof(dataBank["remainLineup"+estmRslt.lineup]['fixEndInt'])!="undefined" && dataBank["remainLineup"+estmRslt.lineup]['fixEndInt'] && dataBank["remainLineup"+estmRslt.lineup]['fixEndInt'].indexOf(estmRslt.colorInt)>=0){
			fixEnd = "내장색상";
		}
		if(fixEnd && (estmChangeKind=="colorExt" || estmChangeKind=="colorInt")){
			var fixEndCkd = false;
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
				var fNo = parseInt($(this).attr("fincNo"));
				if(fincConfig[estmNow][fNo]['endType']!="0002") {
					fixEndCkd = true;
					fincConfig[estmNow][fNo]['endType'] = "0002";
				}
			});
			if(fixEndCkd){
				alertPopup("<span class='desc'>선택하신 "+fixEnd+"은 구매(인수)조건만 진행 가능합니다.</span><br>만기 조건을 확인해주세요.");
			}
		}
		if(fixEnd) $("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell .selsub[kind='endTypeSel']").attr("code","not");
		else $("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell .selsub[kind='endTypeSel']").attr("code","");
	}
	
	// 국산 수입 변경 확인
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	//fincConfig[estmNow][0]['insureCompany'] = dataBank["remainLineup"+estmRslt.lineup]['insureCompany'];
	if(typeof(fincData[estmNow])=="undefined") fincData[estmNow] = {};
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
		var fNo = parseInt($(this).attr("fincNo"));
		var goods = fincConfig[estmNow][fNo]['goods'];
		if($(this).find(".btnFincStar").hasClass("on")) fincConfig[estmNow][fNo]['star'] = "O";
		else fincConfig[estmNow][fNo]['star'] = "X";
		var star = fincConfig[estmNow][fNo]['star'];
		if((estmChangeKind!='endType' && estmChangeKind!='month' && estmChangeKind!='stampYn' && estmChangeKind!='monthH' && estmChangeKind!='capital' && estmChangeKind!='rateCover' && estmChangeKind!='km' && estmChangeKind!='prepay' && estmChangeKind!='deposit' && estmChangeKind!='respite' && estmChangeKind!='remain' && estmChangeKind!='careType' && estmChangeKind!='adCmfe' && estmChangeKind!='dcSppt') || fNo==fincNow[estmNow]){
			fincData[estmNow][fNo] = {};
			var eVal = new Object();
			// 공통 초기설정
			eVal.goods = goods;
			if(estmMode=="fince"){
				eVal.finceType = fincConfig[estmNow][0]['goodsKind'];
				eVal.name = dataBank['goodsConfig'][local]['finceType'][eVal.finceType];
				if(typeof(fincConfig[estmNow][fNo]['capital'])=="undefined") fincConfig[estmNow][fNo]['capital'] = defaultCfg['capital'];
				if(typeof(fincConfig[estmNow][fNo]['prepay'])=="undefined") fincConfig[estmNow][fNo]['prepay'] = defaultCfg['prepay'+fNo];
				if(typeof(fincConfig[estmNow][fNo]['rateCover'])=="undefined") fincConfig[estmNow][fNo]['rateCover'] = 0;
				if(typeof(fincConfig[estmNow][fNo]['stampYn'])=="undefined") fincConfig[estmNow][fNo]['stampYn'] = "Y";
				if(parseInt(fincConfig[estmNow][fNo]['prepay'])==0){
					eVal.capital = estmRslt.capitalMax;
				}else 	if(fincConfig[estmNow][fNo]['prepay']!="" && parseInt(fincConfig[estmNow][fNo]['prepay'])<100){
					eVal.capital = (100 - parseInt(fincConfig[estmNow][fNo]['prepay'])) * estmRslt.capitalBase / 100;
					eVal.capital = number_cut(eVal.capital,10000,"floor");
				}else 	if(fincConfig[estmNow][fNo]['prepay']!="" && parseInt(fincConfig[estmNow][fNo]['prepay'])>100){
					eVal.capital = estmRslt.capitalBase - parseInt(fincConfig[estmNow][fNo]['prepay']);
				}else{
					eVal.capital = parseInt(fincConfig[estmNow][fNo]['capital']);
				}
				if(eVal.capital<estmRslt.capitalMin) eVal.capital = estmRslt.capitalMin;
				else if(eVal.capital>estmRslt.capitalMax) eVal.capital = estmRslt.capitalMax;
				eVal.rateCover = parseInt(fincConfig[estmNow][fNo]['rateCover']);
				
				eVal.prepay = estmRslt.capitalBase -  eVal.capital;
				eVal.prepayR = number_cut(eVal.prepay /  estmRslt.capitalBase * 10000 ,1,"round") / 100;
				
				eVal.feeAg = number_cut(eVal.capital * parseFloat(fincConfig[estmNow][0]['feeAgR']) / 100,100,'floor');
				eVal.feeCm = number_cut(eVal.capital * parseFloat(fincConfig[estmNow][0]['feeCmR']) / 100,100,'floor');
				eVal.feeSum = eVal.feeAg + eVal.feeCm;
				
				// 인지세
				if(eVal.capital<=50000000) eVal.stamp = 0;
				else if(eVal.capital<=100000000) eVal.stamp = 70000;
				else if(eVal.capital<=1000000000) eVal.stamp = 150000;
				else eVal.stamp = 350000;
				eVal.stampYn = fincConfig[estmNow][fNo]['stampYn'];
			}else{
				if(typeof(fincConfig[estmNow][fNo]['endType'])=="undefined") fincConfig[estmNow][fNo]['endType'] = defaultCfg['endType'];
				if(typeof(fincConfig[estmNow][fNo]['prepay'])=="undefined") fincConfig[estmNow][fNo]['prepay'] = defaultCfg['prepay'+fNo];
				if(typeof(fincConfig[estmNow][fNo]['deposit'])=="undefined") fincConfig[estmNow][fNo]['deposit'] = defaultCfg['deposit'+fNo];
				if(typeof(fincConfig[estmNow][fNo]['km'])=="undefined") fincConfig[estmNow][fNo]['km'] = defaultCfg['km'];
				if(typeof(fincConfig[estmNow][fNo]['remain'])=="undefined") fincConfig[estmNow][fNo]['remain'] = defaultCfg['remain'];
				if(typeof(fincConfig[estmNow][fNo]['careType'])=="undefined") fincConfig[estmNow][fNo]['careType'] = defaultCfg['careType'];
				if(typeof(fincConfig[estmNow][fNo]['depositType'])=="undefined") fincConfig[estmNow][fNo]['depositType'] = defaultCfg['depositType'];
				if(typeof(fincConfig[estmNow][fNo]['remainType'])=="undefined") fincConfig[estmNow][fNo]['remainType'] = defaultCfg['remainType'];
				if(typeof(fincConfig[estmNow][fNo]['adCmfe'])=="undefined") fincConfig[estmNow][fNo]['adCmfe'] = "";
				if(typeof(fincConfig[estmNow][fNo]['dcSppt'])=="undefined") fincConfig[estmNow][fNo]['dcSppt'] = "";
			}
			if(typeof(fincConfig[estmNow][fNo]['month'])=="undefined") fincConfig[estmNow][fNo]['month'] = defaultCfg['month'+fNo];
			
			// 약정거리 만기, 기간 재설정 , 기본값 처리
			if(estmMode!="fince"){
				configMatchReset(fNo,'km');
				configMatchReset(fNo,'month');
				configMatchReset(fNo,'endType');
			}
			if(estmMode=="rent" && fincConfig[estmNow][fNo]['remainType']=="Y") fincConfig[estmNow][fNo]['km'] = "50000";
			//else if(estmMode=="rent" && (fincConfig[estmNow][fNo]['km']=="50000" || fincConfig[estmNow][fNo]['km']=="30000")) fincConfig[estmNow][fNo]['km'] = defaultCfg['km'];
			
			if(estmChangeKind=="goodsKind" && fincConfig[estmNow][0]['goodsKind']=="lease"){
				if(fincConfig[estmNow][fNo]['deposit']>parseInt(dataBank['goodsConfig'][local]['depositMax']))  fincConfig[estmNow][fNo]['deposit']=parseInt(dataBank['goodsConfig'][local]['depositMax']);
				if(fincConfig[estmNow][fNo]['deposit']>parseInt(dataBank['goodsConfig'][local]['preSumMax']))  fincConfig[estmNow][fNo]['deposit']=parseInt(dataBank['goodsConfig'][local]['preSumMax']);
			}
			if(estmMode!="fince"){
				eVal.endType = fincConfig[estmNow][fNo]['endType'];
				eVal.end = configMatchName(fNo,'endType',eVal.endType); // dataBank['goodsConfig'][local]['endType'][eVal.endType];
			}
			
			eVal.month = parseInt(fincConfig[estmNow][fNo]['month']);
			if(estmMode=="lease"){
				eVal.monthH = 0;	// 금융에서 처리 예정
			}
			eVal.respite = 0;  //		유예원금	pstpPrnc
			eVal.respiteR = 0;//		유예원금비율	pstpPrncRto
			eVal.km = fincConfig[estmNow][fNo]['km'];
			// 약정거리별 프로모션 리셋
			if(typeof(fincConfig[estmNow][fNo]['kmPromotion'])=="undefined") fincConfig[estmNow][fNo]['kmPromotion'] = "1";
			if(fincConfig[estmNow][fNo]['kmPromotion']!="1" && estmRslt.brand!="111" && estmRslt.brand!="112" && estmRslt.brand!="121" && estmCfg.extra.indexOf("0")>=0) fincConfig[estmNow][fNo]['kmPromotion'] = "1";
			else if(fincConfig[estmNow][fNo]['kmPromotion']!="1" && eVal.km=="00000" || parseInt(eVal.km)*parseInt(eVal.month)/12>100000) fincConfig[estmNow][fNo]['kmPromotion'] = "1";
			// if(typeof(start.fastship)!="undefined") fincConfig[estmNow][fNo]['kmPromotion'] = "2";		// 선구매 약정프로모션 모든 혜택 제외
			if(gnbPath=="usedcar"){
				if(typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'])=="undefined" || typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month])=="undefined" || typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month][eVal.km])=="undefined"){
					eVal.remainMax = 0;
				}else{
					eVal.remainMax = parseFloat(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month][eVal.km]);
					if(eVal.remainMax>90) eVal.remainMax = 0;
				}
				var minArr = extractValue(defaultCfg['remainMin'],',',':');
				eVal.remainMin = parseInt(minArr[fincConfig[estmNow][fincNow[estmNow]]['month']]);
				eVal.depositType = fincConfig[estmNow][fNo]['depositType'];
			}else if(estmMode!="fince"){
				eVal.careType = fincConfig[estmNow][fNo]['careType'];
				eVal.care = dataBank['goodsConfig'][local]['careType'][eVal.careType]+" Service";
				eVal.depositType = fincConfig[estmNow][fNo]['depositType'];
				
				if(typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'])=="undefined" || typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month])=="undefined" || typeof(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month][eVal.km])=="undefined"){
					eVal.remainMax = 0;
				}else{
					eVal.remainMax = parseFloat(dataBank["remainLineup"+estmRslt.lineup]['monthKm'][eVal.month][eVal.km]);
					if(eVal.remainMax>90) eVal.remainMax = 0;
				}
				var minArr = extractValue(defaultCfg['remainMin'],',',':');
				eVal.remainMin = parseInt(minArr[fincConfig[estmNow][fincNow[estmNow]]['month']]);
			}
			
			
			
			//if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan") var rateBase = estmRslt.capital;	// 금융리스 취득원가 기준
			//else 
			if(estmMode=="lease"){
				var rateBase = estmRslt.vehicleSale;	// 탁송료 전 가격
				if(estmRslt.brand<200) rateBase -= estmRslt.deliveryMaker;	// 탁송료 전 가격
				var cutStep = 1000;
				if(gnbPath=="usedcar") var rateBase = estmRslt.ucarPrice;
			}else if(estmMode=="rent"){
				var rateBase = estmRslt.priceSum;
				if(estmRslt.brand>200 && fincConfig[estmNow][0]['takeType']!="20") rateBase -= estmRslt.discountMaker;	// 수입차 할인 반영
				var cutStep = 100;
			}
			if(estmMode!="fince"){
				if(parseFloat(fincConfig[estmNow][fNo]['prepay'])<100){
					eVal.prepayR = parseFloat(fincConfig[estmNow][fNo]['prepay']);
					eVal.prepay = number_cut(eVal.prepayR * rateBase / 100, cutStep, 'floor') ;
				}else{
					var maxRate = dataBank['goodsConfig'][local]['prepayMax'];
					var maxSel = number_cut(maxRate * rateBase / 100, cutStep, "floor");
					if(maxSel<parseInt(fincConfig[estmNow][fNo]['prepay'])) fincConfig[estmNow][fNo]['prepay'] = maxSel;
					eVal.prepay = number_cut(parseFloat(fincConfig[estmNow][fNo]['prepay']), cutStep, 'floor') ;
					fincConfig[estmNow][fNo]['prepay'] = eVal.prepay;
					eVal.prepayR = number_cut(eVal.prepay / rateBase * 1000000,1,"floor") / 10000;
				}
				eVal.pmtPay = number_cut( eVal.prepay / eVal.month , 100, 'ceil');
				// 보증금
				if(parseFloat(fincConfig[estmNow][fNo]['deposit'])<100){
					eVal.depositR = parseFloat(fincConfig[estmNow][fNo]['deposit']);
					eVal.deposit = number_cut(eVal.depositR * rateBase / 100, cutStep, 'floor');
				}else{
					var maxRate = dataBank['goodsConfig'][local]['depositMax'];
					var maxSel = number_cut(maxRate * rateBase / 100, cutStep, "floor");
					if(maxSel<parseInt(fincConfig[estmNow][fNo]['deposit'])) fincConfig[estmNow][fNo]['deposit'] = maxSel;
					eVal.deposit = number_cut(parseFloat(fincConfig[estmNow][fNo]['deposit']),cutStep, 'floor');
					fincConfig[estmNow][fNo]['deposit'] = eVal.deposit;
					eVal.depositR = number_cut(eVal.deposit / rateBase * 1000000,1,"floor") / 10000;
				}
				/*
				var feeBase = estmRslt.capital - eVal.prepay;
				eVal.feeAg = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeAgR']) / 100,100,'floor');
				eVal.feeCm = number_cut(feeBase * parseFloat(fincConfig[estmNow][0]['feeCmR']) / 100,100,'floor');
				if(estmRslt.feeAg){
					estmRslt.feeAg += " / ";
					estmRslt.feeCm += " / ";
					estmRslt.feeSum += " / ";
				}
				estmRslt.feeAg += number_format(eVal.feeAg);
				estmRslt.feeCm += number_format(eVal.feeCm);
				estmRslt.feeSum += number_format(eVal.feeAg+eVal.feeCm);
				*/
				
			}

			if(eVal.goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){	// 금융리스 유예원금
				eVal.prepayR = 0;	// 선수금 대신 본인부담금으로 변경
				eVal.prepay = 0;	 // 선수금 대신 본인부담금으로 변경
				
				if(typeof(fincConfig[estmNow][fNo]['monthH'])!="undefined")  eVal.monthH = parseInt(fincConfig[estmNow][fNo]['monthH']);
				if(typeof(fincConfig[estmNow][fNo]['respite'])!="undefined")  eVal.respiteR = parseInt(fincConfig[estmNow][fNo]['respite']);
				eVal.capital = estmRslt.capital - eVal.prepay;
				if(eVal.respiteR>100){
					eVal.respite = eVal.respiteR;
					eVal.respiteR = number_cut(eVal.respite / rateBase * 1000000,1,"floor") / 10000;
				}else if(eVal.respiteR){
					eVal.respite = number_cut(eVal.respiteR * rateBase / 100, 100, 'floor');
				}
				eVal.remainR = 0;
				eVal.remain = 0;
				if(eVal.respite==0){
					eVal.depositR = 0;
					eVal.deposit = 0;
					eVal.depositS = 0;
				}else{
					if(eVal.depositType=="cash"){
						eVal.depositS = 0;
					}else{
						eVal.depositS = eVal.deposit;
						eVal.deposit = 0;
					}
				}
				eVal.km = "00000";		// 약정주행거리 초기화
				
			}else{
				
				if(eVal.depositType=="cash"){
					eVal.depositS = 0;
				}else{
					eVal.depositS = eVal.deposit;
					eVal.deposit = 0;
				}
				eVal.remainMaxCut = number_cut(eVal.remainMax * rateBase / 100, cutStep, 'floor');// 금액 제한
				eVal.remainMinCut = number_cut(eVal.remainMin * rateBase / 100, cutStep, 'floor');// 금액 제한
				if(fincConfig[estmNow][fNo]['remain']=="100"){
					eVal.remainR = eVal.remainMax;
				}else if(parseFloat(fincConfig[estmNow][fNo]['remain'])>100 && eVal.remainMaxCut<parseFloat(fincConfig[estmNow][fNo]['remain'])){
					fincConfig[estmNow][fNo]['remain'] = eVal.remainMaxCut;
					eVal.remainR = eVal.remainMaxCut;
					alertPopup("<span class='desc'>입력하신 값이 최대잔가를 벗어나서 최대잔가로 조정되었습니다.</span><br>잔존가치를 확인해주세요.");
				}else if(parseFloat(fincConfig[estmNow][fNo]['remain'])<100 && eVal.remainMax<parseFloat(fincConfig[estmNow][fNo]['remain'])){
					fincConfig[estmNow][fNo]['remain'] = eVal.remainMax;
					eVal.remainR = eVal.remainMax;
					alertPopup("<span class='desc'>입력하신 값이 최대잔가를 벗어나서 최대잔가로 조정되었습니다.</span><br>잔존가치를 확인해주세요.");
				}else if(parseFloat(fincConfig[estmNow][fNo]['remain'])>100 && eVal.remainMinCut>parseFloat(fincConfig[estmNow][fNo]['remain'])){
					fincConfig[estmNow][fNo]['remain'] = eVal.remainMinCut;
					eVal.remainR = eVal.remainMinCut;
					alertPopup("<span class='desc'>입력하신 값이 최저잔가를 벗어나서 최저잔가로 조정되었습니다.</span><br>잔존가치를 확인해주세요.");
				}else if(parseFloat(fincConfig[estmNow][fNo]['remain'])<100 && eVal.remainMin>parseFloat(fincConfig[estmNow][fNo]['remain'])){
					fincConfig[estmNow][fNo]['remain'] = eVal.remainMin;
					eVal.remainR = eVal.remainMin;
					alertPopup("<span class='desc'>입력하신 값이 최저잔가를 벗어나서 최저잔가로 조정되었습니다.</span><br>잔존가치를 확인해주세요.");
				}else{
					eVal.remainR = parseFloat(fincConfig[estmNow][fNo]['remain']);
				}
				if(eVal.remainR<100){
					eVal.remain = number_cut(eVal.remainR * rateBase / 100, cutStep, 'floor');
				}else{
					eVal.remain = number_cut(eVal.remainR, cutStep, 'floor');
					fincConfig[estmNow][fNo]['remain'] = eVal.remain;
					eVal.remainR = number_cut(eVal.remain / rateBase * 1000000, 1, 'floor') / 10000;
				}
				if(fincConfig[estmNow][fNo]['remainType']=="Y"){	// 할부형
					eVal.remainR = 0;
					eVal.remain = 9900;
				}
				eVal.remainType = fincConfig[estmNow][fNo]['remainType'];
			}

			if(goods=="rent"){
				eVal.name = "장기렌트";
			}else if(goods=="lease"){
				if(fincConfig[estmNow][0]['goodsKind']=="lease")  eVal.name = "운용리스";
				else if(fincConfig[estmNow][0]['goodsKind']=="loan")  eVal.name = "금융리스";
				else eVal.name = "오토리스";
			}
			fincData[estmNow][fNo] = eVal;
		}
	});
	if(estmMode=="fince"){
		var capMin = 0;		// 할부 최소
		var capMax = 0;		// 할부 최대
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			var goods = fincConfig[estmNow][fNo]['goods'];
			var star = fincConfig[estmNow][fNo]['star'];
			if(star=="O"){
				var eVal = fincData[estmNow][fNo];
				if(capMin==0){
					capMin = eVal.capital;
					capMax = eVal.capital;
				}else{
					if(capMin > eVal.capital) capMin = eVal.capital;
					if(capMax < eVal.capital) capMax = eVal.capital;
				}
			}
		});
		if(typeof(fincConfig[estmNow][0]['feeDsAmt'])!="undefined" && parseInt(fincConfig[estmNow][0]['feeDsAmt'])){
			feeBase = capMin;
		}else{
			feeBase = capMax;
		}
		var agMax = parseFloat(defaultCfg['agFeeMax']);
		var cmMax = parseFloat(defaultCfg['cmFeeMax']);
		var maxFee = 0;
		if(feeBase<=5000000) maxFee += feeBase * parseFloat(defaultCfg['sumMaxA']) / 100;
		else maxFee += 5000000 * parseFloat(defaultCfg['sumMaxA']) / 100 + (feeBase - 5000000) * parseFloat(defaultCfg['sumMaxB']) / 100;
		var sumMax = number_cut(maxFee / feeBase * 10000, 1, 'floor')/100;
		if(typeof(fincConfig[estmNow][0]['feeDsRate'])!="undefined"){
			sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsRate']);
		}
		if(typeof(fincConfig[estmNow][0]['feeDsAmt'])!="undefined"){
			sumMax -= parseInt(fincConfig[estmNow][0]['feeDsAmt'])/feeBase*100;
		}
		sumMax = number_cut(sumMax * 100,1,'floor')/100;
			
		defaultCfg['sumMax'] = sumMax;
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']) * 1.03412; // 3.3% 지원 및 부가세 포함시
		
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR) / 1.03412 * 100,1,'floor')/100 ;
			if(cmR<0){
				cmR = 0;
				agR = sumMax;
			}
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
				var fNo = parseInt($(this).attr("fincNo"));
				var eVal = fincData[estmNow][fNo];
				eVal.feeAg = number_cut(eVal.capital * parseFloat(fincConfig[estmNow][0]['feeAgR']) / 100,100,'floor');
				eVal.feeCm = number_cut(eVal.capital * parseFloat(fincConfig[estmNow][0]['feeCmR']) / 100,100,'floor');
			});
		}
		
	}
	
	if(gnbPath=="usedcar") outputU();
	else  output();
	
}
//옵션 선택 해제시 의존 체크
function optionApplyOff(name,apply,kind,trim){
	//console.log(apply+" "+kind);
	var lowerStr = "";
	var upperStr = "";
	var deleteStr = "";
	var compName = "";
	if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li.on:not(.off)");
	else var $obj = $("#trim_"+trim+" li.on");
	$obj.each(function (){
		if($(this).attr("apply")){
			comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
			if(comp){
				//console.log("not "+$(this).attr("option")+" "+comp);
				for(ot = 0; ot < comp.length; ot ++){
					os = comp.substring(ot,ot+1);
					if(os.toUpperCase()==os && upperStr.indexOf(os)<0){
						upperStr += os;
					}else if(os.toLowerCase()==os && lowerStr.indexOf(os)<0){
						lowerStr += os;
					}
				}
			}
		}
	});
	if(lowerStr){
		for(ot = 0; ot < lowerStr.length; ot ++){
			os = lowerStr.substring(ot,ot+1);
			if(upperStr.indexOf(os.toUpperCase())<0 && apply.indexOf(os.toUpperCase())>=0){
				deleteStr += os;
			}
		}
	}
	if(deleteStr){
		$obj.each(function (){
			if($(this).attr("apply")){
				comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
				if(comp && comp.indexOf(os)>=0){
					if(compName) compName += "] 옵션과 [";
					compName += $(this).find(".name").text();
					$(this).removeClass("on");
					if(kind=="price") $(this).find("input[type='checkbox']").prop("checked",false);
				}
			}
		});
	}
	if(compName){
		alertPopup("<span class='desc'>["+name+"] 옵션은 ["+compName+"] 옵션과 함께 적용됩니다.</span> <br>["+compName+"] 옵션 선택이 함께 취소됩니다.");
	}
	
}
// 옵션 선택시 중복/의존 체크
function optionApplyOn(name,apply,kind,trim){
	var pass = true;
	var depend = false;
	var compName = "";
	if(apply.toUpperCase()!=apply) depend = true;
	if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li.on:not(.off)");
	else if(kind=="price") var $obj = $("#trim_"+trim+" li.on");
	$obj.each(function (){
		if($(this).attr("apply")){
			comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
			if(pass && comp){
				for(ot = 0; ot < apply.length; ot ++){
					os = apply.substring(ot,ot+1);
					if(os.toUpperCase()==os && comp.indexOf(os)>=0){
						pass = false;
						compName = $(this).find(".name").text();
						break;
					}else if(depend && os.toLowerCase()==os && comp.indexOf(os.toUpperCase())>=0){
						depend = false;
					}
				}
			}
		}
	});
	if(pass && depend){
		if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li:not(.on,.off,.selfBox)");
		else var $obj = $("#trim_"+trim+" li:not(.on)");
		$obj.each(function (){
			if($(this).attr("apply")){
				comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
				if(depend && comp){
					for(ot = 0; ot < apply.length; ot ++){
						os = apply.substring(ot,ot+1);
						if(os.toLowerCase()==os && comp.indexOf(os.toUpperCase())>=0){
							if(compName) compName += "] 옵션 이나 [";
							compName += $(this).find(".name").text();
						}
					}
				}
			}
		});
		if(compName=="") depend = false;
	}
	
	return [pass, depend, compName];
}

//리스렌트 설정 text를 배열 변수로 변환 \n \t
function extractValue(data,row,col){
    var rtn = new Array();
    var tmp = data.split(row);
    for (var d in tmp) {
        if(tmp[d]){
            dat = tmp[d].split(col);
            rtn[dat[0]]  = $.trim(dat[1]);
        }
    }
    return rtn;
}
// data 변경 있는지 체크
function dataCheck(key,val){
	if(typeof(estmCheck[key])=="undefined"){
		estmCheck[key] = val;
	}else if(estmCheck[key] != val) {
		console.log(key+" X");
		//return false;
	}else{
		//console.log(key+" O");
	}
}
function calculatorCheck(){
	dataCheck("Brd-"+estmRslt.brand,estmRslt.brandName);
	dataCheck("Mod-"+estmRslt.model,estmRslt.modelName);
	dataCheck("Lup-"+estmRslt.lineup,estmRslt.lineupName);
	dataCheck("Trm-"+estmRslt.trim,estmRslt.trimPrice+"\t"+estmRslt.trimName);
	
}
//코드 명칭 변환
function configMatchName(fNo,kind,dat){
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	if(estmMode=="lease" && (kind=="endType" || kind=="month" || kind=="km")){
		if(fincConfig[estmNow][0]['goodsKind']=="lease"){
			var str = dataBank['goodsConfig'][local][kind]['opLeas'][dat];
		}else if(fincConfig[estmNow][0]['goodsKind']=="loan"){
			if(kind=="endType" && typeof(fincConfig[estmNow][fNo]['respite'])!="undefined" && fincConfig[estmNow][fNo]['respite']!="0"){
				var str = dataBank['goodsConfig'][local][kind]['fnnLeasPstp'][dat];
			}else{
				var str = dataBank['goodsConfig'][local][kind]['fnnLeas'][dat];
			}
		}
	}else{
		var str = dataBank['goodsConfig'][local][kind][dat];
	}
	return str;
}
function configMatchReset(fNo,kind){
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	if(estmMode=="lease" && (kind=="endType" || kind=="month" || kind=="km")){
		if(fincConfig[estmNow][0]['goodsKind']=="lease"){
			if(typeof(dataBank['goodsConfig'][local][kind]['opLeas'][fincConfig[estmNow][fNo][kind]])=="undefined"){
				fincConfig[estmNow][fNo][kind] = defaultCfg[kind];
			}
		}else if(fincConfig[estmNow][0]['goodsKind']=="loan"){
			if(kind=="endType" && typeof(fincConfig[estmNow][fNo]['respite'])!="undefined" && fincConfig[estmNow][fNo]['respite']!="0"){
				if(typeof(dataBank['goodsConfig'][local][kind]['fnnLeasPstp'][fincConfig[estmNow][fNo][kind]])=="undefined"){
					fincConfig[estmNow][fNo][kind] = Object.keys(dataBank['goodsConfig'][local][kind]['fnnLeasPstp'])[0];
				}
			}else{
				if(typeof(dataBank['goodsConfig'][local][kind]['fnnLeas'][fincConfig[estmNow][fNo][kind]])=="undefined"){
					if(kind=="month") fincConfig[estmNow][fNo][kind] = "36";
					else if(kind=="endType") fincConfig[estmNow][fNo][kind] = Object.keys(dataBank['goodsConfig'][local][kind]['fnnLeas'])[0];
					else fincConfig[estmNow][fNo][kind] = defaultCfg[kind];
				}
			}
		}
	}else{
		if(typeof(dataBank['goodsConfig'][local][kind][fincConfig[estmNow][fNo][kind]])=="undefined"){
			fincConfig[estmNow][fNo][kind] = defaultCfg[kind];
		}
	}
}
