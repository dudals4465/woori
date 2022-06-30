function calculator(){
	console.log("calculator Kind "+estmChangeKind);
	msgPopup = "";
	// 초기값 설정
	if(typeof(estmRslt.brand)=="undefined" && estmStart['open']==""){	// 초기값 설정	// estmMode != "fastship" && 
		if(estmMode=="rent")  var kind = ["takeType","buyType","payType","regType","useBiz","goodsKind","cartaxAdd","insureAdd","careAdd","regTaxIn","regBondIn","regExtrIn","deliveryIn","insureAge","insureObj","insureCar","insureSelf","insureEmpYn","navigation","blackBox","sdrrTinting","frtTinting","feeAgR","feeCmR","deliveryType","deliverySido","deliveryShip","dealerShop","takeSido","branchShop","branchName","accountNum"];	// 공통설정 항목
		for(var k in kind){
			if(typeof(estmConfig[0][kind[k]])=="undefined") estmConfig[0][kind[k]] = defaultCfg[kind[k]];
			else estmConfig[0][kind[k]] = "";
		}
		var localOld = "none";
		var brandOld = "none";
		var modelOld = "none";
		var lineupOld = "none";
		
		/*if(typeof(estmConfig[0]['deliveryMaker'])=="undefined") estmConfig[0]['deliveryMaker'] = 0;
		estmConfig[0]['etcAccessorie'] = "";
		estmConfig[0]['etcAccessorieCost'] = 0;
		estmConfig[0]['modify'] = "";
		estmConfig[0]['modifyCost'] = 0;*/
		$(".wrapper").addClass("use");
		/*$obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		$obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		estmConfig[0]['takeExtra'] = parseInt(defaultCfg['takeExtra']);
		estmConfig[0]['takeSelf'] = parseInt(defaultCfg['takeSelf']);*/
	}else{		//  if(estmMode != "fastship")
		if(estmRslt.brand<200) localOld = "domestic";
		else localOld = "imported";
		brandOld = estmRslt.brand;
		modelOld = estmRslt.model;
		lineupOld = estmRslt.lineup;
	}
	
	// 기본 설정
	estmRslt = {};
	estmRslt.mode = estmMode;
	
	estmRslt.trim = parseInt($(".setVehicleList[kind='trim']").attr("code"));
	estmRslt.lineup = parseInt($(".setVehicleList[kind='lineup']").attr("code"));
	estmRslt.model = parseInt($(".setVehicleList[kind='model']").attr("code"));
	estmRslt.brand = parseInt($(".setVehicleList[kind='brand']").attr("code"));
	
	Dpath = 'modelData'+estmRslt.model;
	
	// 명칭
	estmRslt.logo = dataBank[Dpath]['brand'][estmRslt.brand]['logo'];
	estmRslt.brandName = dataBank[Dpath]['brand'][estmRslt.brand]['name'];
	estmRslt.modelName = dataBank[Dpath]['model'][estmRslt.model]['name'];
	estmRslt.lineupName = dataBank[Dpath]['lineup'][estmRslt.lineup]['name'];
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['year'])!="undefined") estmRslt.lineupYear = number_filter(dataBank[Dpath]['lineup'][estmRslt.lineup]['year']);
	else estmRslt.lineupYear = "";
	estmRslt.trimName = dataBank[Dpath]['trim'][estmRslt.trim]['name']; 
	
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
	
	// 계산 설정
	estmCfg.tax = parseFloat(dataBank[Dpath]['trim'][estmRslt.trim]['tax']);
	estmCfg.extra = dataBank[Dpath]['trim'][estmRslt.trim]['extra'];
	estmCfg.carry = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['carry']);
	estmCfg.displace = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['displace']);
	estmCfg.person = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['person']);
	estmCfg.division = dataBank[Dpath]['trim'][estmRslt.trim]['division'];
	estmCfg.cartype = dataBank[Dpath]['trim'][estmRslt.trim]['cartype'];
	estmCfg.engine = dataBank[Dpath]['trim'][estmRslt.trim]['engine'];
	
	estmRslt.taxRate = estmCfg.tax;
	
	
	
	// 국산 수입 변경 확인
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	if(localOld!=local){
		if(estmMode=="rent"){
			/*var kind = ["insureAge","insureObj","insureCar","insureSelf","navigation","blackBox","sdrrTinting","frtTinting"];	// 국산 수입 변경 항목 체크
			for(var k in kind){
				if(typeof(dataBank['goodsConfig'][local][kind[k]][estmConfig[0][kind[k]]])=="undefined"){
					if(kind[k]=="insureSelf" && local == "imported") estmConfig[0][kind[k]] = defaultCfg['importSelf'];
					else if(typeof(defaultCfg[kind[k]])!="undefined") estmConfig[0][kind[k]] = defaultCfg[kind[k]];
					else estmConfig[0][kind[k]] = "";
				}
			}*/
			
		}
	}
	
	calculatorPrice();
	
	calculatorFinance('');
	
	output();
	
	console.log(estmRslt);
	console.log(estmConfig);
	console.log(fincRslt);
}

function calculatorPrice(){
	
	// 기본가격
	estmRslt.trimPrice = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['price']);
	
	// 외장색상
	estmRslt.colorExt = "";
	estmRslt.colorExtPrice = 0;
	estmRslt.colorExtName = "";
	estmRslt.colorExtRgb = "";
	if(typeof(estmConfig[0]['colorExt'])!="undefined" && estmConfig[0]['colorExt']){
		var val = estmConfig[0]['colorExt'].split("\t");
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
	if(typeof(estmConfig[0]['colorInt'])!="undefined" && estmConfig[0]['colorInt']){
		var val = estmConfig[0]['colorInt'].split("\t");
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
	if(typeof(estmConfig[0]['option'])!="undefined" && estmConfig[0]['option']){
		var dat = estmConfig[0]['option'].split("\n");
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
	estmRslt.priceSum = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;	// 순수차량가격
	estmRslt.extraSum = estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;	// 선택금액
	
	// 면세가격
	if(estmMode=="lease") estmRslt.vehicleFree = estmRslt.priceSum;
	else if(estmCfg.tax<=0 || estmCfg.tax==100) estmRslt.vehicleFree = estmRslt.priceSum;
	else estmRslt.vehicleFree = number_cut(estmRslt.priceSum / (1 + estmCfg.tax * 1.3 / 100),1,'round');
	
	estmRslt.deliveryMaker = 0; // 제조사 탁송료 parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	estmRslt.discountMaker = 0;	// 제조사 할인
	estmRslt.discountSpecial = 0;	// 특판 할인
	estmRslt.vehicleTax = 0;			// 개소세 감면
	estmRslt.vehicleHev = 0; 			// 하이브리드 감면
	estmRslt.vehicleSale = estmRslt.vehicleFree - estmRslt.discountMaker - estmRslt.discountSpecial - estmRslt.vehicleTax - estmRslt.vehicleHev;	// 선택금액(차량가격)
}

function calculatorFinance(kd){	
	$(".fincCell").each(function (){
		var fNo = parseInt($(this).attr("fincNo"));
	});
	
	
}
