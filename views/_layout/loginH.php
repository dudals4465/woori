<?php 
    $namePartner = "OO캐피탈";
    $faviconImg = "/images/favicon";
    $ogUrl = URL;
    $ogImg = URL."/images/og.png";
    $ogDesc = "OO캐피탈 온라인 견적서비스 입니다. 등록된 AG회원만 사용하실 수 있습니다.";
    $ogKey = "OO캐피탈 온라인 견적";
?>
<!DOCTYPE html>
<html>
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
	<link href="/styles/login.css" rel="stylesheet">
	<script>
		devicePath = "<?=DEVICE_PATH?>";
		deviceType = "<?=DEVICE_TYPE?>";
		deviceSize = "<?=DEVICE_SIZE?>";
	</script>
	
	<style>
	
	</style>
	
</head>
<body>
	<div class="wrapper <?=$dirGnb?> <?=$dirLnb?> <?=DEVICE_TYPE?>Type <?=DEVICE_SIZE?>Size">
		<div class="container">
			<div class="header">
				<?php if($dirGnb=="home" && $dirLnb=="login"){?>
					<h1><a href="http://www.carpan.co.kr" target="_blank">OO캐피탈</a></h1>
				<?php }else{?>
					<h1><a href="/">하나캐피탈</a></h1>
				<?php }?>
				<div class="title ttl"><?=(DEVICE_SIZE=="mobile") ? $titleGnb:"온라인 견적"?></div>
    			<button class="open" id="btnMenuOpen">메뉴 열기</button>
    		</div>
    		<div class="menuGnb"  id="divGnbMenu">
    			<div class="top">
    				<a class="home" href="/">홈</a>
    				<?php if(GRADE_AUTH!="N"){?>
    				<a class="logout" href="/login/logout">로그아웃</a>
    				<?php }?>
    				<button class="close" id="btnMenuClose">메뉴 닫기</button>
    				<!-- <div class="tohana"><a href="https://www.hanacapital.co.kr" target="_blank">하나캐피탈 바로가기</a></div> -->
    			</div>
    			<ul class="list">
    				<li>
    					<div class="cate">AG회원</div>
    					<ul class="sub">
    						<li><a href="/">로그인</a></li>
    						<li><a href="/service/certify/apply">회원가입</a></li>
    						<li><a href="/service/certify/searchid">아이디 찾기</a></li>
    						<li><a href="/service/certify/searchpw">비밀번호 찾기</a></li>
    					</ul>
    				</li>
    			</ul>
    		</div>
    		<div class="gnbBack" id="divGnbBack"></div>
			<div class="contents">
				<div class="head"></div>
			