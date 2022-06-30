function output(){
	// 창 정리
	if(estmChangeKind != "capitalLease" && estmChangeKind != "remainApi" && estmChangeKind != "insure" && estmChangeKind != "accessory" && estmChangeKind != "modify" && estmChangeKind != "incentive"){
		$(".setVehicleList .list").css("display","none");
		$(".setVehicleList").removeClass("open");
		/*$(".selsub .list").css("display","none");
		$(".selsub").removeClass("open");
		$(".seltop .list").css("display","none");
		$(".seltop").removeClass("open");*/
	}
	
	
	$(".estmRslt_brand").attr("code",estmRslt.brand);
	$(".estmRslt_model").attr("code",estmRslt.model);
	$(".estmRslt_lineup").attr("code",estmRslt.lineup);
	$(".estmRslt_trim").attr("code",estmRslt.trim);
	$(".estmRslt_brandName").html("<img src='"+imgPath+estmRslt.logo+"' alt=''>"+estmRslt.brandName+"</span>");
	$(".estmRslt_modelName").html(estmRslt.modelName);
	if(estmRslt.lineupName.indexOf("(")>=0){
		var lineupN = estmRslt.lineupName.substring(0, estmRslt.lineupName.indexOf("("))+" <span class='sub'>"+estmRslt.lineupName.substring(estmRslt.lineupName.indexOf("("))+"</span>";
	}else{
		var lineupN= estmRslt.lineupName;
	}
	$(".estmRslt_lineupName").html(lineupN);
	$(".estmRslt_trimName").html(estmRslt.trimName+" <span class='price'>"+number_format(estmRslt.trimPrice)+"</span>");
	
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
	$(".estmRslt_colorExt").html(colorExt);
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
	$(".estmRslt_colorInt").html(colorInt);
	// 기본가격 + 색상
	number_change(estmRslt.trimPrice, $(".estmRslt_trimPrice") );
	// 옵션
	var optionLen = "";
	if(estmRslt.optionList){
		var tmp = estmRslt.optionList.split("\n");
		optionLen = "("+tmp.length+")";
	}
	$(".estmRslt_optionLen").html(optionLen);
	number_change(estmRslt.extraSum, $(".estmRslt_optionSum"));
	// 차량가격 합계
	$(".estmRslt_vehicleCar").text(number_format(estmRslt.priceSum));
	if(estmMode=="lease"){
		if(estmRslt.vehicleHev){
			$(".estmRslt_vehicleHevName").text("개소세/Hev감면");
			$(".estmRslt_vehicleHev").text(number_format(estmRslt.vehicleTax)+" / "+number_format(estmRslt.vehicleHev));
		}else{
			$(".estmRslt_vehicleHevName").text("개소세감면");
			$(".estmRslt_vehicleHev").text(number_format(estmRslt.vehicleTax));
		}
		if(estmRslt.brand<"200" && estmConfig[0]['discount'].indexOf('T')>0){
			$(".estmRslt_vehicleHev").text("할인액에 포함");
		}
	}else{
		if(estmRslt.taxRate!=100) $(".estmRslt_vehicleFree").text(number_format(estmRslt.vehicleFree));
		else $(".estmRslt_vehicleFree").text("과세출고");
	}
	if(estmMode == "fastship" || estmMode == "lease" || estmConfig[0]['takeType']!="20"){	// 대리점출고 지점출고(현대)
		$(".unitA[tab='summary'] .vehicle").removeClass("off");
		$(".estmRslt_vehicleTag").text("출고가격(계산서)");
		number_change(estmRslt.vehicleSale,$(".estmRslt_vehicleSale"));
		$(".discountList").removeClass("off");
	}else{
		$(".unitA[tab='summary'] .vehicle").addClass("off");
		$(".estmRslt_vehicleTag").text("차량가격(가격표)");
		number_change(estmRslt.priceSum,$(".estmRslt_vehicleSale"));
		$(".discountList").addClass("off");
	}
	if(estmMode=="lease" && estmRslt.capital==0){
		$obj.find(".fincView").css("display","none");
		$obj.find(".guide").css("display","block");
		$obj.find(".guide .blank").text("취득원가를 먼저 계산해 주세요.");
		$(".wrapper").removeClass("use");
		$("#estmBox").removeClass("open");
	}else if(1 || estmMode=="fince" ||  typeof(dataBank["remainLineup"+estmRslt.lineup]) != 'undefined'){
	
		$(".fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			/*var goods = fincConfig[estmNow][fNo]['goods'];
			var star = fincConfig[estmNow][fNo]['star'];
			var eVal = fincData[estmNow][fNo];*/
			$(this).find(".fincView").css("display","none");
			$(this).find(".guide").css("display","none");
			if(estmMode=="rent"){
				$(this).find(".fincView[view*='R']").css("display","block");
			}else if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
				$(this).find(".fincView[view*='K']").css("display","block");
				if(typeof(fincConfig[estmNow][fincNow[estmNow]]['respite'])!="undefined" && fincConfig[estmNow][fincNow[estmNow]]['respite']!="0") $(this).find(".fincView[view*='S']").css("display","block");
			}else if(estmMode=="lease"){
				$(this).find(".fincView[view*='L']").css("display","block");
			}else if(estmMode=="fince"){
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
		});
	}
}