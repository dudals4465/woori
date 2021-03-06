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
                        else $str[$key] .= "<label><input type='checkbox' value='".$val."' name='".$key."[]'><span class='error'>????????????\t".$val."</span></label> ";
                    }
                }
            }
        }
    }
    if(isset($configSet['remainMin'])){
        $tmp = extractValue($configSet['remainMin'],",", ":", 0, 1);
        $str['remainMin'] = "";
        foreach($tmp as $key=>$val){
            $str['remainMin'] .= "<span> ".$key."??????(".$val."%)</span> ";
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
	var str = "<option value=''>????????? ?????????.</option>";
	for(var n in dataBank[Dpath]['brand']){
		var dat = dataBank[Dpath]['brand'][n];
		str += "<option value='"+n+"'>"+n+" "+dat['name']+"</option>";
	}
	$("#brandSel").html(str);
	
});

$(function () {
	// ????????? ??????
	$(document).on("change", "#brandSel", function () {
		var str = "<option value=''>????????? ?????????.</option>";
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
				sel += " <button kind='rentDisBrand' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='rentNotBrand' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='leaseDisBrand[]'][value='"+val+"']").length==0 && $("input[name='leaseNotBrand[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisBrand' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='leaseNotBrand' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='finceDisBrand[]'][value='"+val+"']").length==0 && $("input[name='finceNotBrand[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisBrand' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			$("#brandData").html(sel);
		}
	});
	// ?????? ??????
	$(document).on("change", "#modelSel", function () {
		var str = "<option value=''>????????? ?????????.</option>";
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
				sel += " <button kind='rentDisModel' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='rentNotModel' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='leaseDisModel[]'][value='"+val+"']").length==0 && $("input[name='leaseNotModel[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisModel' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='leaseNotModel' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='finceDisModel[]'][value='"+val+"']").length==0 && $("input[name='finceNotModel[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisModel' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			$("#modelData").html(sel);
		}
	});

	// ????????? ??????
	$(document).on("change", "#lineupSel", function () {
		var str = "<option value=''>????????? ?????????.</option>";
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
				sel += " <button kind='rentDisLineup' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='rentNotLineup' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='leaseDisLineup[]'][value='"+val+"']").length==0 && $("input[name='leaseNotLineup[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisLineup' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='leaseNotLineup' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='finceDisLineup[]'][value='"+val+"']").length==0 && $("input[name='finceNotLineup[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisLineup' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			$("#lineupData").html(sel);
		}
	});

	// ?????? ??????
	$(document).on("change", "#trimSel", function () {
		var str = "<option value=''>????????? ?????????.</option>";
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
				sel += " <button kind='rentDisTrim' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='rentNotTrim' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='leaseDisTrim[]'][value='"+val+"']").length==0 && $("input[name='leaseNotTrim[]'][value='"+val+"']").length==0){
				sel += " <button kind='leaseDisTrim' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
				sel += " <button kind='leaseNotTrim' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			if($("input[name='finceDisTrim[]'][value='"+val+"']").length==0 && $("input[name='finceNotTrim[]'][value='"+val+"']").length==0){
				sel += " <button kind='finceDisTrim' code='"+val+"' name='"+nam+"'>?????? ??????</button>";
			}
			$("#trimData").html(sel);
		}
	});
	
	// ??????
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
    			<div class="title">?????? ??????</div>
			</div>
		</div>
		<div class="information">
        	????????? ???????????? ??????(????????? ???????????? ??????) ?????? ??????(?????? ??????????????? ??????) ????????? ???????????? ??? ????????????. <span style='color: red'>?????? ????????? ????????? ???????????????.</span>
        </div>
    	<div class="codeBox">
        	<dl>
        		<dt>?????????</dt>
        		<dd><select id="brandSel"><option value="">????????? ?????????.</option></select> <span id="brandData"></span></dd>
        		<dt>??????</dt>
        		<dd><select id="modelSel"><option value="">????????? ?????????.</option></select> <span id="modelData"></span></dd>
        		<dt>?????????</dt>
        		<dd><select id="lineupSel"><option value="">????????? ?????????.</option></select> <span id="lineupData"></span></dd>
        		<dt>??????</dt>
        		<dd><select id="trimSel"><option value="">????????? ?????????.</option></select> <span id="trimData"></span></dd>
        	</dl>
        </div>
        <form id="formConfig" method="post" action="/admin/action/config">
        <h4>?????? ??????</h4>
		<dl>
			<dt>????????? ??????</dt>
			<dd id="rentDisBrand">
				<?=(isset($str['rentDisBrand'])) ? $str['rentDisBrand']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id="rentNotBrand">
				<?=(isset($str['rentNotBrand'])) ? $str['rentNotBrand']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="rentDisModel">
				<?=(isset($str['rentDisModel'])) ? $str['rentDisModel']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="rentNotModel">
				<?=(isset($str['rentNotModel'])) ? $str['rentNotModel']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id="rentDisLineup">
				<?=(isset($str['rentDisLineup'])) ? $str['rentDisLineup']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id="rentNotLineup">
				<?=(isset($str['rentNotLineup'])) ? $str['rentNotLineup']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="rentDisTrim">
				<?=(isset($str['rentDisTrim'])) ? $str['rentDisTrim']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="rentNotTrim">
				<?=(isset($str['rentNotTrim'])) ? $str['rentNotTrim']: "";?>
			</dd>
		</dl>
		<h4>?????? ??????</h4>
		<dl>
			<dt>????????? ??????</dt>
			<dd id="leaseDisBrand">
				<?=(isset($str['leaseDisBrand'])) ? $str['leaseDisBrand']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id="leaseNotBrand">
				<?=(isset($str['leaseNotBrand'])) ? $str['leaseNotBrand']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="leaseDisModel">
				<?=(isset($str['leaseDisModel'])) ? $str['leaseDisModel']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="leaseNotModel">
				<?=(isset($str['leaseNotModel'])) ? $str['leaseNotModel']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id=leaseDisLineup>
				<?=(isset($str['leaseDisLineup'])) ? $str['leaseDisLineup']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id=leaseNotLineup>
				<?=(isset($str['leaseNotLineup'])) ? $str['leaseNotLineup']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="leaseDisTrim">
				<?=(isset($str['leaseDisTrim'])) ? $str['leaseDisTrim']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="leaseNotTrim">
				<?=(isset($str['leaseNotTrim'])) ? $str['leaseNotTrim']: "";?>
			</dd>
		</dl>
		<h4>?????? ??????</h4>
		<dl>
			<dt>????????? ??????</dt>
			<dd id="finceDisBrand">
				<?=(isset($str['finceDisBrand'])) ? $str['finceDisBrand']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="finceDisModel">
				<?=(isset($str['finceDisModel'])) ? $str['finceDisModel']: "";?>
			</dd>
			<dt>????????? ??????</dt>
			<dd id=finceDisLineup>
				<?=(isset($str['finceDisLineup'])) ? $str['finceDisLineup']: "";?>
			</dd>
			<dt>?????? ??????</dt>
			<dd id="finceDisTrim">
				<?=(isset($str['finceDisTrim'])) ? $str['finceDisTrim']: "";?>
			</dd>
		</dl>
		<div class="buttonBox">
			<button id="submit">????????????</button>
        </div>
        <div id="dataName"></div>
		</form>
	</div>
</div>

<script>
    $(document).on("click", "#formConfig button", function () {
    	if(!confirm("????????? ?????????????????????????")){
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