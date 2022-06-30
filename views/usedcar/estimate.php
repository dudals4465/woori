<?php 
// $compBtn = '<button class="del btnLoanDel">삭제</button> <button class="round btnLoanCopy">비교추가</button>';
$compBtn = "";
$pageCut = false;
if($goods=="rent" && date("Y-m-d H:i:s")>"2021-12-30 06:15:00" && date("Y-m-d H:i:s")<"2021-12-31 06:30:00"){
    $pageCut = true;
}

?>
<style>
    .info.depositType { display: none; } /* 보증보험증권 숨김 처리 */
</style>
<script>

pageCut = <?=($pageCut) ? "true":"false"?>;

fincNo[estmNow] = 4;
fincNow[estmNow] = 1;

token = "<?=$_SESSION['token']?>";

estmStart = new Array();
estmStart['mode'] = "blend";
estmStart['trim'] = "<?=(isset($_GET['trim']))? $_GET['trim']: "";?>";
estmStart['option'] = "<?=(isset($_GET['option']))? $_GET['option']: "";?>";
estmStart['code'] = "<?=(isset($_GET['code']))? $_GET['code']: "";?>";
estmStart['open'] = "<?=(isset($_GET['open']))? $_GET['open']: "";?>";
estmStart['fastship'] = "<?=(isset($_GET['fastship']))? $_GET['fastship']: "";?>";
estmStart['vin'] = "<?=(isset($_GET['vin']))? $_GET['vin']: "";?>";

/* 초기 설정 */
defaultCfg = new Array();
defaultCfg['accountBank'] = "하나은행";		// 계좌
defaultCfg['accountNum'] = "<?=$_SESSION['branch_Account']?>";		// 계좌
defaultCfg['accountName'] = "하나캐피탈(주)";		// 계좌
<?php if(isset($_SESSION['account_List'])){?>
defaultCfg['accountList'] = "<?=$_SESSION['account_List']?>";		// 계좌 목록
<?php }?>
defaultCfg['branchShop'] = "<?=$_SESSION['branch_Member']?>";		// 취급지점 
defaultCfg['branchName'] = "<?=(isset($_SESSION['branch_Name'])) ? $_SESSION['branch_Name']:""?>";		// 취급지점 명 

defaultCfg['takeType'] = "10";		// 출고(대리점)
defaultCfg['buyType'] = "1";		// 구입(개인)
defaultCfg['payType'] = "02";		// 결제방식	중고차 카드 불가, 현금만..
defaultCfg['careType'] = "01";		// 정비(Self)
defaultCfg['depositType'] = "cash";		// 보증금 납부/보험증권
defaultCfg['insureAge'] = "04";	// 운전연령(26세이상)
defaultCfg['insureObj'] = "04";		// 대물한도(1억원)
defaultCfg['insureCar'] = "23";		// 자손(1억)
defaultCfg['insureSelf'] = "02";		// 면책금(30만원)
defaultCfg['importSelf'] = "06";	// 수입차 면책금(5~50만원)
defaultCfg['insureEmpYn'] = "N";	// 임직원한정특약(미가입)
defaultCfg['navigation'] = "01";		// 내비게이션(없음)
defaultCfg['blackBox'] = "01";		// 블랙박스(없음)
defaultCfg['sdrrTinting'] = "01";	// 측후면썬팅(없음)
defaultCfg['frtTinting'] = "01";		// 전면썬팅(없음)

defaultCfg['feeAgR'] = "<?=(isset($memCfg['feeAgR'])) ? $memCfg['feeAgR']:"0"?>";		// AG 수수료		▶설정	  
defaultCfg['feeCmR'] = "<?=(isset($memCfg['feeCmR'])) ? $memCfg['feeCmR']:"0"?>";		// CM 수수료		▶설정		
defaultCfg['feeView'] = "<?=(isset($memCfg['feeView'])) ? $memCfg['feeView']:"Y"?>";		// CM 수수료		▶설정	   
defaultCfg['typeAg'] = "<?=(isset($_SESSION['company_Type'])) ? $_SESSION['company_Type']:""?>";

defaultCfg['cardView'] = "<?=(isset($memCfg['cardView'])) ? $memCfg['cardView']:"Y"?>";		// AG명홤 표시		▶설정	   

// defaultCfg['feeDcR'] = 0;		// 제휴사 수수료	
defaultCfg['deliveryType'] = "<?=(isset($_COOKIE['start']) && strpos($_COOKIE['start'],"fastship")!==false && (strpos($_COOKIE['start'],"model\t10534")!==false || strpos($_COOKIE['start'],"delivery\t0")===false)) ? "03":"01"?>";		// 탁송방법 , 선구매 중 GV70/탁송료 있으면 복합으로
defaultCfg['deliverySido'] = "001";		// 도착지
defaultCfg['remainType'] = "N";		// 할부형 Y
defaultCfg['regType'] = "<?=($goods=="fince")?"2":"1";?>";		// 리스사 등록
defaultCfg['useBiz'] = "N";		// 영업용 목적
defaultCfg['cartaxAdd'] = "N";		// 자동차세 불포함
defaultCfg['insureAdd'] = "N";		// 보험료 불포함
defaultCfg['careAdd'] = "N";		// 스마트케어 불포함
defaultCfg['regTaxIn'] = "<?=($goods=="fince")?"02":"01";?>";		// 취득세 포함
defaultCfg['regBondIn'] = "<?=($goods=="fince")?"02":"02";?>";		// 공채할인, 불포함 기본으로 변경
defaultCfg['regExtrIn'] = "<?=($goods=="fince")?"02":"02";?>";		// 부대비용		// 리스도 별도
defaultCfg['deliveryIn'] = "<?=($goods=="fince")?"02":"02";?>";		// 수입차 탁송료	// 리스도 별도로
defaultCfg['takeSido'] = "<?=($goods=="fince")?"SU":"BS";?>";		// 등록지역 부산
defaultCfg['takeSidoName'] = "<?=($goods=="fince")?"서울":"부산";?>";		// 등록지역 부산
defaultCfg['goodsKind'] = "<?=($goods=="fince")?"loan":$goods;?>";		// 운용리스 기본

