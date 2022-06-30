<?php 
/*
차대번호	vin
제조사코드	braNo
제조사명	braNm
차종코드	mdlNo
차종명	mdlNm
라인업코드	linupNo               lineup
라인업명칭	linupNm
차량모델년도	carMdlYr
트림코드	trimNo                     trim
트림명칭	trimNm
외장색상코드	crcltNo                  colorExt
외장색상명칭	crcltNm
내장색상코드	carInerClrtnNo       colorInt
내장색상명칭	carInerClrtnNm
옵션코드	cropMngeNo                 option
옵션명	cropGrpNm
트림가격	trimAmt
외장색상가격	crcltAmt
내장색상가격	carInerClrtnAmt
옵션가격	cropAmt
과세금액	taxtnAmt
차량할인금액	carDcAmt
할인비율	dcRto
차량출고금액	carDlvyAmt
공급가	spprcAmt
출고계약번호	dlvyCntrNo       계약번호 => 내부 등록번호 필요
수량수	qntCnt
선구매구분	preBuyDvCd    kind
면세차량금액	txexCarAmt
탁송금액	cndgmtAmt

 */
    

    $btns = '<li><a class="list" href="/newcar/fastship/list">목록</a></li>';
    $cnt = count($data);
    $list = array();
    $kindArr = array();
    $lineupArr = array();
    $colorExtArr = array();
    $colorIntArr = array();
    $contractArr = array();
    foreach($data as $key => $row){
        $contractArr[$key] = $row['dlvyCntrNo'];
        $row['cropMngeNo'] = str_replace(" ","",$row['cropMngeNo']);
        $code = $row['preBuyDvCd']."_".$row['crcltNo']."_".$row['carInerClrtnNo']."_".str_replace(",","-",$row['cropMngeNo'])."_".$row['carDlvyAmt'];
        $list[$row['trimNo']][$code][$key] = $row['vin'];        // 계약 번호를 대체
        if(isset($lineupArr[$row['linupNo']])) $lineupArr[$row['linupNo']] ++;
        else $lineupArr[$row['linupNo']] = 1;
        if(isset($colorExtArr[$row['crcltNo']])) $colorExtArr[$row['crcltNo']] ++;
        else $colorExtArr[$row['crcltNo']] = 1;
        if(isset($colorIntArr[$row['carInerClrtnNo']])) $colorIntArr[$row['carInerClrtnNo']] ++;
        else $colorIntArr[$row['carInerClrtnNo']] = 1;
        if(isset($kindArr[$row['preBuyDvCd']])) $kindArr[$row['preBuyDvCd']] ++;
        else $kindArr[$row['preBuyDvCd']] = 1;
    }
    $lineupList = explode(",",$dataModelView['model'][$model]['lineup']);
    $lineupOption = "";
    $trimOption = "";
    foreach($lineupList as $lineup){
        if(isset($lineupArr[$lineup])){
            $lineupOption .= '<option value="'.$lineup.'">'.$dataModelView['lineup'][$lineup]['name'].'</option>';
            $trimList = explode(",",$dataModelView['lineup'][$lineup]['trim']);
            $trimOption .= "<select name='trim_".$lineup."' class='off'><option value='''>트림 전체</option>";
            foreach($trimList as $trim){
                if(isset($list[$trim])){
                    $trimOption .= '<option value="'.$trim.'">'.$dataModelView['trim'][$trim]['name'].'</option>';
                }
            }
            $trimOption .= "</select>";
        }
	}
	$colorExtList = explode("\n",$dataModelView['model'][$model]['colorExt']);
	$colorExtOption = "";
	foreach($colorExtList as $val){
	    $color = explode("\t",$val);
	    if(isset($colorExtArr[$color[0]])){
	        $colorExtOption .= '<option value="'.$color[0].'">'.$dataModelView['colorExt'][$color[0]]['name'].'</option>';
	    }
	}
	$colorIntList = explode("\n",$dataModelView['model'][$model]['colorInt']);
	$colorIntOption = "";
	foreach($colorIntList as $val){
	    $color = explode("\t",$val);
	    if(isset($colorIntArr[$color[0]])){
	        $colorIntOption .= '<option value="'.$color[0].'">'.$dataModelView['colorInt'][$color[0]]['name'].'</option>';
	    }
	}
