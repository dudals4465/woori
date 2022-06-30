<?php
    $count['offer'] = 0;
    $count['confirm'] = 0;
    $count['counsel'] = 0;
    $count['order'] = 0;
    $count['delivery'] = 0;
    if($request_group){
        foreach($request_group as $row){
            if($row->cState_Request=="01" || $row->cState_Request=="02" || $row->cState_Request=="03") $count['confirm'] += $row->count;
            else if($row->cState_Request=="04" || $row->cState_Request=="05" || $row->cState_Request=="06" || $row->cState_Request=="16") $count['counsel'] += $row->count;
            else if($row->cState_Request=="07" || $row->cState_Request=="08" || $row->cState_Request=="09" || $row->cState_Request=="10" || $row->cState_Request=="13" || $row->cState_Request=="14") $count['order'] += $row->count;
            else if($row->cState_Request=="11" || $row->cState_Request=="12" || $row->cState_Request=="15") $count['delivery'] += $row->count;
            else $count['offer'] += $row->count;
        }
    }
    
    $uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);
    $addUrl = "?";
    if(isset($uri_parts[1])){
        $get = explode("&",$uri_parts[1]);
        foreach($get as $val){
            if(strpos($val,"page")===false && strpos($val,"no")===false){
                $addUrl .= $val."&";
            }
        }
    }
    
    $addLink = "";
    if(isset($_GET['term']) && $_GET['term']){
        $addLink .= "?term=".$_GET['term'];
        if($_GET['term']=="self") $addLink .= "&dateS=".$_GET['dateS']."&dateE=".$_GET['dateE'];
    }
    $leaseAdd = "";
    if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"l")===false)) $leaseAdd .= "N";
    if($_SESSION['regs_Member']!="N" &&  $_SESSION['permit_Member']!="" &&  strpos($_SESSION['permit_Member'],"U")!==false) $leaseAdd .= "U";
    $menuCount = 0;
    if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"r")===false) $menuCount ++;
    if($leaseAdd) $menuCount ++;
    if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"f")===false)) $menuCount ++;
    if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"p")===false) $menuCount ++;
    
    if(isset($_GET['search']))$_GET['search'] = preg_replace("/[ #\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/i", "", $_GET['search']);
?>