defaultCfg['certifyYN'] = "N";	// 인증중고차 여부
defaultCfg['regY'] = "";
defaultCfg['regM'] = "";
defaultCfg['regFree'] = "N";	// 경차 S, 하이브리드 H, 전기/수소차 E, 해당없음 N  취득세 감면 조항

defaultCfg['bondCut7'] = "13";		// 7년 채권
defaultCfg['bondCut5'] = "9.2";		// 5년 채권
defaultCfg['bondCut'] = "0";		// 채권 할인액
defaultCfg['takeExtra'] = "0";		// 등록대행료
defaultCfg['takeExtraMax'] = "80000";		// 등록대행료 제한
defaultCfg['takeSelf'] = "0";		// 본인부담금

defaultCfg['agFeeMax'] = "0";		// AG 수수료 제한
defaultCfg['cmFeeMax'] = "0";		// CM 수수료 제한
defaultCfg['sumMaxA'] = "3";		// 500만 이하 수수료
defaultCfg['sumMaxB'] = "2.25";		// 500만 초과 수수료
defaultCfg['sumMax'] = "2.25";		// 500만 초과 수수료
defaultCfg['istmFeeDsR'] = "0.7";	// 할부 제휴선 수수료율 (임시 사용)			fincConfig[estmNow][0]['goodsKind']  istm 인 경우  값 없으면 넘어온 값 사용
defaultCfg['minCap'] = "10000000";		// 최소할부원금 2천만원 -> 1천만원 2021-10-17

defaultCfg['preSumMax'] = "100";		// 선수 전체 제한
<?php if($goods=="lease"){?>
defaultCfg['endType'] = "0006";		// 만기선택(선택형)
defaultCfg['remainMin'] = "12:45,24:35,36:25,48:15,60:10";		// 잔가 최저 선택 제한 (리스)
<?php }else{?>
defaultCfg['endType'] = "0008";		// 만기선택(선택형)
defaultCfg['remainMin'] = "12:45,24:20,36:15,48:10,60:10";		// 잔가 최저 선택 제한 (렌트)
<?php }?>

defaultCfg['km'] = "<?=(isset($memCfg['km'])) ? $memCfg['km']:"20000"?>";		// 약정거리			▶설정
defaultCfg['remain'] = "100";		// 잔가율
defaultCfg['month1'] = "<?=(isset($memCfg['month1'])) ? $memCfg['month1']:"36"?>";
defaultCfg['month2'] = "<?=(isset($memCfg['month2'])) ? $memCfg['month2']:"48"?>";
defaultCfg['month3'] = "<?=(isset($memCfg['month3'])) ? $memCfg['month3']:"60"?>";
defaultCfg['deposit1'] = "<?=(isset($memCfg['deposit1'])) ? $memCfg['deposit1']:"0"?>";
defaultCfg['deposit2'] = "<?=(isset($memCfg['deposit2'])) ? $memCfg['deposit2']:"0"?>";
defaultCfg['deposit3'] = "<?=(isset($memCfg['deposit3'])) ? $memCfg['deposit3']:"0"?>";
defaultCfg['prepay1'] = "<?=(isset($memCfg['prepay1'])) ? $memCfg['prepay1']:"0"?>";
defaultCfg['prepay2'] = "<?=(isset($memCfg['prepay2'])) ? $memCfg['prepay2']:"0"?>";
defaultCfg['prepay3'] = "<?=(isset($memCfg['prepay3'])) ? $memCfg['prepay3']:"0"?>";
defaultCfg['capital'] = "";

defaultCfg['guideRent'] = "<b style='color: #ed1652'>ㅇ 상기 견적은 차량가격의 변동 및 렌트조건에 따라 변경될 수 있으며, 렌트계약 체결 시 확정됩니다. (견적유효기간은 작성일로부터 14일 이내)</b><br>ㅇ 상기 견적에 언급되지 않은 유지관리서비스 항목과 발생비용은 고객 부담조건입니다.<br>ㅇ 차량 반납시 주행거리 및 차량상태에 따라 감가 금액이 발생할 수 있습니다.";
defaultCfg['guideLease'] = "ㅇ 상기 견적은 차량가격 변동 및 리스조건에 따라 변경될 수 있으며, 리스계약 체결 시 확정됩니다.<br>ㅇ 차량 반납시 주행거리 및 차량상태에 따라 감가 금액이 발생할 수 있습니다.<br>ㅇ 중도해지 및 승계시 수수료와 부대비용이 발생합니다. <br>ㅇ 대출 진행시 인지대 비용 5,000원이 별도 발생합니다.";

