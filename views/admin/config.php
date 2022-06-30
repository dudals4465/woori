<?php 
    
$dataArr = array(
    "rentDisBrand"=>"brand","rentDisModel"=>"model","rentDisLineup"=>"lineup","rentDisTrim"=>"trim",
    "rentNotBrand"=>"brand","rentNotModel"=>"model","rentNotLineup"=>"lineup","rentNotTrim"=>"trim",
    "leaseDisBrand"=>"brand","leaseDisModel"=>"model","leaseDisLineup"=>"lineup","leaseDisTrim"=>"trim",
    "leaseNotBrand"=>"brand","leaseNotModel"=>"model","leaseNotLineup"=>"lineup","leaseNotTrim"=>"trim",
    "finceDisBrand"=>"brand","finceDisModel"=>"model","finceDisLineup"=>"lineup","finceDisTrim"=>"trim"
);
    foreach($dataArr as $key=>$type){
        $str[$key] = "";
        if(isset($configSet[$key])){
            $tmp = explode(",",$configSet[$key]);
            foreach($tmp as $val){
                if($val){
                    if(isset($salesList[$type][$val])){
                        if($type=="brand"){
                            $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]' checked><span>".$salesList['brand'][$val]['name']."\t".$val."</span></label> ";
                        }else if($type=="model"){
                            $brand = $salesList['model'][$val]['brand'];
                            $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]' checked><span>".$salesList['brand'][$brand]['name']." ".$salesList['model'][$val]['name']."\t".$val."</span></label> ";
                        }else if($type=="lineup"){
                            $brand = $salesList['lineup'][$val]['brand'];
                            $model = $salesList['lineup'][$val]['model'];
                            $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]' checked><span>".$salesList['brand'][$brand]['name']." ".$salesList['model'][$model]['name']." ".$salesList['lineup'][$val]['name']."\t".$val."</span></label> ";
                        }else if($type=="trim"){
                            $brand = $salesList['trim'][$val]['brand'];
                            $model = $salesList['trim'][$val]['model'];
                            $lineup = $salesList['trim'][$val]['lineup'];
                            $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]' checked><span>".$salesList['brand'][$brand]['name']." ".$salesList['model'][$model]['name']." ".$salesList['lineup'][$lineup]['name']." ".$salesList['trim'][$val]['name']."\t".$val."</span></label> ";
                        }
                    }else{
                        if(isset($configSet[$type][$val])) $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]'><span class='error'>".$configSet[$type][$val]."\t".$val."</span></label> ";
                        else $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]'><span class='error'>정보없음\t".$val."</span></label> ";
                    }
                }
            }
        }
    }
    if(isset($configSet['remainMin'])){
        $tmp = extractValue($configSet['remainMin'],",", ":", 0, 1);
        $str['remainMin'] = "";
        foreach($tmp as $key=>$val){
            $str['remainMin'] .= "<span> ".$key."개월(".$val."%)</span> ";
        }
    }

?>
<script>

token = "<?=$_SESSION['token']?>";
Dpath = "sales";

$(window).load(function () {

	var url = "/api/auto/salesList_search"+"?token="+token;
	var Dpath = "sales";
	getjsonData(url,Dpath);
	console.log(dataBank[Dpath]);
	var str = "<option value=''>선택해 주세요.</option>";
	for(var n in dataBank[Dpath]['brand']){
		var dat = dataBank[Dpath]['brand'][n];
		str += "<option value='"+n+"'>"+n+" "+dat['name']+"</option>";
	}
	$("#brandSel").html(str);
	
});

