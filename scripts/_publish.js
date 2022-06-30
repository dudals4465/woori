function outputU(){
	// 창 정리
	if(estmChangeKind != "regYM" && estmChangeKind != "incentive"){
		$(".selbar .list").css("display","none");
		$(".selbar").removeClass("open");
		$(".selsub .list").css("display","none");
		$(".selsub").removeClass("open");
		$(".seltop .list").css("display","none");
		$(".seltop").removeClass("open");
	}
	
	estmDoc[estmNow] = {};	// 저장된 key reset;
	estmDoc['M'] = {};	// 저장된 key reset;
	// 기본 항목 저장
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	var regYM = "";
	if(typeof(fincConfig[estmNow][0]['regY'])!="undefined" && fincConfig[estmNow][0]['regY']) regYM += fincConfig[estmNow][0]['regY']+"년";
	if(typeof(fincConfig[estmNow][0]['regM'])!="undefined" && fincConfig[estmNow][0]['regM']) regYM += " "+parseInt(fincConfig[estmNow][0]['regM'])+"월";
	if(regYM=="") regYM = "<span class='blank'>최초등록 년월을 선택해 주세요.</span>";
	$obj.find(".estmRslt_regYM").html(regYM);
	if(estmRslt.ucarName) $obj.find(".estmRslt_ucarName").html(estmRslt.ucarName);
	else $obj.find(".estmRslt_ucarName").html("<span class='blank'>검색하신 후 선택해 주세요.</span>");
	if(estmRslt.ucarPrice) $obj.find(".estmRslt_ucarPrice").val(number_format(estmRslt.ucarPrice));
	else $obj.find(".estmRslt_ucarPrice").val("");
	
	// 공통선택 표시
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	
	if(defaultCfg['feeView']=="Y"){
		if(estmMode=="fince") var feeCost = "대출원금 기준, CM : "+fincConfig[estmNow][0]['feeCmR']+"%, AG : "+fincConfig[estmNow][0]['feeAgR']+"%";
		else var feeCost = "CM : ("+fincConfig[estmNow][0]['feeCmR']+"%) "+number_format(estmRslt.feeCm)+", AG : ("+fincConfig[estmNow][0]['feeAgR']+"%) "+number_format(estmRslt.feeAg);
		$obj.find(".estmRslt_configFeeCost").html(feeCost);
		$obj.find(".estmRslt_configFeeText").text("수수료");
	}else{
		$obj.find(".estmRslt_configFeeCost").html("&nbsp;");
		$obj.find(".estmRslt_configFeeText").text("기타");
	}
	// 출고장/제휴사
	if(estmRslt.certifyYN== "Y"){
		$obj.find(".delaerS").removeClass("off");
		if(fincConfig[estmNow][0]['dealerShop']=="") estmRslt.dealerShop="<span class='blank'>선택해주세요.</span>";
		else if(fincConfig[estmNow][0]['dealerShop']=="etc")  estmRslt.dealerShop = "선택하지 않음";
		else estmRslt.dealerShop = dataBank['goodsConfig'][local]['dealerShop']['ucar'][fincConfig[estmNow][0]['dealerShop']];
		$obj.find(".estmRslt_dealerShop").html(estmRslt.dealerShop);
	}else{
		$obj.find(".delaerS").addClass("off");
	}
	
	if(estmMode=="lease" || estmMode=="fince"){
		if(fincConfig[estmNow][0]['goodsKind']=="loan"){
			$obj.find(".takeSelf").removeClass("off");
		}else{
			$obj.find(".takeSelf").addClass("off");
		}
		// 영향 제외 
		if(estmMode=="fince"){
			if(estmRslt.takeFreeName) $obj.find(".estmRslt_takeRate").text(estmRslt.takeFreeName);
			else $obj.find(".estmRslt_takeRate").text(estmRslt.takeRate+"%");
			$obj.find(".estmRslt_takeTax").text(number_format(estmRslt.takeTax));
			number_change(estmRslt.cashSum,$obj.find(".estmRslt_cashSum"));
		}else 	if(fincConfig[estmNow][0]['capitalCal']=="Y"){
			$obj.find(".estmRslt_takeTax").text(number_format(estmRslt.takeTax));
			number_change(estmRslt.capital,$obj.find(".estmRslt_capital"));
			$obj.find("button.getCapital").addClass("off");
			$obj.find(".estmRslt_capital").removeClass("off");
		}else{
			$obj.find(".estmRslt_takeTax").text("-");
			$obj.find("button.getCapital").removeClass("off");
			$obj.find("button.getCapital").text("계산하기");
			$obj.find(".estmRslt_capital").addClass("off");
			$obj.find(".estmRslt_capital").attr("capital","0");
		}
		$obj.find(".estmRslt_takeSido").text(fincConfig[estmNow][0]['takeSidoName']);
		if(fincConfig[estmNow][0]['takeSido']=="SU"){
			$obj.find(".bond7yr").removeClass("off");
			$obj.find(".bond5yr").addClass("off");
		}else{
			$obj.find(".bond7yr").addClass("off");
			$obj.find(".bond5yr").removeClass("off");
		}
		if(estmRslt.bondBuy==0) var bondBuy = "(매입 없음)";
		else if(estmRslt.bondRate && estmRslt.bondRate<100) var bondBuy = "(매입 "+estmRslt.bondRate+"% "+number_format(estmRslt.bondBuy)+")";
		else var bondBuy = "(매입  "+number_format(estmRslt.bondBuy)+")";
		$obj.find(".estmRslt_bondBuy").text(bondBuy);
		$obj.find(".estmRslt_bondCut").val(number_format(estmRslt.bondCut));
		$obj.find(".estmRslt_takeExtra").val(number_format(estmRslt.takeExtra));
		$obj.find(".estmRslt_takeSelf").val(number_format(estmRslt.takeSelf));
		$obj.find("input[name='deliveryMaker']").val(number_format(fincConfig[estmNow][0]['deliveryMaker']));
	}
	$obj.find(".estmRslt_branchShop").text(fincConfig[estmNow][0]['branchName']);
	
	if(estmMode=="lease" && estmRslt.capital==0){
		$obj.find(".fincView").css("display","none");
		$obj.find(".guide").css("display","block");
		$obj.find(".guide .blank").text("취득원가를 먼저 계산해 주세요.");
		$(".wrapper").removeClass("use");
		$("#estmBox").removeClass("open");
	}else{
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			var goods = fincConfig[estmNow][fNo]['goods'];
			var star = fincConfig[estmNow][fNo]['star'];
			var eVal = fincData[estmNow][fNo];
			$(this).find(".fincView").css("display","none");
			$(this).find(".guide").css("display","none");
			if(eVal.goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				$(this).find(".fincView[view*='K']").css("display","block");
				if(typeof(fincConfig[estmNow][fincNow[estmNow]]['respite'])!="undefined" && fincConfig[estmNow][fincNow[estmNow]]['respite']!="0") $(this).find(".fincView[view*='S']").css("display","block");
			}else if(eVal.goods=="lease"){
				$(this).find(".fincView[view*='L']").css("display","block");
			}
			
			$(this).find(".estmRslt_fincName").text(eVal.name);
			$(this).find(".estmRslt_fincEnd").text(eVal.end);
			$(this).find(".estmRslt_fincMonth").text(configMatchName(fNo,'month',eVal.month));	//  dataBank['goodsConfig'][local]['month'][eVal.month]);  estmRslt_fincMonth
			if(estmMode!="fince") {
				$(this).find(".estmRslt_fincKm").text(configMatchName(fNo,'km',eVal.km)+"/년");
				fincConfig[estmNow][fNo]['kmPromotionName'] = "";
			}
			if(eVal.goods=="fince"){
				$(this).find(".selsub[kind='capitalSel']").attr("code",estmRslt.capitalBase+":"+estmRslt.capitalMin+":"+estmRslt.capitalMax);
			}else{
				$(this).find(".selsub[kind='prepaySel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='prepaySel']").attr("ratoDis",eVal.depositR+eVal.respiteR);
				$(this).find(".selsub[kind='depositSel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='depositSel']").attr("ratoDis",eVal.prepayR+eVal.respiteR);
				$(this).find(".selsub[kind='respiteSel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='respiteSel']").attr("ratoDis",eVal.prepayR+eVal.depositR);
			}
			
			$(this).find(".selsub[kind='monthHSel']").attr("code",eVal.month);
			if(eVal.goods=="fince"){
				$(this).find(".estmRslt_finceCapital").html(number_format(eVal.capital));
				$(this).find(".estmRslt_fincPrepay").html(eVal.prepayR+"% <span class='price'>"+number_format(eVal.prepay)+"</span>");
				// $(this).find(".estmRslt_prepayRate").html(eVal.prepayR+"%");
				// $(this).find(".estmRslt_prepay").html(number_format(eVal.prepay));
				$(this).find(".estmRslt_rateCover").val(number_format(eVal.rateCover));
				if(eVal.stamp){
					$(this).find(".stempCheck").removeClass("off");
				}else{
					$(this).find(".stempCheck").addClass("off");
				}
				$(this).find(".estmRslt_finceStamp").text(number_format(eVal.stamp/2));
			}else{
				$(this).find(".estmRslt_fincPrepay").html(eVal.prepayR+"% <span class='price'>"+number_format(eVal.prepay)+"</span>");
				if(eVal.depositType=="stock" && eVal.depositS){
					$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% [이행보증보험증권] <span class='price'> "+number_format(eVal.depositS)+"</span>");
				}else{
					$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% <span class='price'>"+number_format(eVal.deposit)+"</span>");
				}
				$(this).find(".selsub[kind='remainSel']").attr("code",eVal.remainMax);
				$(this).find(".selsub[kind='remainSel']").attr("cutMax",eVal.remainMaxCut);
				$(this).find(".selsub[kind='remainSel']").attr("cutMin",eVal.remainMinCut);
				
				if(fincConfig[estmNow][fNo]['remainType']=="Y") $(this).find(".estmRslt_fincRemain").html("할부형 <span class='price'>"+number_format(eVal.remain)+"</span>");
				else if(fincConfig[estmNow][fNo]['remain']=="100") $(this).find(".estmRslt_fincRemain").html("최대("+eVal.remainR+"%) <span class='price'>"+number_format(eVal.remain)+"</span>");
				else $(this).find(".estmRslt_fincRemain").html(eVal.remainR+"% <span class='price'>"+number_format(eVal.remain)+"</span>");
				$(this).find(".estmRslt_fincCare").text(eVal.care);
			}
			
			
			if(goods=="lease"){	// 할인지원금, 추가수수료
				if(estmChangeKind=="adCmfe"){
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					$(this).find("button.getResult").attr("adCmfe","");
					if($(this).find("input[name^='adCmfe']:checked").length) fincConfig[estmNow][fNo]['adCmfe'] = $(this).find("input[name^='adCmfe']:checked").val();
				}else{
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					$(this).find("button.getResult").attr("adCmfe","");
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					if(typeof(dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'])=="undefined" || dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'][eVal.month]!="Y" ){
						$(this).find(".fincView[kind='adCmfe'] .desc").removeClass("off");
						$(this).find(".fincView[kind='adCmfe'] .radio").addClass("off");
					}else{
						$(this).find(".fincView[kind='adCmfe'] .desc").addClass("off");
						$(this).find(".fincView[kind='adCmfe'] .radio").removeClass("off");
						if(typeof(dataBank["remainLineup"+estmRslt.lineup]['adCmfe'])!="undefined" && (dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="01" || dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="02")){
							fincConfig[estmNow][fNo]['adCmfe'] = dataBank["remainLineup"+estmRslt.lineup]['adCmfe'];
							// 값 다르면 아래 적용
							//if(dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="01") fincConfig[estmNow][fNo]['adCmfe'] = "02";
							//else if(dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="02") fincConfig[estmNow][fNo]['adCmfe'] = "01";
							$(this).find("input[name^='adCmfe']").parent().css("display","none");
							$(this).find("input[name^='adCmfe'][value='"+fincConfig[estmNow][fNo]['adCmfe']+"']").parent().css("display","");
							$(this).find("input[name^='adCmfe'][value='"+fincConfig[estmNow][fNo]['adCmfe']+"']").prop("checked",true);
						}else{
							if($(this).find("input[name^='adCmfe']:checked").length) fincConfig[estmNow][fNo]['adCmfe'] = $(this).find("input[name^='adCmfe']:checked").val();
							else $(this).find("button.getResult").attr("adCmfe","X");
						}
					}
				}
				
				
				fincConfig[estmNow][fNo]['dcSppt'] = "";
				$(this).find("button.getResult").attr("dcSppt","");
				if(typeof(dataBank["remainLineup"+estmRslt.lineup]['dcSppt'])=="undefined" || dataBank["remainLineup"+estmRslt.lineup]['dcSppt']!="Y" ){
					$(this).find(".fincView[kind='dcSppt'] .desc").removeClass("off");
					$(this).find(".fincView[kind='dcSppt'] .radio").addClass("off");
				}else{
					$(this).find(".fincView[kind='dcSppt'] .desc").addClass("off");
					$(this).find(".fincView[kind='dcSppt'] .radio").removeClass("off");
					if($(this).find("input[name^='dcSppt']:checked").length) fincConfig[estmNow][fNo]['dcSppt'] = $(this).find("input[name^='dcSppt']:checked").val();
					else $(this).find("button.getResult").attr("dcSppt","X");
				}
			}
			if(goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선수금");
				$(this).find(".estmRslt_fincRespite").html(eVal.respiteR+"% <span class='price'>"+number_format(eVal.respite)+"</span>");
				if(eVal.monthH) $(this).find(".estmRslt_fincMonthH").text(eVal.monthH+"개월");
				else $(this).find(".estmRslt_fincMonthH").text("없음");
				if(eVal.capital<=estmRslt.vehicleSale){
					$(this).find(".estmRslt_loanCapital").text(number_format(eVal.capital));
					$(this).find("button.getResult").attr("loan",eVal.capital);
				}else{
					$(this).find(".estmRslt_loanCapital").text("(차량가 상회) "+number_format(eVal.capital));
					$(this).find("button.getResult").attr("loan","0");
				}
			}else if(goods=="lease"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선납금");
				if(estmRslt.vehicleSale>=eVal.deposit+eVal.prepay+eVal.remain){
					$(this).find("button.getResult").attr("loan",estmRslt.vehicleSale-eVal.deposit+eVal.prepay+eVal.remain);
				}else{
					$(this).find("button.getResult").attr("loan","0");
				}
			}else if(goods=="fince"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선수금");
			}else{
				$(this).find(".estmRslt_fincPrepayTitle").text("선납금");
			}
			
			var payTxt = "";
			var paySum = eVal.prepay;
			if(eVal.prepay && goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")  payTxt += "선수금";
			else if(eVal.prepay)  payTxt += "선납금";
			if(eVal.deposit && eVal.depositType=="cash"){
				if(payTxt) payTxt += "+";
				payTxt += "보증금";
				paySum += eVal.deposit;
			}
			/*
			if(goods=="lease" && estmRslt.payCost){
				if(payTxt) payTxt += "+";
				payTxt += "고객별도";
				paySum += estmRslt.payCost;
			}
			*/
			
			$(this).find(".estmRslt_fincPaySum").html(payTxt+" <span class='price'>"+number_format(paySum)+"</span>");
			if(estmChangeKind=='branchShop'){
				// 계산 결과와 관계 없음
			}else if((estmChangeKind!='endType' &&  estmChangeKind!='capital'  &&  estmChangeKind!='stampYn' && estmChangeKind!='rateCover' && estmChangeKind!='month' && estmChangeKind!='monthH' && estmChangeKind!='km' && estmChangeKind!='prepay' && estmChangeKind!='deposit' && estmChangeKind!='respite' && estmChangeKind!='remain' && estmChangeKind!='careType' && estmChangeKind!='adCmfe' && estmChangeKind!='dcSppt') || fNo==fincNow[estmNow]){
				// 계산 결과 버튼 표시
				$(this).find("button.getResult").removeClass("off");
				$(this).find("button.getResult").text("계산하기");
				$(this).find(".estmRslt_loanRate").text("");
				$(this).find(".estmRslt_finceRate").text("");
				$(this).find(".estmRslt_pmtPay").addClass("off");
				$(this).find(".estmRslt_pmtPayMax").addClass("off");
				eVal.viewPmt = "none";
				fincConfig[estmNow][fNo]['feeAgAdd'] = "";
				fincConfig[estmNow][fNo]['feeAgAddR'] = "";
				// 견적서 결과 표시
			}
			if(estmMode=="rent" && fincConfig[estmNow][fNo]['remainType']=="Y") $(this).find("button.getResult").attr("remain","Y");
			else $(this).find("button.getResult").attr("remain",eVal.remainMax);
			
			
		});
		if(deviceType=="app"){
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
	}
	
}


