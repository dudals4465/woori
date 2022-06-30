<?php 
    $btns = "";
    if(strpos($_SESSION['permit_Member'],"D")!==false){
        $btns = '<li><a class="edit" href="/newcar/fastship/add">등록</a></li>';
    }
    $brandStr = "";
    if(isset($data) && count($data)){
        foreach($data as $val){
            $model = $val['mdlNo'];
            $brand = $dataModelList['model'][$model]['brand'];
            if($brandStr=="") $brandStr .=$brand;
            else if(strpos($brandStr,$brand)===false) $brandStr .=",".$brand;
        }
    }
?>

<div class="fastshipBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
				<h2 class="mobOff"><?=$titleGnb?></h2>
				<?php  if(strpos($_SESSION['permit_Member'],"D")!==false){?>
					<span class="search">
						<input type="text" name="search" value="<?=(isset($_SESSION["name_Fastship"])) ? $_SESSION["name_Fastship"]:""?>" placeholder="제휴사 명칭 입력" ><button class="searchCompany">검색하기</button>
						<select name="company" class="off"></select>
                    	<?php if(isset($_SESSION["custno_Fastship"]) && $_SESSION["custno_Fastship"]){?>
                    	<a href="/newcar/fastship/list?company=&name=">초기화</a>
                    	<?php }?>
					</span>
				<?php }?>
    			<?php if($btns){?>
				<ul class="button">
					<?=$btns?>
				</ul>
				<?php }?>
			</div>
		</div>
		<div class="brandShip estmUnit">
			<div class="brandBar"><button><span class="title">브랜드 </span><span class="bar"><span class="blank">선택해 주세요.</span></span></button></div>
			<ul class="brandList">
				<?php 
				if($brandStr){
				    $brnd = explode(",",$brandStr);
				    foreach($brnd as $val){?>
				        <li brand="<?=$val?>"><button><img src="<?=IMG_PATH?><?=$dataModelList['brand'][$val]['logo']?>" alt=""><span><?=$dataModelList['brand'][$val]['name']?></span></button></li>
				<?php }}?>
			</ul>
		
		</div>
		<ul class="list modelList">
		<?php 
    		if(isset($data) && count($data)){
    		    foreach($data as $val){
    		        $model = $val['mdlNo'];
    		        $cnt = $val['qntCnt'];
        ?>
        	<li brand="<?=$dataModelList['model'][$model]['brand']?>">
				<a href="/newcar/fastship/<?=$model?>">
					<div class="logo"><img src="<?=IMG_PATH?><?=$dataModelList['brand'][$dataModelList['model'][$model]['brand']]['logo']?>" alt=""></div>
					<div class="car"><img src="<?=IMG_PATH?><?=$dataModelList['model'][$model]['image']?>"></div>
					<div class="name"><?=$dataModelList['model'][$model]['name']?><span class="cnt">(<?=$cnt?>대)</span></div>
				</a>
			</li>
        <?php }}else{?>
        	<li class="blank">현재 판매중인 모델이 없습니다.</li>
        <?php }?>
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
<?php  if(strpos($_SESSION['permit_Member'],"D")!==false){?>
	token = "<?=$_SESSION['token']?>";
	$(document).on("click", "button.searchCompany", function () {
    	var word = $.trim($(this).prev().val());
    	if(word.length<2 || word=="(주)"  || word=="(주" || word=="주)"){
    		alert("검색어를 2자 이상 입력해주세요.");
    		$("#formApply input[name='search']").focus();
    	}else{
    		var Dpath = "branchCompany";
    		var url = "/login/branchCompany?code=&name="+encodeURI(word)+"&token="+token;
    		getjsonApi(url,Dpath);
    	}
    	return false;
    });
	function searchCompany(code,name){
    	var Dpath = "branchCompany";
    	var str ="<option value=''>제휴사 선택</option>";
    	var list = dataBank[Dpath]['agcompany'];
    	for (var i in list) {
    		dat = list[i];
    		if(dat['custNo']!="0"){
    			str += "<option value='"+dat['custNo']+"'>"+dat['cprnBrchNm']+"</option>";
    		}
    	}
    	str += "<option value='all'>전체 보기</option>";
    	$("select[name='company']").html(str);
    	$("select[name='company']").removeClass('off');
    }
    $(document).on("change", "select[name='company']", function () {
    	window.location.href = "/newcar/fastship/list?company="+$(this).val()+"&name="+encodeURI($(this).find("option:selected").text());
    });
<?php }?>
    $(document).on("click", ".brandShip .brandList button", function () {
        if($(this).parent().hasClass("on")) var sel = true;
        else var sel = false;
        $(".brandShip li").removeClass("on");
        if(!sel){
        	$(this).parent().addClass("on");
        	var brand = $(this).parent().attr("brand");
        	if(deviceSize=="mobile"){
        		$(".brandBar .bar").html($(this).html());
        	}
        }else{
        	var brand = "";
        	if(deviceSize=="mobile"){
        		$(".brandBar .bar").html("<span class='blank'>선택해 주세요.</span>");
        	}
        }
        if(brand){
        	$(".modelList li").addClass("off");
        	$(".modelList li[brand='"+brand+"']").removeClass("off");
        }else{
        	$(".modelList li").removeClass("off");
        }
        if(deviceSize=="mobile"){
        	$(".brandList").slideUp("fast");
        	$(".brandBar").removeClass("open");
        }
    });
    $(document).on("click", ".fastshipBox .brandShip .brandBar button", function () {
        if($(this).parent().hasClass("open")){
        	$(".brandList").slideUp("fast");
        	$(this).parent().removeClass("open");
        }else{
        	$(".brandList").slideDown("fast");
        	$(this).parent().addClass("open");
        }
    });

    
    
</script>

