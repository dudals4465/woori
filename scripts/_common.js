var orient = "";	//	화면 방향  L / P
var old_url = window.location.href;
var tmpUrl = window.location.pathname.split("/");
var urlHost = window.location.protocol+"//"+window.location.hostname;
var tmpHost = location.host.split(".");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10)  mm='0'+mm;
var now = getDateStr(today);

// 표시 제한일 (올린 날짜 2틀 후부터 표시, 1일 전은 표시하지 않음, 단 일요일은 2일전, 월요일은 3일전 (금요일 건은 표시하지 않음))
var wk = today.getDay();
if(wk==0) var dCut = -2;
else if(wk==1) var dCut = -3;
else var dCut = -1;
var dayOfMonth = today.getDate();
today.setDate(dayOfMonth + dCut);
var dayCut = getDateStr(today);

var popupReload = true;

//# 있으면 없애기(최기화)
if(window.location.href.indexOf('#')>0) {
	window.location.href = window.location.href.substring(0, window.location.href.indexOf("#"));
}

function getDateStr(myDate){
	var year = myDate.getFullYear();
	var month = (myDate.getMonth() + 1);
	var day = myDate.getDate();
	
	month = (month < 10) ? "0" + String(month) : month;
	day = (day < 10) ? "0" + String(day) : day;
	
	return  year + '-' + month + '-' + day;
}

window.onhashchange = function (event) {
	// console.log("onhashchange");
	if(old_url.indexOf("#layerPopup")>=0){
		$('.layerPopup').fadeOut();
	}else if(old_url.indexOf("#loadingPopup")>=0){
		$('.loadingPopup').fadeOut();
	}else if(old_url.indexOf("#menuSlide")>=0){
        slideLnbClose();
	}else if(old_url.indexOf("#menuApp")>=0){
        appMenuClose();
	}
	old_url = window.location.href;
}
//슬라이드 메뉴 열기 
function slideLnbOpen() {
	$("#divGnbMenu").addClass("open");
	if(deviceSize=="mobile"){
		$('#divGnbBack').fadeIn();
		$("#divGnbMenu").css("right","-240px");
		$("#divGnbMenu").animate({
			"right": "0px"
		},100);
	}else{
		$("#divGnbMenu .list").css('display','none');
		$("#divGnbMenu .top").css('display','none');
		$("#divGnbMenu .list").slideDown('fast', function(){
			$("#divGnbMenu .top").css('display','block');
		});
	}
	var url = window.location.href;
	if(url.indexOf("#")>=0){
		url = url.substring(0,url.indexOf("#"))+"#menuSlide";
	}else{
		url += "#menuSlide";
	}
	window.location.href = url;
}
//슬라이드 메뉴 닫기 
function slideLnbClose(gnb) {
	$("#divGnbMenu").removeClass("open");
	$("#divGnbBack").fadeOut();
}

//API 데이터 보기 (개발용)
function viewApiData(data){
	$("#apiRequest").text(data['Request']);
	$("#apiResponse").text(data['Response']);
}


