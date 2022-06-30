<?php
// 게시판 명칭
function boardName($code){
    $code_define = array(
        "notice"=>"100", // :공지사항",
        "guide"=>"101", //이용안내",
        "faq"=>"102" //FAQ"
    );
    if(isset($code_define[$code])) return $code_define[$code];
    else return false;
}
// 게시판 테마
function setCode($code){
    if($code=="stateCode") return array("1"=>"사용","2"=>"중지");   // 코드 매핑
    else if($code=="useCode") return array("Y"=>"전체","D"=>"국산","I"=>"수입","N"=>"미사용");   // 코드 매핑
    /* else if($code=="gradeM") return array("P"=>"일반회원","M"=>"관리회원","S"=>"운영자");
    else if($code=="divisionM") return array("A"=>"직원","G"=>"AG","C"=>"CM","O"=>"기타");  // "S"=>"마스터",
    else if($code=="stateM") return array("0"=>"입력","1"=>"초대","2"=>"등록","3"=>"정지","4"=>"탈퇴");
    else if($code=="permitM") return array("M"=>"회원관리","R"=>"실행관리");
    else if($code=="partner") return array("dgb"=>"DGB캐피탈","hana"=>"하나캐피탈","demo"=>"** 캐피탈");
    else if($code=="smsError") return array("01"=>"시스템장애","02"=>"인증실패","03"=>"메시지 형식 오류","04"=>"BIND 안됨","06"=>"전송 성공","07"=>"비가입자,결번,서비스정지","08"=>"단말기 Power-off 상태","09"=>"음영","10"=>"단말기 메시지 FULL","11 "=>"타임아웃","14"=>"무선망(이통사 사용 통신망)에서 단말기로 전송 실패","17"=>"CallbackURL 사용자 아님","18"=>"메시지 중복 발송","19"=>"월 송신 건수 초과","20"=>"이동통신사에서 정의되지 않은 결과 코드","21"=>"착신번호 에러(자리수에러)","22"=>"착신번호 에러(없는 국번)","23"=>"수신거부 메시지 없음","24"=>"21시 이후 광고","25"=>"성인광고, 대출광고 등 기타 제한","26"=>"데이콤 스팸 필터링","27"=>"야간발송차단","28"=>"사전 미등록 발신번호 사용","29"=>"전화번호 세칙 미준수 발신번호 사용","30"=>"발신번호 변작으로 등록된 발신번호 사용","31"=>"번호 도용 문자 차단 서비스에 가입된 발신번호 사용","40"=>"단말기착신거부(스팸등)","91"=>"발송 미허용 시간 때 발송 실패 처리","92"=>"발신 번호 사전 등록 테이블(PCB)에 등록되지 않은 발신 번호 차단","93"=>"수신 거부 테이블(SPAM)에 등록된 수신 번호 차단","99"=>"수신");
    else if($code=="mmsError") return array("1000"=>"성공","2000"=>"포맷 에러","2001"=>"잘못된 번호","2002"=>"컨텐츠 사이즈 및 개수 초과","2003"=>"잘못된 컨텐츠","3000"=>"기업형 MMS 미지원 단말기","3001"=>"단말기 메시지 저장개수 초과","3002"=>"전송시간 초과","3004"=>"전원 꺼짐","3005"=>"음영지역","3006"=>"기타","4000"=>"서버문제로 인한 접수 실패","4001"=>"단말기 일시 서비스 정지","4002"=>"통신사 내부 실패(무선망단)","4003"=>"서비스의 일시적인 에러","4101"=>"계정 차단","4102"=>"허용되지 않은 IP 접근","4104"=>"건수 부족","4201"=>"국제 MMS 발송 권한이 없음","4202"=>"PUSH 권한 없음","5000"=>"번호이동에러","5001"=>"선불발급 발송건수 초과","5003"=>"팸","5201"=>"중복된 키 접수 차단","5202"=>"중복된 수신번호 접수 차단","5301"=>"사전 미등록 발신번호 사용","5302"=>"전화번호 세칙 미 준수 발신번호 사용","5303"=>"발신번호 변작으로 등록된 발신번호 사용","5304"=>"번호 도용 문자 차단 서비스에 가입된 발신번호 사용","6000"=>"폰 정보 조회 실패","6100"=>"이미지 변환 실패","9001"=>"발송 미허용 시간 때 발송 실패","9002"=>"폰 넘버 에러","9003"=>"스팸 번호(스팸 테이블 사용시)","9004"=>"이통사에서 응답 없음","9005"=>"파일크기 오류","9006"=>"지원되지 않는 파일","9007"=>"파일오류","9008"=>"MMS_MSG의 MSG_TYPE 값이 잘못되었음","9009"=>"수신자번호+메시지내용 이 중복","9010"=>"재전송 횟수 초과로 실패","9011"=>"발송 지연으로 인한 실패","9012"=>"발신 번호 사전 등록되지 않은 발신 번호 차단","9013"=>"수신 거부 테이블(SPAM)에 등록된 수신 번호 차단","9014"=>"템플릿 키 값 없음(바코드 기능 사용 시)","9015"=>"바코드 키 값 없음(바코드 기능 사용 시)","9016"=>"CLI_EXT_OBJ 데이터값 오류(Paynow PUSH 기능 연동 시)");
    else if($code=="faxError") return array("0"=>"발송 성공","1"=>"작업중 오류가 발생","11"=>"첨부파일 없음","12"=>"Content 수 10개 초과","13"=>"전송번호 2000개 초과","100"=>"전송 키 값 중복 발송 오류","101"=>"전송중 연결끊김","103"=>"통화중","104"=>"수신거부","105"=>"응답없음","106"=>"팩스기가 아님","107"=>"번호오류","133"=>"보이스 감지(사람이 전화를 받는 경우)","134"=>"보이스 감지(ARS 또는 음성사서함으로 넘어간 경우)","135"=>"차단요청번호","136"=>"발신취소","900"=>"MSG-COUNT 와 실제 수신자 수 불일치","902"=>"사용자의 상태가 비정상","905"=>"첨부파일이 존재하지 않거나 용량초과","906"=>"첨부파일이 확장자가 지정된 형식이 아님","911"=>"파일변환 실패","999"=>"기타오류");
    //else if($code=="request") return array("1"=>"견적","2"=>"상담접수","3"=>"상담완료","4"=>"발주완료","5"=>"출고","6"=>"인도완료","A000"=>"동의요청","A002"=>"확정견적","A003"=>"동의요청","A004"=>"한도신청","A001"=>"동의완료","B001"=>"심사거절","B002"=>"품의완료","B003"=>"전자약정대기","B004"=>"전자약정완료","B005"=>"실행","B006"=>"지급완료","B007"=>"품의등록","B008"=>"품의승인","B009"=>"중도상환","B010"=>"회송","B011"=>"철회","B999"=>"기타");
    else if($code=="request") return array("00"=>"가견적","01"=>"동의 전","02"=>"동의 전","03"=>"동의완료","04"=>"승인","05"=>"상담중","06"=>"부결","07"=>"발주요청","08"=>"발주완료","09"=>"발주취소요청","10"=>"발주취소","11"=>"인도요청","12"=>"인도","13"=>"배정","14"=>"결제완료","15"=>"취소종료","16"=>"조건부승인");
    else if($code=="requestH") return array("01"=>"승인","02"=>"지점문의","03"=>"부결");
    else if($code=="requestK") return array("RG"=>"장기렌트","RF"=>"선구매•즉시출고","RF01"=>"선구매","RF02"=>"즉시출고","LG"=>"운용리스","LK"=>"금융리스","FG"=>"할부"); */
    else return false;
}
// jpg 이미지 리사이즈
function resize_imagejpg($file, $w, $h, $finaldst) {
    list($width, $height) = getimagesize($file);
    $src = imagecreatefromjpeg($file);
    $ir = $width/$height;
    $fir = $w/$h;
    if($ir >= $fir){
        $newheight = floor($w / ($width/$height));
        $newwidth = $w;
    }
    else {
        $newheight = $h;
        $newwidth = floor($h * ($width / $height));
    }
    // $xcor = 0 - ($newwidth - $w) / 2;
    // $ycor = 0 - ($newheight - $h) / 2;
    // $dst = imagecreatetruecolor($w, $h);
    $xcor = 0;
    $ycor = 0;
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, $xcor, $ycor, 0, 0, $newwidth, $newheight, $width, $height);
    imagejpeg($dst, $finaldst);
    imagedestroy($dst);
    return $file;
}