function output(){
	// 창 정리
	if(estmChangeKind != "capitalLease" && estmChangeKind != "remainApi" && estmChangeKind != "insure" && estmChangeKind != "accessory" && estmChangeKind != "modify" && estmChangeKind != "incentive"){
		$(".selbar .list").css("display","none");
		$(".selbar").removeClass("open");
		$(".selsub .list").css("display","none");
		$(".selsub").removeClass("open");
		$(".seltop .list").css("display","none");
		$(".seltop").removeClass("open");
	}
	
	estmDoc[estmNow] = {};	// 저장된 key reset;
	estmDoc['M'] = {};	// 저장된 key reset;
	// 기본 항목 저장
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	
	$obj.find(".estmRslt_brand").attr("code",estmRslt.brand);
	$obj.find(".estmRslt_model").attr("code",estmRslt.model);
	$obj.find(".estmRslt_lineup").attr("code",estmRslt.lineup);
	$obj.find(".estmRslt_trim").attr("code",estmRslt.trim);
	$obj.find(".estmRslt_brandName").html("<img src='"+imgPath+estmRslt.logo+"' alt=''>"+estmRslt.brandName+"</span>");
	$obj.find(".estmRslt_modelName").html(estmRslt.modelName);
	if(estmRslt.lineupName.indexOf("(")>=0){
		var lineupN = estmRslt.lineupName.substring(0, estmRslt.lineupName.indexOf("("))+" <span class='sub'>"+estmRslt.lineupName.substring(estmRslt.lineupName.indexOf("("))+"</span>";
	}else{
		var lineupN= estmRslt.lineupName;
	}
	$obj.find(".estmRslt_lineupName").html(lineupN);
	$obj.find(".estmRslt_trimName").html(estmRslt.trimName+" <span class='price'>"+number_format(estmRslt.trimPrice)+"</span>");
	
	// 외장색상
	var colorExt = "선택 없음";
	if(estmRslt.colorExt){
		dat = estmRslt.colorExtRgb.split("/");
		colorExt = "<span class='name'>"+estmRslt.colorExtName+"</span>";
		if(dat[0]){
			colorExt += "<span class='colorChip'><span class='colorMain' style='background-color:#"+dat[0]+"'>&nbsp;</span>";
			if(dat[1]) colorExt += "<span class='colorSub' style='background-color:#"+dat[1]+"'>&nbsp;</span>";
			colorExt += "</span>";
		}
		if(estmRslt.colorExtPrice!="0") colorExt += "<span class='price'>"+number_format(estmRslt.colorExtPrice)+"</span>";
	}
	$obj.find(".estmRslt_colorExt").html(colorExt);
	// 내장색상
	var colorInt = "선택 없음";
	if(estmRslt.colorInt){
		dat = estmRslt.colorIntRgb.split("/");
		colorInt = "<span class='name'>"+estmRslt.colorIntName+"</span>";
		if(dat[0]){
			colorInt += "<span class='colorChip'><span class='colorMain' style='background-color:#"+dat[0]+"'>&nbsp;</span>";
			if(dat[1]) colorInt += "<span class='colorSub' style='background-color:#"+dat[1]+"'>&nbsp;</span>";
			colorInt += "</span>";
		}
		if(estmRslt.colorIntPrice!="0") colorInt += "<span class='price'>"+number_format(estmRslt.colorIntPrice)+"</span>";
	}
	$obj.find(".estmRslt_colorInt").html(colorInt);
	// 기본가격 + 색상
	number_change(estmRslt.trimPrice, $obj.find(".estmRslt_trimPrice") );
	
	// 옵션
	var optionLen = "";
	if(estmRslt.optionList){
		var tmp = estmRslt.optionList.split("\n");
		optionLen = "("+tmp.length+")";
	}
	$obj.find(".estmRslt_optionLen").html(optionLen);
	number_change(estmRslt.extraSum, $obj.find(".estmRslt_optionSum"));
	
	// 메이커 할인 금액 표시
	var dcR = parseFloat($obj.find("input[name='discountR']").val());
	$obj.find("input[name='discountR']").parent().next().text(number_format(number_cut(estmRslt.vehicleFree * dcR / 100,1000,'floor')));
	$obj.find("input[name='discountP']").val(number_format(number_filter($obj.find("input[name='discountP']").val())));
	
	// 차량가격 합계
	$obj.find(".estmRslt_vehicleCar").text(number_format(estmRslt.priceSum));
	if(estmMode=="lease"){
		if(estmRslt.vehicleHev){
			$obj.find(".estmRslt_vehicleHevName").text("개소세/Hev감면");
			$obj.find(".estmRslt_vehicleHev").text(number_format(estmRslt.vehicleTax)+" / "+number_format(estmRslt.vehicleHev));
		}else{
			$obj.find(".estmRslt_vehicleHevName").text("개소세감면");
			$obj.find(".estmRslt_vehicleHev").text(number_format(estmRslt.vehicleTax));
		}
		if(estmRslt.brand<"200" && estmConfig[estmNow]['discount'].indexOf('T')>0){
			$obj.find(".estmRslt_vehicleHev").text("할인액에 포함");
		}
	}else{
		if(estmRslt.taxRate!=100) $obj.find(".estmRslt_vehicleFree").text(number_format(estmRslt.vehicleFree));
		else $obj.find(".estmRslt_vehicleFree").text("과세출고");
	}
	$obj.find(".estmRslt_vehicleDc").text(number_format(estmRslt.discountMaker+estmRslt.discountSpecial));
	$obj.find(".estmRslt_deliveryMaker").text(number_format(estmRslt.deliveryMaker));
	// 출고 방법
	if(estmRslt.brand==111 || estmRslt.brand==112 || estmRslt.brand==121){
		$obj.find(".unitA input[name='takeType'][value='30']").parent().removeClass("off");
	}else{
		$obj.find(".unitA input[name='takeType'][value='30']").parent().addClass("off");
	}
	if(estmMode == "fastship" || estmMode == "lease" || fincConfig[estmNow][0]['takeType']!="20"){	// 대리점출고 지점출고(현대)
		$obj.find(".unitA[tab='summary'] .vehicle").removeClass("off");
		$obj.find(".estmRslt_vehicleTag").text("출고가격(계산서)");
		number_change(estmRslt.vehicleSale,$obj.find(".estmRslt_vehicleSale"));
		$obj.find(".discountList").removeClass("off");
	}else{
		$obj.find(".unitA[tab='summary'] .vehicle").addClass("off");
		$obj.find(".estmRslt_vehicleTag").text("차량가격(가격표)");
		number_change(estmRslt.priceSum,$obj.find(".estmRslt_vehicleSale"));
		$obj.find(".discountList").addClass("off");
	}
	$obj.find("input[name='deliveryMaker']").val(number_format(fincConfig[estmNow][0]['deliveryMaker']));
	if(estmMode == "fastship")	return false; // 즉시출고 이하 불가
	// 세율 안내
	var freeM = "해당없음";
	if(estmCfg.tax==100)  var freeM = "과세출고";
	else if(estmCfg.tax!=0 && Math.abs(estmCfg.tax)<100) var freeM = Math.abs(estmCfg.tax)+"%";
	$obj.find(".estmRslt_taxFreeDesc").text(freeM);
	
	// takeType
	if(estmMode=="lease" || estmMode=="fince"){
		// 영향 제외 
		if(estmMode=="fince"){
			if(estmRslt.takeFreeName) $obj.find(".estmRslt_takeRate").text(estmRslt.takeFreeName);
			else $obj.find(".estmRslt_takeRate").text(estmRslt.takeRate+"%");
			$obj.find(".estmRslt_takeTax").text(number_format(estmRslt.takeTax));
			number_change(estmRslt.cashSum,$obj.find(".estmRslt_cashSum"));
		}else 	if(fincConfig[estmNow][0]['capitalCal']=="Y"){
			$obj.find(".estmRslt_takeTax").text(number_format(estmRslt.takeTax));
			number_change(estmRslt.capital,$obj.find(".estmRslt_capital"));
			$obj.find("button.getCapital").addClass("off");
			$obj.find(".estmRslt_capital").removeClass("off");
		}else{
			$obj.find(".estmRslt_takeTax").text("-");
			$obj.find("button.getCapital").removeClass("off");
			$obj.find("button.getCapital").text("계산하기");
			$obj.find(".estmRslt_capital").addClass("off");
			$obj.find(".estmRslt_capital").attr("capital","0");
		}
		$obj.find(".estmRslt_takeSido").text(fincConfig[estmNow][0]['takeSidoName']);
		if(fincConfig[estmNow][0]['takeSido']=="SU"){
			$obj.find(".bond7yr").removeClass("off");
			$obj.find(".bond5yr").addClass("off");
		}else{
			$obj.find(".bond7yr").addClass("off");
			$obj.find(".bond5yr").removeClass("off");
		}
		if(estmRslt.bondBuy==0) var bondBuy = "(매입 없음)";
		else if(estmRslt.bondRate && estmRslt.bondRate<100) var bondBuy = "(매입 "+estmRslt.bondRate+"% "+number_format(estmRslt.bondBuy)+")";
		else var bondBuy = "(매입  "+number_format(estmRslt.bondBuy)+")";
		$obj.find(".estmRslt_bondBuy").text(bondBuy);
		$obj.find(".estmRslt_bondCut").text(number_format(estmRslt.bondCut));
		$obj.find(".estmRslt_takeExtra").val(number_format(estmRslt.takeExtra));
		$obj.find(".estmRslt_takeSelf").val(number_format(estmRslt.takeSelf));
	}
	
	// 공통선택 표시
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	//$obj.find(".estmRslt_configCare").html(dataBank['goodsConfig'][local]['careType'][fincConfig[estmNow][0]['careType']]);
	//estmRslt.configCare = dataBank['goodsConfig'][local]['careType'][fincConfig[estmNow][0]['careType']];
	if(estmMode=="rent"){
		var insure =  number_only(dataBank['goodsConfig'][local]['insureAge'][fincConfig[estmNow][0]['insureAge']])+"세";
		insure +=  ", "+dataBank['goodsConfig'][local]['insureObj'][fincConfig[estmNow][0]['insureObj']];
		insure +=  ", "+dataBank['goodsConfig'][local]['insureCar'][fincConfig[estmNow][0]['insureCar']];
		insure +=  ", "+dataBank['goodsConfig'][local]['insureSelf'][fincConfig[estmNow][0]['insureSelf']];
		
		// if(fincConfig[estmNow][0]['insureEmpYn']=="Y") insure +=  ", 가입";
		$obj.find(".estmRslt_configInsure").html(insure);
		estmRslt.configInsure = insure;
	}
	
	var accessory = "";
	estmRslt.configAccessory = "";
	if(fincConfig[estmNow][0]['navigation']!="01"){
		if(accessory){
			accessory += ", ";
			estmRslt.configAccessory += ", ";
		}
		accessory += "내비게이션";
		estmRslt.configAccessory += "내비게이션 "+dataBank['goodsConfig'][local]['navigation'][fincConfig[estmNow][0]['navigation']];
		/*
		var accessory = {navigation:"내비게이션",blackBox:"블랙박스",sdrrTinting:"측후면썬팅",frtTinting:"전면썬팅"};
		
		 $matchCfg['navigation']='naviNo';
         $matchCfg['blackBox']='bkbxNo';
         
         $matchCfg['sdrrTinting']='snrWndtngNo';
         $matchCfg['sdrrTintingRatio']='snrWndtngCcrtNo';
         $matchCfg['frtTinting']='cwsWndtngNo';
         $matchCfg['frtTintingRatio']='cwsWndtngCcrtNo';
         
       */
	}
	if(fincConfig[estmNow][0]['blackBox']!="01"){
		if(accessory){
			accessory += ", ";
			estmRslt.configAccessory += ", ";
		}
		accessory += "블랙박스";
		estmRslt.configAccessory += "블랙박스 "+dataBank['goodsConfig'][local]['blackBox'][fincConfig[estmNow][0]['blackBox']];
	}
	if(fincConfig[estmNow][0]['sdrrTinting']!="01"){
		if(accessory){
			accessory += ", ";
			estmRslt.configAccessory += ", ";
		}
		accessory += "측후면썬팅";
		estmRslt.configAccessory += "측후면썬팅 "+dataBank['goodsConfig'][local]['sdrrTinting'][fincConfig[estmNow][0]['sdrrTinting']];
		if(fincConfig[estmNow][0]['sdrrTintingRatio']) estmRslt.configAccessory += "("+dataBank['goodsConfig'][local]['sdrrTintingRatio'][fincConfig[estmNow][0]['sdrrTintingRatio']]+")";
	}
	if(fincConfig[estmNow][0]['frtTinting']!="01"){
		if(accessory){
			accessory += ", ";
			estmRslt.configAccessory += ", ";
		}
		accessory += "전면썬팅";
		estmRslt.configAccessory += "전면썬팅 "+dataBank['goodsConfig'][local]['frtTinting'][fincConfig[estmNow][0]['frtTinting']];
		if(fincConfig[estmNow][0]['frtTintingRatio']) estmRslt.configAccessory += "("+dataBank['goodsConfig'][local]['frtTintingRatio'][fincConfig[estmNow][0]['frtTintingRatio']]+")";
	}
	if(typeof(fincConfig[estmNow][0]['etcAccessorie'])!="undefined" && typeof(fincConfig[estmNow][0]['etcAccessorieCost'])!="undefined" && fincConfig[estmNow][0]['etcAccessorie']!="" && fincConfig[estmNow][0]['etcAccessorieCost']!="0"){
		if(accessory){
			accessory += ", ";
			estmRslt.configAccessory += ", ";
		}
		accessory += "추가";
		estmRslt.configAccessory += fincConfig[estmNow][0]['etcAccessorie']+"("+number_format(fincConfig[estmNow][0]['etcAccessorieCost'])+")";
	}
	if(fincConfig[estmNow][0]['deliveryType']=="02"){
		accessory = "제조사탁송시 선택 불가";
		var deliverySido = "제조사탁송시 선택 불가";
		$obj.find(".selsub[kind='accessorySel']").attr("code","not");
		$obj.find(".selsub[kind='deliverySidoSel']").attr("code","not");
	}else{
		if(typeof(dataBank['goodsConfig'][local]['deliverySido'])!="undefined") var deliverySido = dataBank['goodsConfig'][local]['deliverySido'][fincConfig[estmNow][0]['deliverySido']];
		$obj.find(".selsub[kind='accessorySel']").attr("code","");
		$obj.find(".selsub[kind='deliverySidoSel']").attr("code","");
	}
	if(estmRslt.brand>200 && estmMode=="rent" ){
		$obj.find(".selsub[kind='deliveryTypeSel']").attr("code","not");
	}else{
		$obj.find(".selsub[kind='deliveryTypeSel']").attr("code","");
	}
	if(accessory == ""){
		accessory = "선택없음";
	}
	$obj.find(".estmRslt_configAccessory").html(accessory);
	var modify = "선택없음";
	if(typeof(fincConfig[estmNow][0]['modify'])!="undefined" && typeof(fincConfig[estmNow][0]['modifyCost'])!="undefined" && fincConfig[estmNow][0]['modify']!="" && fincConfig[estmNow][0]['modifyCost']!="0"){
		modify = fincConfig[estmNow][0]['modify'];
		estmRslt.configModify = fincConfig[estmNow][0]['modify']+"("+number_format(fincConfig[estmNow][0]['modifyCost'])+")";
	}
	$obj.find(".estmRslt_configModify").html(modify);
	if(defaultCfg['feeView']=="Y"){
		if(estmMode=="fince") var feeCost = "대출원금 기준, CM : "+fincConfig[estmNow][0]['feeCmR']+"%, AG : "+fincConfig[estmNow][0]['feeAgR']+"%";
		else var feeCost = "CM : ("+fincConfig[estmNow][0]['feeCmR']+"%) "+number_format(estmRslt.feeCm)+", AG : ("+fincConfig[estmNow][0]['feeAgR']+"%) "+number_format(estmRslt.feeAg);
		$obj.find(".estmRslt_configFeeCost").html(feeCost);
		$obj.find(".estmRslt_configFeeText").text("수수료");
	}else{
		$obj.find(".estmRslt_configFeeCost").html("&nbsp;");
		$obj.find(".estmRslt_configFeeText").text("기타");
	}
	// 출고장/제휴사
	if(local == "imported"){
		$obj.find(".deliveryS").addClass("off");
		$obj.find(".delaerS").removeClass("off");
	}else{
		$obj.find(".deliveryS").removeClass("off");
		$obj.find(".delaerS").addClass("off");
		if(local == "domestic" && fincConfig[estmNow][0]['goodsKind']=="lease" && fincConfig[estmNow][0]['regType']=="1") $obj.find("input[name='payType'][value='01']").parent().css("display","");
		else $obj.find("input[name='payType'][value='01']").parent().css("display","none");
	}
	// 이용자 명의 영업차량 등록
	 if(estmMode=="fince"){
		
	}else 	if(fincConfig[estmNow][0]['regType']=="1"){
		fincConfig[estmNow][0]['useBiz'] = "N";
		$obj.find(".useBiz").addClass("off");
		$obj.find("input[name='useBiz']").prop("checked",false);
		$obj.find("input[name='cartaxAdd']").parent().removeClass("off");
		$obj.find("input[name='payType']").parent().removeClass("off");
	}else{
		$obj.find(".useBiz").removeClass("off");
		$obj.find("input[name='cartaxAdd'][value='Y']").parent().addClass("off");
		$obj.find("input[name='cartaxAdd'][value='Y']").prop("checked",false);
		$obj.find("input[name='cartaxAdd'][value='N']").prop("checked",true);
		$obj.find("input[name='payType'][value='01']").parent().addClass("off");
		$obj.find("input[name='payType'][value='01']").prop("checked",false);
		$obj.find("input[name='payType'][value='02']").prop("checked",true);
	}
	// 금융리스 본인부담금 표시
	if(estmMode=="lease" || estmMode=="fince"){
		if(fincConfig[estmNow][0]['goodsKind']=="loan"){
			$obj.find(".takeSelf").removeClass("off");
		}else{
			$obj.find(".takeSelf").addClass("off");
		}
		if(estmRslt.brand>200){
			$obj.find(".deliveryMk").addClass("off");
			$obj.find(".deliveryMf").removeClass("off");
		}else{
			$obj.find(".deliveryMk").removeClass("off");
			$obj.find(".deliveryMf").addClass("off");
		}
	}
	// 1. 본인부담금 - 금융리스에서만 보이도록
	//	2. 선수금 - 운용리스에서만 보이도록
	//console.log(fincConfig[estmNow][0]['deliveryType']);
	if(estmMode!="fince") $obj.find(".estmRslt_deliveryType").html(dataBank['goodsConfig'][local]['deliveryType'][fincConfig[estmNow][0]['deliveryType']]);
	// if(typeof(fincConfig[estmNow][0]['deliveryShip'])!="undefined" && fincConfig[estmNow][0]['deliveryShip'])  $obj.find(".estmRslt_deliveryShip").html(dataBank['remainLineup'+estmRslt.lineup]['deliveryShip'][fincConfig[estmNow][0]['deliveryShip']]);	// 라인업별
	if(typeof(fincConfig[estmNow][0]['deliveryShip'])!="undefined" && fincConfig[estmNow][0]['deliveryShip']) $obj.find(".estmRslt_deliveryShip").html(dataBank['goodsConfig'][local]['deliveryShip'][fincConfig[estmNow][0]['deliveryShip']]);	// 국산/수입별
	else $obj.find(".estmRslt_deliveryShip").html("선택 없음");
	
	if(estmMode=="rent"){
		estmRslt.configDelivery = dataBank['goodsConfig'][local]['deliveryType'][fincConfig[estmNow][0]['deliveryType']];
		if(typeof(fincConfig[estmNow][0]['deliveryShip'])!="undefined" && fincConfig[estmNow][0]['deliveryShip']) estmRslt.configDelivery += ", "+dataBank['goodsConfig'][local]['deliveryShip'][fincConfig[estmNow][0]['deliveryShip']]+" 출고장";
		estmRslt.configDelivery += ", "+dataBank['goodsConfig'][local]['deliverySido'][fincConfig[estmNow][0]['deliverySido']]+" 도착";
	}
	if(fincConfig[estmNow][0]['dealerShop']=="") estmRslt.dealerShop="<span class='blank'>선택해주세요.</span>";
	else if(fincConfig[estmNow][0]['dealerShop']=="0")  estmRslt.dealerShop = "제휴사 없음";
	else if(fincConfig[estmNow][0]['dealerShop']=="etc")  estmRslt.dealerShop = "선택하지 않음";
	else estmRslt.dealerShop = dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand][fincConfig[estmNow][0]['dealerShop']];
	if(estmRslt.dealerShop.indexOf(";")>0){
		var tmpShop = estmRslt.dealerShop.split(";");
		if(tmpShop[1]=="Y" || tmpShop[1]=="N")  estmRslt.dealerShop = tmpShop[0];
	}
	$obj.find(".estmRslt_dealerShop").html(estmRslt.dealerShop);
	$obj.find(".estmRslt_deliverySido").html(deliverySido);
	$obj.find(".estmRslt_branchShop").text(fincConfig[estmNow][0]['branchName']);
	
	if(estmMode=="lease" && estmRslt.capital==0){
		$obj.find(".fincView").css("display","none");
		$obj.find(".guide").css("display","block");
		$obj.find(".guide .blank").text("취득원가를 먼저 계산해 주세요.");
		$(".wrapper").removeClass("use");
		$("#estmBox").removeClass("open");
	}else if(estmMode=="fince" ||  typeof(dataBank["remainLineup"+estmRslt.lineup]) != 'undefined'){
		$(".wrapper").addClass("use");
		// 금융 정보
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			var goods = fincConfig[estmNow][fNo]['goods'];
			var star = fincConfig[estmNow][fNo]['star'];
			var eVal = fincData[estmNow][fNo];
			$(this).find(".fincView").css("display","none");
			$(this).find(".guide").css("display","none");
			if(eVal.goods=="rent"){
				$(this).find(".fincView[view*='R']").css("display","block");
			}else if(eVal.goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				$(this).find(".fincView[view*='K']").css("display","block");
				if(typeof(fincConfig[estmNow][fincNow[estmNow]]['respite'])!="undefined" && fincConfig[estmNow][fincNow[estmNow]]['respite']!="0") $(this).find(".fincView[view*='S']").css("display","block");
			}else if(eVal.goods=="lease"){
				$(this).find(".fincView[view*='L']").css("display","block");
			}else if(eVal.goods=="fince"){
				$(this).find(".fincView[view*='F']").css("display","block");
				if(star=="O"){
					if(estmRslt.feeAg){
						estmRslt.feeAg += " / ";
						estmRslt.feeCm += " / ";
						estmRslt.feeSum += " / ";
					}
					estmRslt.feeAg += number_format(eVal.feeAg);
					estmRslt.feeCm += number_format(eVal.feeCm);
					estmRslt.feeSum += number_format(eVal.feeAg+eVal.feeCm);
				}
			}
			$(this).find(".estmRslt_fincName").text(eVal.name);
			$(this).find(".estmRslt_fincEnd").text(eVal.end);
			$(this).find(".estmRslt_fincMonth").text(configMatchName(fNo,'month',eVal.month));	//  dataBank['goodsConfig'][local]['month'][eVal.month]);  estmRslt_fincMonth
			if(typeof(start.fastship)=="undefined" && typeof(fincConfig[estmNow][fNo]['kmPromotion'])!="undefined" && fincConfig[estmNow][fNo]['kmPromotion']!="1"){
				$(this).find(".estmRslt_fincKm").text(configMatchName(fNo,'km',eVal.km)+"/년 (주행거리 프로모션)");
				fincConfig[estmNow][fNo]['kmPromotionName'] = dataBank['goodsConfig'][local]['kmPromotion'][fincConfig[estmNow][fNo]['kmPromotion']];
			}else if(estmMode!="fince") {
				$(this).find(".estmRslt_fincKm").text(configMatchName(fNo,'km',eVal.km)+"/년");
				fincConfig[estmNow][fNo]['kmPromotionName'] = "";
			}
			if(eVal.goods=="fince"){
				$(this).find(".selsub[kind='capitalSel']").attr("code",estmRslt.capitalBase+":"+estmRslt.capitalMin+":"+estmRslt.capitalMax);
			}else{
				$(this).find(".selsub[kind='prepaySel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='prepaySel']").attr("ratoDis",eVal.depositR+eVal.respiteR);
				$(this).find(".selsub[kind='depositSel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='depositSel']").attr("ratoDis",eVal.prepayR+eVal.respiteR);
				$(this).find(".selsub[kind='respiteSel']").attr("code",estmRslt.priceSum);
				$(this).find(".selsub[kind='respiteSel']").attr("ratoDis",eVal.prepayR+eVal.depositR);
			}
			
			$(this).find(".selsub[kind='monthHSel']").attr("code",eVal.month);
			if(eVal.goods=="fince"){
				$(this).find(".estmRslt_finceCapital").html(number_format(eVal.capital));
				$(this).find(".estmRslt_fincPrepay").html(eVal.prepayR+"% <span class='price'>"+number_format(eVal.prepay)+"</span>");
				// $(this).find(".estmRslt_prepayRate").html(eVal.prepayR+"%");
				// $(this).find(".estmRslt_prepay").html(number_format(eVal.prepay));
				$(this).find(".estmRslt_rateCover").val(number_format(eVal.rateCover));
				if(eVal.stamp){
					$(this).find(".stempCheck").removeClass("off");
				}else{
					$(this).find(".stempCheck").addClass("off");
				}
				$(this).find(".estmRslt_finceStamp").text(number_format(eVal.stamp/2));
			}else{
				$(this).find(".estmRslt_fincPrepay").html(eVal.prepayR+"% <span class='price'>"+number_format(eVal.prepay)+"</span>");
				if(eVal.depositType=="stock" && eVal.depositS){
					$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% [이행보증보험증권] <span class='price'> "+number_format(eVal.depositS)+"</span>");
				}else{
					$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% <span class='price'>"+number_format(eVal.deposit)+"</span>");
				}
				$(this).find(".selsub[kind='remainSel']").attr("code",eVal.remainMax);
				$(this).find(".selsub[kind='remainSel']").attr("cutMax",eVal.remainMaxCut);
				$(this).find(".selsub[kind='remainSel']").attr("cutMin",eVal.remainMinCut);
				
				if(fincConfig[estmNow][fNo]['remainType']=="Y") $(this).find(".estmRslt_fincRemain").html("할부형 <span class='price'>"+number_format(eVal.remain)+"</span>");
				else if(fincConfig[estmNow][fNo]['remain']=="100") $(this).find(".estmRslt_fincRemain").html("최대("+eVal.remainR+"%) <span class='price'>"+number_format(eVal.remain)+"</span>");
				else $(this).find(".estmRslt_fincRemain").html(eVal.remainR+"% <span class='price'>"+number_format(eVal.remain)+"</span>");
				$(this).find(".estmRslt_fincCare").text(eVal.care);
			}
			
			
			if(goods=="lease"){	// 할인지원금, 추가수수료
				if(estmChangeKind=="adCmfe"){
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					$(this).find("button.getResult").attr("adCmfe","");
					if($(this).find("input[name^='adCmfe']:checked").length) fincConfig[estmNow][fNo]['adCmfe'] = $(this).find("input[name^='adCmfe']:checked").val();
				}else{
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					$(this).find("button.getResult").attr("adCmfe","");
					fincConfig[estmNow][fNo]['adCmfe'] = "";
					if(typeof(dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'])=="undefined" || dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'][eVal.month]!="Y" ){
						$(this).find(".fincView[kind='adCmfe'] .desc").removeClass("off");
						$(this).find(".fincView[kind='adCmfe'] .radio").addClass("off");
					}else{
						$(this).find(".fincView[kind='adCmfe'] .desc").addClass("off");
						$(this).find(".fincView[kind='adCmfe'] .radio").removeClass("off");
						if(typeof(dataBank["remainLineup"+estmRslt.lineup]['adCmfe'])!="undefined" && (dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="01" || dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="02")){
							fincConfig[estmNow][fNo]['adCmfe'] = dataBank["remainLineup"+estmRslt.lineup]['adCmfe'];
							// 값 다르면 아래 적용
							//if(dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="01") fincConfig[estmNow][fNo]['adCmfe'] = "02";
							//else if(dataBank["remainLineup"+estmRslt.lineup]['adCmfe']=="02") fincConfig[estmNow][fNo]['adCmfe'] = "01";
							$(this).find("input[name^='adCmfe']").parent().css("display","none");
							$(this).find("input[name^='adCmfe'][value='"+fincConfig[estmNow][fNo]['adCmfe']+"']").parent().css("display","");
							$(this).find("input[name^='adCmfe'][value='"+fincConfig[estmNow][fNo]['adCmfe']+"']").prop("checked",true);
						}else{
							if($(this).find("input[name^='adCmfe']:checked").length) fincConfig[estmNow][fNo]['adCmfe'] = $(this).find("input[name^='adCmfe']:checked").val();
							else $(this).find("button.getResult").attr("adCmfe","X");
						}
					}
				}
				
				
				fincConfig[estmNow][fNo]['dcSppt'] = "";
				$(this).find("button.getResult").attr("dcSppt","");
				if(typeof(dataBank["remainLineup"+estmRslt.lineup]['dcSppt'])=="undefined" || dataBank["remainLineup"+estmRslt.lineup]['dcSppt']!="Y" ){
					$(this).find(".fincView[kind='dcSppt'] .desc").removeClass("off");
					$(this).find(".fincView[kind='dcSppt'] .radio").addClass("off");
				}else{
					$(this).find(".fincView[kind='dcSppt'] .desc").addClass("off");
					$(this).find(".fincView[kind='dcSppt'] .radio").removeClass("off");
					if($(this).find("input[name^='dcSppt']:checked").length) fincConfig[estmNow][fNo]['dcSppt'] = $(this).find("input[name^='dcSppt']:checked").val();
					else $(this).find("button.getResult").attr("dcSppt","X");
				}
			}
			if(goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선수금");
				$(this).find(".estmRslt_fincRespite").html(eVal.respiteR+"% <span class='price'>"+number_format(eVal.respite)+"</span>");
				if(eVal.monthH) $(this).find(".estmRslt_fincMonthH").text(eVal.monthH+"개월");
				else $(this).find(".estmRslt_fincMonthH").text("없음");
				if(eVal.capital<=estmRslt.vehicleSale){
					$(this).find(".estmRslt_loanCapital").text(number_format(eVal.capital));
					$(this).find("button.getResult").attr("loan",eVal.capital);
				}else{
					$(this).find(".estmRslt_loanCapital").text("(차량가 상회) "+number_format(eVal.capital));
					$(this).find("button.getResult").attr("loan","0");
				}
			}else if(goods=="lease"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선납금");
				if(estmRslt.vehicleSale>=eVal.deposit+eVal.prepay+eVal.remain){
					$(this).find("button.getResult").attr("loan",estmRslt.vehicleSale-eVal.deposit+eVal.prepay+eVal.remain);
				}else{
					$(this).find("button.getResult").attr("loan","0");
				}
			}else if(goods=="fince"){
				$(this).find(".estmRslt_fincPrepayTitle").text("선수금");
			}else{
				$(this).find(".estmRslt_fincPrepayTitle").text("선납금");
			}
			
			var payTxt = "";
			var paySum = eVal.prepay;
			if(eVal.prepay && goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")  payTxt += "선수금";
			else if(eVal.prepay)  payTxt += "선납금";
			if(eVal.deposit && eVal.depositType=="cash"){
				if(payTxt) payTxt += "+";
				payTxt += "보증금";
				paySum += eVal.deposit;
			}
			/*
			if(goods=="lease" && estmRslt.payCost){
				if(payTxt) payTxt += "+";
				payTxt += "고객별도";
				paySum += estmRslt.payCost;
			}
			*/
			
			$(this).find(".estmRslt_fincPaySum").html(payTxt+" <span class='price'>"+number_format(paySum)+"</span>");
			if(estmChangeKind=='branchShop'){
				// 계산 결과와 관계 없음
			}else if((estmChangeKind!='endType' &&  estmChangeKind!='capital'  &&  estmChangeKind!='stampYn' && estmChangeKind!='rateCover' && estmChangeKind!='month' && estmChangeKind!='monthH' && estmChangeKind!='km' && estmChangeKind!='prepay' && estmChangeKind!='deposit' && estmChangeKind!='respite' && estmChangeKind!='remain' && estmChangeKind!='careType' && estmChangeKind!='adCmfe' && estmChangeKind!='dcSppt') || fNo==fincNow[estmNow]){
				// 계산 결과 버튼 표시
				$(this).find("button.getResult").removeClass("off");
				$(this).find("button.getResult").text("계산하기");
				$(this).find(".estmRslt_loanRate").text("");
				$(this).find(".estmRslt_finceRate").text("");
				$(this).find(".estmRslt_pmtPay").addClass("off");
				$(this).find(".estmRslt_pmtPayMax").addClass("off");
				eVal.viewPmt = "none";
				fincConfig[estmNow][fNo]['feeAgAdd'] = "";
				fincConfig[estmNow][fNo]['feeAgAddR'] = "";
				// 견적서 결과 표시
			}
			if(estmMode=="rent" && fincConfig[estmNow][fNo]['remainType']=="Y") $(this).find("button.getResult").attr("remain","Y");
			else $(this).find("button.getResult").attr("remain",eVal.remainMax);
		});
		
		if(deviceType=="app"){
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
	}
	
	
	estmChangeKind = "";
	//console.log(estmConfig[estmNow]);
	//console.log(estmRslt);
	//console.log(fincConfig[estmNow]);
	// 가격표/카탈로그/제원
	var info = "";
	var Dpath = 'modelData'+estmRslt.model;
	var url = "url1";
	if(estmRslt.spec1853 || estmRslt.spec1854 || estmRslt.spec1855){
		info += "<button class='round specViewEstm' model='"+estmRslt.model+"' spec='"+estmRslt.spec1853+","+estmRslt.spec1854+","+estmRslt.spec1855+"'>제원</button>";
	}
	if(estmRslt.priceF){
		if(deviceType=="app") info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.priceF][url]+"?webview=layer'>가격표</a>";
		else info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.priceF][url]+"' target='_blank'>가격표</a>";
		$(".btnOpenInfo").removeClass("off");
		if($(".btnOpenInfo").length) $(".btnOpenInfo").parent().addClass("half");
	}else{
		$(".btnOpenInfo").addClass("off");
		$(".btnOpenInfo").parent().removeClass("half");
	}
	if(estmRslt.catalogF){
		if(deviceType=="app") info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.catalogF][url]+"?webview=layer'>카탈로그</a>";
		else info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.catalogF][url]+"' target='_blank'>카탈로그</a>";
	}
	$obj.find(".estmRslt_info").html(info);
	
	if(deviceType=="app" && estmRslt.priceF && estmRslt.priceF != estmViewLeft){
		window.location.href = dataBank[Dpath]['files'][estmRslt.priceF][url]+"?webview=left";
		estmViewLeft = estmRslt.priceF;
	}
}