//브랜드 목록
function getBrandList(view){
	if(estmMode=="fince") var local = "F";
	else var local = "";
	var Dpath = "brandList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/brandList_local"+"?token="+token;
		getjsonData(url,Dpath);
		dataBank[Dpath]['brand']['131']['name'] = "한국GM";
	}
	var str = "";
	for (var i in dataBank[Dpath]['local']) {
		if(local=="" || (local=="K" && i=="kr") || (local!="K" && i!="kr")){
			var val = dataBank[Dpath]['local'][i];
			if(view!="option") str += "<div class='box "+i+"'><div class='local'>"+val['name']+"</div><ul class='brandList'>";
			var tmp =val['brandList'].split(",");
			for (var m in tmp) {
				var open = true;
				var cls = "";
				if(typeof(estmMode)!="undefined" && estmMode=="rent" && typeof(defaultCfg['rentDisBrand'])!="undefined" && defaultCfg['rentDisBrand']){
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
				}
				if(open){
					var dat = dataBank[Dpath]['brand'][tmp[m]];
					if(view=="option") str += "<option value='"+tmp[m]+"'>"+dat['name']+"</option>";
					else str += "<li brand='"+tmp[m]+"' class='"+cls+"'><button><img src='"+imgPath+dat['logo']+"' alt=''><span class='len"+dat['name'].length+"'>"+dat['name']+"</span></button></li>";
				}
			}
			if(view!="option") str += "</ul></div>";
		}
	}
	return str;
}
// 모델 목록 
function getModelList(brand,view){	
	var Dpath = "modelList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/auto/modelList_search"+"?token="+token;
		getjsonData(url,Dpath);
		if(brand=="131") dataBank[Dpath]['brand']['131']['name'] = "한국GM";
	}
	var str = "";
	if(typeof(dataBank['modelList']['brand'][brand]['modelList']) == 'undefined'){
		str += "<li><div class='blank'>결과가 없습니다..</div></li>";
	}else{
		if(view=="pop") var loadImg = "onload='openPopupView(720,\"framePopup\")'";
		else if(view=="pop9") var loadImg = "onload='openPopupView(900,\"framePopup\")'";
		else var loadImg = "";
		var tmp = dataBank[Dpath]['brand'][brand]['modelList'].split(",");
		for (var i in tmp) {
			dat = dataBank[Dpath]['model'][tmp[i]];
			var open = true;
			var cls = "";
			if(typeof(estmMode)!="undefined" && estmMode=="rent" && dat['cartype']=="T0") open = false;		// 렌트 화물차
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
			}
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

function clearCache(){
	window.app.clearCache();
	window.location.href = $("#metaUrl").attr("content");
}

$(function () {
	// LNB 열고 닫기
    $(document).on("click", "#btnMenuOpen", function () {
    	slideLnbOpen();
    });
    // LNB 바탕 클릭
    $(document).on("click", "#divGnbBack, #btnMenuClose", function () {
        slideLnbClose();
    });
	// 신차/중고차 메뉴 열기
	$(document).on("click", ".popMenuOpen", function () {
		if($(this).hasClass("on")){
			$(this).next().slideUp( function() {
				$(this).prev().removeClass("on");
	         });
		}else{
	        $(this).addClass("on");
			$(this).next().slideDown();
		}
    });
    
	//페이지 이동
	$(document).on("click", "#pageButton button", function () {
		if(!$(this).hasClass("now")){
			window.location.href = $("#pageButton").attr("link")+"page="+$(this).attr("page");
		}
	});
	// 팝업창 닫기 버튼, 배경 클릭
    $(document).on("click", ".layerPopup .btnClose, .layerPopup .btnClose2, .layerPopup .btnConfirm, .layerPopup .dimBg", function () {
		$('.layerPopup').fadeOut();
		return false;
	});
    // 팝업창 입력 화면 조절..
    $(document).on("click", "#framePopup input[type='text'], .layerPopup textarea", function () {
    	if(deviceType=="app"){
    		setTimeout(function() {
    			openPopupView(600,'framePopup');
    		}, 300);
    	}
    });
    $(document).on("blur", "#framePopup input[type='text'], .layerPopup textarea", function () {
    	if(deviceType=="app"){
    		setTimeout(function() {
    			if(typeof(popupReload)!="undefined" || popupReload==true){
    				openPopupView(600,'framePopup');
    			}
    		}, 300);
    	}
    });
    
    $(document).on("click", ".urlCopy", function () {
		var txt = $(this).prev().val();
		if(window.app && typeof(window.app.copyUrlToClipboard)=="function"){
			 window.app.copyUrlToClipboard(txt);
		}else{
			clipboardCopy(txt);
		}
	});
	
});

function clipboardCopy(txt){
	var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(txt).select();
    document.execCommand("copy");
    $temp.remove();
    alert("Url이 복사되었습니다.");
}
function sendKakao(key,type){
	event.preventDefault();
	if(type=="estm") $obj = $("#estmDocu .estmRslt_estmDocu");
	else $obj = $("#docuViewBox");
	
	if($obj.find(".eTitle").length) var ttl = $obj.find(".eTitle").text();
	else var ttl = "";
	if($obj.find(".eModel").length) var desc = $obj.find(".eModel").text();
	else var desc = "";
	if($obj.find(".ePhoto").length) var src = $obj.find(".ePhoto").attr("src");
	else var src = $("#metaUrl").attr("content")+"/images/og-estimate-01.png";
	
	var w = 300;
	var h = 150;
	var url = urlHost+"/D/E/"+key;
	var btn = ttl+" 보기";
	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: {
			title : ttl ,
			description : desc ,
			imageUrl : src ,
			imageWidth : w,
			imageHeight : h,
			link: {
				mobileWebUrl: url,
				webUrl: url
			}
		},
		buttons: [
			{
				title: btn,
				link: {
					mobileWebUrl: url,
					webUrl: url
				}
			}
		]
    });
}
function sendKakaoLink(url,ttl,src,desc){		// 미사용?
	event.preventDefault();
	var w = 300;
	var h = 150;
	var btn = ttl+" 보기";
	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: {
			title : ttl ,
			description : desc ,
			imageUrl : src ,
			imageWidth : w,
			imageHeight : h,
			link: {
				mobileWebUrl: url,
				webUrl: url
			}
		},
		buttons: [
			{
				title: btn,
				link: {
					mobileWebUrl: url,
					webUrl: url
				}
			}
		]
    });
}
// 로딩바
function openLoading(){
	$(".loadingPopup").fadeIn();
	var url = window.location.href;
	if(url.indexOf("#")>=0){
		url = url.substring(0,url.indexOf("#"))+"#loadingPopup";
	}else{
		url += "#layerPopup";
	}
	window.location.href = url;
}
// 팝업 경고창
function alertPopup(msg){
	$("#framePopup h3").text("알림");
	$("#framePopup .content").html("<div><div class='alert'>"+msg+"</div><div class='buttonBox'><button class='btnConfirm'>확인</button></div></div>");
	openPopupView(450,'framePopup');
}
//팝업 레이어 오픈	
function openPopupView(w,id){
	var $el = $('#'+id);
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	if(winWidth<w+10) w = winWidth - 10;
	$el.css({width:w});
	$el.find('.content').css('overflow-y','visible');
	$el.find('.content').css('height','auto');
	$el.parent().fadeIn();
	var $elWidth = ~~($el.outerWidth());
	var $elHeight = ~~($el.outerHeight());
	if(winHeight<$elHeight+10){
		$el.find('.content').css('overflow-y','auto');
		$el.find('.content').css('height',winHeight-79);
		$elHeight = winHeight;
	}else{
		$el.find('.content').css('overflow-y','auto');
		$el.find('.content').css('height',$elHeight-35);
	}
	$el.css({	
		marginTop: -$elHeight /2 +5,
		marginLeft: -$elWidth/2
	})
	$el.draggable();
	var url = window.location.href;
	if(url.indexOf("#")>=0){
		url = url.substring(0,url.indexOf("#"))+"#layerPopup";
	}else{
		url += "#layerPopup";
	}
	window.location.href = url;
}