// set / sql 만들기
function dbDataSet($data){
    $fields = "";
    $values = array();
    $count = 0;
    foreach ($data as $key => $val) {
        $count ++;
        if($fields){
            $fields .= ",";
        }
        $fields .= $key."=:d".$count;
        $values[":d".$count] = strip_tags($val);
    }
    return array("fields" => $fields, "values"=>$values);
}
// define 배열로 만들기
function defineSet($data,$kind="code",$view=0){
    $values = array();
    foreach($data as $row){
        if($kind=="define"){
            if($view){
                $values[$row->iIdx_Define] = $row->cName_Define." (".$row->iIdx_Define.")";
            }else{
                $values[$row->iIdx_Define] = $row->cName_Define;
            }
        }else{
            if($view){
                $values[$row->cCode_Define] = $row->cName_Define." (".$row->cCode_Define.")";
            }else{
                $values[$row->cCode_Define] = $row->cName_Define;
            }
        }
    }
    return $values;
}
// 차량 select 배열 만들기
function defineVehicle($data,$key,$val,$state=""){
    $values = array();
    foreach($data as $row){
        if($state){
            $values[$row->$key] = $row->$val." (".$row->$state.")";
        }else{
            $values[$row->$key] = $row->$val;
        }
    }
    return $values;
}
// 변수를 배열로 분리
function extractValue($data,$row, $col, $key, $val){
    $rtn = array();
    $tmp = explode($row, $data);
    foreach ($tmp as $dat) {
        if($dat){
            $da =  explode($col, $dat);
            $rtn[$da[$key]]  = trim($da[$val]);
        }
    }
    return $rtn;
}
// ajax 선택 목록 리턴
function defineReturn($data){
    if(isset($_GET['type']) && $_GET['type']=="html"){
        foreach ($data as $key => $val) {
            echo "<option value='$key'>$val</option>\n";
        }
    }else if(isset($_GET['type']) && $_GET['type']=="xml"){
        $xml = new SimpleXMLElement('<root/>');
        array_walk_recursive($data, array ($xml, 'addChild'));
        Header('Content-Type: application/xml');
        print $xml->asXML();
    }else{	// json
        echo json_encode($data);
    }
}

