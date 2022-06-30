<?php
$height = $estimate_data->iHeight_Estimate;
$docuBody = stripslashes(htmlspecialchars_decode($estimate_data->tDocument_Estimate));

if(isset($_SERVER['HTTP_AICT_AGENT'])){
    $method = "GET";
}else{
    $method = "POST";
}
if($height>1050) $lineHeight = 130;
else if($height>1000) $lineHeight = 140;
else if($height>950) $lineHeight = 150;
else if($height>900) $lineHeight = 160;
else if($height>850) $lineHeight = 170;
else if($height>800) $lineHeight = 180;
else if($height>750) $lineHeight = 200;
else $lineHeight = 220;

// echo $height;
$docuBody = str_replace("width: 280px; height: 140px;","width: 290px; height: 145px;",$docuBody);
$docuBody = str_replace("http://img.carpan.co.kr/","https://www.carpan.co.kr/img/",$docuBody);
//$docuBody = str_replace("font-size: 24px","font-size: 30px",$docuBody);
//$docuBody = str_replace("font-size: 14px","font-size: 15px",$docuBody);
//$docuBody = str_replace("font-size: 13px","font-size: 14px",$docuBody);

$w = "";
if($estimate_data->iFno_Request){
    $addScript = "confirmCheck();";
}else{
    $addScript = "";
}
if(isset($_GET['v']) && $_GET['v']=="print") {
    $loadScript = 'onload="'.$addScript.'window.print()"';
}else if(isset($_GET['v']) && $_GET['v']=="url") {
    $loadScript = 'onload="'.$addScript.'copyUrl()"';
}else if(isset($_GET['v']) && $_GET['v']=="talk") {
    $loadScript = 'onload="'.$addScript.'sendKakao()"';
}else if(isset($_GET['v']) && ($_GET['v']=="pdf" || $_GET['v']=="jpg")) {
    $w = $_GET['v'];
    $loadScript = 'onload="'.$addScript.'fileDown()"';
}else if($estimate_data->cCode_Request) {
    $loadScript = 'onload="'.$addScript.'hanainCode()"';
}else if($estimate_data->iFno_Request){
    $loadScript = 'onload="'.$addScript.'"';
}else{
    $loadScript = "";
}
    