$(function () {
	// 브랜드 선택
	$(document).on("change", "#brandSel", function () {
		var str = "<option value=''>선택해 주세요.</option>";
		var sel = "";
		var val = $(this).val();
		var nam = dataBank[Dpath]['brand'][val]['name']+"\t"+val;
		$("#modelSel").html(str);
		$("#lineupSel").html(str);
		$("#trimSel").html(str);
		$("#brandData").html("");
		$("#modelData").html("");
		$("#lineupData").html("");
		$("#trimData").html("");
		if(val){
			var list =  dataBank[Dpath]['brand'][val]['modelList'].split(",");
			for(var n in list){
				var dat = dataBank[Dpath]['model'][list[n]];
				str += "<option value='"+list[n]+"'>"+list[n]+" "+dat['name']+"</option>";
			}
			$("#modelSel").html(str);
			sel += val;
			if($("input[name='rentDisBrand[]'][value='"+val+"']").length==0 && $("input[name='rentNotBrand[]'][value='"+val+"']").length==0){
				sel += " <button kind='rentDisBrand' code='"+val+"' name='"+nam+"'>렌트 숨김</button>";
				sel += " <button kind='rentNotBrand' code='"+val+"' name='"+nam+"'>렌트 미정</button>";
			}
			if($("input[name='leaseDisBrand[]'][value='"+val+"']").length==0 && $("input[name='leaseNotBrand[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisBrand' code='"+val+"' name='"+nam+"'>리스 숨김</button>";
				sel += " <button kind='leaseNotBrand' code='"+val+"' name='"+nam+"'>리스 미정</button>";
			}
			if($("input[name='finceDisBrand[]'][value='"+val+"']").length==0 && $("input[name='finceNotBrand[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisBrand' code='"+val+"' name='"+nam+"'>할부 숨김</button>";
			}
			$("#brandData").html(sel);
		}
	});
	// 모델 선택
	$(document).on("change", "#modelSel", function () {
		var str = "<option value=''>선택해 주세요.</option>";
		var sel = "";
		var val = $(this).val();
		var brnd = $("#brandSel").val();
		var nam = dataBank[Dpath]['brand'][brnd]['name']+" "+dataBank[Dpath]['model'][val]['name']+"\t"+val;
		$("#lineupSel").html(str);
		$("#trimSel").html(str);
		$("#modelData").html("");
		$("#lineupData").html("");
		$("#trimData").html("");
		if(val){
			var list =  dataBank[Dpath]['model'][val]['lineupList'].split(",");
			for(var n in list){
				var dat = dataBank[Dpath]['lineup'][list[n]];
				str += "<option value='"+list[n]+"'>"+list[n]+" "+dat['name']+"</option>";
			}
			$("#lineupSel").html(str);
			sel += val;
			if($("input[name='rentDisModel[]'][value='"+val+"']").length==0 && $("input[name='rentNotModel[]'][value='"+val+"']").length==0){
				sel += " <button kind='rentDisModel' code='"+val+"' name='"+nam+"'>렌트 숨김</button>";
				sel += " <button kind='rentNotModel' code='"+val+"' name='"+nam+"'>렌트 미정</button>";
			}
			if($("input[name='leaseDisModel[]'][value='"+val+"']").length==0 && $("input[name='leaseNotModel[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisModel' code='"+val+"' name='"+nam+"'>리스 숨김</button>";
				sel += " <button kind='leaseNotModel' code='"+val+"' name='"+nam+"'>리스 미정</button>";
			}
			if($("input[name='finceDisModel[]'][value='"+val+"']").length==0 && $("input[name='finceNotModel[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisModel' code='"+val+"' name='"+nam+"'>할부 숨김</button>";
			}
			$("#modelData").html(sel);
		}
	});

	// 라인업 선택
	$(document).on("change", "#lineupSel", function () {
		var str = "<option value=''>선택해 주세요.</option>";
		var sel = "";
		var val = $(this).val();
		var brnd = $("#brandSel").val();
		var modl = $("#modelSel").val();
		var nam = dataBank[Dpath]['brand'][brnd]['name']+" "+dataBank[Dpath]['model'][modl]['name']+" "+dataBank[Dpath]['lineup'][val]['name']+"\t"+val;
		$("#trimSel").html(str);
		$("#lineupData").html("");
		$("#trimData").html("");
		if(val){
			var list =  dataBank[Dpath]['lineup'][val]['trimList'].split(",");
			for(var n in list){
				var dat = dataBank[Dpath]['trim'][list[n]];
				str += "<option value='"+list[n]+"'>"+list[n]+" "+dat['name']+"</option>";
			}
			$("#trimSel").html(str);
			sel += val;
			if($("input[name='rentDisLineup[]'][value='"+val+"']").length==0 && $("input[name='rentNotLineup[]'][value='"+val+"']").length==0){
				sel += " <button kind='rentDisLineup' code='"+val+"' name='"+nam+"'>렌트 숨김</button>";
				sel += " <button kind='rentNotLineup' code='"+val+"' name='"+nam+"'>렌트 미정</button>";
			}
			if($("input[name='leaseDisLineup[]'][value='"+val+"']").length==0 && $("input[name='leaseNotLineup[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisLineup' code='"+val+"' name='"+nam+"'>리스 숨김</button>";
				sel += " <button kind='leaseNotLineup' code='"+val+"' name='"+nam+"'>리스 미정</button>";
			}
			if($("input[name='finceDisLineup[]'][value='"+val+"']").length==0 && $("input[name='finceNotLineup[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisLineup' code='"+val+"' name='"+nam+"'>할부 숨김</button>";
			}
			$("#lineupData").html(sel);
		}
	});

	// 트림 선택
	$(document).on("change", "#trimSel", function () {
		var str = "<option value=''>선택해 주세요.</option>";
		var sel = "";
		var val = $(this).val();
		var brnd = $("#brandSel").val();
		var modl = $("#modelSel").val();
		var line = $("#lineupSel").val();
		var nam = dataBank[Dpath]['brand'][brnd]['name']+" "+dataBank[Dpath]['model'][modl]['name']+" "+dataBank[Dpath]['lineup'][line]['name']+" "+dataBank[Dpath]['trim'][val]['name']+"\t"+val;
		$("#trimData").html("");
		if(val){
			sel += val;
			if($("input[name='rentDisTrim[]'][value='"+val+"']").length==0 && $("input[name='rentNotTrim[]'][value='"+val+"']").length==0){
				sel += " <button kind='rentDisTrim' code='"+val+"' name='"+nam+"'>렌트 숨김</button>";
				sel += " <button kind='rentNotTrim' code='"+val+"' name='"+nam+"'>렌트 미정</button>";
			}
			if($("input[name='leaseDisTrim[]'][value='"+val+"']").length==0 && $("input[name='leaseNotTrim[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisTrim' code='"+val+"' name='"+nam+"'>리스 숨김</button>";
				sel += " <button kind='leaseNotTrim' code='"+val+"' name='"+nam+"'>리스 미정</button>";
			}
			if($("input[name='finceDisTrim[]'][value='"+val+"']").length==0 && $("input[name='finceNotTrim[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisTrim' code='"+val+"' name='"+nam+"'>할부 숨김</button>";
			}
			$("#trimData").html(sel);
		}
	});
	
	// 숨김
	$(document).on("click", ".codeBox button", function () {
		var kind = $(this).attr('kind');
		var code = $(this).attr('code');
		var name = $(this).attr('name');
		$("#"+kind).append("<label><input type='checkbox' value='"+code+"' name='"+kind+"[]' checked><span>"+name+"</span></label> ");
		if(kind.indexOf('Dis')>0) $(this).next().remove();
		else if(kind.indexOf('Not')>0) $(this).prev().remove();
		$(this).remove();
	});
});

</script>
<style>
    input[type="checkbox"]:checked ~ span{ color:#222; font-weight: normal; }
    #formConfig input[type='text'] { width: 100%; }
    #formConfig dd .desc { color: #999; }
    #formConfig dd .error { color: red; }
    .codeBox button { background: #f4f4f4; border: 1px solid #ccc; padding: 2px 10px; border-radius: 20px; margin-left: 10px; }
</style>
<div class="editBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">기본 설정</div>
			</div>
		</div>
		<div class="information">
        	모델을 선택하여 숨김(목록에 표시되지 않음) 또는 미정(잔가 미확정으로 표시) 조건을 추가하실 수 있습니다. <span style='color: red'>적색 표시는 단종된 상태입니다.</span>
        </div>
    	<div class="codeBox">
        	<dl>
        		<dt>브랜드</dt>
        		<dd><select id="brandSel"><option value="">선택해 주세요.</option></select> <span id="brandData"></span></dd>
        		<dt>모델</dt>
        		<dd><select id="modelSel"><option value="">선택해 주세요.</option></select> <span id="modelData"></span></dd>
        		<dt>라인업</dt>
        		<dd><select id="lineupSel"><option value="">선택해 주세요.</option></select> <span id="lineupData"></span></dd>
        		<dt>트림</dt>
        		<dd><select id="trimSel"><option value="">선택해 주세요.</option></select> <span id="trimData"></span></dd>
        	</dl>
        </div>
        <form id="formConfig" method="post" action="/admin/action/config">
        <h4>렌트 설정</h4>
		<dl>
			<dt>브랜드 숨김</dt>
			<dd id="rentDisBrand">
				<?=(isset($str['rentDisBrand'])) ? $str['rentDisBrand']: "";?>
			</dd>
			<dt>브랜드 미정</dt>
			<dd id="rentNotBrand">
				<?=(isset($str['rentNotBrand'])) ? $str['rentNotBrand']: "";?>
			</dd>
			<dt>모델 숨김</dt>
			<dd id="rentDisModel">
				<?=(isset($str['rentDisModel'])) ? $str['rentDisModel']: "";?>
			</dd>
			<dt>모델 미정</dt>
			<dd id="rentNotModel">
				<?=(isset($str['rentNotModel'])) ? $str['rentNotModel']: "";?>
			</dd>
			<dt>라인업 숨김</dt>
			<dd id="rentDisLineup">
				<?=(isset($str['rentDisLineup'])) ? $str['rentDisLineup']: "";?>
			</dd>
			<dt>라인업 미정</dt>
			<dd id="rentNotLineup">
				<?=(isset($str['rentNotLineup'])) ? $str['rentNotLineup']: "";?>
			</dd>
			<dt>트림 숨김</dt>
			<dd id="rentDisTrim">
				<?=(isset($str['rentDisTrim'])) ? $str['rentDisTrim']: "";?>
			</dd>
			<dt>트림 미정</dt>
			<dd id="rentNotTrim">
				<?=(isset($str['rentNotTrim'])) ? $str['rentNotTrim']: "";?>
			</dd>
		</dl>
		<h4>리스 설정</h4>
		<dl>
			<dt>브랜드 숨김</dt>
			<dd id="leaseDisBrand">
				<?=(isset($str['leaseDisBrand'])) ? $str['leaseDisBrand']: "";?>
			</dd>
			<dt>브랜드 미정</dt>
			<dd id="leaseNotBrand">
				<?=(isset($str['leaseNotBrand'])) ? $str['leaseNotBrand']: "";?>
			</dd>
			<dt>모델 숨김</dt>
			<dd id="leaseDisModel">
				<?=(isset($str['leaseDisModel'])) ? $str['leaseDisModel']: "";?>
			</dd>
			<dt>모델 미정</dt>
			<dd id="leaseNotModel">
				<?=(isset($str['leaseNotModel'])) ? $str['leaseNotModel']: "";?>
			</dd>
			<dt>라인업 숨김</dt>
			<dd id=leaseDisLineup>
				<?=(isset($str['leaseDisLineup'])) ? $str['leaseDisLineup']: "";?>
			</dd>
			<dt>라인업 미정</dt>
			<dd id=leaseNotLineup>
				<?=(isset($str['leaseNotLineup'])) ? $str['leaseNotLineup']: "";?>
			</dd>
			<dt>트림 숨김</dt>
			<dd id="leaseDisTrim">
				<?=(isset($str['leaseDisTrim'])) ? $str['leaseDisTrim']: "";?>
			</dd>
			<dt>트림 미정</dt>
			<dd id="leaseNotTrim">
				<?=(isset($str['leaseNotTrim'])) ? $str['leaseNotTrim']: "";?>
			</dd>
		</dl>
		<h4>할부 설정</h4>
		<dl>
			<dt>브랜드 숨김</dt>
			<dd id="finceDisBrand">
				<?=(isset($str['finceDisBrand'])) ? $str['finceDisBrand']: "";?>
			</dd>
			<dt>모델 숨김</dt>
			<dd id="finceDisModel">
				<?=(isset($str['finceDisModel'])) ? $str['finceDisModel']: "";?>
			</dd>
			<dt>라인업 숨김</dt>
			<dd id=finceDisLineup>
				<?=(isset($str['finceDisLineup'])) ? $str['finceDisLineup']: "";?>
			</dd>
			<dt>트림 숨김</dt>
			<dd id="finceDisTrim">
				<?=(isset($str['finceDisTrim'])) ? $str['finceDisTrim']: "";?>
			</dd>
		</dl>
		<div class="buttonBox">
			<button id="submit">변경하기</button>
        </div>
        <div id="dataName"></div>
		</form>
	</div>
</div>

<script>
    $(document).on("click", "#formConfig button", function () {
    	if(!confirm("설정을 저장하시겠습니까?")){
        	return false;
    	}else{
        	var str = "";
    		$("#formConfig input[type='checkbox']:checked").each(function (){
        		if($(this).attr('name').indexOf("Brand")>=0){
            		str+= "<input type='hidden' name='brand[]' value='"+$(this).next().text()+"'>";
        		}else if($(this).attr('name').indexOf("Model")>=0){
            		str+= "<input type='hidden' name='model[]' value='"+$(this).next().text()+"'>";
        		}else if($(this).attr('name').indexOf("Lineup")>=0){
            		str+= "<input type='hidden' name='line[]' value='"+$(this).next().text()+"'>";
        		}else if($(this).attr('name').indexOf("Trim")>=0){
            		str+= "<input type='hidden' name='trim[]' value='"+$(this).next().text()+"'>";
        		}
        	});
			$("#dataName").html(str);
    	}
    });
</script>