// 세션 디코드
function sessionDecode($session_data){
    $return_data = array();
    $offset = 0;
    while ($offset < strlen($session_data)) {
        if (!strstr(substr($session_data, $offset), "|")) {
            throw new Exception("invalid data, remaining: " . substr($session_data, $offset));
        }
        $pos = strpos($session_data, "|", $offset);
        $num = $pos - $offset;
        $varname = substr($session_data, $offset, $num);
        $offset += $num + 1;
        $data = unserialize(substr($session_data, $offset));
        $return_data[$varname] = $data;
        $offset += strlen(serialize($data));
    }
    return $return_data;
}
//차량번호
function check_carnum($carnum){
    $rslt = true;
    // 한글만 추출
    $han0 = '|(?<hangul>[가-힣]+)|u';
    $han1 = "가나다라마거너더러머버서어저고노도로모보소오조구누두루무부수우주바사아자허배호하";
    $han2 = "서울부산대구인천대전광주울산제주경기강원충남전남전북경남경북세종";
    preg_match_all($han0, $carnum, $match);
    if(count($match[0])==1){
        if(strlen($match[0][0])!=3 || strpos($han1,$match[0][0])===false) $rslt = false;
    }else if(count($match[0])==2){
        if(strlen($match[0][0])!=6 || strpos($han2,$match[0][0])===false) $rslt = false;
        else if(strlen($match[0][1])!=3 || strpos($han1,$match[0][1])===false) $rslt = false;
    }else{
        $rslt = false;  // 한글명 없음
    }
    if($rslt){
        // 숫자만 체크
        $num = '|[0-9]+|';
        preg_match_all($num, $carnum, $match);
        if(count($match[0])==2){
            if(strlen($match[0][0])>3) $rslt = false;
            if(strlen($match[0][1])!=4) $rslt = false;
        }else{
            $rslt = false;  // 한글명 없음
        }
    }
    return $rslt;
}

