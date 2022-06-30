// WebToWeb 수신
function receiveWebToWeb(func,value){
	if(value){
		value = JSON.stringify(value);
		dat = JSON.parse(value);
		var tmp = func+"(";
		if(dat['vars']){
			var vars = dat['vars'].split(",");
			for(var v in vars){
				if(v!=0) tmp += ",";
				tmp += "'"+dat[vars[v]]+"'";
			}
		}
		tmp += ")";
	}else{
		var tmp = func+"()";
	}
	eval(tmp);
}
// WebToWeb 호출 : 견적서 선택
function sendDataToRight(kind,data){
	//alert("sendDataToRight "+kind);
	var view = "right";
	var func = "writeDataFromMain";
	var cfg = {};
	cfg['kind']=kind;
	cfg['data']=data;
	cfg['vars']="kind,data";
	var dataJ = JSON.stringify(cfg);
	//alert(dataJ);
	window.app.callWebToWeb(view,func,dataJ);
}

function sendDocuToRight(tabs){
	loadViewDocu(tabs,'right');
}

function writeDataFromMain(kind,data){
	// alert("writeDataFromMain "+kind);	// endDataToRight("pmt_G"+cod[2],eVal.pmtGrand);
	if(kind=="tab"){
		$("#estmDocu .estmRslt_tabView").html(decodeURIComponent(window.atob(data)));
	}else if(kind=="docu"){
		$("#estmDocu .estmRslt_tabDocu").html(decodeURIComponent(window.atob(data)));
	}else if(kind.substring(0,4)=="html"){	// OK
		$("#estmDocu .estmRslt_estmDocu").html(decodeURIComponent(window.atob(data)));
	}else if(kind.substring(0,4)=="data"){	// OK
		$("#formEstmSave textarea[name='data']").val(decodeURIComponent(window.atob(data)));
	}else if(kind=="saveNo"){	// OK
		if(data==0){
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
			
			estmConfig[estmNow]['saveNo'] = "";
			estmConfig[estmNow]['viewKey'] = "";
		}
	}else if(kind=="config"){
		$("#estmBody .estmRslt_data").html(decodeURIComponent(window.atob(data)));
	}else if(kind=="edit"){
		$("#docuEdit").html(decodeURIComponent(window.atob(data)));
	}else if(kind=="sets"){
		var sets = data.split("\t");
		estmNow = sets[0];
		estmDoc[estmNow] = {};
		estmDoc['M'] = {};
		$("#estmBody .estmCell").attr("estmNo",estmNow);
		if(sets[1]=="M"){
			$("#estmBody").attr("tabM",sets[2]);
		}else{
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .estmUnit").attr("fincDoc",sets[1]);
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .estmUnit").attr("fincTab",sets[2]);
			$("#estmBody").attr("tabM","");
		}
		$("#estmBody .estmCell").attr("saveNo",sets[3]);
		$("#estmBody").attr("saveM",sets[4]);
	}else if(kind=="save"){
		$("#docuSaveForm").html(decodeURIComponent(window.atob(data)));
	}else if(kind=="star"){
		var sets = data.split("\t");
		$("#estmBody").attr("starLen",sets[0]);
		$("#estmBody").attr("tabM",sets[1]);
	}
	//alert("writeDataFromMain end")
}
//WebToWeb 호출 : 견적서 편집
function sendConfigToMain(kind,data,tabs){
	var view = "main";
	var func = "updateConfigFromSide";
	var cfg = {};
	cfg['kind']=kind;
	cfg['data']=data;
	cfg['tabs']=tabs;
	cfg['vars']="kind,data,tabs";
	var dataJ = JSON.stringify(cfg);
	window.app.callWebToWeb(view,func,dataJ);
}
function updateConfigFromSide(kind,data,tabs){	// if($(this).attr("name")=="cName" && $(this).val()!="VIP") $("#nameCustomer").val($(this).val());
	if(kind=="grade"){
		leftEstimate(data);
		window.app.changeWebView('main');
	}else if(kind=="memo"){
		$("#memoEdit").text(decodeURIComponent(window.atob(data)));
	}else if(kind=="customer"){	// OK
		estmConfig['name'] = data;
	}else if(kind=="cardView"){	// OK
		defaultCfg['cardView'] = data;
	}else if(kind=="saveNo"){	// OK
		estmConfig[estmNow]['saveNo'] = data;
	}else if(kind=="title" || kind=="date" || kind=="show" || kind=="attach" || kind=="color"|| kind=="form" || kind=="seller"){
		$("#"+kind+"Edit").val(data);
	}else if(kind=="guide" || kind=="guideS"){
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] span[name='"+kind+"']").text(decodeURIComponent(window.atob(data)));
	}else{
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] input[name='"+kind+"']").val(data);
	}
	if(kind=="show" || kind=="color" || kind=="form"){
    	loadViewDocu(tabs,'right');
	}
}