?>

<div class="fastshipBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
				<h2 class="mobOff"><?=$titleGnb?></h2>
    			<div class="title"><?=$dataModelView['brand'][$brand]['name']?> > <?=$dataModelView['model'][$model]['name']?></div>
				<ul class="button">
					<span class="count">전체 <?=$cnt?>대</span>
				</ul>
			</div>
		</div>
		<div class="searchBox">
			<span>
				<select name="kind">
					<option value="">구분 전체</option>
					<?php if(isset($kindArr['01'])){?><option value="01">선구매</option><?php }?>
					<?php if(isset($kindArr['02'])){?><option value="02">즉시출고</option><?php }?>
				</select>
				<select name="lineup">
					<option value="">라인업 전체</option>
					<?=$lineupOption?>
				</select>
				<?=$trimOption?>
				<select name="colorExt">
					<option value="">외장 전체</option>
					<?=$colorExtOption?>
				</select><select name="colorInt">
					<option value="">내장 전체</option>
					<?=$colorIntOption?>
				</select>
			</span>
		</div>
		<div class="information">
        	계약번호를 클릭하시면 견적으로 이동하고, 조건에 맞춰 견적을 뽑고 심사신청을 바로 하실 수 있습니다.
        </div>
		<ul class="fastshipList" id="fastshipView">
		<?php 
    		foreach($lineupList as $lineup){
    		    if(isset($lineupArr[$lineup])){
    		        $trimList = explode(",",$dataModelView['lineup'][$lineup]['trim']);
    		        foreach($trimList as $trim){
    		            if(isset($list[$trim])){
    		                $optionPrice = extractValue($dataModelView['trim'][$trim]['option'],"\n", "\t", 0, 1);
    		                foreach($list[$trim] as $code=>$row){
    		                    $contract = "";
    		                    $contractNo = "";
    		                    foreach($row as $key=>$cont){
    		                        if($contract){
    		                            $contract .= ",";
    		                            $contractNo .= ",";
    		                        }
    		                        $contract .= $cont;
    		                        $contractNo .= $contractArr[$key];
    		                    }
    		                    
    		                    $contractList = explode(",",$contract);
    		                    $contractNoList = explode(",",$contractNo);
    		                    $dat = $data[$key];
    		                    if(strpos($contract,"A3621CN005425")!==false){
    		                        $dat['cropMngeNo'] = str_replace("103010","107587",$dat['cropMngeNo']);
    		                    }
    		                    $priceExt = 0;
    		                    $priceInt = 0;
    		                    if($dat['crcltNo']){
    		                        $priceExt = $dat['crcltAmt'];
    		                        $colorExt = $dat['crcltNm'];
    		                    }else{
    		                        $colorExt = "";
    		                    }
    		                    if(isset($dat['carInerClrtnNo']) && $dat['carInerClrtnNo']){
    		                        $priceInt = $dat['carInerClrtnAmt'];
    		                        $colorInt = $dat['carInerClrtnNm'];
    		                    }else{
    		                        $colorInt = "";
    		                    }
    		                    if(strpos($dat['cropGrpNm'],"^")!==false) $optionList = explode("^",$dat['cropGrpNm']);
    		                    else $optionList = explode("\n",$dat['cropGrpNm']);
    	?>
    		<li kind="<?=$dat['preBuyDvCd']?>" model="<?=$model?>" lineup="<?=$lineup?>" trim="<?=$trim?>" colorExt="<?=$dat['crcltNo']?>" colorInt="<?=$dat['carInerClrtnNo']?>" option="<?=str_replace(" ","",$dat['cropMngeNo'])?>" delivery="<?=$dat['cndgmtAmt']?>">
				<div class="box">
					<div class="kind"><span class="title"><?=($dat['preBuyDvCd']=="01") ? "선구매":"즉시출고"?></span><span class="count"><?=count($contractList)?>대</span></div>
					<div class="sales"><span class="price"><?=number_format($dat['carDlvyAmt'])?></span></div>
					<div class="detail">
						<div class="model">
            				<span class="lineup"><?=$dataModelView['lineup'][$lineup]['name']?></span>
            				<span class="trim"><?=$dataModelView['trim'][$trim]['name']?></span>
            				<span class="price">(<?=number_format($dataModelView['trim'][$trim]['price'])?>)</span>
        				</div>
        				<div class="color">
        					<?php if($colorExt){?><span class="colorExt"><?=$colorExt?><?php if($priceExt){?><span class="price">(<?=number_format($priceExt)?>)</span><?php }?></span><?php }?>
							<?php if($colorInt){?><span class="colorInt"><?=$colorInt?><?php if($priceInt){?><span class="price">(<?=number_format($priceInt)?>)</span><?php }?></span><?php }?>
        				</div>
        				<div class="option">
        				<?php if($dat['cropMngeNo']==""){?>
        					<span>없음</span>
        				<?php }else{
        				    foreach($optionList as $option){
        				        $opt = explode("\t",trim($option));
        				        if(count($opt)>1){
        				?>
        					<span><?=$opt[0]?><span class="price">(<?=number_format($opt[1])?>)</span></span>
        					<?php }else{?>
        					<span><?=$opt[0]?></span>
                        <?php }}}?>
        				</div>
					</div>
					<div class="cost">
						<div class="choice"><span class="price"><?=number_format($dat['taxtnAmt'])?></span></div>
						<div class="discount"><span class="price"><?=number_format($dat['carDcAmt'])?></span></div>
						<div class="sales"><span class="price"><?=number_format($dat['carDlvyAmt'])?></span></div>
					</div>
				</div>
				<div class="contract">
					<?php foreach($contractList as $key=>$val){?>
						<button vin="<?=$val?>"><?=$contractNoList[$key]?></button>
					<?php }?>
					<a href="javascript:void(0)" class="more">전체보기</a>
				</div>
			</li>
    	<?php          
                            }
                        }
    		        }
    		    }
    		}
		?>
			<li class="blank off">검색된 목록이 없습니다.</li>
		</ul>
	</div>
	<div id="apiView">
		<h5>API 요청</h5>
		<div id="apiRequest" style="word-break:break-all"><?=(isset($reqJson)) ? $reqJson:""?></div>
		<h5>API 응답</h5>
		<div id="apiResponse" style="word-break:break-all"><?=(isset($getJson)) ? $getJson:""?></div>
	</div>