// 전화번호
function phone_format($num){
    $num = str_replace("-","",trim($num));
    if(strlen($num)==12) return substr($num,0,4)."-".substr($num,4,4)."-".substr($num,8);
    else if(strlen($num)==11) return substr($num,0,3)."-".substr($num,3,4)."-".substr($num,7);
    else if(strlen($num)==10 && substr($num,0,2)=="02") return substr($num,0,2)."-".substr($num,2,4)."-".substr($num,6);
    else if(strlen($num)==10) return substr($num,0,3)."-".substr($num,3,3)."-".substr($num,6);
    else if(strlen($num)==9) return substr($num,0,2)."-".substr($num,2,3)."-".substr($num,5);
    else if(strlen($num)==8) return substr($num,0,4)."-".substr($num,4);
    else return $num;
}
// 페이지 표시
function pageList($total, $unit, $page){
    $str="";
    $step = 5;	// 페이지 표시갯수
    $first = 1;
    $last = ceil($total / $unit);
    if($last>1){
        $start = $page - 2;
        if($start<1) $start = 1;
        $end = $start + $step -1;
        if($end > $last) $end = $last;
        if($end - $start < $step - 1){
            $start = $end - $step + 1;
            if($start<1) $start = 1;
        }
        
        if($page>2){
            $str .="<button class='first' page='1'>&nbsp;<span>처음</span></button>";
        }
        if($page>1){
            $str .="<button class='prev' page='".($page-1)."'>&nbsp;<span>이전</span></button>";
        }
        
        for($i=$start;$i<=$end;$i++){
            if($page==$i) $now = "now";
            else $now = "";
            $str .="<button class='$now' page='$i'><span>$i</span></button>";
        }
        
        if($page<$last){
            $str .="<button class='next' page='".($page+1)."'>&nbsp;<span>다음</span></button>";
        }
        if($page<$last-1){
            $str .="<button class='last' page='$last'>&nbsp;<span>마지막</span></button>";
        }
    }
    return $str;
}
// 압축 -> 해제는 sxcompressor jxgcompress(string);
function jxgcompress($str)
{
    return base64_encode(gzcompress($str,9));
}
/* AES 암호화  // 7.0 기본 제공 중복됨
function hex2bin($hexdata) {
    $bindata="";
    for ($i=0;$i<strlen($hexdata);$i+=2) {
        $bindata.=chr(hexdec(substr($hexdata,$i,2)));
    }
    return $bindata;
}
*/
function toPkcs7 ($value)
{
    if ( is_null ($value) )
        $value = "" ;
        $padSize = 16 - (strlen ($value) % 16) ;
        return $value . str_repeat (chr ($padSize), $padSize) ;
}
function fromPkcs7 ($value)
{
    $valueLen = strlen ($value) ;
    if ( $valueLen % 16 > 0 )
        $value = "";
        $padSize = ord ($value{$valueLen - 1}) ;
        if ( ($padSize < 1) or ($padSize > 16) )
            $value = "";
            // Check padding.
            for ($i = 0; $i < $padSize; $i++)
            {
                if ( ord ($value{$valueLen - $i - 1}) != $padSize )
                    $value = "";
            }
            return substr ($value, 0, $valueLen - $padSize) ;
}
function encrypt ($key, $iv, $value)
{
    if ( is_null ($value) )
        $value = "" ;
        $value = toPkcs7 ($value) ;
        $output = mcrypt_encrypt (MCRYPT_RIJNDAEL_128, $key,$value, MCRYPT_MODE_CBC, $iv) ;
        return base64_encode ($output) ;
}
function decrypt ($key, $iv, $value)
{
    if ( is_null ($value) )
        $value = "" ;
        $value = base64_decode ($value) ;
        $output = mcrypt_decrypt (MCRYPT_RIJNDAEL_128, $key,$value, MCRYPT_MODE_CBC, $iv) ;
        return fromPkcs7 ($output) ;
}
// 네이버 소셜 로그인
function generate_state() {
    $mt = microtime();
    $rand = mt_rand();
    return md5($mt . $rand);
}
// 자동 링크 걸기
function autolink($data){
    $data = preg_replace("/http:\/\/([0-9a-z-.\/@~?&=_,%]+)/i", "<a href=\"http://\\1\" target='_blank'>http://\\1</a>", $data);     // http
    $data = preg_replace("/https:\/\/([0-9a-z-.\/@~?&=_,%]+)/i", "<a href=\"https://\\1\" target='_blank'>https://\\1</a>", $data);   // https
    $data = preg_replace("/([_0-9a-z-]+(\.[_0-9a-z-]+)*)@([0-9a-z-]+(\.[0-9a-z-]+)*)/i", "<a href=\"mailto:\\1@\\3\">\\1@\\3</a>", $data);  // email
    return $data;
}
// curl 호출, json 가져오기
function connect_curl($url,$header,$post){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    if($header){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header );
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false );
    if($post){
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    }
    curl_setopt($ch, CURLOPT_COOKIE, '' );
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
    $g = curl_exec($ch);
    curl_close($ch);
    return $g;
}