//리스렌트 보기
function viewLoanDocu(){
	if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
		estmConfig[estmNow]['saveNo'] = "";
		estmConfig[estmNow]['viewKey'] = "";
		if(deviceType=="app"){
			sendDataToRight("saveNo","0");
		}else{
			//$("#estmDocu .urlBox").addClass("off");
			//$("#estmDocu .urlBox input[name='shortcut']").val("");
			//if(deviceType=="app") $("#estmDocu .urlBox .urlOpen").attr("href","");
			//else $("#estmDocu .urlBox .urlOpen").attr("href","");
			//$("#estmDocu .btnEstmAct[job='url']").removeClass("off");
			$("#estmDocu .btnEstmAct[job='save']").text("새로 저장");
			$("#estmDocu .btnEstmAgree").text("신용조회신청");
			$("#estmDocu .btnEstmAct").addClass("cyan");
			$("#estmDocu .btnEstmAct").removeClass("gray");
			$("#estmDocu .btnEstmAct2").removeClass("cyan");
			$("#estmDocu .btnEstmAct2").addClass("gray");
			$("#estmDocu .btnEstmConfirm").removeClass("cyan");
			$("#estmDocu .btnEstmConfirm").addClass("gray");
			$("#estmDocu .btnEstmConfirm").removeClass("off");
			$("#estmDocu .btnEstmAgree").removeClass("cyan");
			$("#estmDocu .btnEstmAgree").addClass("gray");
			$("#estmDocu .btnEstmAgree").addClass("off");
			
		}
    	alertPopup("견적이 변경되었습니다. <br>새로 저장하여 주시기 바랍니다.");
    	$("button.btnEstmAct[job='finc']").text("심사신청");
	}
	var eColor = ["담청","178eb2","d5e0e3","effbff","d2eaf1","ed1753"];
	
	var str ="";
	
	// 공통선택 표시
	if(gnbPath=="usedcar"){
		var mName = estmRslt['ucarNameB'] +" "+estmRslt['ucarName'];
		if(estmRslt['certifyYN']=="Y") var mName2 = "<br>[인증 중고차] "+estmRslt['dealerShop'];
		else var mName2 = "";
	}else{
		if(estmRslt.brand<200) var local = "domestic";
		else var local = "imported";
		var mImage = imgPath+estmRslt['image'];
		// 선택 항목
		var mName = estmRslt['brandName']+' '+estmRslt['modelName']+' '+estmRslt['lineupName']+' '+estmRslt['trimName'];
		// 외장색상
		var mColor = "";
		if(estmRslt['colorExt']){
		    mColor += '외장 : '+estmRslt['colorExtName'];
		    if(estmRslt['colorExtPrice'])  mColor += "("+number_format(estmRslt['colorExtPrice'])+")";
		}
		// 내장색상
		if(estmRslt['colorInt']){
		    if(mColor) mColor+='<br>';
		    mColor += '내장 : '+estmRslt['colorIntName'];
		    if(estmRslt['colorIntPrice'])  mColor += '('+number_format(estmRslt['colorIntPrice'])+')';
		}
		if(mColor=="") mColor = '선택 없음';
		// 옵션
		var mOption = "";
		if(estmRslt['optionList']){
		    var tmp = estmRslt['optionList'].split("\n");
		    for(var o in tmp){
		    	dat = tmp[o].split("\t");
		    	if(dat[0].indexOf("[가니쉬]")==0 && estmRslt['colorInt']){
		    		mColor += "<br>가니쉬 : "+dat[0].substr(6);
		    	}else{
		    		if(mOption) mOption+='<br>';
		    		mOption += dat[0];
		    		if(dat[1]!="0") mOption += ' ('+number_format(dat[1])+')';
		    	}
		    }
		}
		if(mOption=="") mOption ='선택 없음';
	}
	
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		var eTitle = "금융리스 견적서";
		var eKind = "LK";
	}else if(estmMode=="lease"){
		var eTitle = "운용리스 견적서";
		var eKind = "LG";
	}else if(estmMode=="fince"){
		var eTitle = "할부금융 견적서";
		var eKind = "FG";
	}else{
		var eTitle = "장기렌트 견적서";
		if(estmRslt.vin) var eKind = "RF";
		else var eKind = "RG";
	}
	// 타이틀, 선택사항 등
	str += '\n<table cellspacing="0" cellpadding="1" border="0" width="100%" class="eHead" kind="'+eKind+'">'+docuSalesInfo(eTitle)+'</table>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		
	
	var tdT = '27%';
	var tdD = '73%';
	
	// 선택 요약
	if(gnbPath=="usedcar"){
		str += '\n<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody>';
		str += '\n<tr><td style="width: 11%; padding: 0; text-align: left; font-size: 13px; ">■ 모델</td><td style="width: 89%; padding: 0; text-align: left; font-size: 13px; " ><b class="eModel openDressup">'+mName+'</b>'+mName2+'</td></tr>';
		str += '\n</tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	}else{
		var choice = '';
		choice += '\n<table cellspacing="0" cellpadding="2" border="0" width="100%"><tbody>';
		choice += '\n<tr><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">모델</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; " ><b class="eModel openDressup">'+mName+'</b> ('+number_format(estmRslt['trimPrice'])+')</td></tr>';
		choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">색상</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mColor+'</td></tr>';
		choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">옵션</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mOption+'</td></tr>';
		//choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">탁송</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mDelivery+'</td></tr>';
		//if(estmRslt.vehicleFree) choice += '\n<tr><td colspan="2" style="width: 100%; padding: 3px; text-align: right;  font-size: 13px; line-height: 180%; color: #ed1753;  ">(세제혜택 전) <b>'+number_format(estmRslt.vehicleSum)+' 원</b><br> (세제혜택 후) <b> '+number_format(estmRslt.vehicleSum+estmRslt.vehicleFree)+' 원</b></td></tr>';
		//else 
		if(estmMode=="rent") choice += '\n<tr><td colspan="2" style="width: 100%; padding: 3px; text-align: right;  font-size: 13px; line-height: 180%; color: #ed1753;  "><b>'+number_format(estmRslt.priceSum)+' 원</b></td></tr>';
		choice += '\n</tbody></table>';
		
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody>\n<tr>';
		//if(eShow.indexOf("M")>=0){
			str +='\n<td style="text-align: left; width: 40%;" ><img class="ePhoto" style="width: 280px; height: 140px;" src="'+mImage.replace(".png",".jpg")+'"><div style="font-size: 11px; color: #999;">※ 위 참고 이미지는 실제 판매모델과 다를 수 있습니다.</div></td>'
				+'\n<td style="text-align: left; width: 60%;">'+choice+'</td>';
		//}else{
		//	str +='\n<td style="text-align: left; width: 100%;">'+choice+'</td>';
		//}
		str +='\n</tr></tbody></table>';
	}
	var tdTBt1 = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; ';
	var tdTBt = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; background-color:#'+eColor[3]+'; ';
	var tdTBtb = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; ';
	
	var tdDBt = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; ';
	var tdDBt1 = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; ';
	var tdDBt2 = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; border-top: 1px solid #'+eColor[1]+'; ';
	var tdDB = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; ';
	var tdDBb = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; ';
	
	if(estmMode=="lease" || estmMode=="fince"){
		priceStr = '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; background-color:#'+eColor[3]+';  text-align: center; font-size: 13px; padding: 4px; ">기본가격</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.trimPrice)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		priceStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">옵션가격</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.extraSum)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		priceStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">할인가격</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.discountMaker+estmRslt.discountSpecial+estmRslt.vehicleTax+estmRslt.vehicleHev)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		if(estmRslt.brand<200){
			priceStr += '<tr>'
				+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">탁송료</td>'
				+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.deliveryMaker)+' 원</td></tr></tbody></table></td>'
				+'</tr>';
		}
		priceStr += '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 5px; background-color:#'+eColor[4]+'; ">①최종 차량가</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 13px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.vehicleSale)+' 원</b></td>'
			+'</tr>';
		if(estmMode=="fince") var regTaxInTxt = "";
		else if(fincConfig[estmNow][0]['regTaxIn']=="01") regTaxInTxt = "포함";
		else var regTaxInTxt = "고객별도";
		if(estmMode=="fince") var regBondInTxt = "";
		else if(fincConfig[estmNow][0]['regBondIn']=="01") var regBondInTxt = "포함";
		else var regBondInTxt = "고객별도";
		if(estmMode=="fince") var regExtrInTxt = "";
		else if(fincConfig[estmNow][0]['regExtrIn']=="01") var regExtrInTxt = "포함";
		else var regExtrInTxt = "고객별도";
		if(estmMode=="fince") var deliveryInTxt = "";
		else if(fincConfig[estmNow][0]['deliveryIn']=="01") var deliveryInTxt = "포함";
		else var deliveryInTxt = "고객별도";
		if(typeof(fincConfig[estmNow][0]['testride'])!="undefined" && fincConfig[estmNow][0]['testride']){		// 시승차 예외처리, 고객별도 표시하지 않음
			var takeTax = 0;
			var bondCut = 0;
			var takeExtra = 0;
			var deliveryMaker = 0;
		}else{
			var takeTax = estmRslt.takeTax;
			var bondCut = estmRslt.bondCut;
			var takeExtra = estmRslt.takeExtra;
			var deliveryMaker = estmRslt.deliveryMaker;
		}
		var wonCap = "①+②";
		if(gnbPath=="usedcar"){
			var costWL = "50";
			var costWR = "50";
			costStr = '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; border-top: 2px solid #'+eColor[1]+'; background-color:#'+eColor[4]+';  text-align: center; font-size: 13px; padding: 4px; ">①차량가격</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; border-top: 2px solid #'+eColor[1]+'; font-size: 13px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.vehicleSale)+' 원</b></td>'
				+'</tr>';
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">취득세</td>'
				+'<td style="width:'+costWR+'%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regTaxInTxt+'</td><td width="70%" style="text-align: right; font-size: 13px;">'+number_format(takeTax)+' 원</td></tr></tbody></table></td>'
				+'</tr>';
		}else{
			var costWL = "35";
			var costWR = "65";
			costStr = '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; background-color:#'+eColor[3]+';  text-align: center; font-size: 13px; padding: 4px; ">취득세</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regTaxInTxt+'</td><td width="70%" style="text-align: right; font-size: 13px;">'+number_format(takeTax)+' 원</td></tr></tbody></table></td>'
				+'</tr>';
		}
		costStr += '<tr>'
			+'<td style="width:'+costWL+'%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">공채비용</td>'
			+'<td style="width:'+costWR+'%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regBondInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(bondCut)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		costStr += '<tr>'
			+'<td style="width:'+costWL+'%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">부대비용</td>'
			+'<td style="width:'+costWR+'%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regExtrInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(takeExtra)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		if(( gnbPath=="usedcar" || estmRslt.brand>200) && estmRslt.deliveryMaker){
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">탁송료</td>'
				+'<td style="width:'+costWR+'%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+deliveryInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(deliveryMaker)+' 원</td></tr></tbody></table></td>'
				+'</tr>';
		}
		if(estmMode=="fince"){
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">②등록/기타 합계</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;"><b>'+number_format(estmRslt.takeSum)+' 원</b></td></tr></tbody></table></td>'
				+'</tr>';
		}else{
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">②등록비용 합계</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;"><b>'+number_format(estmRslt.addCost)+' 원</b></td></tr></tbody></table></td>'
				+'</tr>';
		}
		if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">③선수금</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;"><b>'+number_format(estmRslt.takeSelf)+' 원</b></td></tr></tbody></table></td>'
				+'</tr>';
			wonCap += "-③";
		}
		if(estmMode=="fince"){
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 5px; background-color:#'+eColor[4]+'; ">총 소요비용('+wonCap+')</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 13px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.cashSum)+' 원</b></td>'
				+'</tr>';
		}else{
			costStr += '<tr>'
				+'<td style="width:'+costWL+'%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 5px; background-color:#'+eColor[4]+'; ">취득원가('+wonCap+')</td>'
				+'<td style="width:'+costWR+'%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 13px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.capital)+' 원</b></td>'
				+'</tr>';
		}
		
		/*
		costStr += '<tr>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">취득세</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.takeTax)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">공채할인</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.bondCut)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">기타비용</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.takeExtra)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; "><b>취득원가</b></td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; font-size: 13px; color: #'+eColor[5]+'; background-color:#'+eColor[3]+';"><b>'+number_format(estmRslt.capital)+'</b></td>';
		costStr += '</tr>';
		*/
		// str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		if(estmMode=="fince") str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="30px"><tbody><tr><td style="text-align: left; font-size: 13px;  ">■ 가격 사항</td></tr></tbody></table>';
		else str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="30px"><tbody><tr><td style="text-align: left; font-size: 13px;  ">■ 취득원가</td></tr></tbody></table>';
		if(gnbPath=="usedcar"){
			str +='<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>'+costStr+'</tbody></table>';
		}else{
			str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody>'
		    		+'\n<tr>'
						+'\n<td style="width: 49%; vertical-align: top;"><table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>'+priceStr+'</tbody></table></td>'
						+'\n<td style="width: 2%;"></td>'
						+'\n<td style="width: 49%; vertical-align: top;"><table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>'+costStr+'</tbody></table></td>'
					+'\n</tr>'
		    	+'\n</tbody></table>';
		}
	}

	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	
	var starLen = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .btnFincStar.on").length;
	if(starLen==0) fincLen = 3;
	else fincLen = starLen;
	
	var tdTW = '49%';
	var tdDW = 'width:51%; padding: 4px; text-align: center; ';	// vertical-align: top;
	var tdEW = 'width:51%;';
	if(fincLen==2){
		tdTW = '20%';
		tdDW = 'width:40%; padding: 4px; text-align: center; '; // vertical-align: top;
		tdEW = 'width:80%;';
	}else if(fincLen==3){
		tdTW = '16%';
		tdDW = 'width:28%; padding: 4px; text-align: center; '; // vertical-align: top;
		tdEW = 'width:84%;';
	}
	
	
	var txtM = '';	// 기간
	var txtH = '';	// 거치
	var txtFt = '';	// 할부상품
	var txtFr = '';	// 할부금리
	var txtFc = '';	// 할부원금
	var txtFx = '';	// 할부유예
	var txtE = '';	// 만기
	var txtC = '';	// 정비
	var txtD = '';	// 보증
	var txtP = '';	// 선납/선수
	var txtX = '';	// 유예
	var txtW = '';	// 리스이용금액
	var txtA = '';	// 상환금리
	var txtK = '';	// 약정
	var txtR = '';	// 잔가
	var txtPm = '';	// 선납 월 차감
	var txtS = '';	// 공급가
	var txtV = '';	// 부가세
	var txtG = '';	// 선납
	var txtPay = ''; // 초기 납입금
	var txtPay1 = ''; // 리스 등록/부대비
	var txtPay2 = ''; // 리스 선납/보증
	var txtZs = ""; // 인지세
	var txtZd = ''; // 보증금 할인
	var txtZp = ''; // 선수금 할인
	
	if(estmMode=="lease") var txtT = "리스";
	else if(estmMode=="fince") var txtT = "할부";
	else var txtT = "렌트";
	var cntRe = 0; // 유예
	
	// 금융 정보
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
		var fNo = parseInt($(this).attr("fincNo"));
		var goods = fincConfig[estmNow][fNo]['goods'];
		if($(this).find(".btnFincStar").hasClass("on")) fincConfig[estmNow][fNo]['star'] = "O";
		else fincConfig[estmNow][fNo]['star'] = "X";
		var star = fincConfig[estmNow][fNo]['star'];
		if(starLen==0 || star=="O"){
			var eVal = fincData[estmNow][fNo];
			var ttlPay = "";
			if(estmMode=="lease"){
				var sumPay = estmRslt.payCost+estmRslt.takeSelf;
				if(sumPay) ttlPay += "등록/부대비";
				if(estmRslt.takeSelf){
					if(ttlPay) ttlPay +="+";
					ttlPay += "선수금";
				}
			}else if(estmMode=="fince"){
				var sumPay = estmRslt.payCost;
				if(sumPay) ttlPay += "등록/부대비";
			}else{
				var sumPay = 0;
			}
			// 20220607 추가 W/유모현
			if(fincConfig[estmNow][0]['buyType']=="1" && ( (estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan") || estmMode=="fince") && typeof(eVal.rateMax)!="undefined"){		// 개인 , 금융리스/ 할부
				var maxViewCheck = true;
			}else{
				var maxViewCheck = false;
			}
			
			if(estmMode=="fince"){
				txtM += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" fNo="M'+fNo+'"><b>'+configMatchName(fNo,'month',eVal.month)+'</b></td>';
				txtFc += '\n<td style="'+tdDW+tdDBt+' text-align: center;  " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px; "><b>'+number_format(eVal.capital)+'</b></td></tr></tbody></table></td>';
				//txtFt += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" ><b>'+configMatchName(fNo,'finceType',eVal.finceType)+'</b></td>';
				txtFt += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" ><b>오토할부(론)</b></td>';
				if(typeof(eVal.rate)!="undefined"){
					if(maxViewCheck) var changeRateText = number_cut(eVal.rate*100,1,"round")/100+' ~ '+number_cut(eVal.rateMax*100,1,"round")/100;
					else var changeRateText = number_cut(eVal.rate*100,1,"round")/100;
					txtFr += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;"  class="changeRate">'+changeRateText+'%</td>';
				}else{
					txtFr += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >-</td>';
				}
				txtFx += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; "></td><td width="70%;" style="text-align: right; font-size: 13px; ">0</td></tr></tbody></table></td>';
				if(eVal.stamp && eVal.stampYn=="Y") sumPay += eVal.stamp / 2;
				if(eVal.stamp && eVal.stampYn=="Y") var txtZs2 = "포함";
				else if(eVal.stamp && eVal.stampYn=="N") var txtZs2 = "불포함";
				else var txtZs2 = "";
				if(eVal.stamp && eVal.stampYn=="Y"){
					if(ttlPay) ttlPay+="/";
					ttlPay += "인지세";
				}
				txtZs +=  '\n<td style="'+tdDW+tdDBt2+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+txtZs2+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.stamp/2)+'</td></tr></tbody></table></td>';
			}else{
				txtM += '\n<td style="'+tdDW+tdDBt+' font-size: 13px; text-align: center;" fNo="M'+fNo+'"><b>'+configMatchName(fNo,'month',eVal.month)+'</b></td>';
			}
			if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				if(eVal.monthH)  txtH += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.monthH+'개월 포함</td>';
				else txtH += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >없음</td>';
				if(eVal.respiteR=="0"){
					var respiteR = "";
				}else{
					var respiteR = eVal.respiteR + "%";
					cntRe ++;
				}
				if(typeof(eVal.rate)!="undefined"){
					if(maxViewCheck) var changeRateText = number_cut(eVal.rate*100,1,"round")/100+' ~ '+number_cut(eVal.rateMax*100,1,"round")/100;
					else var changeRateText = number_cut(eVal.rate*100,1,"round")/100;
					txtA += '\n<td class="changeRate" style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+changeRateText+'%</td>';
				} 
				txtX += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+respiteR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.respite)+'</td></tr></tbody></table></td>';
				txtW += '\n<td style="'+tdDW+tdDB+' text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px; "><b>'+number_format(eVal.capital)+'</b></td></tr></tbody></table></td>';
			}
			
			if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="lease"){
				if(typeof(eVal.viewPmt)!="undefined" && eVal.viewPmt=="show"){
					if(eVal.pmtGapPayR=="0") var pmtPayR = "";
					else var pmtPayR = number_cut(eVal.pmtGapPayR*100,1,'round')/100 + "%";
					var pmtPay = number_format(eVal.pmtGapPay);
					if(eVal.pmtGapDepR=="0") var pmtDepR = "";
					else var pmtDepR = number_cut(eVal.pmtGapDepR*100,1,'round')/100 + "%";
					var pmtDep = number_format(eVal.pmtGapDep);
				}else{
					var pmtPayR = "";
					var pmtPay = "-";
					var pmtDepR = "";
					var pmtDep = "-";
				}
				txtZp += '\n<td style="'+tdDW+tdDB+' text-align: center; border-top: 1px solid #'+eColor[1]+';  " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">'+pmtPayR+'</td><td width="60%;" style="text-align: right; font-size: 13px; ">'+pmtPay+'</td></tr></tbody></table></td>';
				txtZd += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">'+pmtDepR+'</td><td width="60%;" style="text-align: right; font-size: 13px; ">'+pmtDep+'</td></tr></tbody></table></td>';
			}
			if(estmMode!="fince"){
				txtE += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.end+'</td>';
				txtK += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+configMatchName(fNo,'km',eVal.km)+'/년</td>';
				txtC += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.care+'</td>';
			}
			if(eVal.prepayR=="0") var prepayR = "";
			else var prepayR = parseInt(eVal.prepayR*100)/100 + "%";
			txtP += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+prepayR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.prepay)+'</td></tr></tbody></table></td>';
			if(eVal.prepay){
				sumPay += eVal.prepay;
				if(ttlPay) ttlPay +="+";
				if((estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan") || estmMode=="fince") ttlPay += "선수금";
				else ttlPay += "선납금";
			}
			if(eVal.depositR=="0") var depositR = "";
			else var depositR = parseInt(eVal.depositR*100)/100 + "%";
			if(eVal.depositType=="stock" && eVal.depositS){
				depositR += "[이행보증보험증권]";
				txtD += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="60%" style="text-align: left; font-size: 12px; ">'+depositR+'</td><td width="40%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.depositS)+'</td></tr></tbody></table></td>';
			}else{
				txtD += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+depositR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.deposit)+'</td></tr></tbody></table></td>';
				if(eVal.deposit){
					sumPay += eVal.deposit;
					if(ttlPay) ttlPay +="+";
					ttlPay += "보증금";
				}
			}
			if(estmMode=="lease"){ 	// 리스 견적서 초기납입비용 분리 표시 2022-02-19
				ttlPay = "";	
				if(fincConfig[estmNow][0]['goodsKind']=="loan"){
					ttlPay1 = "선수금";
				}else{
					ttlPay1 = "선납금/보증금";
				}
				pay1 = estmRslt.payCost;
				pay2 = eVal.prepay+eVal.deposit+estmRslt.takeSelf;
				txtPay1 += '\n<td style="'+tdDW+tdDB+' text-align: center; border-top: 1px solid #'+eColor[1]+';  " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; "></td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(pay1)+'</td></tr></tbody></table></td>';
				txtPay2 += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; "></td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(pay2)+'</td></tr></tbody></table></td>';				
			}
			var remainR = parseInt(eVal.remainR*100)/100 + "%";
			txtR += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+remainR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.remain)+'</td></tr></tbody></table></td>';
			if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease"){
				txtPm += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">③선납금(월)</td><td width="60%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.pmtPay)+'</td></tr></tbody></table></td>';
				var numStr = "①+②-③";
			}else if(estmMode=="fince"){
				var numStr = "";
			}else{
				var numStr = "①+②";
			}
			if(estmMode=="rent"){
				var ttlS = "공급가";
				var ttlV = "부가세";
			}else{
				var ttlS = "리스료";
				var ttlV = "자동차세";
			}
			if(typeof(eVal.viewPmt)!="undefined" && eVal.viewPmt=="show"){
				if(estmMode=="rent"){
					var pmtS = number_format(eVal.pmtSupply);
					var pmtV = number_format(eVal.pmtVat);
					var pmtG = number_format(eVal.pmtGrand);
				}else{
					if(fincConfig[estmNow][0]['cartaxAdd']=="Y") var pmtV = number_format(eVal.carTax);
					else var pmtV = "고객별도";
					if(maxViewCheck){
						if(estmMode!="fince") var pmtS = number_format(eVal.pmtMon) +' ~ '+ number_format(eVal.pmtMonMax);
						var pmtG = number_format(eVal.pmtGrand) +' ~ '+ number_format(eVal.pmtGrandMax);
					}else{
						//	var pmtS = number_format(eVal.carSelf+eVal.carIns);
						if(estmMode!="fince") var pmtS = number_format(eVal.pmtMon);
						var pmtG = number_format(eVal.pmtGrand);
					}
				}
			}else{
				var pmtS = "-";
				var pmtV = "-";
				var pmtG = "계산 대기중";
			}
			if(estmMode!="fince") txtS += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">①'+ttlS+'</td><td width="70%;" fno="S'+fNo+'" style="text-align: right; font-size: 13px; " class="changePmtBase">'+pmtS+'</td></tr></tbody></table></td>';
			txtV += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">②'+ttlV+'</td><td width="70%;" fno="V'+fNo+'" style="text-align: right; font-size: 13px; ">'+pmtV+'</td></tr></tbody></table></td>';
			txtG += '\n<td style="'+tdDW+tdDBb+' text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+numStr+'</td><td width="70%;" fno="G'+fNo+'" style="text-align: right; text-align: right; font-size: 13px; color: #'+eColor[5]+'; " class="changePmtGrand"><b>'+pmtG+'</b></td></tr></tbody></table></td>';
			
			if(estmMode=="lease")  txtPay += '\n<td style="'+tdDW+tdDBb+' text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="55%" style="text-align: left; font-size: 12px; ">'+ttlPay+'</td><td width="45%;" style="text-align: right; font-size: 13px; "><b>'+number_format(sumPay)+'</b></td></tr></tbody></table></td>';
			else if(estmMode=="rent")  txtPay += '\n<td style="'+tdDW+tdDBt1+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="55%" style="text-align: left; font-size: 12px; ">'+ttlPay+'</td><td width="45%;" style="text-align: right; font-size: 13px; "><b>'+number_format(sumPay)+'</b></td></tr></tbody></table></td>';
			else txtPay += '\n<td style="'+tdDW+tdDBt2+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="55%" style="text-align: left; font-size: 12px; ">'+ttlPay+'</td><td width="45%;" style="text-align: right; font-size: 13px; "><b>'+number_format(sumPay)+'</b></td></tr></tbody></table></td>';
			//else txtPay += '\n<td style="'+tdDW+tdDBt2+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px; "><b>'+number_format(sumPay)+'</b></td></tr></tbody></table></td>';
		}
	});
	if(estmMode=="rent") var godTxt = "렌트료";
	else var godTxt = "리스료";
	
	str += '<table id="changeBox" cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
	
	// if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")  str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">거치 기간</td>'+txtH+'</tr>';
	if(estmMode=="fince"){
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">대출 원금</td>'+txtFc+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선수금</td>'+txtP+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">이용 기간</td>'+txtM+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">상환 금리</td>'+txtFr+'</tr>';
		//str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">할부 상품</td>'+txtFt+'</tr>';  // 
		// str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">유예금</td>'+txtFx+'</tr>';
	}else{
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">'+txtT+' 기간</td>'+txtM+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">만기처리</td>'+txtE+'</tr>';
	}
	if(estmMode=="rent") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">정비상품</td>'+txtC+'</tr>';
	
	if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선납금</td>'+txtP+'</tr>';
	if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease" || cntRe) str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">보증금</td>'+txtD+'</tr>';
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		if(txtA)  str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">상환금리</td>'+txtA+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">대출원금</td>'+txtW+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">유예금</td>'+txtX+'</tr>';
	}
	if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">약정거리</td>'+txtK+'</tr>';
	if(estmMode=="rent") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">만기 인수가격</td>'+txtR+'</tr>';
	else if(fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">잔존가치</td>'+txtR+'</tr>';
	if(estmMode!="fince"){
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; " rowspan="2"><b>매회 '+godTxt+'</b></td>'+txtS+'</tr>';
		str += '<tr>'+txtV+'</tr>';
	}
	if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>선납 '+godTxt+'</b></td>'+txtPm+'</tr>';
	if(estmMode=="fince") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>월 납입금</b></td>'+txtG+'</tr>';
	else str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>납입 '+godTxt+'</b></td>'+txtG+'</tr>';
	str +='\n</tbody></table>';
	
	if(eKind=="LK" || eKind=="FG"){	// 금융리스, 할부 안내문 추가
		str +='<div id="changeNotice" style="font-size: 12px; color: #'+eColor[5]+'; ">※ 본 견적서는 사업자(개인사업자/법인) 고객에 한하여 유효합니다.<br>※ 개인 고객은 금리체계 모범규준에 의거 신용조회 및 심사 후 금리가 결정되며, 결정된 금리에 따라 월 납입금이 변동됩니다.</div>';
		// str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	} 
	
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="lease"){
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';   border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선납금 할인</td>'+txtZp+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">보증금 할인</td>'+txtZd+'</tr>';
		str +='\n</tbody></table>';
	}
	
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
	if(estmMode=="rent"){
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; "><b>고객 초기납입비용</b></td>'+txtPay+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; ">입금 계좌</td>';
		str += '<td colspan="'+fincLen+'" style="'+tdEW+tdDBb+' text-align: left; padding: 4px;  text-align: left; font-size: 12px;" >'+fincConfig[estmNow][0]['accountBank']+' '+fincConfig[estmNow][0]['accountNum']+' / 예금주 : '+fincConfig[estmNow][0]['accountName']+'</td></tr>';
	}else if(estmMode=="fince"){
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 12px; ">고객부담 인지세</td>'+txtZs+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; "><b>고객 초기납입비용</b></td>'+txtPay+'</tr>';
	}else{
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 12px; ">등록/부대비용</td>'+txtPay1+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[2]+';  border-right: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 12px; ">'+ttlPay1+'</td>'+txtPay2+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; "><b>고객 초기납입 합계</b></td>'+txtPay+'</tr>';
	}
	str +='\n</tbody></table>';
	
	
	if(estmMode=="rent"){
		if(typeof(fincConfig[estmNow][0]['insureCompany'])!="undefined") var insComp = fincConfig[estmNow][0]['insureCompany'];
		else var insComp = "-";
		
		var insure =  "대물 :  "+dataBank['goodsConfig'][local]['insureObj'][fincConfig[estmNow][0]['insureObj']];
		insure +=  ", 자손 :  "+dataBank['goodsConfig'][local]['insureCar'][fincConfig[estmNow][0]['insureCar']];
		insure +=  ", 면책금 :  "+dataBank['goodsConfig'][local]['insureSelf'][fincConfig[estmNow][0]['insureSelf']];
		if(fincConfig[estmNow][0]['insureEmpYn']=="Y") insure +=  ", 임직원 운전자 한정운전 특약 가입";
		
		
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left;  font-size: 13px; ">■ 보험 조건</td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr>';
		str += '<td style="width:14%; '+tdTBt1+' text-align: center; font-size: 12px; padding: 3px; ">보험회사</td>';
		str += '<td style="width:22%; '+tdDBt1+' text-align: center; font-size: 12px padding: 3px;; ">'+insComp+'</td>';
		//str += '<td style="width:14%; '+tdTBt1+' border-left: 1px solid #'+eColor[2]+';  text-align: center; font-size: 12px; padding: 3px; ">피보험자</td>';
		//str += '<td style="width:12%; '+tdDBt1+' text-align: center; font-size: 12px padding: 3px;; ">하나캐피탈</td>';
		str += '<td style="width:14%; '+tdTBt1+' border-left: 1px solid #'+eColor[2]+';  text-align: center; font-size: 12px; padding: 3px; ">운전연령</td>';
		str += '<td style="width:18%; '+tdDBt1+' text-align: center; font-size: 12px; padding: 3px; ">'+dataBank['goodsConfig'][local]['insureAge'][fincConfig[estmNow][0]['insureAge']]+'</td>';
		str += '<td style="width:14%; '+tdTBt1+' border-left: 1px solid #'+eColor[2]+';  text-align: center; font-size: 12px; padding: 3px; ">보험종류</td>';
		str += '<td style="width:18%; '+tdDBt1+' text-align: center; font-size: 12px; padding: 3px; ">영업용</td>'; 
		str += '</tr>';
		str += '<tr>';
		str += '<td style="width:14%; '+tdTBt1+' text-align: center; font-size: 12px; padding: 3px; ">의무가입</td>';
		str += '<td colspan="7" style="width:86%; '+tdDBt1+' text-align: left; font-size: 13px; padding: 3px;; ">대인배상Ⅰ, 대인배상Ⅱ, 무보험차상해(최고액 2억), 긴급출동</td>';
		str += '</tr>';
		str += '<tr>';
		str += '<td style="width:14%; '+tdTBtb+' text-align: center; font-size: 12px; padding: 3px; ">필수가입</td>';
		str += '<td colspan="7" style="width:86%; '+tdDBb+' text-align: left; font-size: 12px; padding: 3px; ">'+insure+'</td>';
		str += '</tr>';
		str +='\n</tbody></table>';
		/*
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left; ">■ 정비 조건</td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr>';
		str += '<td style="width:11%; '+tdTBt1+' text-align: center; font-size: 13px; padding: 3px; ">보험회사</td>';
		str += '<td style="width:20%; '+tdDBt1+' background-color:#'+eColor[3]+';  text-align: center; font-size: 13px padding: 3px;; ">'+insComp+'</td>';
		str += '<td style="width:11%; '+tdTBt1+' border-left: 1px solid #'+eColor[2]+';   text-align: center; font-size: 13px; padding: 3px; ">피보험자</td>';
		str += '<td style="width:12%; '+tdDBt1+' text-align: center; font-size: 13px padding: 3px;; ">하나캐피탈</td>';
		str += '<td style="width:11%; '+tdTBt1+' text-align: center; font-size: 13px; padding: 3px; ">운전연령</td>';
		str += '<td style="width:12%; '+tdDBt1+' text-align: center; font-size: 13px; padding: 3px; ">'+dataBank['goodsConfig'][local]['insureAge'][fincConfig[estmNow][0]['insureAge']]+'</td>';
		str += '<td style="width:11%; '+tdTBt1+' text-align: center; font-size: 13px; padding: 3px; ">보험종류</td>';
		str += '<td style="width:12%; '+tdDBt1+' text-align: center; font-size: 13px; padding: 3px; ">영업용</td>'; 
		str += '</tr>';
		str += '<tr>';
		str += '<td style="width:11%; '+tdTBt1+' text-align: center; font-size: 13px; padding: 3px; ">의무가입</td>';
		str += '<td colspan="7" style="width:89%; '+tdDBt1+' text-align: left; font-size: 13px; padding: 3px;; ">대인배상Ⅰ, 대인배상Ⅱ, 무보험차상해(최고액 2억), 긴급출동</td>';
		str += '</tr>';
		str += '<tr>';
		str += '<td style="width:11%; '+tdTBtb+' text-align: center; font-size: 13px; padding: 3px; ">필수가입</td>';
		str += '<td colspan="7" style="width:89%; '+tdDBb+' text-align: left; font-size: 13px; padding: 3px; ">'+insure+'</td>';
		str += '</tr>';
		str +='\n</tbody></table>';
		*/
	}
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left; font-size: 13px;  ">■ 구비서류</td></tr></tbody></table>';
	str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
	str += '<tr><td style="width: 16%; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; ">개인/개인사업자</td>';
	str += '<td style="width: 84%; text-align: left; padding: 4px;  text-align: left; font-size: 12px; border-top: 1px solid #'+eColor[1]+'; border-bottom: 1px solid #'+eColor[1]+'; " >사업자등록증 사본, 운전면허증 사본, 자동이체통장 사본<br>소득금액증명원, 재산세과세증명원, 자격증 사본(전문직 한정)</td></tr>';
	str += '<tr><td style="width: 16%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; ">법인사업자</td>';
	str += '<td style="width: 84%; border-bottom: 1px solid #'+eColor[1]+'; text-align: left; padding: 4px;  text-align: left; font-size: 12px;" >사업자등록증 사본, 법인등기부등본 1부, 법인인감증명서 1통, 최근 2개년도 재무제표<br>주주명부, 자동이체통장 사본 ※ 법인의 경우 대표이사 개인입보 필수</td></tr>';
	str +='\n</tbody></table>';
	str +='<div style="font-size: 12px;">※ (개인/법인)인감증명서, 주민등록등본, 법인등기부등본은 계약체결시점 3개월 이내 발급분만 인정합니다.<br>※ 연대보증인 필요서류도 동일합니다.</div>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	if(estmMode=="rent") str +='<div style="font-size: 12px;" class="eGuide openDressup">'+defaultCfg['guideRent']+'</div>';
	else if(estmMode=="lease") str +='<div style="font-size: 12px;" class="eGuide openDressup">'+defaultCfg['guideLease']+'</div>';
	return str;
}