defaultCfg['sInfo'] = "<?=$_SESSION['name_Member']."\t".$_SESSION['phone_Member']."\t".$_SESSION['company_Member'];?>";

priceSelf  = true;	// 가격 수정 입력 on off  , 적용할 경우 true;

/*
defaultCfg['etcAccessorie'] = "";	// 추가용품(없음)	명칭 미정
defaultCfg['etcAccessorieCost'] = 0;	// 추가용품(가격)	명칭 미정
defaultCfg['modify'] = "";	// 특장개조	명칭 미정
defaultCfg['modifyCost'] = 0;	// 특장개조(가격)	명칭 미정
$data['Message']['korea']['agFeeMax'] = "0";
$data['Message']['korea']['cmFeeMax'] = "9";
$data['Message']['korea']['agcmFeeMax'] = "12";
*/
fincConfig[estmNow][1]['config'] = "";
fincConfig[estmNow][1]['goods'] = "<?=$goods?>";
fincConfig[estmNow][2]['config'] = "";
fincConfig[estmNow][2]['goods'] = "<?=$goods?>";
fincConfig[estmNow][3]['config'] = "";
fincConfig[estmNow][3]['goods'] = "<?=$goods?>";


// 아래 두가지 통일 예정
estmMode = "<?=$goods?>";
estmStart["setting"] = "blend";

$(window).load(function () {
	// 설정 불러오기
	getGoodsConfig();
	getDefaultConfig();
	if(typeof(defaultCfg['accountList'])!="undefined" && defaultCfg['accountList']){
		branchList = decodeData(defaultCfg['accountList']);
        <?php if(isset($memCfg['branch']) && $memCfg['branch'] && $memCfg['branch']!=$_SESSION['branch_Member']){?>
        var cfgBranch = "<?=$memCfg['branch']?>";
		if(typeof(branchList[cfgBranch])!="undefined"){
			defaultCfg['branchShop'] = cfgBranch;
    		defaultCfg['branchName'] = branchList[cfgBranch]['dptNm'];
			defaultCfg['accountNum'] = branchList[cfgBranch]['vaccNo'];
		}
		<?php }?>
	}
	
	<?php if($goods=="lease" && !$testride){?>
   if(!getCookie('lease2205')){
		$("#framePopup h3").text("모바일 견적 손님제공 절차안내");
		popupStr = "<div class='alert'>견적서 제공행위 변경 절차에 따라 <br>손님제공 프로세스를 안내 드립니다.</div><div style='text-align: left; '>";
		popupStr += "1. 고객 정보(이름,연락처) 기재 후  sms  발송<br><br>";
		popupStr += "2. 고객  sms  수신 시 <br>&nbsp;  고지의무 확인 및 적합성 확인절차 진행<br>&nbsp;   (만 연령 20세 이상, 신용점수 400점 이상 진행가능)<br><br>";
		popupStr += "3. 견적산출은 차량평가 절차 완료된 차량에 한해 가능합니다. <br>※ 제휴 인증중고차 제외<br><br>";
		popupStr += "4. 위 내용 수행 완료시 견적제공";
		popupStr +="</div>";
		popupStr +="<div class='buttonBox' style='margin: 0;'><button onclick='closeNotice(\"lease2205\",1)'>오늘 하루 표시하지 않기</button></div>";
		$("#framePopup .content").html(popupStr);
		openPopupView(360,'framePopup');
	}
	<?php }?>
	if(pageCut){
		openPageCutMsg();		
	}else if(estmStart['open'] && estmStart['open']!=""){
		var open = estmStart['open'];
		$.cookie("open", "", {path: "/", domain: location.host});
		$.removeCookie("open", {path: "/", domain: location.host});
		<?php if(DEVICE_TYPE=="app"){?>window.app.removeNativeCookie("open");<?php }?>
		openEstimateU(open);
	}else 	if($.cookie("start") && $.cookie("start")!=""){
		var start = $.cookie("start");
		$.cookie("start", "", {path: "/", domain: location.host});
		$.removeCookie("start", {path: "/", domain: location.host});
		<?php if(DEVICE_TYPE=="app"){?>window.app.removeNativeCookie("start");<?php }?>
		startEstimate(start);
	}
	if(deviceType=="app"){
		window.location.href = "/newcar/app/<?=$goods?>?webview=right";
	}
});

$(document).on("click", ".selbar[kind='pageCut'] > button", function () {
	openPageCutMsg();
});
function openPageCutMsg(){
	if(estmMode=='rent'){
		$("#framePopup h3").text("서비스 제공 중지 안내");
    	popupStr = "<div class='alert'>아래와 같이 서비스 제공이 중지되오니 양해 바랍니다.</div><div style='text-align: left; '>";
    	popupStr += "기간 : 12월 31일 오후 7시 ~ 1월 3일 오전 9시<br>";
    	popupStr += "범위 : 렌트 견적<br>";
    	popupStr += "사유 : 서비스 업데이트<br>";
    	popupStr +="</div>";
    	$("#framePopup .content").html(popupStr);
    	openPopupView(400,'framePopup');
	}
}


</script>
<style>
    /* 당겨서 새로고침 방지 */
    body{ overscroll-behavior: none; }
</style>