// 숫자만 입력
function onlyNumber(){
    if((event.keyCode<48)||(event.keyCode>57)){
    	event.returnValue=false;
    }
}
// 다음 박스로 이동
function nextFocus(arg,len,nextname) { 
	if (arg.value.length==len) {
		$("input[name='"+nextname+"']").focus() ;
		return;
	}
}
// 페이지 목록
function pageList(total, unit, page){
    var str="";
    var step = 5;	// 페이지 표시갯수
    var first = 1;
    var last = Math.ceil(total / unit);
    if(last>1){
        var start = page - 2;
        if(start<1) start = 1;
        var end = start + step -1;
        if(end > last) end = last;
        if(end - start < step - 1){
            start = end - step + 1;
            if(start<1) start = 1;
        }
        
        if(page>2){
            str +="<button class='first' page='1'>&nbsp;<span>처음</span></button>";
        }
        if(page>1){
            str +="<button class='prev' page='"+(page-1)+"'>&nbsp;<span>이전</span></button>";
        }
        
        for(i=start;i<=end;i++){
            if(page==i) var now = "now";
            else var now = "";
            str +="<button class='"+now+"' page='"+i+"'><span>"+i+"</span></button>";
        }
        
        if(page<last){
            str +="<button class='next' page='"+(page+1)+"'>&nbsp;<span>다음</span></button>";
        }
        if(page<last-1){
            str +="<button class='last' page='"+last+"'>&nbsp;<span>마지막</span></button>";
        }
    }
    return str;
}
// 전화번호 포맷
function phone_format(num){
	if(num.indexOf("-")>0) return num;
	else{
		num = num.replace(/[^0-9]/g,"");
	    if(num.length==12) return num.substr(0,4)+"-"+num.substr(4,4)+"-"+num.substr(8);
	    else if(num.length==11) return num.substr(0,3)+"-"+num.substr(3,4)+"-"+num.substr(7);
	    else if(num.length==10 && num.substr(0,2)=="02") return num.substr(0,2)+"-"+num.substr(2,4)+"-"+num.substr(6);
	    else if(num.length==10) return num.substr(0,3)+"-"+num.substr(3,3)+"-"+num.substr(6);
	    else if(num.length==9) return num.substr(0,2)+"-"+num.substr(2,3)+"-"+num.substr(5);
	    else if(num.length==8) return num.substr(0,4)+"-"+num.substr(4);
	    else return num;
	}
}
// 숫자 콤마 넣기
function number_format(num) {
	if(num == "" || num == 0) return 0;
	num = Math.round(num);
	var str = ""+num+"";
	var rtn = "";
	for (ilk = 0; ilk < str.length; ilk ++) {
		if (ilk > 0 && (ilk%3)==0 && str.charAt(str.length - ilk -1)!="-") {
			rtn = str.charAt(str.length - ilk -1) + "," + rtn;
		}
		else {
			rtn = str.charAt(str.length - ilk -1) + rtn;
		}
	}
	return rtn;
}
// 숫자만, 없으면 0
function number_filter(data){
	data = data.replace(/[^0-9.-]/g,"");
	if(data=="" || data =="." || data =="-") data = 0;
	return data;
}
// 숫자만, 없으면 없음
function number_only(data){
	data = data.replace(/[^0-9.-]/g,"");
	if(data =="." || data =="-") data = "";
	return data;
}
// 절사
function number_cut(data, step, type) {
	if( type == 'floor') return Math.floor(data / step ) * step;
	else if (type == 'ceil') return Math.ceil(data / step ) * step;
	else return Math.round(data / step ) * step;
}
// 숫자 점차적으로 변경
function number_change(data,$obj){
	var data = parseInt(data);
	if(isNaN(data)){
		$obj.text(data);
		return;
	}
	var addStr = "";
	if(data<0){
		data = Math.abs(data);
		addStr = "-";
	}
	var thisNo = number_filter($obj.text());
	thisNo = Math.abs(thisNo);
	if(data == thisNo){
		$obj.text(addStr+number_format(data));
		return;
	}
	else if(data > thisNo && Math.abs(data - thisNo)<10) var step = 1;
	else if(data < thisNo && Math.abs(data - thisNo)<10) var step = -1;
	else var step = parseInt((data - thisNo) / 10);
	var step2 = Math.abs(step)+"";
	var len = step2.length;
	if(len<2) len = 0;
	var len2 = Math.pow(10,len-2);
	step = number_cut(step,len2,"round");
	var spinning = setInterval(function (){
		$obj.text(function (){
			thisNo += step;
			if(step > 0 && thisNo >= data){
				 thisNo = data;
				 if(thisNo==0) addStr = "";
				 clearInterval(spinning);
				 $obj.text(addStr+number_format(thisNo));
					return;
			}else if(step < 0 && thisNo <= data){
				 thisNo = data;
				 if(thisNo==0) addStr = "";
				 clearInterval(spinning);
				 $obj.text(addStr+number_format(thisNo));
					return;
	 		}else{
	 			if(thisNo==0) addStr = "";
	 			$obj.text(addStr+number_format(thisNo));
	 			return;
	 		}
	 	});
	},40);
}
// 요일 변환
var weekArr = new Array("일","월","화","수","목","금","토");

