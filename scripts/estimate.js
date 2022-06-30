
start = new Object();
estmCode = new Object();	 // 계산 시작 임시 변수

estmRslt = new Object();	// 견적 차량 계산 데이터
estmCfg = new Object();	// 트림별 계산 기준값(제원) 임시 저장
estmConfig = new Object();	// 견적별 설정 값 보관
estmConfig[0] = new Object();	// 견적 공통 설정
estmConfig[1] = new Object();	// 견적 금융 개별 설정
estmConfig[2] = new Object();	// 견적 금융 개별 설정
estmConfig[3] = new Object();	// 견적 금융 개별 설정
fincRslt = new Object();		// 견적 금융 계산 데이터

fincNow = new Object();	 	// 현재 선택된 금융 번호
alertPopupMsg = "";			// 경고문
estmChangeKind = "";	// 모델 변경시 변경할 사항들..
garnishCheck = false;

codesMatch = new Object();		// 코드 매칭
codesMatch["milage"] = "km";
codesMatch["buyTypec"] = "custType";


// 상품정보 불러오기 (서버에서 json 캐싱한 것 로드)
function getGoodsConfig(){
	var Dpath = "goodsConfig";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		if(gnbPath=="usedcar") var url = "/api/auto/"+estmMode+"UConfig?token="+token;
		else var url = "/api/auto/"+estmMode+"Config?token="+token;
		getjsonData(url,Dpath);
		console.log(dataBank[Dpath]);
	}
	var Dpath = "codes";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/finance/"+partnerPath+"_codes?token="+token;
		getjsonData(url,Dpath);
		console.log(dataBank[Dpath]);
	}
	
}