// curl 호출, json 가져오기
function connect_api($url,$post){
    $header = array(
        'Content-Type:application/json',
        'Accept: application/json'
    );
    if(API_MODE=="aict") $url = "https://epa.aictin.com/woorifc".$url;
    else $url = "https://epa.aictin.com/woorifc".$url;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    if($header){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header );
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false );
    if($post){
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    }
    curl_setopt($ch, CURLOPT_COOKIE, '' );
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
    $g = curl_exec($ch);
    curl_close($ch);
    return $g;
}
// 세션 만들기, 기본 값 제어
function setSessionCount($kind,$data){
    if($kind=="notice"){
        foreach($data as $row){
            if($row->cTable_MemberCount=="Notice") $_SESSION['notice_Member'] = $row->iCount_MemberCount;
        }
        if(!isset($_SESSION['notice_Member'])) $_SESSION['notice_Member'] = 0;
    }else if($kind=="limit"){
        foreach($data as $row){
            if($row->cTable_MemberCount=="Note") $_SESSION['note_Limit'] = $row->iCount_MemberCount;
            else if($row->cTable_MemberCount=="Board") $_SESSION['board_Limit'] = $row->iCount_MemberCount;
            else if($row->cTable_MemberCount=="Comment") $_SESSION['comment_Limit'] = $row->iCount_MemberCount;
        }
        if(!isset($_SESSION['note_Limit']) && $_SESSION['idx_Member']>=100 && $_SESSION['idx_Member']<=9999) $_SESSION['note_Limit'] = 1000;
        else if(!isset($_SESSION['note_Limit'])) $_SESSION['note_Limit'] = 20;
        if(!isset($_SESSION['board_Limit']) && $_SESSION['idx_Member']>=100 && $_SESSION['idx_Member']<=9999) $_SESSION['board_Limit'] = 1000;
        else if(!isset($_SESSION['board_Limit'])) $_SESSION['board_Limit'] = 10;
        if(!isset($_SESSION['comment_Limit']) && $_SESSION['idx_Member']>=100 && $_SESSION['idx_Member']<=9999) $_SESSION['comment_Limit'] = 1000;
        else if(!isset($_SESSION['comment_Limit'])) $_SESSION['comment_Limit'] = 20;
    }else if($kind=="count"){
        foreach($data as $row){
            if($row->cTable_MemberCount=="Note") $_SESSION['note_Count'] = $row->iCount_MemberCount;
            else if($row->cTable_MemberCount=="Board") $_SESSION['board_Count'] = $row->iCount_MemberCount;
            else if($row->cTable_MemberCount=="Comment") $_SESSION['comment_Count'] = $row->iCount_MemberCount;
        }
        if(!isset($_SESSION['note_Count'])) $_SESSION['note_Count'] = 0;
        if(!isset($_SESSION['board_Count'])) $_SESSION['board_Count'] = 0;
        if(!isset($_SESSION['comment_Count'])) $_SESSION['comment_Count'] = 0;
    }
}
// 신입회원 세션 기본값
function setSessionBiginner($mIdx,$nickname,$site){
    $_SESSION['idx_Member'] = $mIdx;
    $_SESSION['name_Member'] = $nickname;
    $_SESSION['site_Member'] = $site;
    $_SESSION['grade_Member'] = "G";
    $_SESSION['auth_Member'] = "";
    $_SESSION['grant_Member'] = "";
    $_SESSION['time_Member'] = time();
    $_SESSION['info_Member'] = "";
    $_SESSION['end_Member'] = "";
    $_SESSION['dues_Member'] = "";
    $_SESSION['permit_Member'] = "";
    $_SESSION['division_Member'] = "";
    $_SESSION['idx_Manager'] = "";
    $_SESSION['bookmark_Member'] = "";
    $_SESSION['customer_Member'] = "";
    $_SESSION['vehicle_Member'] = "";
    $_SESSION['schedule_Member'] = "";
    
    $_SESSION['count_Message'] = 0;
    $_SESSION['count_Estimate'] = "0\t0\t".date("Y-m-d");
    $_SESSION['count_Leaserent'] = "0\t0\t".date("Y-m-d");
    
    $_SESSION['notice_Member'] = 0;
    $_SESSION['note_Limit'] = 20;
    $_SESSION['board_Limit'] = 10;
    $_SESSION['comment_Limit'] = 20;
    $_SESSION['note_Count'] = 0;
    $_SESSION['board_Count'] = 0;
    $_SESSION['comment_Count'] = 0;
    
}
// 로그인 회원 세션 기본값
function setSessionMember($memD,$site){
	$_SESSION['idx_Member'] = $memD->iIdx_Member;
	$_SESSION['name_Member'] = $memD->cNickname_Member;
	$_SESSION['site_Member'] = $site;
	$_SESSION['grade_Member'] = $memD->cGrade_Member;
	$_SESSION['auth_Member'] = $memD->cAuthority_Member;
	$_SESSION['grant_Member'] = $memD->cGrant_Member;
	$_SESSION['time_Member'] = time();
	$_SESSION['size_Device'] = DEVICE_SIZE;
	$_SESSION['host_Device'] = $_SERVER['REMOTE_ADDR'];
	if(isset($memD->cName_Member)){
	    if($memD->cDirectory_File) $photo = $memD->cDirectory_File."/".$memD->cName_File;
	    else $photo = "";
	    $_SESSION['info_Member'] = $memD->cName_Member."\t".$memD->cPosition_Member."\t".$memD->cCompany_Member."\t".$memD->cShop_Member."\t".$memD->cPhone_Member."\t".$memD->cMail_Member."\t".$memD->cFax_Member."\t".$photo;
	}else{
		$_SESSION['info_Member'] = "";
	}
	if($memD->dEnd_Member=="0000-00-00" || $memD->dEnd_Member==""){
	    $_SESSION['end_Member'] = "";
	    if(!isset($_SESSION['return']) || strpos($_SESSION['return'],"/ticket/")===false) $_SESSION['return'] = "/service/apply";
	}else{
	    if(strpos($memD->cPermit_Member,"T")!==false && $memD->dEnd_Member<date("Y-m-d")){
	        $memD->dEnd_Member = date("Y-m-d");
	    }
	    $_SESSION['end_Member'] = $memD->dEnd_Member;
	    if($memD->dEnd_Member<date("Y-m-d")){
	        if(!isset($_SESSION['return']) || strpos($_SESSION['return'],"/ticket/")===false)  $_SESSION['return'] = "/service/dues";
	    }
	}
	$_SESSION['dues_Member'] = $memD->cDues_Member;
	$_SESSION['permit_Member'] = $memD->cPermit_Member;
	$_SESSION['division_Member'] = $memD->cDivision_Member;
	$_SESSION['idx_Manager'] = $memD->iIdx_Manager;
	$_SESSION['bookmark_Member'] = $memD->bookmark;
    $_SESSION['customer_Member'] = $memD->customer;
    $_SESSION['vehicle_Member'] = $memD->vehicle;
    $_SESSION['schedule_Member'] = $memD->schedule;
}