//데이터 정렬
function sortData($obj,odr){
	var comp = [];
	var cap = 0;
	var minR = 0;
	var maxR = 0;
	$obj.find("li").each(function () {
		if(typeof($(this).attr("cap"))!="undefined"){
			if(cap==0 || cap > parseInt($(this).attr("cap"))) cap = $(this).attr("cap");
		}
		if(typeof($(this).attr("res"))!="undefined"){
			if(minR==0 || minR > parseInt($(this).attr("res"))) minR = $(this).attr("res");
			if(maxR==0 || maxR < parseInt($(this).attr("res"))) maxR = $(this).attr("res");
		}
		comp.push({name:$(this).attr("finance"),value:parseInt($(this).attr("comp"))});
	});
	$obj.attr("cap",cap);
	if(minR==maxR) $obj.attr("res",minR+"%");
	else $obj.attr("res",minR+"% ~ "+maxR+"%");
	comp.sort(function (a, b) {
		  if (a.value > b.value) {
		    return 1;
		  }
		  if (a.value < b.value) {
		    return -1;
		  }
		  // a must be equal to b
		  return 0;
	});
	var best = 0;
	var gap = 0;
	var now = "";
	var cnt = 0;
	var rank = 0;
	var gapO = 0;
	for(var c in comp){
		var com = comp[c];
		if(best==0) best = com.value;
		else gap = com.value - best;
		if(gap){
			if(odr=="V") $obj.find("li[finance='"+com.name+"'] .gap").text("-"+number_format(gap));
			else if(odr=="P") $obj.find("li[finance='"+com.name+"'] .gap").text("+"+number_format(gap)+" ("+number_format(com.value)+")");
			else $obj.find("li[finance='"+com.name+"'] .gap").text("+"+number_format(gap));
		}else{
			if(odr=="P") $obj.find("li[finance='"+com.name+"'] .gap").text("("+number_format(com.value)+")");
			else $obj.find("li[finance='"+com.name+"']").addClass("best");
		}
		cnt ++;	// 순위 구성
		if(best==0 || gap==0){
			oldGap = 0;
			$obj.find("li[finance='"+com.name+"'] .rank").text("1");
		}else{
			if(gapO!=gap) rank = cnt;
			gapO = gap;
			//console.log(gap+" "+rank);
			$obj.find("li[finance='"+com.name+"'] .rank").text(rank);
		}
		if(now){
			//console.log(now +" => "+ com.name)
			$obj.find("li[finance='"+now+"']").after($obj.find("li[finance='"+com.name+"']"));
		}
		now = com.name;
	}
	var rank = "";
	$obj.find("li:not(.failure)").each(function () {
		if(rank) rank += ",";
		rank += $(this).attr("finance");
	});
	return rank;
}

