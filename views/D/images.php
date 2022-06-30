<?php
if($val['kind']=="price") $photoKind = "가격표";
else if($val['kind']=="catalog")  $photoKind= "카탈로그";

$modelName = $val['modelName'];
$ogTitle = $modelName." ".$photoKind;
$ogImg = IMG_PATH.$val['modelImg'];

$nam = explode("_",$val['name']);
$nameF = $nam[0];
$dat = explode("-",$val['name']);
$dat2 = substr($dat[count($dat)-1],0,-4);
$dateF = substr($dat2,0,4)."년";
if(substr($dat2,4,2)) $dateF .= " ".number_format(substr($dat2,4,2))."월";
if(substr($dat2,6,2)) $dateF .= " ".number_format(substr($dat2,6,2))."일";
$width = round($val['thumbW']*2/3);
$widthT = $val['count'] * ($width+10);

if($page) $imgMain = IMG_PATH.$val['kind'].'/'.$val['dir'].'/'.$idx.'/'.$page.'.jpg';
else $imgMain = IMG_PATH.$val['kind'].'/'.$val['dir'].'/'.$idx.'/1.jpg';

$ogDesc=$nameF." (".$dateF." 기준)";

$faviconImg = "/images/favicon-hana";
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title><?=$ogTitle?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="<?=$faviconImg?>.ico">
	<link rel="icon" href="<?=$faviconImg?>-152.png" sizes="152x152">
    <link rel="canonical" href="<?=$url?>">
    <meta name="description" content="<?=$ogDesc?>">
    <meta id="metaTitle" property="og:title" content="<?=$ogTitle?>">
    <meta id="metaUrl" property="og:url" content="<?=$url?>">
    <meta id="metaImage" property="og:image" content="<?=$ogImg?>">
    <meta id="metaDesc" property="og:description" content="<?=$ogDesc?>">
	<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css">
	<link href="/styles/photo-1.0.6.css" rel="stylesheet">
	<?php if(DEVICE_PATH=="pc"){?>
	<style>
	   .thumb .full img {max-width: 1900px;}
	   .catalog img {max-width: 1900px;}
	</style>
	<?php }?>
    <script type="text/javascript" src="/scripts/jquery-2.1.4.min.js"></script>
	<script>
		$(document).on("click", "button.list", function () {			
			$(".thumb").removeClass("off");
			$(".main").removeClass("open");
			if($(window).height()< $(".thumb").height()){
				var top = $(".thumb img.on").offset().top + $(window).height() / 2 - $(window).height() +50 ;
				$('html, body').animate({scrollTop : top}, 400);
			}
		});
		$(document).on("click", ".thumb .list img", function () {
			var url = $(this).attr("src").replace('-','');
			$(".thumb img").removeClass("on");
			$(this).addClass("on");
			$(".thumb").addClass("off");
			$(".main").addClass("open");
			var num = parseInt($(this).attr("num"));
			var len = $(".thumb img").length;
			$(".main button.prev").removeClass("off");
			$(".main button.next").removeClass("off");
			if(num==1) $(".main button.prev").addClass("off");
			else if(num==len) $(".main button.next").addClass("off");
			$("#photoImage").attr("src",url);
			//$(".main").css({'background':'url('+url+')', 'background-repeat' : 'no-repeat', 'background-position':'center center', 'background-size': 'contain'}); 
		});
		$(document).on("click", ".main button.prev,.main button.next", function () {
			var kind = $(this).attr("class");
			var num = parseInt($(".thumb img.on").attr("num"));
			var len = $(".thumb img").length;
			if(kind=="prev") num --;
			else num ++;
			if(num>0 && num<=len){
				$(".thumb img").removeClass("on");
				$(".thumb img[num='"+num+"']").addClass("on");
				var url = $(".thumb img[num='"+num+"']").attr("src").replace('-','');
				$("#photoImage").attr("src",url);
				//$(".main").css({'background':'url('+url+')', 'background-repeat' : 'no-repeat', 'background-position':'center center', 'background-size': 'contain'});
				$(".main button.prev").removeClass("off");
				$(".main button.next").removeClass("off");
				if(num==1 || num==len) $(this).addClass("off");
			}
		});
	</script>
</head>
<body onload="window.focus();">
	<div id="photoThumb" class="thumb <?=($page) ? "off":""?>">
		<div class="top">
			<div class="title">
				<h2><?=$modelName?> <span class="kind"><?=$photoKind?></span></h2>
				<h3><?=$nameF?> <span>(<?=$dateF?> 기준)</span></h3>
			</div>
		</div>
		<div class="<?=($val['kind']=="catalog") ? "list":"full";?>">
            <?php 
                if($val['kind']=="catalog") $imgType = "-";
                else $imgType = "";
                for($i=1;$i<=$val['count'];$i++){
                    if($page==$i) $cssOn = "on";
                    else $cssOn = "";
                    if($val['kind']=="catalog") echo '<img src="'.IMG_PATH.$val['kind'].'/'.$val['dir'].'/'.$idx.'/-'.$i.'.jpg" class="'.$cssOn.'" style="width:'.$width.'px;" num="'.$i.'">';
                    else echo '<img src="'.IMG_PATH.$val['kind'].'/'.$val['dir'].'/'.$idx.'/'.$i.'.jpg" class="'.$cssOn.'">';
            }?>
		</div>
	</div>
	<?php if($val['kind']=="catalog"){?>
	<div id="photoMain" class="main <?=($page) ? "open":""?>">
		<div class="title ttl"><?=$modelName?></div>
		<div class="btns">
			<button class="list">목록</button>
		</div>
		<button class="prev <?if($page==1) echo "off";?>">이전</button>
		<button class="next <?if($page==$val['count']) echo "off";?>">다음</button>
		<div class="catalog"><img src="<?=$imgMain?>" id="photoImage"></div>
	</div>
	<?php }?>
</body>
</html>