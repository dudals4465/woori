<?php 

        $namePartner = "우리금융캐피탈";
        $faviconImg = "/images/favicon";
        if(!isset($ogUrl)){
            $uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);
            $ogUrl = URL.$uri_parts[0];
        }
        $ogImg = URL."/images/og.jpg";
        $ogDesc = "우리금융캐피탈 온라인 견적서비스 입니다. 등록된 AG회원만 사용하실 수 있습니다.";
        $ogKey = "우리금융캐피탈 온라인 견적";
        
?>

<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<title><?=$titleGnb?></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="<?=$faviconImg?>.ico">
	<link rel="icon" href="<?=$faviconImg?>-152.png" sizes="152x152">
	<link rel="apple-touch-icon-precomposed" href="<?=$faviconImg?>-152.png">
	<link rel="canonical" href="<?=$ogUrl?>">
	<meta name="apple-mobile-web-app-title" content="견적서비스>
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="keyword" content="<?=$ogKey?>">
    <meta name="description" content="<?=$ogDesc?>">
	<meta id="metaTitle" property="og:title" content="<?=$titleGnb?>">
    <meta id="metaUrl" property="og:url" content="<?=$ogUrl?>">
    <meta id="metaImage" property="og:image" content="<?=$ogImg?>">
    <meta id="metaDesc" property="og:description" content="<?=$ogDesc?>">
	<script type="text/javascript" src="/scripts/jquery-2.1.4.min.js"></script>
	
	<script type="text/javascript" src="/scripts/jquery.cookie.min.js"></script>
	<script type="text/javascript" src="/scripts/jsxcompressor.min.js"></script>
	
	<script type="text/javascript" src="/scripts/common.js"></script>
	<?php if($dirGnb=="newcar" || $dirGnb=="usedcar" || $dirGnb=="desk"){?>
		<script type="text/javascript" src="/scripts/estimate.js"></script>
	<?php }?>
	<?php if($dirGnb=="newcar" || $dirGnb=="usedcar"){?>
		<script type="text/javascript" src="/scripts/calculator.js"></script>
		<script type="text/javascript" src="/scripts/calculatorC.js"></script>
		<script type="text/javascript" src="/scripts/publish.js"></script>
	<?php }?>
	<script>
		imgPath = "<?=IMG_PATH?>";
		devicePath = "<?=DEVICE_PATH?>";
		deviceType = "<?=DEVICE_TYPE?>";
		deviceSize = "<?=DEVICE_SIZE?>";
		gradeAuth = "<?=GRADE_AUTH?>";
		gnbPath = "<?=$dirGnb?>";
		lnbPath = "<?=$dirLnb?>";
		dcYM = "<?=DC_YM?>";
		partnerPath = "<?=PARTNER_PATH?>";
		
	</script>
	<link href="/styles/main.css" rel="stylesheet">
	<?php if($dirGnb=="newcar" || $dirGnb=="usedcar"){?>
	<link href="/styles/estimate.css" rel="stylesheet">
	<?php }?>
	
	<style>
	<?php if(isset($_SESSION['mode']) && $_SESSION['mode']) {?>
	   #apiView { display: block; margin: 20px; }
	 <?php }else{?>
	 #apiView { display: none;}
	 <?php }?>
	</style>
	
</head>
<body>
	<div class="wrapper <?=$dirGnb?> <?=$dirLnb?> <?=DEVICE_TYPE?>Type <?=DEVICE_SIZE?>Size">
		<header>
			<div class="header">
				<div class="frame">
    				<?php if($dirGnb=="home" && $dirLnb=="login"){?>
    					<h1><a href="https://www.carpan.co.kr" target="_blank">우리금융캐피탈</a></h1>
    				<?php }else{?>
    					<h1><a href="/">우리금융캐피탈</a></h1>
    				<?php }?>
    				<div class="title ttl"><?=(DEVICE_SIZE=="mobile") ? $titleGnb:"온라인 견적"?></div>
        			<button class="open" id="btnMenuOpen">메뉴 열기</button>
        		</div>
    		</div>
    		<div class="menuGnb"  id="divGnbMenu">
    			<div class="frame">
        			<div class="top">
        				<a class="home" href="/desk">홈</a>
        				<?php if(GRADE_AUTH!="N"){?>
        				<a class="logout" href="/login/logout">로그아웃</a>
        				<?php }?>
        				<button class="close" id="btnMenuClose">메뉴 닫기</button>
        				<!-- <div class="tohana"><a href="https://www.hanacapital.co.kr" target="_blank">하나캐피탈 바로가기</a></div> -->
        			</div>
        			<ul class="list">
        				<li>
        					<div class="cate">신차</div>
        					<ul class="sub">
        						<?php if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"r")===false){?><li><a href="/newcar/estimate/rent">렌트견적</a></li><?php }?>
        						<?php if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"l")===false)){?><li><a href="/newcar/estimate/lease">리스견적</a></li><?php }?>
        						<?php if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"f")===false)){?><li><a href="/newcar/estimate/fince">할부견적</a></li><?php }?>
        						<?php if($_SESSION['regs_Member']!="N" && strpos($_SESSION['permit_Member'],"T")!==false){?><li><a href="/newcar/estimate/testride">시승차견적</a></li><?php }?>
        						<?php if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"p")===false){?><li><a href="/newcar/fastship/list">선구매</a></li><?php }?>
        					</ul>
        				</li>
        				<?php if($_SESSION['regs_Member']!="N" &&  $_SESSION['permit_Member']!="" &&  strpos($_SESSION['permit_Member'],"U")!==false){?>
        				<li>
        					<div class="cate">중고차</div>
        					<ul class="sub" style="padding-top: 3px;">
        						<li><a href="/usedcar/estimate/lease">리스견적</a></li>
        					</ul>
        				</li>
        				<?php }?>
        				<?php if(DEVICE_SIZE=='mobile' || (isset($_SESSION['mode']) && $_SESSION['mode'])){?>
        				<li>
        					<div class="cate">저장•심사</div>
        					<ul class="sub">
        						<li><a href="/desk/save/offer">가견적</a></li>
        						<li><a href="/desk/save/confirm">견적</a></li>
        						<li><a href="/desk/save/counsel">심사</a></li>
        						<li><a href="/desk/save/order">발주</a></li>
        						<li><a href="/desk/save/delivery">인도</a></li>
        					</ul>
        				</li>
        				<?php }?>
        				<li>
        					<div class="cate">서비스</div>
        					<ul class="sub">
        						<li><a href="/mypage">내정보</a></li>
        						<li><a href="/board/notice/list">공지사항(즉시출고)</a></li>
        						<li><a href="/service/policy">이용약관</a></li>
        						<?php if(strpos($_SESSION['permit_Member'],"M")!==false){?><li><a class="admin" href="/admin">관리자</a></li><?php }?>
        						<?php if(DEVICE_TYPE=="app"){?><li><a href="javascript:clearCache()"><span>Cache 삭제</span></a></li><?php }?>
        					</ul>
        				</li>
        			</ul>
        		</div>
    		</div>
    		<div class="gnbBack" id="divGnbBack"></div>
		</header>
		<div class="container">
			