// 견적서 tab 변경 전달 - 견적서 요청
function noticeDocuTab(doc,tab){
	var view = "main";
	var func = "changeDocuTab";
	var cfg = {};
	cfg['doc']=doc;
	cfg['tab']=tab;
	cfg['vars']="doc,tab";
	var dataJ = JSON.stringify(cfg);
	window.app.callWebToWeb(view,func,dataJ);
	//alert("call urlBoxOpenA "+doc+tab+" < noticeDocuTab");
	urlBoxOpen(doc+tab);
}
// 견적서 tab 변경 수신 - 견적서 전송
function changeDocuTab(doc,tab){
	if(doc=="M"){
		$("#estmBody").attr("tabM",tab);
	}else{
		$("#estmBody").attr("tabM","");
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .estmUnit").attr("fincDoc",doc);
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .estmUnit").attr("fincTab",tab);
	}
	loadViewDocu(doc+tab,'right');
}
// 메인 뷰 클릭 이벤트 처리
function callMainViewClick(obj){
	var view = "main";
	var func = "clickMainView";
	var cfg = {};
	cfg['obj']=obj;
	cfg['vars']="obj";
	var dataJ = JSON.stringify(cfg);
	window.app.callWebToWeb(view,func,dataJ);
}
function clickMainView(obj){
	$(obj).click();
}
// 개발용
function sendData(){
	var view = $("input[name='view']:checked").val();
	var func = $("input[name='func']").val();
	var cfg = {};
	cfg['title']=$("input[name='title']").val();
	cfg['value']=$("input[name='value']").val();
	cfg['vars']="title,value";
	var data = JSON.stringify(cfg);
	window.app.callWebToWeb(view,func,data);
	//receiveWebToWeb(func,data);
	//alert(window.app.getCurrentViewName());
	if(window.app.getCurrentViewName()=="layer"){
		window.app.closeLayerView();
	}
}
// 개발용
function pushData(title,value){
	$("#title").text($("#title").text()+" > "+title);
	$("#value").text($("#value").text()+" > "+value);
}
// 푸시 메세지 표시
function pushMessageViewer(url){
	var tmp = url.split("/");
	if(tmp[3]=="service" && tmp[4]=="message" && tmp[5]){
		if($("li[key='"+tmp[5]+"']").length){
			$("li[key='"+tmp[5]+"'] span.read").addClass("done");
			$("li[key='"+tmp[5]+"'] span.read").removeClass("not");
			$("li[key='"+tmp[5]+"'] span.read").text("읽음");
		}
		var url = "/api/pushview/"+tmp[5];
		var val = "pushView"+tmp[5];
		getjsonData(url,val);
		var msg = dataBank[val]['message'];
		
		$("#framePopup h3").text("알림 메세지");
		var str = '<div class="pushView">';
		str += '<div class="title">'+msg['title']+'</div>';
		str += '<div class="msg">'+msg['body'].replace(/\n/g,"<br>")+'</div>';
		if(msg['url']) str += '<div class="buttonBox"><a href="'+msg['url']+'">자세히 보기</a></div>';
		str +='</div>';
		
		$("#framePopup .content").html(str);
		openPopupView(400,'framePopup');
		if(msg['count']=="0"){
			$(".header .message").remove();
		}else{
			$(".header .message").text(msg['count']);
		}
	}else{
		window.location.href = url;
	}	
}