//ajax form전송
function ajaxSubmit(obj) {
	var act = $("#" + obj).attr("action");
	var method = $("#" + obj).attr("method");
	var fd = $("#" + obj).serialize();
	$.ajax({
		url: act,
		async : true,
		type : method,
		contentType : "application/x-www-form-urlencoded; charset=UTF-8", 
		data : fd,
		dataType : "JSON",
		timeout: 30000,
		mimeType : "multipart/form-data",
		success : function (obj) {
			if (obj.msg){
				alert(obj.msg);
			}
			if (obj.jsonData) {
				//dataBank['jsonData'] = JSON.parse(obj.jsonData)
				dataBank['jsonData'] = obj.jsonData
			}
			if (obj.returnFunction) {
				eval(obj.returnFunction);
			}
			if (obj.returnUrl) {
				location.href = obj.returnUrl;
			}
		},
		error : function (request, status, error) {
			alert('error : timeout');
		}
	});
}
//ajax form file 전송
function ajaxSubmitFile(obj) {
    var act = $("#" + obj).attr("action");
    var method = $("#" + obj).attr("method");
    var fd = new FormData();
    fd = $("#" + obj).serializefiles();
    var xhr = new XMLHttpRequest();
    xhr.open(method, act);
    xhr.send(fd);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (xhr.responseText != null) {
                    var obj = $.parseJSON(xhr.responseText);
                    if (obj.msg){
                    	alert(response.msg);
                    }
                    if (obj.jsonData) {
        				//dataBank['jsonData'] = JSON.parse(obj.jsonData)
        				dataBank['jsonData'] = obj.jsonData
        			}
        			if (obj.returnFunction) {
        				eval(obj.returnFunction);
        			}
        			if (obj.returnUrl) {
        				location.href = obj.returnUrl;
        			}
                }
                else {
                    alert("실패");
                }
            }
            else {
                alert(xhr.statusText);
                return false;
            }
        }
    }
}