// 차량 선택 목록 펼치기
$(document).on("click", ".setVehicleList > button", function () {
	var $obj = $(this).parent();
	var kind = $obj.attr("kind");
	var code = $obj.attr("code");
	if($obj.find(".list").css("display")!="block"){
		if(kind=="brand"){
			var brand = code;
			var $objS = $obj.find(".brandSel");
			if($objS.html()==""){
				$objS.html(getBrandList());
				if(brand) $objS.find("li[brand='"+brand+"']").addClass("on");
				$objS.find(".brandList").each(function (){	// 브랜드 없으면 지역 삭제(off)
					if($(this).find("li").length==0){
						$(this).parent().addClass("off");
					}
				});
			}
		}else if(kind=="model"){
			var model = code;
			var brand = $(".setVehicleList[kind='brand']").attr("code");
			if(brand==""){
				alertPopup("브랜드를 먼저 선택해 주세요.");
				return false;
			}
			var $objS = $obj.find(".modelSel");
			if($objS.html()=="" || brand!=$objS.attr("brand")){
				$objS.html(getModelList(brand));
				$objS.attr("brand",brand);
				if(model) $objS.find("li[model='"+model+"']").addClass("on");
			}
		}else if(kind=="lineup"){
			var lineup = code;
			var model = $(".setVehicleList[kind='model']").attr("code");
			if(model==""){
				alertPopup("모델을 먼저 선택해 주세요.");
				return false;
			}
			var $objS = $(".lineupSel");
			if($objS.html()=="" || model!=$objS.attr("model")){
				$objS.html(getLineupList(model));
				$objS.attr("model",model);
				if(lineup) $objS.find("li[lineup='"+lineup+"']").addClass("on");
			}
		}else if(kind=="trim"){
			var trim = code;
			var lineup = $(".setVehicleList[kind='lineup']").attr("code");
			var model = $(".setVehicleList[kind='model']").attr("code");
			if(lineup==""){
				alertPopup("라인업을 먼저 선택해 주세요.");
				return false;
			}
			var $objS = $(".trimSel");
			if($objS.html()=="" || lineup!=$objS.attr("lineup")){
				$objS.html(getTrimList(model, lineup));
				$objS.attr("lineup",lineup);
				if(trim) $objS.find("li[trim='"+trim+"']").addClass("on");
			}
		}else if(kind=="colorExt" || kind=="colorInt"){
			var trim = $(".setVehicleList[kind='trim']").attr("code");
			if(trim==""){
				alert("트림을 먼저 선택해 주세요.");
				return false;
			}
			disabledContent(kind);
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
	}
});
// 선택 목록 닫기
$(document).on("click", ".closeSelectList", function () {
	$(this).parent().prev().click();
	return false;
});
	

//브랜드 목록
function getBrandList(){
	var local = "";
	var Dpath = "brandList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/brandList_local"+"?token="+token;
		getjsonData(url,Dpath);
	}
	var str = "";
	for (var i in dataBank[Dpath]['local']) {
		if(local=="" || (local=="K" && i=="kr") || (local!="K" && i!="kr")){
			var val = dataBank[Dpath]['local'][i];
			str += "<div class='box "+i+"'><div class='local'>"+val['name']+"</div><ul class='brandList'>";
			var tmp =val['brandList'].split(",");
			for (var m in tmp) {
				var open = true;
				var cls = "";
				/*if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentDisBrand'])!="undefined" && defaultCfg['rentDisBrand']){
					if(defaultCfg['rentDisBrand'].indexOf(tmp[m])>=0) open = false;
				}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseDisBrand'])!="undefined" && defaultCfg['leaseDisBrand']){
					if(defaultCfg['leaseDisBrand'].indexOf(tmp[m])>=0) open = false;
				}else if(typeof(estmMode)!="undefined" && estmMode=="fince" && typeof(defaultCfg['finceDisBrand'])!="undefined" && defaultCfg['finceDisBrand']){
					if(defaultCfg['finceDisBrand'].indexOf(tmp[m])>=0) open = false;
				}
				if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentNotBrand'])!="undefined" && defaultCfg['rentNotBrand']){
					if(defaultCfg['rentNotBrand'].indexOf(tmp[m])>=0) cls = "not";
				}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseNotBrand'])!="undefined" && defaultCfg['leaseNotBrand']){
					if(defaultCfg['leaseNotBrand'].indexOf(tmp[m])>=0) cls = "not";
				}*/
				if(open){
					var dat = dataBank[Dpath]['brand'][tmp[m]];
					//if(view=="option") str += "<option value='"+tmp[m]+"'>"+dat['name']+"</option>";
					//else 
					str += "<li brand='"+tmp[m]+"' class='"+cls+"'><button><img src='"+imgPath+dat['logo']+"' alt=''><span class='len"+dat['name'].length+"'>"+dat['name']+"</span></button></li>";
				}
			}
			str += "</ul></div>";
		}
	}
	return str;
}
// 견적 브랜드 선택
$(document).on("click", ".brandSel button", function () {
	if($(this).parent().hasClass("not")){
		alertPopup("취급불가 차종입니다. 영업점에 문의 바랍니다.");
		return false;
	}else if(!$(this).parent().hasClass("on")){
		arrangeEstmData('brand',$(this).parent().attr("brand"));
	}
	$(".setVehicleList[kind='model'] > button").click();
});
	
