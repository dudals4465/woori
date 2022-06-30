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
var now = yyyy + '-' + mm + '-' + dd;






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
	// $el.draggable();
	var url = window.location.href;
	if(url.indexOf("#")>=0){
		url = url.substring(0,url.indexOf("#"))+"#layerPopup";
	}else{
		url += "#layerPopup";
	}
	window.location.href = url;
}
// 팝업창 닫기 버튼, 배경 클릭
$(document).on("click", ".layerPopup .btnClose, .layerPopup .btnClose2, .layerPopup .btnConfirm, .layerPopup .dimBg", function () {
	$('.layerPopup').fadeOut();
	return false;
});


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
			if (obj.reqApi) {
				$("#apiRequest").text(JSON.stringify(decodeData(obj.reqApi)));
			}
			if (obj.getApi) {
				$("#apiResponse").text(JSON.stringify(decodeData(obj.getApi)));
			}
			if (obj.rtnData) {
				dataBank['rtnData'] = decodeData(obj.rtnData);
				$("#apiData").text(JSON.stringify(dataBank['rtnData']));
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
                    if (obj.getApi) {
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