//영업사원 정보 표시
function docuSalesInfo(eTitle){
	var eColor = ["담청","00aaaa","d5e0e3","effbff","d2eaf1","ed1753"];
	//var sInfo = eSeller.split("\t");
	var sInfo = defaultCfg['sInfo'].split("\t");
	if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var cName = estmConfig['name'];
	else var cName = "VIP 고객";
	var eDate = now;
	var str = "<tbody>";
	if(defaultCfg['cardView']=="Y"){
		var sales = '<table cellspacing="0" cellpadding="0" border="0" width="95%"><tbody>';
		sales += '<tr><td colspan="2" style="text-align: center; width: 100%; font-size: 13px; "><b style="font-size: 14px; line-height: 250%; ">'+sInfo[0]+'</b></td></tr>';
		sales += '<tr><td style="text-align: center; width: 20%; font-size: 13px; ">소속</td><td style="text-align: right; width: 80%; font-size: 13px; ">'+sInfo[2]+'</td></tr>';
		sales += '<tr><td style="text-align: center; width: 20%; font-size: 13px; ">전화</td><td style="text-align: right; width: 80%; font-size: 13px; ">'+sInfo[1]+'</td></tr>';
		sales += '</tbody></table>';
		str += '<tr><td style="width: 30%; text-align: left; "><img style="width: 185px; height: 45px;" src="'+imgPath+'capital/logo-hana-estm-01.jpg"></td><td style="width: 40%; text-align:center; padding: 2px; "><b class="eTitle ttl" style="font-size: 24px; line-height: 180%;">'+eTitle+'</b></td>'
		+'<td style="width: 30%; text-align: center; background-color: #f4f4f4; padding: 2px 5px; border-bottom: 3px solid #'+eColor[1]+';" rowspan="3" class="openDressup">'+sales+'</td></tr>'
		+'\n<tr><td colspan="2" style="width: 70%; text-align:left;  padding: 2px; font-size: 14px;">■ <b class="cName openDressup" type="'+fincConfig[estmNow][0]['buyType']+'">'+cName+'</b>님 귀중 </td></tr>'
		+'\n<tr><td colspan="2" style="width: 70%; text-align:left;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+'; font-size: 13px; " >작성일 : <span class="eDate openDressup">'+eDate+'</span></td></tr>';
	}else{
		str += '<tr><td style="width: 30%; text-align: left; "><img style="width: 185px; height: 45px;" src="'+imgPath+'capital/logo-hana-estm-01.jpg"></td><td style="width: 40%; text-align:center; padding: 2px; "><b class="eTitle ttl" style="font-size: 24px; line-height: 180%;">'+eTitle+'</b></td>'
		+'<td style="width: 30%;">&nbsp;</td></tr>'
		+'\n<tr><td colspan="2" style="width: 70%; text-align:left;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+';  font-size: 14px;">■ <b class="cName openDressup" type="'+fincConfig[estmNow][0]['buyType']+'">'+cName+'</b>님 귀중 </td>'
		+'\n<td style="width: 70%; text-align:right;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+'; font-size: 13px; " >작성일 : <span class="eDate openDressup">'+eDate+'</span></td></tr>';
	}
	str += "</tbody>";
	//if(type=="change"){
	//	$("#estmDocu .estmRslt_estmDocu .eHead").html(str);
	//}else{
		return str;
	//}
}
function outPutCapital(path){
	var cod = path.split("_");
	var $obj = $("#estmBody .estmCell[estmNo='"+cod[1]+"']");
	if($obj.find("button.getCapital").text()=="계산하기"){
		return false;
	}
	var capital = parseInt(dataBank[path]['capital']); // 취득원가
	dataBank["remainLineup"+estmRslt.lineup] = new Object();
	dataBank["remainLineup"+estmRslt.lineup]['monthKm'] = dataBank[path]['monthKm'];
	if(typeof(dataBank[path]['adCmfeTrgtList'])!="undefined") dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'] = dataBank[path]['adCmfeTrgtList'];
	if(typeof(dataBank[path]['preBchKndCd'])!="undefined") dataBank["remainLineup"+estmRslt.lineup]['adCmfe'] = dataBank[path]['preBchKndCd'];
	if(typeof(dataBank[path]['dcSpptAmtTrgtYn'])!="undefined") dataBank["remainLineup"+estmRslt.lineup]['dcSppt'] = dataBank[path]['dcSpptAmtTrgtYn'];
	if(typeof(dataBank[path]['cprnCmfeRto'])!="undefined") fincConfig[estmNow][0]['feeDsR'] = dataBank[path]['cprnCmfeRto'];
	else fincConfig[estmNow][0]['feeDsR'] = 0;
	if(typeof(dataBank[path]['monthKm'])=="string" && fincConfig[estmNow][0]['goodsKind']=="lease"){
		if(dataBank[path]['monthKm']) var msg = dataBank[path]['monthKm'];
		else var msg = "잔가율이 확정되지 않아 견적을 산출할 수 없습니다. 다른 차종을 선택하여 주세요.";
		alertPopup("<div>"+msg+"</div>");
	}
	$obj.find(".estmRslt_capital").attr("capital",capital);
	$obj.find("button.getCapital").addClass("off");
	$obj.find("button.getCapital").text("계산하기");
	$obj.find(".estmRslt_capital").removeClass("off");
	estmChangeKind = "capitalLease";
	if(gnbPath=="usedcar") calculatorU();
	else calculator();
}