<main>
<section>
<div class="estmBox estimate" id="estmBox">
	<div class="frame">
		<div class="estmMain">
			<div class="headBox">
				<div class="naviBox">
        			<h2 class="mobOff"><?=$titleGnb?></h2>
    				<ul class="button">
    					<li><button id="estmBtnConfig" class="config">설정</button></li>
    				</ul>
    			</div>
			</div>
			<div class="estmBody" id="estmBody">	
				<div class="estmCell on" estmNo="1" saveNo="" openNo="">
            		<div class="estmInfo estmRslt_info"></div>
					<div class="estmUnit"  fincLen="3" fincTab="" fincDoc="">
					
    					<div class="boxA">
    						<div class="boxA2 comnCell">
    						<?php if($goods=="lease"){?>
    							<div class="unitD">
    								<div class="top">
        								<div class="checkbox" style="font-weight: bold;">
        									<h4 style="display: inline-block;">차량 선택</h4>
	                						<label><input type="radio" name="certifyYN" value="N" checked><span>일반 중고차</span></label>
	                						<label><input type="radio" name="certifyYN" value="Y"><span>인증 중고차</span></label>
        								</div>
        							</div>
    								<div class="cont">
                						<div class="selsub" kind="regYMSel" code="" >
                    						<button><span class="title">등록년월</span><span class="estmRslt_regYM"><span class="blank">최초등록 년월을 선택해 주세요.</span></span></button>
                    						<div class="list">
                    							<ul class="ymList regY" etc="regY">
                    								<?php for($i=date("Y");$i>=date("Y")-10;$i--){?>
                    								<li regY="<?=$i?>"><button><?=$i?>년</button></li>
                    								<?php }?>
                    							</ul>
                    							<ul class="ymList regM" etc="regM">
                    								<?php for($i=1;$i<=12;$i++){?>
                    								<li regM="<?=($i<10) ? "0".$i:$i?>"><button><?=$i?>월</button></li>
                    								<?php }?>
                    							</ul>
                    							<button class="selup toup">접기</button>
											</div>
										</div>
										<div class="databar">
            								<span class="title">차량검색</span>
	                						<div class="searchbox">
	                							<input type="text" name="carName" value="">
	                							<button id="btnCarnameSearch">조회</button>
        									</div>
                						</div>
                						<div class="selsub" kind="carListSel" code="not" >
                    						<button><span class="title">차량선택</span><span class="estmRslt_ucarName"><span class="blank">검색하신 후 선택하세요.</span></span></button>
                    						<div class="list">
                    							<ul class="carListSel"></ul>
                    							<button class="selup toup">접기</button>
											</div>
										</div>
    								</div>
    								
    								<div class="grand">
                        				<div class="total"><span class="name">판매가격</span><span class="price ucar"><input type="text" name="ucarPrice" value="" class="estmRslt_ucarPrice numF"> <span class="unit">원</span></span></div>
                        			</div>
    							</div>
    							<div class="unitD">
    								<div class="cont">
    									<div class="databar">
            								<span class="title">상품</span>
	                						<div class="checkbox">
	                							<label><input type="radio" name="goodsKind" value="lease" checked><span>운용리스</span></label>
	                							<label><input type="radio" name="goodsKind" value="loan"><span>금융리스</span></label>
        									</div>
                						</div>
										<!-- 20220607 W/유모현 -->
										<div class="databar buyType">
            								<span class="title">유형</span>
	                						<div class="checkbox buyTypeCheck">
	                							<label style="cursor: pointer"><input type="radio" name="buyType" value="1" checked><span>개인</span></label>
	                							<label style="cursor: pointer"><input type="radio" name="buyType" value="2"><span>개인사업자</span></label>
        										<label style="cursor: pointer"><input type="radio" name="buyType" value="3"><span>법인</span></label>
        									</div>
                						</div>
										<div class="databar">
            								<span class="title">등록명의</span>
	                						<div class="checkbox">
	                							<label><input type="radio" name="regType" value="1" checked><span>리스사</span></label>
        									</div>
                						</div>
										<div class="databar">
            								<span class="title">자동차세</span>
	                						<div class="checkbox">
	                							<!-- <label><input type="radio" name="cartaxAdd" value="Y"><span>포함</span></label> -->
        										<label><input type="radio" name="cartaxAdd" value="N" checked><span>고객별도</span></label>
        										<span class="price num estmRslt_carTaxY"></span>
        									</div>
                						</div>
                						<div class="selsub delaerS off" kind="dealerShopSel" code="" >
                    						<button><span class="title">제휴사</span><span class="estmRslt_dealerShop">&nbsp;</span></button>
                    						<div class="list">
                    							<div class="dealerShopSel commonSub"></div>
                    							<button class="selup toup">접기</button>
											</div>
										</div>
                						 <div class="selsub" kind="incentiveSel" code="" >
                    						<button><span class="title estmRslt_configFeeText">기타</span><span class="estmRslt_configFeeCost">&nbsp;</span></button>
                    						<div class="list">
                    							<div class="incentiveSel commonSub"></div>
                    							<button class="selup toup">접기</button>
											</div>
										</div>
										<div class="selsub" kind="branchShopSel" code="" >
                    						<button><span class="title">취급지점</span><span class="estmRslt_branchShop">&nbsp;</span></button>
                    						<div class="list">
                    							<div class="branchShopSel commonSub"></div>
                    							<button class="selup toup">접기</button>
											</div>
										</div>
    								</div>
    							</div>
    							
    							<div class="unitD">
    								<div class="cont">
	            						<div class="databar">
	                						<span class="title">취득세</span>
	                						<div>
	                							<label><input type="radio" name="regTaxIn" value="01" checked><span>포함</span></label>
	                							<label><input type="radio" name="regTaxIn" value="02"><span>고객별도</span></label>
	                							<span class="desc estmRslt_takeRate"></span> <span class="price estmRslt_takeTax">0</span>
	                						</div>
	                					</div>
	                					<div class="databar">
	                						<span class="title">감면</span>
	                						<div>
	                							<label><input type="checkbox" name="regFree" value="S"><span>경차</span></label>
	                							<label><input type="checkbox" name="regFree" value="H"><span>하이브리드</span></label>
	                							<label><input type="checkbox" name="regFree" value="E"><span>전기/수소차</span></label>
	                						</div>
	                    				</div>
	                    				<?php if(0){?>
	                    				<div class="selsub" kind="takeSidoSel" code="">
	                						<button><span class="title">공채지역</span><span class="estmRslt_takeSido">&nbsp;</span> <span class=" estmRslt_bondBuy "></span></button>
	                						<div class="list ">
	                    						<ul class="takeSidoSel sidoList">
	                                            	<li takeSido='SU' hana='001'><button>서울</button></li>
	                                            	<li takeSido='KG' hana='021'><button>수원</button></li>
	                                            	<li takeSido='IC' hana='009'><button>인천</button></li>
	                                            	<!-- <li takeSido='KW' hana=''><button>강원</button></li> -->
	                                            	<li takeSido='DJ' hana='006'><button>대전</button></li>
	                                            	<!-- <li takeSido='SJ' hana=''><button>세종</button></li> -->
	                                            	<!-- <li takeSido='CB' hana=''><button>충북</button></li> -->
	                                            	<!-- <li takeSido='CN' hana=''><button>충남</button></li> -->
	                                            	<li class="on" takeSido='BS' hana='004'><button>부산</button></li>
	                                            	<li takeSido='DG' hana='005'><button>대구</button></li>
	                                            	<!-- <li takeSido='US' hana=''><button>울산</button></li> -->
	                                            	<!-- <li takeSido='GB' hana=''><button>경북</button></li> -->
	                                            	<li takeSido='GN' hana='008'><button>함양</button></li>
	                                            	<li takeSido='CW' hana='003'><button>창원</button></li>
	                                            	<li takeSido='KJ' hana='007'><button>광주</button></li>
	                                            	<!-- <li takeSido='JB' hana=''><button>전북</button></li> -->
	                                            	<!-- <li takeSido='JN' hana=''><button>전남</button></li> -->
	                                            	<!-- <li takeSido='JJ' hana=''><button>제주</button></li> -->
	                    						</ul>
	                    						<button class="selup toup">접기</button>
	                    					</div>
	                					</div>
	                    				<div class="databar bondType">
	                						<span class="title">공채할인</span>
											<div>
												<label><input type="radio" name="regBondIn" value="01"><span>포함</span></label>
	                							<label><input type="radio" name="regBondIn" value="02" checked><span>고객별도</span></label>
	                							<span>할인율</span><input class="rateL bond7yr numF" type="text" name="bondcut7" value="" ><input class="rateL bond5yr numF off" type="text" name="bondcut5" value="" > %
	                							 <span class="price estmRslt_bondCut">0</span>
	                						</div>
	                    				</div>
	                    				<?php }?>
	                    				<div class="databar">
	                						<span class="title">공채할인</span>
	                						<div>
												<label><input type="radio" name="regBondIn" value="01"><span>포함</span></label>
	                							<label><input type="radio" name="regBondIn" value="02" checked><span>고객별도</span></label>
	                							<span class="price"><input class="priceS estmRslt_bondCut numF" type="text" name="bondCut" value="0"></span>
	                						</div>
    	                    			</div>
    	                				<div class="databar">
	                						<span class="title">기타비용</span>
	                						<div>
												<label class="off"><input type="radio" name="regExtrIn" value="01"><span>포함</span></label>
	                							<label><input type="radio" name="regExtrIn" value="02" checked><span>고객별도</span></label>
	                							<span class="price"><input class="priceS estmRslt_takeExtra numF" type="text" name="takeExtra" value=""></span>
	                						</div>
    	                    			</div>
    	                    			<div class="databar deliveryMf">
            								<span class="title">탁송료</span>
	                						<div>
	                							<label class="off"><input type="radio" name="deliveryIn" value="01"><span>포함</span></label>
	                							<label><input type="radio" name="deliveryIn" value="02" checked><span>고객별도</span></label>
	                							<span class="price"><input type="text" name="deliveryMaker" value="0" class="priceS numF"></span>
        									</div>
                						</div>
    	                    			<div class="databar takeSelf off">
	                						<span class="title">선수금</span>
	                						<div>
	                							<span class="price"><input class="priceL estmRslt_takeSelf numF" type="text" name="takeSelf" value="0"></span>
	                						</div>
    	                    			</div>
    								</div>
    								<div class="grand">
                        				<div class="total"><span class="name">취득원가</span><span class="price num estmRslt_capital off">0</span><button class="getCapital" capital="0">계산하기</button></div>
                        			</div>
    							</div>
    						<?php }?>
        					</div>
        					
    					</div>
    					
    					<div class="fincFrame">
        					<div class="boxE fincBox" tab="fincBox">
        					<?php for($i=1;$i<=3;$i++){?>
        						<div class="fincCell" fincNo="<?=$i?>">
            						<div class="unitC compare">
            							<div class="top seltop" kind="mode" code="">
            								<button class="star btnFincStar <?=($i==1) ? "on":"";?>">중요</button>
            								<span class="estmRslt_fincNo no num"><?=$i?></span>
            								<h4>상품 선택</h4>
            								<?php if($i==0){?><button>전체 적용</button><?php }?>
            							</div>
            							<div class="cont">
            								<div class="databar fincView" kind="goods" maxcap="" code="" view="FLRK">
                    							<span class="title">상품</span><span class="desc estmRslt_fincName">&nbsp;</span>
                        					</div>
    										<div class="selsub fincView" kind="endTypeSel" code="" view="LRK">
                        						<button><span class="title">만기</span><span class="estmRslt_fincEnd">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="endTypeSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
                        					<div class="selsub fincView" kind="monthSel" code="" view="FLRK">
                        						<button><span class="title">기간</span><span class="estmRslt_fincMonth">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="monthSel finceSub"></div>
                        							<button class="selup toup">접기</button>
                        						</div>
    										</div>
    										<div class="selsub fincView" kind="monthHSel" code="" view="">
                        						<button><span class="title">거치</span><span class="estmRslt_fincMonthH">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="monthHSel finceSub"></div>
                        							<button class="selup toup">접기</button>
                        						</div>
    										</div>
    										<div class="selsub fincView" kind="kmSel" code="" view="LR">
                        						<button><span class="title">약정거리</span><span class="estmRslt_fincKm">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="kmSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<div class="selsub fincView" kind="prepaySel" code="" view="LRF" ratoDis="0">
                        						<button><span class="title estmRslt_fincPrepayTitle">선납금</span><span class="estmRslt_fincPrepay">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="prepaySel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<div class="selsub fincView" kind="depositSel" code="" view="LR_" ratoDis="0">
                        						<button><span class="title">보증금</span><span class="estmRslt_fincDeposit">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="depositSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<div class="databar fincView" kind="goods" maxcap="" code="" view="K">
                    							<span class="title">대출원금</span><span class="price estmRslt_loanCapital">&nbsp;</span>
                        					</div>
    										<div class="selsub fincView" kind="capitalSel" code="" view="F" rateCut="" ratoDis="0">
                        						<button><span class="title">대출원금</span><span class="price estmRslt_finceCapital">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="capitalSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
                        					<div class="databar fincView" view="">
                    							<span class="title">이손금</span><span class="price "><input type="text" name="rateCover" value="0" class="priceL numF estmRslt_rateCover"></span>
                        					</div>
                        					<div class="databar fincView" kind="stampYn" view="F">
                    							<span class="title">인지세</span>
                    							<span class="stempCheck off"><label><input type="radio" name="stamp<?=$i?>" value="Y" checked><span>포함</span></label><label><input type="radio" name="stamp<?=$i?>" value="N"><span>불포함</span></label></span> 
                    							<span class="price estmRslt_finceStamp">&nbsp;</span>
                        					</div>
    										<div class="selsub fincView" kind="respiteSel" code="" view="" ratoDis="0">
                        						<button><span class="title">유예금</span><span class="estmRslt_fincRespite">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="respiteSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<div class="selsub fincView" kind="remainSel" code="" view="LR" cutMin="0" cutMax="0">
                        						<button><span class="title estmRslt_fincRemainTitle">잔존가치</span><span class="estmRslt_fincRemain">&nbsp;</span></button>
                        						<div class="list">
                        							<div class="remainSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<div class="databar fincView" view="F">
                    							<span class="title">금리</span><span class="desc estmRslt_finceRate"></span>
                        					</div>
    										<div class="selsub fincView" kind="careTypeSel" code="" view="R">
                        						<button><span class="title">정비</span><span class="estmRslt_fincCare">&nbsp;</span></button>
                        						<div class="list left">
                        							<div class="careTypeSel finceSub"></div>
                        							<button class="selup toup">접기</button>
    											</div>
    										</div>
    										<?php if($goods=="lease" && !$testride){?>
    										<div class="databar fincView" kind="dcSppt" view="L">
    	                						<span class="title">할인지원금</span>
    	                						<div class="desc">해당 없음</div>
    	                						<div class="radio off" style="border: 0;">
    												<label><input type="radio" name="dcSppt<?=$i?>" value="01"><span>지급</span></label>
    	                							<label><input type="radio" name="dcSppt<?=$i?>" value="02"><span>미지급</span></label>
    	                						</div>
        	                    			</div>
        	                    			<div class="databar fincView" kind="adCmfe" view="L">
    	                						<span class="title">추가수수료</span>
    	                						<div class="desc">해당 없음</div>
    	                						<div class="radio off" style="border: 0;">
    												<label><input type="radio" name="adCmfe<?=$i?>" value="01"><span>AG 지급</span></label>
    	                							<label><input type="radio" name="adCmfe<?=$i?>" value="02"><span>딜러 지급</span></label>
    	                						</div>
        	                    			</div>
        	                    			<?php }?>
    										<div class="databar fincView" kind="paySum" maxcap="" code="" view="LRK">
                    							<span class="title">출고전납입</span><span class="desc estmRslt_fincPaySum">&nbsp;</span>
                        					</div>
                    					</div>
										<div class="hot fincView" view=""><span class=estmRslt_pmtCost>이자합계</span> <span class="price estmRslt_fincRateR">&nbsp;</span></div>
            							<div class="grand fincView" view="PFLRK">
                    						<div class="total"><span class="estmRslt_pmtHPay hold"></span><span class="name">월납입금</span><span class="price num estmRslt_pmtPay">0</span><span class="price max num estmRslt_pmtPayMax">0</span><button class="getResult off" remain="0" openRslt="0" adCmfe="" dcSppt="">계산하기</button></div>
                    					</div>
                    					<div class="cont fincView" view="C">
            								<div class="selpop noline" kind="compset">
                    							<span class="title">비교</span>
                    							<button class="estmRslt_fincCompSet">&nbsp; ...</button>
                        					</div>
                        				</div>
                    					<div class="data fincView" view="C">
                    						<ul class="compareList dataBox" base="" res="" cap=""><li class="blank">차량을 선택해 주세요.</li></ul>
                    					</div>
                    					<div class="guide"><div class="blank">차량을 선택해 주세요.</div></div>
                    					
            						</div>
            					</div>
            				<?php }?>
        					</div>
    					</div>
    					
					</div>
					
				</div>
			
			</div>
			<div class="off" id="docuEdit">
    			<input type="hidden" id="default" value="<?=(isset($estmMyconfig['idx'])) ? $estmMyconfig['idx'] :""?>">
    			<input type="hidden" id="bondCut7" value="5">
    			<input type="hidden" id="bondCut5" value="3">
    			<input type="hidden" id="takeExtra" value="60000">
    			<input type="hidden" id="calConfig" value="<?=(isset($estmMyconfig['calcfg']) && $estmMyconfig['calcfg']) ? $estmMyconfig['calcfg']:""?>">
    			
    			
            	<input type="hidden" id="saveSubject" value="">
            	<input type="hidden" id="saveCounsel" value="">
            	
            	<input type="hidden" id="etcSet" value="<?="down:300000:M10241,M10355,:K9, 모하비\ndown:500000:M10298,M10386,M10357,M10356,:G90, GV80, 콜로라도, 트래버스"?>">
			
				<input type="hidden" id="feeA" value="<?=$estmDefault['estm']['feeA']?>">
				<input type="hidden" id="feeAl" value="<?=$estmDefault['estm']['feeAl']?>">
    			<input type="hidden" id="feeV" value="<?=(isset($estmMyconfig['feeV'])) ? $estmMyconfig['feeV']:""?>">
    			<input type="hidden" id="mileage" value="<?=$estmDefault['estm']['mileage']?>">
    			<input type="hidden" id="end" value="<?=$estmDefault['estm']['end']?>">
    			<input type="hidden" id="insureAge" value="<?=$estmDefault['estm']['insureAge']?>">
    			<input type="hidden" id="insureObject" value="<?=$estmDefault['estm']['insureObject']?>">
    			<input type="hidden" id="feeD" value="<?=(isset($estmMyconfig['fee']) && $estmMyconfig['fee']!="") ? $estmMyconfig['fee']:$estmDefault['estm']['feeD']?>">
    			<input type="hidden" id="brand" value="<?=(isset($estmMyconfig['brand']) && $estmMyconfig['brand']) ? $estmMyconfig['brand']:""?>">
    			
    			<input type="hidden" id="dSido" value="<?=(isset($estmMyconfig['dSido'])) ? $estmMyconfig['dSido']:""?>">
    			<input type="hidden" id="dHDG" value="<?=(isset($estmMyconfig['dHDG'])) ? $estmMyconfig['dHDG']:""?>">
    			<input type="hidden" id="dGMK" value="<?=(isset($estmMyconfig['dGMK'])) ? $estmMyconfig['dGMK']:""?>">
    			<input type="hidden" id="dSYM" value="<?=(isset($estmMyconfig['dSYM'])) ? $estmMyconfig['dSYM']:""?>">
    			<input type="hidden" id="dRSM" value="<?=(isset($estmMyconfig['dRSM'])) ? $estmMyconfig['dRSM']:""?>">
    			
    			<input type="hidden" id="guideE" value="<?=$estmDefault['estm']['guideES']?>">
    			<input type="hidden" id="guideL" value="<?=$estmDefault['estm']['guideLR']?>">
    			<input type="hidden" id="guideU" value="<?=$estmDefault['estm']['guideUE']?>">
    			
    			<input type="hidden" id="companyL" value="<?=(isset($estmMyconfig['companyL'])) ? $estmMyconfig['companyL']:""?>">
    			<input type="hidden" id="companyR" value="<?=(isset($estmMyconfig['companyR'])) ? $estmMyconfig['companyR']:""?>">
    			
    			<!-- 고객저장, 견적편집 분리 .. -->
    			<input type="hidden" id="seller" value="<?=(isset($_SESSION['info_Member'])) ? $_SESSION['info_Member']:""; ?>">
    			<?php if(isset($estmMyconfig['advance']) && strpos($estmMyconfig['advance'],"C")!==false){?>
    			<input type="hidden" id="sellerEdit" value="">
    			<?php }else{?>
    			<input type="hidden" id="sellerEdit" value="<?=(isset($_SESSION['info_Member']) && strpos($_SESSION['permit_Member'],"M")===false) ? $_SESSION['info_Member']:""; ?>">
    			<?php }?>
            	<input type="hidden" id="customer" value="">
            	<input type="hidden" id="customerEdit" value="<?=(isset($estmMyconfig['customer'])) ? $estmMyconfig['customer'] :""?>">
            	
            	<input type="hidden" id="titleEdit" value="<?=(isset($estmMyconfig['title'])) ? $estmMyconfig['title'] :"견적서"?>">
            	<input type="hidden" id="dateEdit" value="">
            	<span id="memoEdit"><?=(isset($estmMyconfig['memo'])) ? $estmMyconfig['memo'] :""?></span>
            	
            	<input type="hidden" id="advanceEdit" value="<?=(isset($estmMyconfig['advance'])) ? $estmMyconfig['advance']:""?>">
            	<input type="hidden" id="showEdit" value="<?=(isset($estmMyconfig['show'])) ? $estmMyconfig['show']:"MCPTFDHEK_"?>">
        		<input type="hidden" id="attachEdit" value="<?=(isset($estmMyconfig['attach'])) ? $estmMyconfig['attach']:"PTC_"?>">
        		<input type="hidden" id="colorEdit" value="<?=(isset($estmMyconfig['color'])) ? $estmMyconfig['color'] :$estmColor?>">
        		<input type="hidden" id="formEdit" value="<?=(isset($estmMyconfig['form'])) ? $estmMyconfig['form']:"Z"?>">
        		<span id="extraMulti"></span>
    		</div>
			<div id="estmDesc" class="estmDesc">
    			<h5 class="title">견적 작성시 유의사항</h5>
    			<ul>
        			<li>※ 고객님과 계약 전에 반드시 요청 받은 차량이 맞는지 트림 및 변속기, 제원, 내외장 색상, 탁송료, 채권 등 정보 등을 다시 한번 확인하시기 바랍니다.</li>
        			<li>※ 하나캐피탈에서 제공하는 차량 정보의 가격, 색상, 판매조건에 오류가 있을 수 있습니다. 계약전에 필히 확인하여 주시기 바랍니다.</li>
        			<li>※ 제조사의 악세사리(Customizing) 옵션(TUIX, TUON 등) 선택시 출고장에 제한이 있습니다. 전용 출고장의 탁송료를 선택해 주세요.</li>
        			<li>※ 견적에 표시된 차량에는 재고차량이나 단종된 차량이 포함되어 있을 수 있습니다. 실제 판매하는 차량인지 확인하시기 바랍니다.</li>
        			<li>※ 수동 변속기나 특이한 색상, 일반용 LPG, 특판 출고 등은 판매사나 금융사에 따라 취급되지 않을 수 있습니다.</li>
    			</ul>
    		</div>
		</div>
		
		<div class="btnOpenSlide">
			<?php if(DEVICE_TYPE=="app"){?><button class="btnOpenInfo off">가격표 보기</button><?php }?>
			<button class="btnOpenDocu">견적서 보기</button>
		</div>
		
		<div class="estmDocu" id="estmDocu">
			<div class="tabBox"><button class="btnCloseDocu">견적서 접기</button></div>
			<div class="docuBody">
				<div class="docuEdit">
					<span class="title">연락처</span>
					<label><input type="radio" name="cardView" value="Y" <?=(!isset($memCfg['cardView'])) ? "checked":""?>><span>표시</span></label>
					<label><input type="radio" name="cardView" value="N"  <?=(isset($memCfg['cardView'])) ? "checked":""?>><span>숨김</span></label>
				</div>
				<div class="docuBox estmRslt_estmDocu">견적서</div>
			</div>
			<div class="buttonBox estm send" type="estm">
				<!-- 
				<div class="urlBox off">
					<input type="text" value="" name="shortcut">
					<button class="urlCopy">Url 복사</button>
					<a class="urlOpen" href="" target="_blank">열기</a>
					<a class="red urlSave" href="">견적 확정</a>
				</div>
				<button class="btnEstmAct kakao " job="talk">카톡</button>
				<button class="btnEstmAct " job="url">Url</button>
				<button class="btnEstmAct " job="pdf">PDF</button>
				<button class="btnEstmAct " job="jpg">JPG</button>
				<button class="btnEstmAct " job="print">인쇄</button>
				-->
				<button class="btnEstmAct cyan" job="save">견적저장</button>
				<?php if($goods=="lease" || $goods=="fince"){?>
                <a class="btnEstmOffer gray" href="/" target="_blank">견적서발송</a>
                <?php }else{?>
                <button class="btnEstmAct2 gray" job="share">공유•다운</button>
                <?php }?>
				<?php if(DEVICE_SIZE=='mobile' || (isset($_SESSION['mode']) && $_SESSION['mode'])){?>
				<button class="btnEstmConfirm gray" page="estm">견적확정</button>
				<button class="btnEstmAgree gray off" page="estm">신용조회요청</button>
				<?php }?>
			</div>
		</div>
		
		
		
	</div>
	
	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>
			
</div>
</section>
</main>