</div>
<script>
    $(document).on("change", ".searchBox select", function () {
    	var kind = $(".searchBox select[name='kind']").val();
    	var lineup = $(".searchBox select[name='lineup']").val();
    	if($(this).attr("name")=="lineup"){
    		$(".searchBox select[name^='trim_']").addClass("off");
    		if(lineup){
    			$(".searchBox select[name='trim_"+lineup+"']").val("");
        		$(".searchBox select[name='trim_"+lineup+"']").removeClass("off");
    		}
    	}
    	if(lineup){
        	var trim = $(".searchBox select[name='trim_"+lineup+"']").val();
    	}else{
    		var trim = "";
    	}
    	var colorExt = $(".searchBox select[name='colorExt']").val();
    	var colorInt = $(".searchBox select[name='colorInt']").val();
    	$(".fastshipList li").removeClass("off");
    	if(kind){
    		$(".fastshipList li:not([kind='"+kind+"'])").addClass("off");
    	}
    	if(trim){
    		$(".fastshipList li:not([trim='"+trim+"'])").addClass("off");
    	}else if(lineup){
    		$(".fastshipList li:not([lineup='"+lineup+"'])").addClass("off");
    	}
    	if(colorExt){
    		$(".fastshipList li:not([colorExt='"+colorExt+"'])").addClass("off");
    	}
    	if(colorInt){
    		$(".fastshipList li:not([colorInt='"+colorInt+"'])").addClass("off");
    	}
    	if(kind=="" && lineup=="" && trim=="" && colorExt=="" && colorInt=="") $(".fastshipList li.blank").addClass("off");
    	if($(".fastshipList li:not(.off)").length==0) $(".fastshipList li.blank").removeClass("off");
    	return false;
    });
    $(document).on("click", ".fastshipList .contract a.more", function () {
    	if($(this).parent().hasClass("open")){
    		$(this).parent().removeClass("open");
        }else{
            $(this).parent().addClass("open");
        }
    });
</script>

