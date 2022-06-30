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
?>

<div class="adminBox">
	<div class="frame">
		<div class="headBox">
			<div class="naviBox">
    			<div class="title">이용현황</div>
				<ul class="button">
					<li><a href="/admin/error">오류 해제</a></li>
					<li><a href="/admin/permit">관리 지정</a></li>
					<li><a href="/admin/config">기본 설정</a></li>
					<li><a href="/admin/data">자동차 DB 전송</a></li>
					<li><a href="/admin/push">푸시 발송</a></li>
				</ul>
			</div>
		</div>
		<div class="stepSave">
            <div class="naviBox">
            <h2 class="title">현황 조회 (견적일 기준)</h2>
            <span class="intro" style="display: inline-block;"><input type="text" name="dateS" class="dateForm" value="<?=$_GET['dateS']?>" id="dateStart"> ~ <input type="text" name="dateE" class="dateForm" value="<?=$_GET['dateE']?>" id="dateEnd"> <button id="applyDate" style="background: #f1f1f1; height: 30px; line-height: 30px;  ">적용</button></span>
            </div>
            <ul>
                <li class=""><a href="javascript:void(0)"><span class="title">가견적</span><span class="count"><?=number_format($count['offer'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">견적</span><span class="count"><?=number_format($count['confirm'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">심사</span><span class="count"><?=number_format($count['counsel'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">발주</span><span class="count"><?=number_format($count['order'])?></span></a></li>
				<li class=""><a href="javascript:void(0)"><span class="title">인도</span><span class="count"><?=number_format($count['delivery'])?></span></a></li>
			</ul>
		</div>
		<br><br>
		<div><a href="/app/1014.apk">App 다운(안드로이드)</a></div>
	</div>
</div>

<script>
$(function () {
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

	$(document).on("click", "#applyDate", function () {
        	var sdt = new Date($("#dateStart").val());
        	var edt = new Date($("#dateEnd").val());
        	/* var dateDiff = Math.ceil((edt.getTime()-sdt.getTime())/(1000*3600*24));
        	if(dateDiff>31){
            	alert("1개월 이내로 기간을 줄여주세요.");
            	return false;
        	} */
        	window.location.href = "/admin?dateS="+$("#dateStart").val()+"&dateE="+$("#dateEnd").val()
    });
});

</script>