//json 데이터 가져오기
var dataBank = [];
function getjsonData(url,val){
	// ajax 비동기식 호출..
	$.ajaxSetup({
		async: false
	});
	$.ajax({
		url: url,
	}).done(function (data) {
		dataBank[val] = decodeData(data);
	});
	$.ajaxSetup({
		async: true
	});
}
function getjsonApi(url,val){
	// ajax 동기식 호출..
	$.ajax({
		url: url,
	}).done(function (data) {
		dataBank[val] = decodeData(data);
		if(val.indexOf("remain")==0){
			viewApiData(dataBank[val]);
			calculatorFinance('remain');
			if(typeof(dataBank[val]['monthKm'])=="string"){
				if(dataBank[val]['monthKm']) var msg = dataBank[val]['monthKm'];
				else var msg = "잔가율이 확정되지 않아 견적을 산출할 수 없습니다. 다른 차종을 선택하여 주세요.";
				alertPopup("<div>"+msg+"</div>");
			}
		}else if(val.indexOf("cost")==0){
			viewApiData(dataBank[val]);
			if(typeof(dataBank[val]['msg'])!="undefined"){
				alertPopup("<div>"+dataBank[val]['msg']+"</div>");
				outPutCost(val+'_error');
			}else{
				outPutCost(val);
			}
		}else if(val.indexOf("capital")==0){
			viewApiData(dataBank[val]);
			outPutCapital(val);
		}else if(val.indexOf("idcheck")==0){
			viewApiData(dataBank[val]);
			recodeIdCheck(val);
		}else if(val.indexOf("branchCompany")==0){
			viewApiData(dataBank[val]);
			searchCompany(dataBank[val]['code'],dataBank[val]['name']);
		}else if(val.indexOf("request")==0){
			viewApiData(dataBank[val]);
			$('.loadingPopup').css("display","none");
			if(typeof(dataBank[val]['msg'])!="undefined"){
				alertPopup("<div>"+dataBank[val]['msg']+"</div>");
				if(typeof(dataBank[val]['creditChange'])!="undefined"){
					creditChange(dataBank[val]['creditChange']);
				}
			}else{
				estmActReturn(dataBank[val]['job'],dataBank[val]['no'],dataBank[val]['key'],dataBank[val]['type']);
			}
		}else if(val=="carInfo"){
			viewApiData(dataBank[val]);
			$('.loadingPopup').css("display","none");
			if(typeof(dataBank[val]['msg'])!="undefined"){
				alertPopup("<div>"+dataBank[val]['msg']+"</div>");
				setTestrideInfo('error');
			}else{
				setTestrideInfo(val);
			}
		}else if(val=="ucarList"){
			viewApiData(dataBank[val]);
			$('.loadingPopup').css("display","none");
			if(typeof(dataBank[val]['msg'])!="undefined"){
				alertPopup("<div>"+dataBank[val]['msg']+"</div>");
				setUsedCarList('error');
			}else{
				setUsedCarList(val);
			}
		}
		
		
	});
}

function setCookie(name, value, exp){
	var date = new Date();
	date.setTime(date.getTime() + exp*24*60*60*1000);
	document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'+';domain='+location.host.substring(location.host.indexOf('.'));
	// setCookie('name', 1, 7);
}
function getCookie(name) {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
	// getCookie('name')
}
function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	//deleteCookie('name');
}
function closeNotice(name,expire){
	setCookie(name, 'Not '+expire+' Days', 0.5);
	$('.layerPopup').css("display","none");
}