function appMenuClose(){
	$('#appBtnBox .navi').fadeOut();
	$('#appBtnBox .tab').fadeOut();
	$('#appBtnBox .dim').fadeOut();
	$('#appBtnBox').removeClass("open");
}
function appMenuOpen(){
	$('#appBtnBox .navi').fadeIn();
	$('#appBtnBox .tab').fadeIn();
	$('#appBtnBox .dim').fadeIn();
	$('#appBtnBox').addClass("open");
	var url = window.location.href;
	if(url.indexOf("#")>=0){
		url = url.substring(0,url.indexOf("#"))+"#menuApp";
	}else{
		url += "#menuApp";
	}
	window.location.href = url;
}

//단축 url 표시
function urlBoxOpenA(tabs){		// 미사용
	//alert(event.target);
	//alert("urlBoxOpenA "+tabs+"= "+estmDoc[estmNow][tabs]);
	if(typeof(estmDoc[estmNow][tabs])!="undefined" && estmDoc[estmNow][tabs]){
		var key = estmDoc[estmNow][tabs];
		$("#estmDocu .urlBox").removeClass("off");
		$("#estmDocu .urlBox input[name='shortcut']").val("http://m.ca8.kr/"+key);
		$("#estmDocu .urlBox .urlOpen").attr("href","http://m.ca8.kr/"+key+"?webview=layer");
		$("#estmDocu .btnEstmAct[job='url']").addClass("off");
		$("#estmDocu .btnEstmAct[job='save']").text("저장됨");
	}else{
		$("#estmDocu .urlBox").addClass("off");
		$("#estmDocu .urlBox input[name='shortcut']").val("");
		$("#estmDocu .urlBox .urlOpen").attr("href","");
		$("#estmDocu .btnEstmAct[job='url']").removeClass("off");
		$("#estmDocu .btnEstmAct[job='save']").text("저장");
	}
}

$(function () {
	// 앱 테스트 
	$(document).on("click", "#appTest", function () {
		//alert("appTest");	// 15843
		estmActReturn('pdf','1257','QsCN7w','ECe1','work','','앱테스트');
	});
	
	$(document).on("click", "#openAppNavi", function () {
		if($('#appBtnBox').hasClass("open")) appMenuClose();
		else appMenuOpen();
	});
	$(document).on("click", "#appBtnBox .dim", function () {
		appMenuClose();
	});
	$(document).on("click", "#btnReloadDocu", function () {
		callMainViewClick(".btnOpenDocu");
	});
	
	$(document).on("click", "#appBtnBox .navi button", function () {
		appMenuClose();
		if($(this).attr("navi")=="home") window.location.href = "/desk";
		else if($(this).attr("navi")=="back") history.go(-2);
		else if($(this).attr("navi")=="top") $( 'html, body' ).stop().animate( { scrollTop : '0' } );
		else if($(this).attr("navi")=="reload" && $("#estmBtnReload").length){
			$( 'html, body' ).stop().animate( { scrollTop : '0' } );
			$("#estmBtnReload").click();
		}else if($(this).attr("navi")=="reload"){
			$( 'html, body' ).stop().animate( { scrollTop : '0' } );
			window.location.href = $("#metaUrl").attr("content");
		}
	});
	$(document).on("click", "#appBtnBox .tab button", function () {
		appMenuClose();
		var tab = $(this).attr("tab");
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] [tab='"+tab+"']");
		var offset = $obj.offset();
		if(tab=="grade") var top = offset.top - 90;
		else var top = offset.top - 60;
		$( 'html, body' ).stop().animate( { scrollTop : top } );
	});
});