function getSessionMember($memD){
    $handle  = opendir(DIR_SESS);	// 핸들 획득
    $cnt = 0;
    $data = array();
    $timeP = date("Y-m-d H:i:s", strtotime("-3 hours"));
    while (false !== ($filename = readdir($handle))) {
        if($filename == "." || $filename == ".." || $filename == "_ClearTime.txt" || strpos($filename,".json")!==false || strpos($filename,".log")!==false || strpos($filename,".txt")!==false || $filename == "sess_".session_id()){
            continue;
        }
        if(is_file(DIR_SESS . "/" . $filename)){		// 파일인 경우
            $sess = sessionDecode(file_get_contents(DIR_SESS."/".$filename));
            if(isset($sess['id_Member']) && $sess['id_Member']==$memD ){
                $timeN = date("Y-m-d H:i:s", filemtime(DIR_SESS."/".$filename));
                $sessID = substr($filename,5);
                if($sessID!=session_id()){
                    if($timeP<$timeN)  $cnt ++;
                    unlink(DIR_SESS."/".$filename);
                }
            }
        }
    }
    $_SESSION['count_Login'] = $cnt;
}
// 배열로 변환
function strToArray($str){
    $dat = array();
    $tmp = explode("`",$str);
    foreach($tmp as $row){
        if(trim($row)){
            $val = explode("~",trim($row));
            if(!isset($val[1])) $val[1]="";
            $dat[$val[0]] = $val[1];
        }
    }
    return $dat;
}
// SEED 128 관련
function encrypt2($bszIV, $bszUser_key, $str) {
    $planBytes = explode(",",$str);
    $keyBytes = explode(",",$bszUser_key);
    $IVBytes = explode(",",$bszIV);
    for($i = 0; $i < 16; $i++)
    {
        $keyBytes[$i] = hexdec($keyBytes[$i]);
        $IVBytes[$i] = hexdec($IVBytes[$i]);
    }
    for ($i = 0; $i < count($planBytes); $i++) {
        $planBytes[$i] = hexdec($planBytes[$i]);
    }
    if (count($planBytes) == 0) {
        return $str;
    }
    $ret = null;
    $bszChiperText = null;
    $pdwRoundKey = array_pad(array(),32,0);
    $bszChiperText = KISA_SEED_CBC::SEED_CBC_Encrypt($keyBytes, $IVBytes, $planBytes, 0, count($planBytes));
    $r = count($bszChiperText);
    for($i=0;$i< $r;$i++) {
        $ret .=  sprintf("%02X", $bszChiperText[$i]).",";
    }
    return substr($ret,0,strlen($ret)-1);
}
function decrypt2($bszIV, $bszUser_key, $str) {
    $planBytes = explode(",",$str);
    $keyBytes = explode(",",$bszUser_key);
    $IVBytes = explode(",",$bszIV);
    for($i = 0; $i < 16; $i++)
    {
        $keyBytes[$i] = hexdec($keyBytes[$i]);
        $IVBytes[$i] = hexdec($IVBytes[$i]);
    }
    for ($i = 0; $i < count($planBytes); $i++) {
        $planBytes[$i] = hexdec($planBytes[$i]);
    }
    if (count($planBytes) == 0) {
        return $str;
    }
    $pdwRoundKey = array_pad(array(),32,0);
    $bszPlainText = null;
    $bszPlainText = KISA_SEED_CBC::SEED_CBC_Decrypt($keyBytes, $IVBytes, $planBytes, 0, count($planBytes));
    for($i=0;$i< sizeof($bszPlainText);$i++) {
        $planBytresMessage .=  sprintf("%02X", $bszPlainText[$i]).",";
    }
    return substr($planBytresMessage,0,strlen($planBytresMessage)-1);
}
// STR HEX
function strToHex($string){
    $hex = '';
    for ($i=0; $i<strlen($string); $i++){
        $ord = ord($string[$i]);
        $hexCode = dechex($ord);
        $hex .= substr('0'.$hexCode, -2);   // kisa 용도..  ",".
    }
    return strToUpper($hex);
}
function strToHex2($string){    // , 븓임
    $hex = '';
    for ($i=0; $i<strlen($string); $i++){
        $ord = ord($string[$i]);
        $hexCode = dechex($ord);
        $hex .= ",".substr('0'.$hexCode, -2);   // kisa 용도..  ",".
    }
    return strToUpper(substr($hex,1));
}
function hexToStr($hex){
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2){
        $string .= chr(hexdec($hex[$i].$hex[$i+1]));
    }
    return $string;
}
function hexToStr2($hex){
    $hex = str_replace(",","",$hex);
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2){
        $string .= chr(hexdec($hex[$i].$hex[$i+1]));
    }
    return $string;
}
function encodeDocu($v){
    $noteKey = "abcdefghkmnopqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ23456789";
    $n = strlen($noteKey);
    $s = "";
    $r = 0;
    do{
        $e = $v % $n;
        $s = substr($noteKey,$e,1).$s;
        $v = ( $v - $e ) / $n;
        $r += $e;
    }while ($v);
    $e = $r % $n;
    $s = substr($noteKey,$e,1).$s;
    return $s;
}
function decodeDocu($s){
    $noteKey = "abcdefghkmnopqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ23456789";
    $x = substr($s,0,1);
    $s = substr($s,1);
    $n = strlen($noteKey);
    $v = 0;
    $c = strlen($s);
    $i = 0;
    $r = 0;
    do{
        $e = strpos($noteKey,substr($s,$i,1));
        $v += $e * pow($n,$c-$i-1);
        $i ++;
        $r += $e;
    }while ($i<$c);
    $e = $r % $n;
    if($x == substr($noteKey,$e,1)) return $v;
    else return 0;
}
function getRandomNumber($length = 6) {
    $characters = '0123456789';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
// 상품 제원 보기
function specShopView($str){
    $txt = "";
    $tmp = explode("\n",$str);
    foreach($tmp as $row){
        if($txt) $txt .="<br>";
        if(strpos($row,"`")!==false){
            $txt .="<b>".substr($row,0,strpos($row,"`"))."</b> ".substr($row,strpos($row,"`")+1);
        }else{
            $txt .= $row;
        }
    }
    return $txt;
}
function estmSummary($kind,$data,$conf){
    $txt = "";
    if(substr($kind,1,1)=="M"){
        //echo "***";
    }else{
        if(substr($kind,0,2)=="ES"){
            foreach($data->finc as $val){
                if($txt) $txt .= "\n";
                if($val->code=="cash"){
                    $txt .= "일시불";
                }else{
                    $txt .= $val->name."(".number_format($val->capital/10000)."만원, ".$val->month."개월)";
                }
            }
        }else if(substr($kind,0,2)=="EU"){
            foreach($data->finc as $val){
                if($txt) $txt .= "\n";
                $txt .= $val->name."(".$val->month."개월)";
            }
        }else if(substr($kind,0,1)=="L"){
            foreach($conf->finc as $val){
                if($txt) $txt .= "\n";
                $dat = explode("\t",$val);
                if($dat[1]=="L") $txt .="오토리스(";
                else $txt .="장기렌트(";
                $txt .=$dat[2]."개월 ".$dat[3]." / ".$dat[5]." / ".$dat[7];
                $txt .=")";
            }
        }
        
    }
    
    return $txt;
}
?>