function outPutCost(path){
	var cod = path.split("_");
	var $obj = $("#estmBody .estmCell[estmNo='"+cod[1]+"'] .fincBox .fincCell[fincNo='"+cod[2]+"']");
	if($obj.find("button.getResult").text()=="계산하기"){
		return false;
	}
	$obj.find("button.getResult").text("계산하기");
	if(typeof(cod[3])!="undefined" && cod[3]=="error"){
		return false;
	}
	var eVal = fincData[cod[1]][cod[2]];
	if(estmMode=="lease"){
		if(typeof(dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'])=="undefined" || dataBank["remainLineup"+estmRslt.lineup]['adCmfeYn'][eVal.month]!="Y" ){
			if(dataBank[path]['hrcstAdCmfeYn']=="Y"){
				$obj.find(".fincView[kind='adCmfe'] .desc").addClass("off");
				$obj.find(".fincView[kind='adCmfe'] .radio").removeClass("off");
				if(dataBank[path]['preBchKndCd']=="01" || dataBank[path]['preBchKndCd']=="02"){
					fincConfig[cod[1]][cod[2]]['adCmfe'] = dataBank[path]['preBchKndCd'];
					// 값 다르면 아래 적용
					//if(dataBank[path]['preBchKndCd']=="01") fincConfig[cod[1]][cod[2]]['adCmfe'] = "02";
					//else if(dataBank[path]['preBchKndCd']=="02") fincConfig[cod[1]][cod[2]]['adCmfe'] = "01";
					$obj.find("input[name^='adCmfe']").parent().css("display","none");
					$obj.find("input[name^='adCmfe'][value='"+fincConfig[cod[1]][cod[2]]['adCmfe']+"']").parent().css("display","");
					$obj.find("input[name^='adCmfe'][value='"+fincConfig[cod[1]][cod[2]]['adCmfe']+"']").prop("checked",true);
					alertPopup("<div>추가수수료 지급 대상입니다.</div>");
				}else if(fincConfig[cod[1]][cod[2]]['adCmfe']==""){
					$obj.find("input[name^='adCmfe']").parent().css("display","");
					$obj.find("input[name^='adCmfe']").prop("checked",false);
					fincConfig[cod[1]][cod[2]]['adCmfe']="";
					$obj.find("button.getResult").attr("adCmfe","X");
					alertPopup("<div>추가수수료 지급 대상을 선택하신 후 다시 계산해 주세요.</div>");
					return false;
				}
			}
		}
	}
	
	
	$obj.find("button.getResult").addClass("off");
	// $obj.find("button.getResult").text("계산하기");
	$obj.find(".estmRslt_pmtPay").removeClass("off");
	$obj.find(".estmRslt_pmtPayMax").removeClass("off");
	
	if(estmMode=="rent"){
		fincConfig[cod[1]][0]['insureCompany'] = dataBank[path]['jnIscoNm']; // 계약보험사
		eVal.capital = parseInt(dataBank[path]['acqCamtAmt']); // 취득원가
		eVal.irr = parseFloat(dataBank[path]['irrPer']);  // IRR
		eVal.pmtCar = parseInt(dataBank[path]['carRtfe']);	// 차량분렌탈료
        eVal.pmtAdd = parseInt(dataBank[path]['addRtfe']);	// 가산렌탈료
		eVal.pmtSupply = parseInt(dataBank[path]['spprcAmt']);  // 공급가금액
		eVal.pmtVat = parseInt(dataBank[path]['srtxAmt']);  // 부가세금액
		eVal.pmtSupply = parseInt(dataBank[path]['spprcAmt']);  // 공급가금액
		eVal.pmtVat = parseInt(dataBank[path]['srtxAmt']);  // 부가세금액
		eVal.pmtSum = parseInt(dataBank[path]['evtmPyinAmt']);  // 매회납입금액
		eVal.pmtPay = parseInt(dataBank[path]['prrpRtfe']);  // 선납렌트료
		eVal.pmtGrand = parseInt(dataBank[path]['rlpnRtfe']);  // 실납입렌트료
		fincConfig[estmNow][0]['insureCompany'] = dataBank[path]['jnIscoNm']; // 보험회사
	}else if(estmMode=="lease"){
		eVal.carSelf = parseInt(dataBank[path]['rnPrnc']);  // 차량분 rnPrnc 
		eVal.carIns = parseInt(dataBank[path]['pmfex']);  // 보험분 pmfex 
		if(typeof(dataBank[path]['catxAmtx'])!="undefined") eVal.carTax = parseInt(dataBank[path]['catxAmtx']);  // 차세분 catxAmtx 
		else eVal.carTax = parseInt(dataBank[path]['catxAmt']);  // 차세분 catxAmtx 
		eVal.pmtMon = parseInt(dataBank[path]['evtmPyinAmt']);  // 매회납입금액	evtmPyinAmt  (최소)
		if(typeof(dataBank[path]['maxEvtmPyinAmt'])!="undefined") eVal.pmtMonMax = parseInt(dataBank[path]['maxEvtmPyinAmt']);  // 매회납입금액	maxEvtmPyinAmt (최대)		// 20220607 추가 W/유모현
		eVal.pmtPay = parseInt(dataBank[path]['evtmPrrpAmt']);  // 매회선납리스료	evtmPrrpAmt
		eVal.pmtGrand = parseInt(dataBank[path]['evtmRlpnAmt']);  // 매회납부리스료	evtmRlpnAmt  (최소)
		if(typeof(dataBank[path]['maxEvtmRlpnAmt'])!="undefined") eVal.pmtGrandMax = parseInt(dataBank[path]['maxEvtmRlpnAmt']);  // 매회납입금액	maxEvtmRlpnAmt (최대)		// 20220607 추가 W/유모현
		if(typeof(dataBank[path]['rmbrAplInrt'])!="undefined"){
			eVal.rate = parseFloat(dataBank[path]['rmbrAplInrt']);  // 상환적용금리	rmbrAplInrt  (최소)
			if(typeof(dataBank[path]['maxRmbrAplInrt'])!="undefined"){	// 20220607 추가 W/유모현
				eVal.rateMax = parseFloat(dataBank[path]['maxRmbrAplInrt']);  // 상환적용금리	maxRmbrAplInrt  (최대)
			}
			// $obj.find(".estmRslt_loanRate").text("금리 "+(number_cut(eVal.rate*100,1,"round")/100)+"%"); // 사용되는 곳 없음  // 20220607 추가 W/유모현
		}
		if(typeof(dataBank[path]['agAdCmfe'])!="undefined"){
			fincConfig[cod[1]][cod[2]]['feeAgAdd'] = parseFloat(dataBank[path]['agAdCmfe']);  // agAdCmfe : AG추가수수료,
			fincConfig[cod[1]][cod[2]]['feeAgAddR'] = parseFloat(dataBank[path]['agAdCmfeRto']);  // agAdCmfeRto : AG추가수수료율
		}else{
			fincConfig[cod[1]][cod[2]]['feeAgAdd'] = "";
			fincConfig[cod[1]][cod[2]]['feeAgAddR'] = "";
		}
		eVal.pmtGapPay = parseInt(dataBank[path]['preaDcAmt']);
		eVal.pmtGapPayR = parseFloat(dataBank[path]['preaDcRto']);
		eVal.pmtGapDep = parseInt(dataBank[path]['gtamtDcAmt']);
		eVal.pmtGapDepR = parseFloat(dataBank[path]['gtamtDcRto']);
		/*
		선납금에 따른 할인은 preaDcAmt 할인율은preaDcRto. 입니다
		보증금에 따른 할인은 gtamtDcAmt 할인율은 gtamtDcRto 입니다.
		매회납입금액	evtmPyinAmt
		매회선납리스료	evtmPrrpAmt
		매회납부리스료	evtmRlpnAmt
		자동차세분	catxAmt
						차세분 catxAmtx
                        보험분 pmfex
                        차량분 rnPrnc
		상품코드	prdtCd
		잔가보장사고객번호	rcstGrnCustNo
		잔가보장수수료금액	rcstGrnCmfeAmt
		잔가보장수수료율	rcstGrnCmrt
		주행거리감가비율	trvgDstnDeprRto
		*/
		eVal.prdtCd = dataBank[path]['prdtCd'];  // 상품코드	prdtCd
		eVal.rcstGrnCustNo = dataBank[path]['rcstGrnCustNo'];  // 잔가보장사고객번호	rcstGrnCustNo
		eVal.rcstGrnCmfeAmt = parseInt(dataBank[path]['rcstGrnCmfeAmt']);  // 잔가보장수수료금액	rcstGrnCmfeAmt
		eVal.rcstGrnCmrt =dataBank[path]['rcstGrnCmrt'];  // 잔가보장수수료율	rcstGrnCmrt
		eVal.trvgDstnDeprRto = parseInt(dataBank[path]['trvgDstnDeprRto']);  // 주행거리감가비율	trvgDstnDeprRto
		//eVal.insure = parseInt(dataBank[path]['evtmPmfeAmt']);  // 매회보험료금액	evtmPmfeAmt
		// $("#estmBody .estmCell[estmNo='"+cod[1]+"'] .estmRslt_carTaxY").text(number_format(eVal.carTaxY)+"/년");
	}else if(estmMode=="fince"){
		eVal.rate = parseFloat(dataBank[path]['rmbrAplInrt']);  // 상환적용금리	rmbrAplInrt (최소)
		if(typeof(dataBank[path]['maxRmbrAplInrt'])!="undefined"){	// 20220607 추가 W/유모현
			eVal.rateMax = parseFloat(dataBank[path]['maxRmbrAplInrt']);  // 상환적용금리 maxRmbrAplInrt  (최대)
		}
		if(fincConfig[estmNow][0]['buyType']=="1" && typeof(eVal.rateMax)!="undefined"){
			$obj.find(".estmRslt_finceRate").text(eVal.rate+"% ~ " + eVal.rateMax+"%");
		}else{
			$obj.find(".estmRslt_finceRate").text(eVal.rate+"%");
		}
		eVal.pmtGrand = dataBank[path]['evtmPyinAmt'];  // // 매회납입금액 		evtmPyinAmt (최소)
		if(typeof(dataBank[path]['maxEvtmPyinAmt'])!="undefined") eVal.pmtGrandMax = parseFloat(dataBank[path]['maxEvtmPyinAmt']);  // 매회납입금액 maxEvtmPyinAmt  (최대) // 20220607 추가 W/유모현
		/*if(typeof(dataBank[path]['cprnCmfeRto'])!="undefined") fincConfig[estmNow][0]['feeDsR'] = dataBank[path]['cprnCmfeRto'];
		else fincConfig[estmNow][0]['feeDsR'] = 0;
		if(typeof(defaultCfg['istmFeeDsR'])=="undefined" && typeof(dataBank[path]['cprnCmfeRto'])!="undefined" && parseFloat(dataBank[path]['cprnCmfeRto'])>0){		// 추후 삭제 예정 API 제휴선수수료율 정상화 되면 istmFeeDsR
			if(estmRslt.brand<200) var local = "domestic";
			else var local = "imported";
			var agMax = parseFloat(dataBank['goodsConfig'][local]['agFeeMax']);
			var cmMax = parseFloat(dataBank['goodsConfig'][local]['cmFeeMax']);
			var sumMax = parseFloat(dataBank['goodsConfig'][local]['agcmFeeMax']);
			sumMax -= parseFloat(fincConfig[estmNow][0]['feeDsR']);
			var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
			var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']);
			var sumR = agR + cmR;
			if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
				alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주시고 다시 계산해 주세요.");
				if(cmMax && cmR>cmMax) cmR = cmMax;
				if(agMax && agR>agMax) agR = agMax;
				if(agR+cmR>sumMax) cmR = number_cut((sumMax - agR)*1000,1,'round')/1000;;
				if(cmR<0){
					cmR = 0;
					agR = sumMax;
				}
				fincConfig[estmNow][0]['feeAgR'] = agR;
				fincConfig[estmNow][0]['feeCmR'] = cmR;
				estmChangeKind="dealerShop";
				calculator();
				return false;
			}
		}*/
	}
	if(fincConfig[estmNow][0]['buyType']=="1" && ( (estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan") || estmMode=="fince") && typeof(eVal.rateMax)!="undefined"){		// 개인 , 금융리스/ 할부
		number_change(eVal.pmtGrandMax,$obj.find(".estmRslt_pmtPayMax"));
		$obj.find(".estmRslt_pmtPayMax").parent().addClass("maxView");
	}else{
		$obj.find(".estmRslt_pmtPayMax").parent().removeClass("maxView");
	}
	number_change(eVal.pmtGrand,$obj.find(".estmRslt_pmtPay"));
	if($obj.find("button.getResult").attr("openRslt")!="0"){
		if(parseInt($obj.find("button.getResult").attr("openRslt"))!=eVal.pmtGrand){
			alertPopup("<div>견적 계산 결과가 변동되었습니다. <br>기존 견적서와 비교하여 변경내역을 확인해주세요.<br><br><span class='desc'>월납입금 : "+number_format($obj.find("button.getResult").attr("openRslt"))+" ▶ "+number_format(eVal.pmtGrand)+"</span></div>")
		}
		$obj.find("button.getResult").attr("openRslt","0");
	}
	eVal.viewPmt = "show";
	//var pmtGrand = parseInt(dataBank[path]['rentalCar']) + parseInt(dataBank[path]['rentalAddSum']);
	//number_change(pmtGrand,$obj.find(".estmRslt_pmtPay"));
	if(deviceType=="app"){
		sendDataToRight("html",window.btoa(encodeURIComponent(viewLoanDocu())));
	}else{
		$("#estmDocu .estmRslt_estmDocu").html(viewLoanDocu());
	}
}


//즉시출고 목록 추가
function addListFastship(){
	estmSelf ++;
	var sNo = estmSelf;
	estmData[sNo] = new Object();
	var rsltArr = new Object();;
	rsltArr.braNo = "brand";
	rsltArr.braNm = "brandName";
	rsltArr.mdlNo = "model";
	rsltArr.mdlNm = "modelName";
	rsltArr.linupNo = "lineup";
	rsltArr.linupNm = "lineupName";
	rsltArr.carMdlYr = "lineupYear";
	rsltArr.trimNo = "trim";
	rsltArr.trimNm = "trimName";
	rsltArr.trimAmt = "trimPrice";
	rsltArr.crcltNo = "colorExt";
	rsltArr.crcltNm = "colorExtName";	
	rsltArr.crcltAmt = "colorExtPrice";
	rsltArr.carInerClrtnNo = "colorInt";
	rsltArr.carInerClrtnNm = "colorIntName";
	rsltArr.carInerClrtnAmt = "colorIntPrice";
	rsltArr.cropMngeNo = "option";
	rsltArr.cropGrpNm = "optionName";
	rsltArr.cropAmt = "optionSum";
	rsltArr.taxtnAmt = "priceSum";
	rsltArr.txexCarAmt = "vehicleFree";
	rsltArr.carDcAmt = "discountMaker";	
	rsltArr.dcRto = "discountRate";
	rsltArr.cndgmtAmt = "deliveryMaker";
	rsltArr.carDlvyAmt = "vehicleSale";
	rsltArr.spprcAmt = "vehicleSupply";
	for(var k in rsltArr){
		estmData[sNo][k] = estmRslt[rsltArr[k]]+"";
	}
	// 선택 항목
	var mName = '<span class="model">'+estmRslt['modelName']+'</span> <span class="lineup">'+estmRslt['lineupName']+'</span> <span class="trim">'+estmRslt['trimName']+'</span>';
	mName += '<span class="price">('+number_format(estmRslt['trimPrice'])+')</span>';
	
	// 외장색상
	var mColor = "";
	if(estmRslt['colorExt']){
	    mColor += '<span class="colorExt">'+estmRslt['colorExtName'];
	    if(estmRslt['colorExtPrice']) mColor += '<span class="price">('+number_format(estmRslt['colorExtPrice'])+')</span>';
	    mColor += '</span>';
	}
	// 내장색상
	if(estmRslt['colorInt']){
		mColor += ' <span class="colorInt">'+estmRslt['colorIntName'];
	    if(estmRslt['colorIntPrice']) mColor += '<span class="price">('+number_format(estmRslt['colorIntPrice'])+')</span>';
	    mColor += '</span>';
	}
	if(mColor=="") mColor = '<span>선택 없음</span>';
	// 옵션
	var mOption = "";
	if(estmRslt['optionList']){
	    var tmp = estmRslt['optionList'].split("\n");
	    for(var o in tmp){
	    	dat = tmp[o].split("\t");
    		mOption+='<span>';
    		mOption += dat[0];
    		if(dat[1]!="0") mOption += '<span class="price">('+number_format(dat[1])+')</span>';
    		mOption+='</span>';
	    }
	}
	if(mOption=="") mOption ='<span>선택 없음</span>';
	
	
	var str = '<li sNo="'+sNo+'">';
	str += '<div class="box"><button class="btnDelFashship">삭제</button>';
		str += '<div class="kind">';
			str += '<span class="title">';
			str += '<label><input type="radio" name="type'+sNo+'" value="01"><span>선구매</span></label> <label><input type="radio" name="type'+sNo+'" value="02"><span>즉시출고</span></label>';
			str += '</span>';
			str += '<span class="count">수량 <input type="text" value="" class="rateS numF" name="count"> 대</span>';
		str += '</div>';
		str += '<div class="detail">';
			str += '<div class="model">'+mName+'</div>';
			str += '<div class="color">'+mColor+'</div>';
			str += '<div class="option">'+mOption+'</div>';
		str += '</div>';
		str += '<div class="cost">';
			str += '<div class="choice"><span class="price">'+number_format(estmRslt.priceSum)+'</span></div>';
			if(estmRslt.taxRate!=100) str += '<div class="free"><span class="price">'+number_format(estmRslt.vehicleFree)+'</span></div>';
			else str += '<div class="free"><span class="price">과세출고</span></div>';
			str += '<div class="discount"><span class="price">'+number_format(estmRslt.discountMaker)+'</span></div>';
			str += '<div class="delivery"><span class="price">'+number_format(estmRslt.deliveryMaker)+'</span></div>';
			str += '<div class="sales"><span class="price">'+number_format(estmRslt.vehicleSale)+'</span></div>';
		str += '</div>';
	str += '</div>';
	str += '<ol class="contract"></0l>';
	 
	 str += '</li>';
	 $("#fastshipData").prepend(str);
}


//원리금 균등 상환식
function calculatorPMT( mon, rate, cap, rem){
	rate = rate / 100 / 12;
	var pay = ( cap - rem / Math.pow( 1 + rate, mon) ) * rate * Math.pow( 1 + rate, mon) / ( Math.pow( 1 + rate, mon) - 1 ) ;
	// pay = number_cut(pay*10, 1, "floor")/10;
	//console.log(pay);
	return pay;
}