// 모델 목록 
function getModelList(brand){	
	var Dpath = "modelList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/modelList_search"+"?token="+token;
		getjsonData(url,Dpath);
	}
	var str = "";
	if(typeof(dataBank['modelList']['brand'][brand]['modelList']) == 'undefined'){
		str += "<li><div class='blank'>결과가 없습니다..</div></li>";
	}else{
		var loadImg = "";
		var tmp = dataBank[Dpath]['brand'][brand]['modelList'].split(",");
		for (var i in tmp) {
			dat = dataBank[Dpath]['model'][tmp[i]];
			var open = true;
			var cls = "";
			/*if(typeof(estmMode)!="undefined" && estmMode=="rent" && dat['cartype']=="T0") open = false;		// 렌트 화물차
			if(dat['open']>=dayCut) open = false;		// 1일전 오픈 표시하지 않음
			if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentDisModel'])!="undefined" && defaultCfg['rentDisModel']){
				if(defaultCfg['rentDisModel'].indexOf(tmp[i])>=0) open = false;
			}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseDisModel'])!="undefined" && defaultCfg['leaseDisModel']){
				if(defaultCfg['leaseDisModel'].indexOf(tmp[i])>=0) open = false;
			}
			if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentNotModel'])!="undefined" && defaultCfg['rentNotModel']){
				if(defaultCfg['rentNotModel'].indexOf(tmp[i])>=0) cls = "not";
			}else if(typeof(estmMode)!="undefined" && estmMode=="lease" && typeof(defaultCfg['leaseNotModel'])!="undefined" && defaultCfg['leaseNotModel']){
				if(defaultCfg['leaseNotModel'].indexOf(tmp[i])>=0) cls = "not";
			}*/
			if(open){
				if(dat['image']=="/")  dat['image'] = "model/noImage_main.png";
				str += "<li class='state"+dat['state']+" "+cls+"' model='"+tmp[i]+"'><button>";
				str += "<div class='logo'><img src='"+imgPath+dataBank[Dpath]['brand'][dat['brand']]['logo']+"' alt='"+dataBank[Dpath]['brand'][dat['brand']]['name']+"'></div>";
				str += "<div class='type'>"+dataBank[Dpath]['cartype'][dat['cartype']]['name']+"</div>";
				str += "<div class='car'><img src='"+imgPath+dat['image']+"' "+loadImg+"></div>";
				str += "<div class='name'>"+dat['name']+"</div>";
				str += "</button></li>\n";
			}
		}
	}
	return str;
}
// 견적 모델 선택
$(document).on("click", ".modelSel button", function () {
	if($(this).parent().hasClass("not")){
		alertPopup("취급불가 차종입니다. 영업점에 문의 바랍니다.");
		return false;
	}else{
		if(!$(this).parent().hasClass("on")){
			arrangeEstmData('model',$(this).parent().attr("model"));
		}
		$(".setVehicleList[kind='lineup'] > button").click();
	}
});
//라인업 목록
function getLineupList(model){
	var Dpath = "modelData"+model;
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/modelData_"+model+"?token="+token;
		getjsonData(url,Dpath);
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

// 견적 라인업 선택
$(document).on("click", ".lineupSel button", function () {
	if($(this).parent().hasClass("not")){
		alertPopup("취급불가 차종입니다. 영업점에 문의 바랍니다.");
		return false;
	}else if(!$(this).parent().hasClass("on")){
		arrangeEstmData('lineup',$(this).parent().attr("lineup"));
	}
	$(".setVehicleList[kind='trim'] > button").click();
});

// 트림 목록
function getTrimList(model,lineup){
	var Dpath = "modelData"+model;
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		if(typeof(estmConfig[0]['testride'])!="undefined" && estmConfig[0]['testride']) var url = "/api/auto/modelUsed_"+model+"?token="+token;
		else var url = "/api/auto/modelData_"+model+"?token="+token;
		getjsonData(url,Dpath);
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
			//dataCheck("Trm-"+trim,trimD['price']+"\t"+trimD['name']);
		}
	}
	return str;
}
// 견적 트림 선택
$(document).on("click", ".trimSel button", function () {
	if($(this).parent().hasClass("not")){
		alert("취급불가 차종입니다. 영업점에 문의 바랍니다.");
		return false;
	}else if(!$(this).parent().hasClass("on")){
		arrangeEstmData('trim',$(this).parent().attr("trim"));
	}
	if(estmMode=="rent"){
		if(typeof(estmConfig[0]['colorExt'])=="undefined" || estmConfig[0]['colorExt']=="") $(".setVehicleList[kind='colorExt'] > button").click();
	}
});
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
				//dataCheck(kind+"-"+lineup+"-"+val[0],val[1]+"\t"+dat.name+code);
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
// 견적 외장 선택
$(document).on("click", ".colorExtSel button", function () {
	if($(this).parent().hasClass("dis")){
		disabledMessage('colorExt',$(this).parent().attr("colorExt"),$(this).parent().attr("dis"));
		return false;
	}
	if(!$(this).parent().hasClass("on")){
		var $obj = $(".colorExtSel");
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
		if(typeof(estmConfig[0]['colorInt'])=="undefined" || estmConfig[0]['colorInt']=="") $(".setVehicleList[kind='colorInt'] > button").click();
	}
});
//외장색상 선택 저장
function getColorExtCode(){
	var code = "";
	$col = $(".colorExtSel li.on");
	if($col.length){
		code += $col.attr("colorExt")+"\t";
		code += $col.attr("price")+"\t";
		code += $col.find(".name").text()+"\t";
		code += $col.attr("rgb");
		colorExt = $col.attr("colorExt");
	}else{
		colorExt = "";
	}
	$(".setVehicleList[kind='colorExt']").attr("code", colorExt);
	estmConfig[0]['colorExt'] = code;
}
// 견적 내장 선택
$(document).on("click", ".colorIntSel button", function () {
	if($(this).parent().hasClass("dis")){
		disabledMessage('colorInt',$(this).parent().attr("colorInt"),$(this).parent().attr("dis"));
		return false;
	}
	if(!$(this).parent().hasClass("on")){
		var $obj = $(".colorIntSel");
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
	if(deviceSize=="mobile" && estmRslt.brand<200 && (typeof(estmConfig[0]['option'])=="undefined" || estmConfig[0]['option']=="")){
		$(".unitA.option .top > button").click();
	}
});
// 내장색상 선택 저장
function getColorIntCode(){
	var code = "";
	$col = $(".colorIntSel li.on");
	if($col.length){
		code += $col.attr("colorInt")+"\t";
		code += $col.attr("price")+"\t";
		code += $col.find(".name").text()+"\t";
		code += $col.attr("rgb");
		colorInt = $col.attr("colorInt");
	}else{
		colorInt = "";
	}
	$(".setVehicleList[kind='colorInt']").attr("code", colorInt);
	estmConfig[0]['colorInt'] = code;
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
				//dataCheck("Opt-"+trim+"-"+val[0],val[1]+"\t"+dat.name);
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
	var colorExt = $(".setVehicleList[kind='colorExt']").attr("code");
	var colorInt = $(".setVehicleList[kind='colorInt']").attr("code");
	var nameSel = $(this).find(".name").text().replace(" ?","");
	var msg = "";
	var $objO = $(".optionSel");
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
			msg +="【"+$(".estmRslt_colorExt span.name").text()+"】 외장색상은  【"+nameSel+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
			$(".setVehicleList[kind='colorExt']").attr("code","");
			estmConfig[0]['colorExt'] = "";
			$(".colorExtSel li").removeClass("on");
			$(".colorExtSel li.selNot").remove();
		}
		// 내장 연결
		if(colorInt && intJoin && intJoin.indexOf(colorInt)>=0){
			if(msg) msg += "<br>";
			msg +="【"+$(".estmRslt_colorInt span.name").text()+"】 내장색상은  【"+nameSel+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
			$(".setVehicleList[kind='colorInt']").attr("code","");
			estmConfig[0]['colorInt'] = "";
			$(".colorIntSel li").removeClass("on");
			$(".colorIntSel li.selNot").remove();
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
//옵션 선택 저장
function getOptionCode(){
	var code = "";
	var option = "";
	var $obj = $(".optionSel li.on:not(.off)");
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
	$(".setVehicleList[kind='option']").attr("code",option);
	estmConfig[0]['option'] = code;
}

// 외장/내장/옵션 선택 제한 안내
function disabledMessage(kind,code,type){
	var model = $(".setVehicleList[kind='model']").attr("code");
	var trim = $(".setVehicleList[kind='trim']").attr("code");
	var Dpath = "modelData" + model;
	var optionList = dataBank[Dpath]['trim'][trim]['option'];
	var $objO = $(".optionSel");
	if(kind=="colorInt") var msg = "【"+dataBank[Dpath]['colorInt'][code]['name']+"】 내장색상은 ";
	else if(kind=="colorExt") var msg = "【"+dataBank[Dpath]['colorExt'][code]['name']+"】 외장색상은 ";
	else if(kind=="option") var msg = "【"+dataBank[Dpath]['option'][code]['name']+"】 옵션은 ";
	if(type=="extNot"){
		var colorExt = $(".setVehicleList[kind='colorExt']").attr("code");
		msg += "【"+dataBank[Dpath]['colorExt'][colorExt]['name']+"】 외장색상과 함께 적용되지 않습니다.";
	}else if(type=="intNot"){
		var colorInt = $(".setVehicleList[kind='colorInt']").attr("code");
		msg += "【"+dataBank[Dpath]['colorInt'][colorInt]['name']+"】 내장색상과 함께 적용되지 않습니다.";
	}else if(type=="optionNot"){
		var option = $(".setVehicleList[kind='option']").attr("code");
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
	var model = $(".setVehicleList[kind='model']").attr("code");
	var trim = $(".setVehicleList[kind='trim']").attr("code");
	var Dpath = "modelData" + model;
	var colorExt = $(".setVehicleList[kind='colorExt']").attr("code");
	var colorInt = $(".setVehicleList[kind='colorInt']").attr("code");
	var option = $(".setVehicleList[kind='option']").attr("code");
	var $objE = $(".colorExtSel");
	var $objI = $(".colorIntSel");
	var $objO = $(".optionSel");
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
		if(estmConfig[0]['option'].indexOf('(가니쉬')<0){
			var $objO2 = $(".optionSel li:not(.dis)");
			$objO2.each(function (){
				var name = $(this).find(".name").text();
				if(name.indexOf('(가니쉬')==0){
					garnishCheck = true;
				}
			});
		}
	}
}


// 선택 클릭 후 변경시 실행
function arrangeEstmData(kind,code){
	// arrangeEstmData('brand',$(this).parent().attr("brand"));
	var $obj = $(".setVehicleList[kind='"+kind+"']");
	console.log("arrangeEstmData "+ kind+" => "+code);
	var $objS = $("."+kind+"Sel");
	$objS.find("li.on").removeClass("on");
	$objS.find("li["+kind+"='"+code+"']").addClass("on");
	$obj.attr("code",code);
	// 선택된 데이터 표시하기
	if(kind=="brand"){
		$(".estmRslt_brandName").html($objS.find("li.on").html());
	}else if(kind=="model"){
		$(".estmRslt_modelName").html($objS.find("li.on .name").html());
	}else if(kind=="lineup"){
		$(".estmRslt_lineupName").html($objS.find("li.on span").html());
	}else if(kind=="trim"){
		$(".estmRslt_trimName").html($objS.find("li.on .name").text()+" <span class='price'>"+$objS.find("li.on .price").text()+"</span>");
	}
	
	if(kind=="brand"){	// 모델 초기화
		$(".setVehicleList[kind='model']").attr("code","");
		$(".modelSel").html("");
		var $objM = $(".modelSel");
		$objM.html("");
		$objM.attr("brand","");
		$(".setVehicleList[kind='model'] .bar").html("<span class='blank'>선택해 주세요.</span>");
	}
	if(kind=="brand" || kind=="model"){	// 라인업 초기화
		$(".setVehicleList[kind='lineup']").attr("code","");
		var $objL = $obj.find(".lineupSel");
		$objL.html("");
		$objL.attr("model","");
		$(".setVehicleList[kind='lineup'] .bar").html("<span class='blank'>선택해 주세요.</span>");
		estmCode = {};
	}
	if(kind=="brand" || kind=="model" || kind=="lineup"){	// 트림 초기화
		$(".setVehicleList[kind='trim']").attr("code","");
		$(".setVehicleList[kind='colorExt']").attr("code","");
		$(".setVehicleList[kind='colorInt']").attr("code","");
		$(".setVehicleList[kind='option']").attr("code","");
		var $objT = $obj.find(".trimSel");
		$objT.html("");
		$objT.attr("lineup","");
		$(".setVehicleList[kind='trim'] .bar").html("<span class='blank'>선택해 주세요.</span>");
		resetEstmUnit();
	}
	if(kind=='trim'){	// 견적 계산 시작
		var modelOld = 0;
		if(typeof(estmCode['model'])!="undefined")  modelOld = estmCode['model'];
		var trimOld = 0;
		if(typeof(estmCode['trim'])!="undefined")  trimOld = estmCode['trim'];
		estmCode = {};
		estmCode['trim'] = parseInt(code);
    	estmCode['lineup'] = parseInt($(".setVehicleList[kind='lineup']").attr("code"));
    	estmCode['model'] = parseInt($(".setVehicleList[kind='model']").attr("code"));
    	estmCode['brand'] = parseInt($(".setVehicleList[kind='brand']").attr("code"));
    	//console.log(estmCode);
    	// 외장/내장/옵션/할인/탁송료 목록 작성
    	$(".colorExtSel").html(getColorList( estmCode.model, estmCode.lineup, estmCode.trim, 'Ext' ));
    	$(".colorIntSel").html(getColorList( estmCode.model, estmCode.lineup, estmCode.trim, 'Int' ));
    	$(".optionSel").html(getOptionList( estmCode.model, estmCode.lineup, estmCode.trim ));
    	// $obj.find(".discountSel").html(getDiscountList(estmCode.brand, estmCode.model,  estmCode.lineup, estmCode.trim ));	미사용
    	// 잔가율 가져요기
    	//if(estmMode=="rent") getApiModelRemain(estmCode);
    	if(trimOld==0 || estmChangeKind=="startUrl"  || estmChangeKind=="start"){
    		// 계산 처음 시작
    		estmCode['change'] = "start";
    	}else if(trimOld == estmCode['trim']){
    		estmCode['change'] = "open";
    	}else{
    		estmCode['change'] = "trim";
    	}
    	if(estmMode != "fastship" && estmCode['model']==modelOld){	// 불러오기, 기존 승계
    		if(typeof(estmConfig[0]['colorExt'])!="undefined" && estmConfig[0]['colorExt']){
    			var val = estmConfig[0]['colorExt'].split("\t");
            	if(val[0].substr(0,1)=="S"){
            		$obj.find(".colorExtSel .selfBox").before(makeSelfColor("colorExt",val[0],val[2],val[1]));
					$obj.find(".colorExtSel .selfBox").addClass("off");
            	}
    			$obj.find(".colorExtSel li[colorExt='"+val[0]+"']").addClass("on");
    			getColorExtCode();
    		}
    		if(typeof(estmConfig[0]['colorInt'])!="undefined" && estmConfig[0]['colorInt']){
    			var val = estmConfig[0]['colorInt'].split("\t");
    			if(val[0].substr(0,1)=="S"){
    				$obj.find(".colorIntSel .selfBox").before(makeSelfColor("colorInt",val[0],val[2],val[1]));
					$obj.find(".colorIntSel .selfBox").addClass("off");
    			}
    			$obj.find(".colorIntSel li[colorInt='"+val[0]+"']").addClass("on");
    			getColorIntCode();
    		}
    		if(typeof(estmConfig[0]['option'])!="undefined" && estmConfig[0]['option']){
    			var dat = estmConfig[0]['option'].split("\n");
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
    		if(typeof(estmConfig[0]['discount'])!="undefined" && estmConfig[0]['discount']){
    			$obj.find(".discountSel li[discount='S']").addClass("on");
				estmConfig[0]['discount'] += "";
				if(estmConfig[0]['discount'].indexOf('T')>0){
					$("input[name='discountType']").prop("checked",true);
				}
    			if(parseFloat(estmConfig[0]['discount']) && parseFloat(estmConfig[0]['discount'])<100){
    				$obj.find(".discountSel li[code='R']").addClass("on");
    				$obj.find(".discountSel li[code='R'] input").val(parseFloat(estmConfig[0]['discount']));
    			}else if(parseFloat(estmConfig[0]['discount'])){
    				$obj.find(".discountSel li[code='P']").addClass("on");
    				$obj.find(".discountSel li[code='P'] input").val(number_format(parseInt(estmConfig[0]['discount'])));
    			}
				
    		}
    	}else{
    		estmConfig[0]['colorExt']="";
    		estmConfig[0]['colorInt']="";
    		estmConfig[0]['option']="";
    		estmConfig[0]['discount'] = 0;
    		$(".discountSel li").removeClass("on");
    	}
    	// 필수 선택 옵션 체크 (* 으로 시작 apply)
    	if($(".optionSel li[apply^='*']").length){
    		$(".optionSel li[apply^='*']").addClass("on");
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
	$(".estmRslt_colorExt").html("<span class='blank'>선택해 주세요.</span>");
	$(".colorExtSel").html("");
	$(".estmRslt_colorInt").html("<span class='blank'>선택해 주세요.</span>");
	$(".colorIntSel").html("");
	$(".estmRslt_trimPrice").html("0");
	$(".optionSel").html("");
	
	$(".estmRslt_taxFreeCost").text("0");
	$(".estmRslt_vehicleVat").text("0");
	$(".estmRslt_vehiclePay").text("0");
	$(".estmRslt_takeSum").text("0");
	$(".estmRslt_costSum").text("0");
	$(".estmRslt_pmtPay").text("0");
	$(".estmRslt_pmtHPay").text("");
	$(".estmRslt_finceRate").text("");
	$(".estmRslt_paySum").text("0");
	
	$(".wrapper").removeClass("use");
	$("#estmBox").removeClass("open");
}
