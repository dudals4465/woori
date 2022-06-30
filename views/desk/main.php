<?php 
    $adminBtn = "";     // 관리자 메뉴
    if(strpos($_SESSION['permit_Member'],"M")!==false) $adminBtn='<li><a class="admin" href="/javascript:void(0)">관리자</a></li>';
    
    $count['offer'] = 0;
    $count['confirm'] = 0;
    $count['counsel'] = 0;
    $count['order'] = 0;
    $count['delivery'] = 0;
    $leaseAdd = "";
    if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"l")===false)) $leaseAdd .= "N";
    //if($_SESSION['regs_Member']!="N" &&  $_SESSION['permit_Member']!="" &&  strpos($_SESSION['permit_Member'],"U")!==false) $leaseAdd .= "U";
    $menuCount = 0;
    if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"r")===false) $menuCount ++;
    if($leaseAdd) $menuCount ++;
    if($_SESSION['regs_Member']!="N" &&  ($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"f")===false)) $menuCount ++;
    if($_SESSION['permit_Member']=="" ||  strpos($_SESSION['permit_Member'],"p")===false) $menuCount ++;
    
    $listArr = array();     // 견적 초기화
?>
<div class="deskBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title"><a class="mypage" href="javascript:void(0)"><b><?=$_SESSION['name_Member']?></b></a></div>
				<ul class="button">
					<?=$adminBtn?> <li><a class="logout" href="/login/logout">로그아웃</a></li>
					<li><a href="/admin/codes/list/group">코드설정</a></li>
				</ul>
			</div>
		</div>
		<navi>
		<ul class="menuDesk count<?=$menuCount?>">
			<li><a href="/newcar/estimate/rent">렌트견적</a></li>
			<li><a href="javascript:void(0)">리스견적</a></li>
			<li><a href="javascript:void(0)">할부견적</a></li>
        	<li><a href="javascript:void(0)">선구매</a></li>
		</ul>
		</navi>
		<div class="stepSave">
			<div class="naviBox">
    			<h2 class="title">현황 조회</h2>
    			<span class="intro">(최근 2주 이내)</span>
			</div>
			<ul>
				<li class=""><a href="javascript:void(0)"><span class="title">가견적</span><span class="count"><?=number_format($count['offer'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">견적</span><span class="count"><?=number_format($count['confirm'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">심사</span><span class="count"><?=number_format($count['counsel'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">발주</span><span class="count"><?=number_format($count['order'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">인도</span><span class="count"><?=number_format($count['delivery'])?></span></a></li>
			</ul>
		</div>
	</div>

</div>
<script>
function goSave(no,kd){
	$.cookie("save", no, {path: "/", domain: location.host});
	window.location.href = "/desk/save/"+kd;
}
</script>