<script>
$(function () {
	$(window).load(function () {
		if($.cookie("save") && $.cookie("save")!=""){
			var no = $.cookie("save");
			$.cookie("save", "", {path: "/", domain: location.host});
			$.removeCookie("save", {path: "/", domain: location.host});
			<?php if(DEVICE_TYPE=="app"){?>window.app.removeNativeCookie("save");<?php }?>
			viewSave(no);
		}
		/* if(!getCookie('fast2103')){
    		$("#framePopup h3").text(" 즉출리스트 공지안내");
    		popupStr = "<div class='alert'>▶ 현대기아 즉출리스트 공지 ◀ </div><div style='text-align: center; '><a href='/board/notice/list'>자세한 사항은 공지사항 참고</a></div>";
    		popupStr +="<div class='buttonBox' style='margin: 0;'><button onclick='closeNotice(\"fast2103\",1)'>오늘 하루 표시하지 않기</button></div>";
    		$("#framePopup .content").html(popupStr);
    		openPopupView(300,'framePopup');
    	} */
	});

	
	$( "#dateStart" ).datepicker({
		showOtherMonths: true,
      	selectOtherMonths: true,
      	showButtonPanel: true,
      	showMonthAfterYear:true,
        currentText: '오늘 날짜',
        closeText: '닫기',
        dateFormat: "yy-mm-dd",
        minDate: new Date('<?=$dateLimitSelf?>'),
        maxDate: new Date('<?=$dateE?>'),
        dayNames: [ '일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], 
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        onClose: function( selectedDate ) {    
            $("#dateEnd").datepicker( "option", "minDate", selectedDate );
        }
    });
	$( "#dateEnd" ).datepicker({
		showOtherMonths: true,
      	selectOtherMonths: true,
      	showButtonPanel: true,
      	showMonthAfterYear:true,
        currentText: '오늘 날짜',
        closeText: '닫기',
        dateFormat: "yy-mm-dd",
        minDate: new Date('<?=$dateS?>'),
        maxDate: new Date('<?=$dateToday?>'),
        dayNames: [ '일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], 
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        onClose: function( selectedDate ) {    
            $("#dateStart").datepicker( "option", "maxDate", selectedDate );
        }
    });
    
    $(document).on("click", "#btnEstmDel", function () {
        if($("#formEstimateList input[name='no[]']:checked").length==0){
            alert("삭제할 견적을 선택해 주세요.");
            return false;
        }else if(confirm("선택한 견적을 정말로 삭제하시겠습니까?")){
            var no = "";
        	$("#formEstimateList input[name='no[]']:checked").each(function (){
            	if(no) no += ",";
        		no += $(this).val();
        	});
        	$("#formEstimateDel input[name='no']").val(no);
    	}else{
        	return false;
    	}
    });
 	// 검색
    $(document).on("click", "#btnSearch", function () {
    	var word = $.trim($("#searchText").val());
    	if(word.length>0 && word.length<2){
    		alert("두 글자 이상 입력해 주세요.");
    	}else{
        	var url = "?term=<?=$_GET['term']?>";
        	if(url.indexOf("self")>0){
        		url += "&dateS="+$("#dateStart").val()+"&dateE="+$("#dateEnd").val();
        	}
        	if($("#searchGoods").val()){
            	url += "&goods="+$("#searchGoods").val();
        	}
    		if(word){
            	url += "&search="+encodeURI(word)+"&kind="+encodeURI($("#searchKind").val());
    		}
    		window.location.href = "/desk/save/<?=$idx?>"+url;
    	}
    });
    $(document).on("click", "#searchTerm button, .dateSelf button", function () {
        var term = $(this).attr("term");
        if(term=="apply" || term=="self"){
        	var sdt = new Date($("#dateStart").val());
        	var edt = new Date($("#dateEnd").val());
        	var dateDiff = Math.ceil((edt.getTime()-sdt.getTime())/(1000*3600*24));
        	if(dateDiff>183){
            	alert("6개월 이내로 기간을 줄여주세요.");
            	return false;
        	}
        	window.location.href = "/desk/save/<?=$idx?>?term=self&dateS="+$("#dateStart").val()+"&dateE="+$("#dateEnd").val()
        }else{
        	window.location.href = "/desk/save/<?=$idx?>?term="+term;
        }
    });
    $(document).on("click", "#openSearch", function () {
        if($(this).hasClass("open")){
        	$(this).removeClass("open");
        	$(".searchSave").removeClass("open")
        }else{
        	$(this).addClass("open");
        	$(".searchSave").addClass("open")
        }
    });

    
});
function viewSave(no){
	$obj = $("#list_"+no);
	if(deviceSize=="mobile"){
		if($obj.hasClass("open")){
			$obj.removeClass("open");
			$obj.find(".detail").slideUp("fast");
		}else{
			$obj.addClass("open");
			$obj.find(".detail").slideDown("fast");
		}
	}else{
		$(".listSave > ul > li").removeClass("open");
		$obj.addClass("open");
		if($("#saveView").hasClass("open")){
			var scroll = false;
		}else{
			var scroll = true;
		}
		$("#saveView").addClass("open");
		var top = $obj.offset().top-$("#saveView").offset().top+0;
		$("#saveDetail").css("margin-top",top+"px");
		$("#saveDetail .box").html($obj.find(".detail").html());
		if(scroll){
			$("html,body" ).animate({scrollTop: $obj.offset().top},"slow");
		}
	}
}
function creditChange(dat){
	var chg = JSON.parse(dat);
	var $obj = $("#formEstimateList > li.open");
	var capitalK = $obj.find(".capitalK").text();
	capitalK = capitalK.replace(")"," -> 확정 "+(number_cut(chg['rate']*100,1,'round')/100)+"%)");
	$obj.find(".capitalK").text(capitalK);
	$("#saveDetail .capitalK").text(capitalK);
	var pmtF = $obj.find(".pmtF").text();
	if(typeof(chg['pmtGrand'])!="undefined"){
		pmtF += " -> 확정 "+number_format(chg['pmtGrand']);
	}else{
		pmtF += " -> 별도안내";
	}
	$obj.find(".pmtF").text(pmtF);
	$("#saveDetail .pmtF").text(pmtF);
	// 버튼 숨김
	$obj.find(".btnEstmCredit").text("심사완료");
	$obj.find(".btnEstmCredit").addClass("gray");
	$("#saveDetail .btnEstmCredit").text("심사완료");
	$("#saveDetail .btnEstmCredit").addClass("gray");
	$obj.find(".state").text("심사완료");
}
//저장 견적 불러오기
$(document).on("click", ".btnOpenEstimate", function () {
	var no = $(this).attr("no");
	var path = $(this).attr("path");
	var state = $(this).attr("state");
	var gnb = $(this).attr("carAge");
	if(state=="00" || confirm("재견적 진행시, 견적이 변동되어 가견적 화면으로 이동합니다(재심사 필요)")){
		window.location.href = "/"+gnb+"/estimate/"+path+"?open="+no;
	}
	return false;
});
</script>

<div class="saveBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title"><a class="mypage" href="/mypage"><b><?=$_SESSION['name_Member']?></b></a></div>
			</div>
			<div class="naviBox">
    			<h2 class="title">현황 조회</h2>
    			<span class="intro">(최근 <?=($idx=="offer") ? "2주":"1개월";?> 이내 조회 가능)</span>
    			<button id="openSearch" class="search <?=(!$termNot) ? "open":""?>">상세</button>
			</div>
		</div>
		<navi>
		<ul class="menuDesk pcOff count<?=$menuCount?>">
			<?php if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"r")===false){?><li><a href="/newcar/estimate/rent">렌트견적</a></li><?php }?>
			<?php if($leaseAdd=="N"){?>
				<li><a href="/newcar/estimate/lease">리스견적</a></li>
			<?php }else if($leaseAdd=="U"){?>
				<li><a href="/usedcar/estimate/lease">중고 리스</a></li>
			<?php }else if($leaseAdd=="NU"){?>
        		<li><button class="popMenuOpen">리스견적</button>
        			<div class="slideUp">
        				<a href="/newcar/estimate/lease">신차</a><a href="/usedcar/estimate/lease">중고차</a>
        			</div>
        		</li>
        	<?php }?>
        	<?php if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"f")===false)){?><li><a href="/newcar/estimate/fince">할부견적</a></li><?php }?>
        	<?php if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"p")===false){?><li><a href="/newcar/fastship/list">선구매</a></li><?php }?>
		</ul>
		</navi>
		<div class="stepSave">
			<ul>
				<li class="<?=($idx=="offer") ? "on":""?>"><a href="/desk/save/offer<?=$addLink?>"><span class="title">가견적</span><span class="count"><?=number_format($count['offer'])?></span></a></li>
				<li class="<?=($idx=="confirm") ? "on":""?>"><a href="/desk/save/confirm<?=$addLink?>"><span class="title">견적</span><span class="count"><?=number_format($count['confirm'])?></span></a></li>
				<li class="<?=($idx=="counsel") ? "on":""?>"><a href="/desk/save/counsel<?=$addLink?>"><span class="title">심사</span><span class="count"><?=number_format($count['counsel'])?></span></a></li>
				<li class="<?=($idx=="order") ? "on":""?>"><a href="/desk/save/order<?=$addLink?>"><span class="title">발주</span><span class="count"><?=number_format($count['order'])?></span></a></li>
				<li class="<?=($idx=="delivery") ? "on":""?>"><a href="/desk/save/delivery<?=$addLink?>"><span class="title">인도</span><span class="count"><?=number_format($count['delivery'])?></span></a></li>
			</ul>
		</div>
		<div class="searchSave <?=(!$termNot) ? "open":""?>">
			<div class="tab" id="searchTerm">
				<div class="<?=($_GET['term']=="1w") ? "on":""?>"><button term="1w">1주</button></div>
				<div class="<?=($_GET['term']=="2w") ? "on":""?>"><button term="2w">2주</button></div>
				<div class="<?=($_GET['term']=="1m") ? "on":""?>"><button term="1m">1개월</button></div>
				<div class="<?=($_GET['term']=="self") ? "on":""?> self"><button term="self">직접설정</button></div>
			</div>
			<div class="dateSelf <?=($_GET['term']=="self") ? "on":""?>">
				<input type="text" name="dateS" class="dateForm" value="<?=$_GET['dateS']?>" id="dateStart"> ~ <input type="text" name="dateE" class="dateForm" value="<?=$_GET['dateE']?>" id="dateEnd"><button term="apply">적용</button>
			</div>
			<div class="word">
				<select name="goods" id="searchGoods">
					<option value="" <?=(!isset($_GET['goods']) || $_GET['goods']=="") ? "selected":""?>>전체상품</option>
					<option value="RG" <?=(isset($_GET['goods']) && $_GET['goods']=="RG") ? "selected":""?>>장기렌트</option>
					<option value="RF" <?=(isset($_GET['goods']) && $_GET['goods']=="RF") ? "selected":""?>>선구매•즉시출고</option>
					<option value="LG" <?=(isset($_GET['goods']) && $_GET['goods']=="LG") ? "selected":""?>>운용리스</option>
					<option value="LK" <?=(isset($_GET['goods']) && $_GET['goods']=="LK") ? "selected":""?>>금융리스</option>
				</select>
				<select name="kind" id="searchKind">
					<option value="customer" <?=(isset($_GET['kind']) && $_GET['kind']=="customer") ? "selected":""?>>고객</option>
					<option value="subject" <?=(isset($_GET['kind']) && $_GET['kind']=="subject") ? "selected":""?>>제목</option>
					<option value="model" <?=(isset($_GET['kind']) && $_GET['kind']=="model") ? "selected":""?>>모델</option>
					<option value="counsel" <?=(isset($_GET['kind']) && $_GET['kind']=="counsel") ? "selected":""?>>메모</option>
				</select>
				<input type="text" name="search" id="searchText" value="<?=(isset($_GET['search'])) ? $_GET['search']:""?>" placeholder="검색어 2자 이상">
				<button id="btnSearch">조회</button>
			</div>
		</div>
		
		<div class="viewSave" id="saveView">
    		<div class="listSave">
    			<ul class="list" id="formEstimateList">
    				<?php if($request_list){
    				    foreach($request_list as $row){
    				        $idxE = $row->iIdx_Estimate;
    				        $secE = substr($row->dInsert_Estimate,-2);
    				        $keyE = encodeDocu(substr($idxE,0,1).substr($idxE,-1).$idxE.$secE);
    				        $data = json_decode($row->tData_Estimate, true);
    				        if($row->cChanged_Request){
    				            $changed = json_decode($row->cChanged_Request, true);
    				        }
    				        
    				        $fno = $row->iFno_Request;
    				        if($row->cState_Request>="01" && $row->dInsert_Request){
    				            $mDates = "<span>확정견적(".substr($row->dInsert_Request,0,10).")</span>";
    				        }else{
    				            $mDates = "";
    				        }
    				        if($row->cState_Request>="07" && $row->dOrder_Request){
    				            $mDates .= " <span>발주(".$row->dOrder_Request.")</span>";
    				        }
    				        if($row->cState_Request=="12" && $row->dDelivery_Request){
    				            $mDates .= " <span>인도(".$row->dDelivery_Request.")</span>";
    				        }    				        
    				        if(isset($data['fincCfg'][0]['branchName']) && $data['fincCfg'][0]['branchName']) $mCode = "[".$data['fincCfg'][0]['branchName']."] ". $row->cCode_Request;
    				        else $mCode = $row->cCode_Request;
    				        if(isset($data['fincCfg'][0]['testride']) && $data['fincCfg'][0]['testride']){      // 시승차 추가
    				            $mCode = "시승차 ".$data['fincCfg'][0]['testride']." ".$mCode;
    				        }
    				        if(isset($data['estmData']['ucarCode'])){
    				            $carAge = "usedcar";
    				            if(!isset($data['estmData']['brand'])) $data['estmData']['brand'] = "100";
    				        }else{
    				            $carAge = "newcar";
    				        }
    				        if($data['estmData']['brand']<"200") $local = "domestic";
    				        else $local = "imported";
    				        
    				        // 연령 제한
    				        if(substr($row->cKind_Estimate,0,1)!="R" ) $ageCut = "";
    				        //else if($data['estmData']['brand']<"200" && (int)$data['estmData']['priceSum']>50000000) $ageCut = "75";
    				        //else if($data['estmData']['brand']<"200") $ageCut = "75";
    				        //else 
    				        $ageCut = "75";
    				        
    				        if($fno) $pmt = number_format($data['fincData'][$fno]['pmtGrand']);
    				        else $pmt = "";
    				        // 선택 항목
    				        if($carAge=="usedcar"){
    				            $mName = '<span class="model">';
    				            if(isset($data['estmData']['ucarNameB'])) $mName .= $data['estmData']['ucarNameB'].' ';
    				            $mName = $data['estmData']['ucarName'].' ('.substr($data['estmData']['regYM'],0,4).'년 '.substr($data['estmData']['regYM'],4,2).'월)';
    				            $mName .= '</span>';
    				        }else{
    				            $mName = '<span class="model">'.$data['estmData']['modelName'].'</span> <span class="lineup">'.$data['estmData']['lineupName'].'</span> <span class="trim">'.$data['estmData']['trimName'].'</span>';
    				            $mColor = "";
    				            if($data['estmData']['colorExt']){
    				                $mColor .= '<span class="colorExt">'.$data['estmData']['colorExtName'];
    				                //if($data['estmData']['colorExtPrice']) $mColor .= '<span class="price">('.number_format($data['estmData']['colorExtPrice']).')</span>';
    				                $mColor .= '</span>';
    				            }
    				            // 내장색상
    				            if($data['estmData']['colorInt']){
    				                $mColor .= '<span class="colorInt">'.$data['estmData']['colorIntName'];
    				                //if($data['estmData']['colorIntPrice']) $mColor .= '<span class="price">('.number_format($data['estmData']['colorIntPrice']).')</span>';
    				                $mColor .= '</span>';
    				            }
    				            if($mColor=="") $mColor = '<span>선택 없음</span>';
    				            // 옵션
    				            $mOption = "";
    				            if($data['estmData']['optionList']){
    				                $tmp = explode("\n",$data['estmData']['optionList']);
    				                foreach($tmp as $val){
    				                    $dat = explode("\t",$val);
    				                    $mOption.='<span>';
    				                    $mOption .= $dat[0];
    				                    // if($dat[1]!="0") $mOption .= '<span class="price">('.number_format($dat[1]).')</span>';
    				                    $mOption.='</span>';
    				                }
    				            }
    				            if($mOption=="") $mOption ='<span>선택 없음</span>';
    				        }
				            $mSet = "";
				            $mDelivery = "";
				            $mInsure = "";
				            $mAccessory = "";
				            $mModify = "";
				            $mShop = "";
				            $mCapital = "";
				            $mDeliveryCost = "";
				            $mDiscount = "";
				            if($carAge!="usedcar"){
    				            if($data['fincCfg'][0]['takeType']=="20") $mSet .= "직판출고";
    				            else if($data['fincCfg'][0]['takeType']=="10") $mSet .= "대리점출고";
    				            if($local=="imported"){
    				                $mShop = $data['estmData']['dealerShop'];
    				            }
				            }else{
				                $mSet .= "딜러출고";
				                if($data['estmData']['certifyYN']=="Y"){
				                    if(isset($data['estmData']['dealerShop'])) $mShop = $data['estmData']['dealerShop'];
				                    $carTag = "인증 중고차";
				                }else{
				                    $carTag = "중고차";
				                }
				            }
				            
    				        // $mName .= '<span class="price">('.number_format($data['estmData']['trimPrice']).')</span>';
    				        // 외장색상
    				       
    				        if($data['estmData']['mode']=="lease"){
    				            if($local=="domestic"){
    				                $mSet .= ", ";
    				                if(isset($data['fincCfg'][0]['payType'])){
    				                    if($data['fincCfg'][0]['payType']=="01") $mSet .= "카드결제";
    				                    else if($data['fincCfg'][0]['payType']=="02") $mSet .= "현금결제";
    				                }
    				            }
    				            $mSet .= ", ";
    				            if($data['fincCfg'][0]['regType']=="1") $mSet .= "리스사 명의";
    				            else if($data['fincCfg'][0]['regType']=="2"){
    				                $mSet .= "이용자 명의";
    				                if($data['fincCfg'][0]['useBiz']=="Y") $mSet .= " 영업차량등록";
    				            }
    				            
    				            $mCapital = "";
    				            if($data['fincCfg'][0]['regTaxIn']=="01") $mCapital .= "취/등록세 포함";
    				            else $mCapital .= "취/등록세 미포함";
    				            if($data['fincCfg'][0]['regBondIn']=="01") $mCapital .= ", 공채할인 포함";
    				            else $mCapital .= ", 공채할인 미포함";
    				            if($data['fincCfg'][0]['regExtrIn']=="01") $mCapital .= ", 기타비용 포함";
    				            else $mCapital .= ", 기타비용 미포함";
    				            if(isset($data['estmData']['takeSelf']) && $data['estmData']['takeSelf']){
    				                $mCapital .= ", 본인부담금(".number_format($data['estmData']['takeSelf']).") 제외";
    				            }
    				        }else if($data['estmData']['mode']=="rent"){
    				            $mSet .= ", ";
    				            if($data['fincCfg'][0]['buyType']=="1") $mSet .= "개인";
    				            else if($data['fincCfg'][0]['buyType']=="2") $mSet .= "개인사업자";
    				            else if($data['fincCfg'][0]['buyType']=="3") $mSet .= "법인";
    				            if(isset($data['estmData']['configInsure'])) $mInsure = $data['estmData']['configInsure'];
    				            if(isset($data['estmData']['configAccessory'])) $mAccessory = $data['estmData']['configAccessory'];
    				            if(isset($data['estmData']['configModify'])) $mModify = $data['estmData']['configModify'];
    				        }
    				        if(isset($data['estmData']['configDelivery'])) $mDelivery = $data['estmData']['configDelivery'];
    				        // 견적
    				        $mEstm = "";
    				        $mEstmD = "";
    				        $cnt = 1;
    				        // $data['estmData']['mode']=="lease"){
    				        //if($data['fincCfg'][0]['goodsKind']=="loan"){
    				        $mFee = "";
    				        //if($data['estmData']['mode']=="rent" || $data['fincCfg'][0]['goodsKind']!="loan"){
    				        //if(strpos($data['estmData']['feeCm'],"/")===false && strpos($data['estmData']['feeAg'],"/")===false){
    				        if($data['estmData']['mode']!="fince"){
    				            if($data['estmData']['feeCm'])  $mFee .= "(".$data['fincCfg'][0]['feeCmR']."%) ";
    				            $mFee .= number_format($data['estmData']['feeCm'])." / ";
    				            if($data['estmData']['feeAg'])  $mFee .= "(".$data['fincCfg'][0]['feeAgR']."%) ";
    				            $mFee .= number_format($data['estmData']['feeAg']);
    				        }else{
    				            // $mFee = $data['estmData']['feeCm']." / ".$data['estmData']['feeAg'];
    				        }
    				        //}
    				        $star = "";
    				        foreach($data['fincCfg'] as $key=>$conf){
    				            if($key!=0 && $conf['star']=="O"){
    				                $star .= $conf['star'];
    				            }
    				        }
    				        $mFeeC = "";
    				        $mFeeA = "";
    				        foreach($data['fincCfg'] as $key=>$conf){
    				            if($key!=0 && ($star=="" || $conf['star']=="O")){
    				                $eVal = $data['fincData'][$key];
    				                // 최고 표시 체크 20220607 추가 W/유모현
    				                if($data['fincCfg'][0]['buyType']=="1" && ( ($data['estmData']['mode']=="lease" && $data['fincCfg'][0]['goodsKind']=="loan") || $data['estmData']['mode']=="fince") && isset($eVal['rateMax'])){		// 개인 , 금융리스/ 할부
    				                    $maxViewCheck = true;
    				                }else{
    				                    $maxViewCheck = false;
    				                }
    				                // var_dump($eVal);
    				                if(!$fno || $key==$fno){
    				                    if($row->cChanged_Request && $key==$fno){
    				                        if(isset($changed['rate'])){
    				                            $rateChange = " -> 확정 ".(round($changed['rate']*100)/100)."%";
    				                        }
    				                        if(isset($changed['pmtGrand'])){
    				                            $pmtChange = " -> 확정 ".number_format($changed['pmtGrand']);
    				                        }else{
    				                            $pmtChange = " -> 별도안내";
    				                        }
    				                    }else{
    				                        $rateChange = "";
    				                        $pmtChange = "";
    				                    }
    				                    if($idx=="offer"){
    				                        $mEstm .= "<li fno='".$key."'><span class='no'>견적".$cnt."</span><span class='month'>".$eVal['month']."개월</span>";
    				                        if($data['estmData']['mode']!="rent"){
    				                            $mEstm .= "<span class='rate'>".(round($eVal['rate']*100)/100)."%</span>";
    				                        }
    				                        if($data['estmData']['mode']=="fince"){
    				                            
    				                        }else if($data['estmData']['mode']=="lease" && $data['fincCfg'][0]['goodsKind']=="loan"){
    				                            $mEstm .= "<span class='add'>".number_format($eVal['capital'])."</span>";
    				                            //if($mFee)  $mFee .= ", ";
    				                            //$mFee .= number_format($eVal['feeCm'])." / ".number_format($eVal['feeAg']);
    				                        }else if($eVal['km']=="00000"){
    				                            $mEstm .= "<span class='add'>제한없음</span>";
    				                        }else{
    				                            if(isset($data['fincCfg'][$key]['kmPromotion']) && $data['fincCfg'][$key]['kmPromotion']!="1") $mEstm .= "<span class='add'>".($eVal['km']/10000)."만km(프로모션)</span>";
    				                            else $mEstm .= "<span class='add'>".($eVal['km']/10000)."만km</span>";
    				                        }
    				                        // 가견적
    				                        if($maxViewCheck) $mEstm .= "<span class='pmt'>".number_format($eVal['pmtGrand'])."~".number_format($eVal['pmtGrandMax'])."</span></li>";
    				                        else $mEstm .= "<span class='pmt'>".number_format($eVal['pmtGrand'])."</span></li>";
    				                        $cnt ++;
    				                        if($data['estmData']['mode']=="fince"){
    				                            if($mFeeC==""){
    				                                $mFeeC .= "(".$data['fincCfg'][0]['feeCmR']."%)";
    				                                $mFeeA .= "(".$data['fincCfg'][0]['feeAgR']."%)";
    				                            }
    				                            $mFeeC .= " : ".number_format($eVal['feeCm']);
    				                            $mFeeA .= " : ".number_format($eVal['feeAg']);
    				                        }
    				                    }else{
    				                        if(isset($eVal['end'])) $mEstmD .= "<div class='end'>".$eVal['end']."</div>";
    				                        if($data['estmData']['mode']=="rent") $mEstmD .= "<div class='sales'>".number_format($data['estmData']['priceSum'])."</div>";
    				                        else if($data['estmData']['mode']!="fince") $mEstmD .= "<div class='capital'>".number_format($data['estmData']['capital'])."</div>";
    				                        if($data['estmData']['mode']=="lease" && $data['fincCfg'][0]['goodsKind']=="loan"){
    				                            //$mFee .= number_format($eVal['feeCm'])." / ".number_format($eVal['feeAg']);
    				                            $mEstmD .= "<div class='monH'>".$eVal['month']."개월 (";
    				                            if($eVal['monthH']) $mEstmD .= $eVal['monthH']."개월";
    				                            else $mEstmD .= "없음";
    				                            $mEstmD .= ")</div>";
    				                            if(isset($eVal['rate'])) $mEstmD .= "<div class='capitalK'>(".(round($eVal['rate']*100)/100)."%".$rateChange.") ".number_format($eVal['capital'])."</div>";
    				                            else $mEstmD .= "<div class='capitalK'>".number_format($eVal['capital'])."</div>";
    				                            $mEstmD .= "<div class='payK'>".number_format($data['estmData']['takeSelf'])." / ".number_format($eVal['deposit'])." / ".number_format($eVal['respite'])."</div>";
    				                        }else{
    				                            if($data['estmData']['mode']=="fince"){
    				                                $mEstmD .= "<div class='capitalK'>(".(round($eVal['rate']*100)/100)."%".$rateChange.") ".number_format($eVal['capital'])."</div>";
    				                                $mEstmD .= "<div class='payF'>(".$eVal['prepayR']."%) ".number_format($eVal['prepay'])."</div>";
    				                                $mFeeC .= "(".$data['fincCfg'][0]['feeCmR']."%)";
    				                                $mFeeA .= "(".$data['fincCfg'][0]['feeAgR']."%)";
    				                                $mFeeC .= " : ".number_format($eVal['feeCm']);
    				                                $mFeeA .= " : ".number_format($eVal['feeAg']);
    				                                    
    				                            }else{
    				                                $mEstmD .= "<div class='monkm'>".$eVal['month']."개월 / ";
    				                                if(isset($eVal['rate'])) $mEstmD .= (round($eVal['rate']*100)/100)."% / ";
    				                                if($eVal['km']=="00000") $mEstmD .= "제한없음";
    				                                else $mEstmD .= ($eVal['km']/10000)."만km";
    				                                if(isset($data['fincCfg'][$key]['kmPromotion']) && $data['fincCfg'][$key]['kmPromotion']!="1"){
    				                                    $mEstmD .= " (주행거리 프로모션 ".$data['fincCfg'][$key]['kmPromotionName'].")";
    				                                }
    				                                $mEstmD .= "</div>";
    				                                $mEstmD .= "<div class='payL'>".number_format($eVal['prepay'])." / ".number_format($eVal['deposit'])."</div>";
    				                                $mEstmD .= "<div class='remain'>";
    				                                if($eVal['remainR']==$eVal['remainMax']) $mEstmD .= "최고";
    				                                $mEstmD .= "(".$eVal['remainR']."%) ".number_format($eVal['remain'])."</div>";
    				                                if($data['estmData']['mode']=="rent" && isset($eVal['care'])) $mEstmD .= "<div class='care'>".$eVal['care']."</div>";
    				                            }
    				                        }
    				                        $mFeeAd = "";
    				                        if(isset($data['fincCfg'][$key]['feeAgAdd']) && $data['fincCfg'][$key]['feeAgAdd']){
    				                            if($mFeeAd) $mFeeAd .= ", ";
    				                            $mFeeAd .= " 추가수수료 (".$data['fincCfg'][$key]['feeAgAddR']."%) ".number_format($data['fincCfg'][$key]['feeAgAdd']);
    				                        }
    				                        if(isset($data['fincCfg'][$key]['adCmfe']) && $data['fincCfg'][$key]['adCmfe']){
    				                            if($mFeeAd) $mFeeAd .= ", ";
    				                            if($data['fincCfg'][$key]['adCmfe']=="01") $mFeeAd .= " AG 지급";
    				                            else if($data['fincCfg'][$key]['adCmfe']=="02") $mFeeAd .= " CM 지급";
    				                        }
    				                        if(isset($data['fincCfg'][$key]['dcSppt']) && $data['fincCfg'][$key]['dcSppt']){
    				                            if($mFeeAd) $mFeeAd .= ", ";
    				                            if($data['fincCfg'][$key]['dcSppt']=="01") $mFeeAd .= " 할인지원금 지급";
    				                            else if($data['fincCfg'][$key]['dcSppt']=="02") $mFeeAd .= " 할인지원금 미지급";
    				                        }
    				                        if($mFeeAd) $mFee .= "<br>".$mFeeAd;
    				                        
    				                        if($maxViewCheck && $pmtChange=="")  $mEstmD .= "<div class='pmtF'>".number_format($eVal['pmtGrand'])."~".number_format($eVal['pmtGrandMax'])."</div>";
    				                        else $mEstmD .= "<div class='pmtF'>".number_format($eVal['pmtGrand']).$pmtChange."</div>";
    				                    }
    				                }
    				            }
    				        }
    				        if($data['estmData']['mode']=="fince"){
    				            $mFee .= $mFeeC." / ".$mFeeA.$mFee;
    				        }
    				        $state = $request_state[$row->cState_Request];
    				        /*
    				        if($row->cState_Request=="04" || $row->cState_Request=="05"){
    				            $stateReq = $request_state[$row->cState_Request]." - ".$request_stateH[$row->cStateReq_Request];
    				            if($row->cState_Request=="04"){
    				                if($row->cStateReq_Request=="01") $state = "상담완료";
    				                else if($row->cStateReq_Request=="03") $state = "부결";
    				                else $state = "상담중";
    				                $stateReq = "상담중 - ".$request_stateH[$row->cStateReq_Request];
    				            }else if($row->cState_Request=="05"){
    				                if($row->cStateReq_Request=="01") $state = "상담완료";
    				                else if($row->cStateReq_Request=="03") $state = "부결";
    				                else $state = "상담완료";
    				                $stateReq = "상담중 - ".$request_stateH[$row->cStateReq_Request];
    				            }
    				        }else{
    				            $stateReq = "";
    				        }
    				        */
    				        $stateReq = "";
    				        
    				        $fastKd = "";
    				        if($row->cKind_Estimate=="RF"){
    				            $fastKd = $data['estmData']['fastKind'];
    				        }
    				        
    				?>
    				<li class="" id="list_<?=$row->iNo_Estimate?>" key="<?=$keyE?>" goods="<?=$row->cKind_Estimate?>" fno="<?=$row->iFno_Request?>" buy="<?=$data['fincCfg'][0]['buyType']?>" hno="<?=$row->cCode_Request?>" ageCut="<?=$ageCut?>">
    					<div class="box"><a href="javascript:viewSave(<?=$row->iNo_Estimate?>)">
    						<span class="customer"><?=$row->cCustomer_Estimate?></span>
    						<span class="kind"><span><?=$request_kind[$row->cKind_Estimate.$fastKd]?> </span> <?=($carAge=="usedcar") ? "(".$carTag.")":""?></span> 
    						<span class="pmt"><?=$pmt?></span>
    						<?php if($carAge=="usedcar"){?>
    							<span class="model"><?=(isset($data['estmData']['ucarNameB'])) ? $data['estmData']['ucarNameB']:"" ?> <?=$data['estmData']['ucarName']?></span>
    						<?php }else{?>
    							<span class="model"><?=$data['estmData']['brandName']?> <?=$data['estmData']['modelName']?></span>
    						<?php }?>
    						<span class="date"><?=substr($row->dInsert_Estimate,0,10)?></span>
    						<span class="subj <?=(DEVICE_SIZE!="mobile" && ($row->cState_Request=="00" || $row->cState_Request=="01")) ? "del":"";?>"> <?=$row->cSubject_Estimate?></span>
    						<span class="state"><?=$state?></span>
    					</a>
    					<?php if(DEVICE_SIZE!="mobile" && ($row->cState_Request=="00" || $row->cState_Request=="01")){?><label><input type="checkbox" name="no[]" value="<?=$row->iNo_Estimate?>"><span>&nbsp;</span></label><?php }?>
    					</div>
    					<div class="detail detailBox">
    						<?php if($mDates){?><div class="dates"><?=$mDates?></div><?php }?>
    						<?php if($mCode){?><div class="hanain"><?=$mCode?></div><?php }?>
    						<div class="model"><?=$mName?></div>
    						<?php if($carAge!="usedcar"){?>
        						<div class="color"><?=$mColor?></div>
        						<div class="option"><?=$mOption?></div>
    						<?php }?>
    						<?php if($mEstm){?><ul class="estm"><?=$mEstm?></ul><?php }?>
    						<?php if($mEstmD){?><?=$mEstmD?><?php }?>
    						<?php if($mDelivery){?><div class="delivery"><?=$mDelivery?></div><?php }?>
    						<?php if($mDeliveryCost){?><div class="deliveryCost"><?=$mDeliveryCost?></div><?php }?>
    						<?php if($mSet){?><div class="set"><?=$mSet?></div><?php }?>
    						<?php if($mDiscount){?><div class="discount"><?=$mDiscount?></div><?php }?>
    						<?php if($mInsure){?><div class="insure"><?=$mInsure?></div><?php }?>
    						<?php if($mShop){?><div class="shop"><?=$mShop?></div><?php }?>
    						<?php if($mAccessory){?><div class="accessory"><?=$mAccessory?></div><?php }?>
    						<?php if($mModify){?><div class="modify"><?=$mModify?></div><?php }?>
    						<?php if($mCapital){?><div class="capitalSel"><?=$mCapital?></div><?php }?>
    						<?php if($stateReq){?><div class="stateH"><?=$stateReq?></div><?php }?>
    						<div class="fee"><?=$mFee?></div>
    						<div class="memo"><span><?=($row->tCounsel_Estimate) ? nl2br($row->tCounsel_Estimate):"&nbsp;"?></span><button class="btnEstmMemo"  no="<?=$row->iNo_Estimate?>">기록</button></div>
    						<div class="buttonBox" no="<?=$row->iNo_Estimate?>">
    							<a class="<?=($row->cState_Request>"03") ? "wide":"";?>" href="<?=URL?>D/E/<?=$keyE?><?=(DEVICE_TYPE=="app") ? "?webview=layer":""?>" target="_blank" class="gray">견적서 보기</a>
    							<?php if(substr($row->cKind_Estimate,0,1)=="L" || substr($row->cKind_Estimate,0,1)=="F"){?><a class="btnEstmOffer " href="<?=URL_OFFER?>?mbrIdnId=<?=$_SESSION['id_Member']?>&estdKey=<?=$keyE?><?=(DEVICE_TYPE=="app") ? "?webview=layer":""?>" target="_blank">견적서 발송</a><?php }?>
                        		<?php if($row->cState_Request=="00" && substr($row->dInsert_Estimate,0,7)==date("Y-m")){?>
                        			<button class="btnEstmConfirm " page="save">견적 확정</button>
                        		<?php }else if($row->cState_Request=="00"){?>
                        			<button class="gray" onclick="alert('당월 견적만 확정할 수 있습니다.')">견적 확정</button>
                        		<?php }else if($row->cState_Request=="01"){?>
                        			<button class="btnEstmAgree " fno="<?=$row->iFno_Request?>" page="save">신용조회요청</button>
                        		<?php }else if($row->cState_Request=="02"){?>
                        			<button class="btnEstmAgree resend" fno="<?=$row->iFno_Request?>" page="save">신용조회 재요청</button>
                        		<?php }else if($row->cState_Request=="03"){?>
                        			<button class="btnEstmCredit " fno="<?=$row->iFno_Request?>" hno="<?=$row->cCode_Request?>">심사신청</button>
                        		<?php }else if(substr($row->cKind_Estimate,0,1)=="R" && ($row->cState_Request=="04" || $row->cState_Request=="16")){?>
                        			<button class="btnEstmOrder apply" fno="<?=$row->iFno_Request?>" hno="<?=$row->cCode_Request?>">발주요청</button>
                        		<?php }else if($row->cState_Request=="07"){?>
                        			<!-- <button class="btnEstmCancle" fno="<?=$row->iFno_Request?>" hno="<?=$row->cCode_Request?>">발주취소요청</button> -->
                        		<?php }else if($row->cState_Request=="14"){?>
                        			<button class="btnEstmDelivery" fno="<?=$row->iFno_Request?>" hno="<?=$row->cCode_Request?>">인도요청</button>
                        		<?php }?>
                        		<?php if(($carAge=="usedcar" ||  isset($salesList['trim'][$data['estmData']['trim']]) ) && ($row->cState_Request=="00" || $row->cState_Request=="01" || $row->cState_Request=="02" || $row->cState_Request=="03" || $row->cState_Request=="04" || $row->cState_Request=="05" || $row->cState_Request=="16")){?>
                        			<button class="btnOpenEstimate" no="<?=$row->iNo_Estimate?>" path="<?=$data['estmData']['mode']?>" state="<?=$row->cState_Request?>" carAge="<?=($carAge=="usedcar") ? "usedcar":"newcar"?>">재 견적</button>
                        		<?php }?>
    						</div>
    					</div>
    				</li>
    				<?php }}else{?>
    				<li class="blank">조회결과가 없습니다.</li>
    				<?php }?>
    			</ul>
    			<?php if(DEVICE_SIZE!="mobile" && ($idx=="offer" || $idx=="confirm")){?>
    			<form id="formEstimateDel" action="/mypage/action/save" method="POST">
            		<input type="hidden" name="work" value="del">
            		<input type="hidden" name="no" value="">
            		<button class="del" id="btnEstmDel">선택항목 삭제</button><?php }?>
        		</form>
    			<?php if($page_list){?><div class="pageBox" id="pageButton" link="/desk/save/<?=$idx?><?=$addUrl?><?=(isset($_GET['search'])) ? "search=".urlencode($_GET['search'])."&":""?>"><?=$page_list?></div><?php }?>
    		</div>
    		<div class="detailSave" id="saveDetail">
    			<div class="box detailBox"></div>
    		</div>
		</div>
		
	</div>
	
	<div id="apiView" class="off">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>

</div>