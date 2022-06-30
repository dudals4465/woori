<?php 
// $compBtn = '<button class="del btnLoanDel">삭제</button> <button class="round btnLoanCopy">비교추가</button>';
$compBtn = "";
$btns = '<li><a class="list" href="/newcar/fastship/list">목록</a></li>';
?>

<script>
token = "<?=$_SESSION['token']?>";

estmStart = new Array();
estmStart['mode'] = "fastship";
estmStart['trim'] = "";
estmStart['option'] = "";
estmStart['code'] = "";
estmStart['open'] = "";
estmMode = "fastship";
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
        			<?php if($btns){?>
    				<ul class="button">
    					<?=$btns?>
    				</ul>
    				<?php }?>
    			</div>
    		</div>
			<div class="estmBody" id="estmBody" estmLen="1" starLen="0" starNo="," tabM="" saveM="">	
				<div class="estmCell on" estmNo="1" saveNo="" openNo="">
					<div class="estmUnit"  fincLen="3" fincTab="" fincDoc="">
					
    					<div class="boxA">
    						<div class="boxA1">
        						<div class="unitA grade" tab="grade">
        							<div class="top">
        								<h4 class="estmSave_subject">차량 선택</h4>
        							</div>
        							<div class="cont">
        								<div class="selbar brand estmRslt_brand" kind="brand" code="">
                							<button>
                    							<span class="title">브랜드 </span>
                    							<span class="bar estmRslt_brandName">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<div class="brandSel"></div>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        								<div class="selbar estmRslt_model" kind="model" code="">
                							<button>
                    							<span class="title">모델 </span>
                    							<span class="bar estmRslt_modelName">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<ul class="modelSel modelList" brand=""></ul>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        								<div class="selbar estmRslt_lineup" kind="lineup" code="">
                							<button>
                    							<span class="title">라인업 </span>
                    							<span class="bar estmRslt_lineupName">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<ul class="lineupSel lineupList" model=""></ul>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        								<div class="selbar estmRslt_trim" kind="trim" code="">
                							<button>
                    							<span class="title">트림 </span>
                    							<span class="bar estmRslt_trimName">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<ul class="trimSel trimList" lineup=""></ul>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        								<div class="selbar color useNot" kind="colorExt" code="">
                							<button>
                    							<span class="title">외장 </span>
                    							<span class="bar estmRslt_colorExt">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<ul class="colorExtSel colorList"></ul>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        								<div class="selbar color useNot" kind="colorInt" code="">
                							<button>
                    							<span class="title">내장</span>
                    							<span class="bar estmRslt_colorInt">
                    								<span class="blank">선택해 주세요.</span>
                    							</span>
                							</button>
                							<div class="list">
                								<ul class="colorIntSel colorList"></ul>
                								<button class="selup toup">접기</button>
                							</div>
        								</div>
        							</div>
        							<div class="sum"><span class="name">기본가격</span><span class="price num estmRslt_trimPrice">0</span></div>
        						</div>
        						<div class="unitA option" tab="option">
        							<div class="top">
        								<h4>옵션 선택</h4>
        								<button class="updown">펼치기</button>
        								<div class="selpop off" kind="option" code=""></div>
        							</div>
        							<div class="scroll">
        								<div class="cont">
        									<ul class="optionSel optionList"><li class="blank">차량을 선택해 주세요.</li></ul>
        									<button class="slideup toup">접기</button>
        								</div>
        								<div class="sum"><span class="name">옵션(+색상) 합계 <span class="estmRslt_optionLen"></span></span><span class="price num estmRslt_optionSum">0</span></div>
        							</div>
        						</div>
        						<div class="unitA discount" tab="discount">
        							<div class="top">
        								<h4>할인•탁송료</h4>
        							</div>
    								<div class="cont">
    									<ul class="discountSel discountList">
    										<li discount="S" apply="" kind="P" star="">
    											<ul>
    												<li code="R"><button><span class="require">할인율</span></button><span><input class="rateL numF" type="text" name="discountR" value="0"> %</span><span class="price">0</span></li>
    												<li code="P"><button><span class="require">할인액</span></button><span class="price"><input class="priceL numF" type="text" name="discountP" value="0"></span></li>
    											</ul>
    										</li>
    									</ul>
    									<div class="databar">
            								<span class="title">제조사탁송</span>
	                						<div class="checkbox">
	                							<span class="price"><input type="text" name="deliveryMaker" value="0" class="priceL numF"></span>
        									</div>
                						</div>
    								</div>
        						</div>
        						<div class="unitA summy" tab="summary">
    								<div class="vehicle">
                        				<div class="subs"><span class="name">순수차량가격</span><span class="price num estmRslt_vehicleCar">0</span></div>
                        				<div class="subs"><span class="name">면세가격</span><span class="price num estmRslt_vehicleFree">0</span></div>
                        				<div class="subs"><span class="name">할인금액</span><span class="price num  estmRslt_vehicleDc">0</span></div>
                        				<div class="subs"><span class="name">제조사탁송료</span><span class="price num  estmRslt_deliveryMaker">0</span></div>
                        			</div>
                        			<div class="grand">
                        				<div class="total"><span class="name estmRslt_vehicleTag">출고가격(계산서)</span><span class="price num estmRslt_vehicleSale">0</span></div>
                        			</div>
        						</div>
    						</div>
    					</div>
    					<div class="buttonBox"><button id="addFashship">목록에 추가</button></div>
    					
    					<div class="fastshipFrame">
    						<ul id="fastshipData" class="fastshipList estm"><li class="blank">모델을 선택하시고 목록에 추가하세요.</li></ul>
    					</div>
    					
					</div>
					
				</div>
			
			</div>			
			<div class="buttonBox">
				<button id="sendFashship">전송하기</button>
			</div>
			<div id="estmDesc" class="estmDesc">
    			<div class="title">등록 유의사항</div>
    			<ul>
        			<li>※ 전송 전 차량 가격을 다시 한번 확인하여 주시기 바랍니다.</li>
        			<li>※ 중복되어 신청되지 않게 주의해 주세요.</li>
    			</ul>
    		</div>
		</div>
	</div>
		
	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"></div>
	</div>
</div>
</section>
</main>