$viewExtra = "";
$header = '<div class="buttonBox">';
if((isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'],URL)!==false) || isset($_SERVER['HTTP_AICT_AGENT'])){
    if(substr($estimate_data->cKind_Estimate,0,1)=="R"){
        $header .= '<input type="text" value="'.$url.'" name="shortcut"> <button class="urlCopy">Url 복사</button> ';
        $header .= '<button class="sendTalk">카톡</button> ';
    }
}
if(strpos($_SERVER['HTTP_USER_AGENT'],"KAKAOTALK")!==false){
    $header .= '<a href="javascript:alert(\'카톡에서는 PDF 다운 기능이 작동하지 않습니다. [다른 브라우저로 열기] 후 이용하실 수 있습니다.\')">PDF 다운</a> ';
    $header .= '<a href="javascript:alert(\'카톡에서는 JPG 다운 기능이 작동하지 않습니다. [다른 브라우저로 열기] 후 이용하실 수 있습니다.\')">JPG 다운</a> ';
    $header .= '<a href="javascript:alert(\'카톡에서는 인쇄하기 기능이 작동하지 않습니다. [다른 브라우저로 열기] 후 이용하실 수 있습니다.\')">인쇄하기</a>';
}else{
    $header .= '<button class="fileDown"  job="pdf">PDF 다운</button> ';
    $header .= '<button class="fileDown"  job="jpg">JPG 다운</button> ';
    $header .= '<a href="javascript:window.print()">인쇄하기</a>';
}

$header .= '</div> ';
$script = '
		<script type="text/javascript" src="/scripts/jquery-2.1.4.min.js"></script>';
if((isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'],URL)!==false) || isset($_SERVER['HTTP_AICT_AGENT'])){
    $script .= '
        <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
    	<script>
    			Kakao.init("8192b37c6858d76d8e37ee1fcaf72b12");
    	</script>
    ';
}
    
$script .= '
		<script>
			$(document).on("click", ".fileDown", function () {
				var job = $(this).attr("job");
				$("#inputW").val(job);
				$("#formEstimate").submit();
			});
            function fileDown(){
    			$("#formEstimate").submit();
    		}
    		function copyUrl(){
    			alert("Url 복사 버튼을 클릭하시면 간편하게 Url을 복사하실 수 있습니다.");
    		}
            function hanainCode(){
    			var hanainCode ="'.$estimate_data->cCode_Request.'";
                $(".eDate").append(" ("+hanainCode+")");
    		}
		';
if($estimate_data->iFno_Request){
    if($estimate_data->cChanged_Request){
        $tmp = json_decode($estimate_data->cChanged_Request, true);
        foreach($tmp as $key=>$val){
            if($val>1000) $val = number_format($val);
            $script .= '
                    var change'.$key.'="'.$val.'";';
        }
    }
    $script .= '
                    var stateReq="'.$estimate_data->cState_Request.'";';
    $script .= '
            function confirmCheck(){
    			var fNo = '.$estimate_data->iFno_Request.';
                if($("#changeBox").length==0){      // 기 발송 견적에도 소급 적용하기 위한 코드
                    $("#viewDocu td[fno=\'M"+fNo+"\']").closest("table").attr("id","changeBox");
                }
                if($("#changeBox").length){
                    var i = 0;
                    var len = $("#changeBox > tbody > tr").length;
                    var fNo2 = fNo;
                    fNo2 = $("#changeBox tr td[fno=\'M"+fNo+"\']").index();
                    $("#changeBox > tbody > tr").each(function(){
                        i ++;
                        var child = fNo2+1;
                        if(i==1){
                            fLen = $(this).children("td").length;
                        }else if(fLen != $(this).children("td").length){
                            var child = fNo2;
                        }
    	               	$objT = $(this).children("td:nth-child("+child+")");
                        if(i==1) $objT.css("border-top","3px solid #ed1753");
                        else if(i==len) $objT.css("border-bottom","3px solid #ed1753");
                        //$objT.css("background-color","#c3eaf5");
                        //$objT.css("border-left","3px solid #ed1753");
                        //$objT.css("border-right","1px solid #ed1753");
                        if($objT.hasClass("changeRate") && typeof(changerate)!="undefined"){
                             $objT.html("<span style=\'color: #ed1753\'><b>(확정금리) "+changerate+"%</b></span>");
                        }
                        if($objT.find(".changePmtGrand") && typeof(changepmtGrand)!="undefined"){
                             $objT.find(".changePmtGrand").html("<span><b>(확정금액) "+changepmtGrand+"</b></span>");
                        }else if(typeof(changerate)!="undefined"){
                            $objT.find(".changePmtGrand").html("<span><b>(확정금액 별도안내)</b></span>");
                        }
                        if($objT.find(".changePmtBase") && typeof(changepmtBase)!="undefined"){
                             $objT.find(".changePmtBase").html(changepmtBase);
                        }else if(typeof(changerate)!="undefined"){
                            $objT.find(".changePmtBase").html("별도안내");
                        }
                	});
                    if(typeof(changerate)!="undefined"){
                         $("#changeNotice").text("※ 본 견적서는 개인 고객에 한하여 유효합니다. (개인사업자 및 법인사업자는 진행불가)");
                    }else if(stateReq>="04"){
                        $("#changeNotice").remove();
                    }
                    $("#txtDocu").val($("#viewDocu").html());
                }
    		}
		';
}
if((isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'],URL)!==false) || isset($_SERVER['HTTP_AICT_AGENT'])){
    $script .= '
			$(document).on("click", ".urlCopy", function () {
				var txt = $(this).prev().val();
                if(window.app && typeof(window.app.copyUrlToClipboard)=="function"){
        			 window.app.copyUrlToClipboard(txt);
        		}else{
        			clipboardCopy(txt);
        		}
			});
			$(document).on("click", "input", function () {
				$(this).select();
			});
			function clipboardCopy(txt){
				var $temp = $("<input>");
			    $("body").append($temp);
			    $temp.val(txt).select();
			    document.execCommand("copy");
			    $temp.remove();
			    alert("Url이 복사되었습니다.");
			}
            function sendKakao(){
                var ttl = $("#metaTitle").attr("content");
				var desc = $("#metaDesc").attr("content");
				var src = $("#metaImage").attr("content");
				var url = $("#metaUrl").attr("content");
				var w = 300;
				var h = 150;
				var btn = ttl+" 보기";
				Kakao.Link.sendDefault({
					objectType: "feed",
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
            $(document).on("click", ".sendTalk", function () {
                sendKakao();
			});
	';
}
    
$script .= '
		</script>';
$script .= "
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src='https://www.googletagmanager.com/gtag/js?id=UA-127940045-3'></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-127940045-3');
    </script>
";
// 헤더 구성
preg_match_all('/<b class=\"eTitle.+>(.*)<\/b>/Ui', $docuBody, $result);
$ogTitle =$result[1][0];
preg_match_all('/<b class=\"eModel.+>(.*)<\/b>/Ui', $docuBody, $result);
if(isset($result[1][0])) $ogDesc =$result[1][0];
else $ogDesc = "";
preg_match_all("/<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/i", $docuBody, $matches);
if(isset($matches[1]) && $matches[1]){
    if(strpos($matches[1][0],"/model/")!==false) $ogImg = $matches[1][0];
    else if(isset($matches[1][1]) && strpos($matches[1][1],"/model/")!==false) $ogImg = $matches[1][1];
    else $ogImg = "http://m.ca8.kr/images/og-estimate-01.png";
}else{
    $ogImg = "http://m.ca8.kr/images/og-estimate-01.png";
}

$htmlPdf = '
                    <!DOCTYPE html>
                	<html lang="ko">
                    <head>
                        <meta charset="utf-8">
                        <title>'.$ogTitle.'</title>
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    	<link rel="shortcut icon" href="/images/favicon-hana.ico">
                        <link rel="canonical" href="'.$url.'">
                        <meta name="description" content="'.$ogDesc.'">
                        <meta id="metaTitle" property="og:title" content="'.$ogTitle.'">
                        <meta id="metaUrl" property="og:url" content="'.$url.'">
                        <meta id="metaImage" property="og:image" content="'.$ogImg.'">
                        <meta id="metaDesc" property="og:description" content="'.$ogDesc.'">
						<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css">
						<link href="/styles/document-1.0.0.css" rel="stylesheet">
                        <style>
                           div, span, td { line-height: '.$lineHeight.'%; }
                        </style>
                         '.$script.'
                    </head>
                    <body '.$loadScript.'>
                    	<div class="wrapper">
                    		<div class="header">
                    			'.$header.'
                                '.$viewExtra.'
                    		</div>
                    		<div class="container" id="viewDocu">
                         		'.$docuBody.'
                         	</div>
                         	<div class="footer">
                    			<form id="formEstimate" action="'.$url.'" method="'.$method.'"><input type="hidden" name="w" value="'.$w.'" id="inputW"><input name="docu" type="hidden" value="" id="txtDocu"></form>
                    		</div>
                         </div>
                    </body>
                    </html>
                ';
echo $htmlPdf;
?>