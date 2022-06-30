	</div>
	<footer>
	<div class="footer">
		<div class="frame">
			<span class="phone">서비스 이용 문의 : <strong>0000-0000</strong></span>
			<span class="right">Copyright © 2019 WOORI FINANCIAL CAPITAL CO.,LTD CO. ALL Right Reserved</span>
			<!-- <a class="link" href="/service/policy">이용약관</a> -->
			<?php if(DEVICE_TYPE=="app"){?><a class="link"  href="javascript:clearCache()"><span>Cache 삭제</span></a><?php }?>
		</div>
		<?php 
    		if(isset($_SESSION['mode']) && $_SESSION['mode']=="aict"){
    		   var_dump($_SESSION);
    		}
		?>
	</div>
	</footer>
</div>
<div class="layerPopup <?=DEVICE_TYPE?>Type <?=DEVICE_SIZE?>Size">
    <div class="dimBg"></div>
    <div id="framePopup" class="frame">
    	<div class="head drag"><h3>팝업 타이틀</h3><button class="btnClose">닫기</button></div>
        <div class="content">
            팝업 내용
        </div>
    </div>
</div>
<div class="layerNotice">
    <div class="dimBg"></div>
    <div id="frameNotice" class="frame">
        <div class="content">
            팝업 내용
        </div>
    </div>
</div>
<div class="loadingPopup <?=DEVICE_TYPE?>Type <?=DEVICE_SIZE?>Size">
    <div class="dimBg"></div>
    <div class="frame"></div>
</div>
</body>
</html>