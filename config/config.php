<?php
// 오픈시 제거
error_reporting(E_ALL);
ini_set("display_errors", 1);

if(!defined("INDEX")){
    header('location: /');
    exit;
}

define('URL', 'http://woorift.aictin.com/');      // 금융사별 설정
define('DOMAIN', 'aictin.com');     // 금융사별 설정
/* DB 관련 환경설정 */
define('DB_TYPE', 'mysql');
define('DB_HOST', '183.111.234.181');
define('DB_NAME', 'test');
define('DB_USER', 'aict');
define('DB_PASS', 'aict@1436.com');
/* crypt Key */
define('CRYPT', 'HeoNanSeolHyeon');
define('IV','CarnoonPowerdByAictCorpKimLeeMaU');

define('WOORI_IV','12345678ABCDEFGH');
define('WOORI_KEY','abcdefgh12345678');


/* data 경로 */
define('DATA_PATH', '../../files/autodata/');
//define('SITE_PATH', '../../files/caps/'); // 운영, 금융사별 설정
define('SITE_PATH', '../_session/woorift/');   // 개발, 금융사별 설정
define('IMG_PATH', 'http://img.carpan.co.kr/'); // 운영은 https://www.carpan.co.kr
define('CDN_PATH', '');

/* 이미지 경로 */
define('JPG_PATH', '../img/');

define('FILE_PATH', '../../files/');

define('UPLOAD_PATH', '../_session/woorift/');     // 개발, 금융사별

// define('URL_OFFER','https:// ');  // 견적서 제공 url : 금융리스, 할부 사용


// 판매조건 년월
//define('DC_YM','202006');
define('DC_YM',date("Ym"));

// 디바이스 검출
if(!isset($_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_PATH', 'etc');
}else if(preg_match("/(iPhone|iPod|iPad)/i",$_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_PATH', 'ios');
}else if(preg_match("/Android/i",$_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_PATH', 'android');
}else if(preg_match("/(iBlackBerry|SymbianOS|Opera Mini|Windows CE|Nokia|SonyEricsson|webOS|PalmOS|mobile)/i",$_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_PATH', 'mobile');
}else {
    define('DEVICE_PATH', 'pc');
}

// 기기 사이즈 검출
if(!isset($_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_SIZE', 'etc');
}else if(preg_match("/(iPad|SM-P|SM-T|SM-W)/i",$_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_SIZE', 'tablet');
}else if(preg_match("/(iPhone|iPod|Android)/i",$_SERVER['HTTP_USER_AGENT'])){
    define('DEVICE_SIZE', 'mobile');
}else{
    define('DEVICE_SIZE', 'pc');
}

define('KAKAO_LINK', '8192b37c6858d76d8e37ee1fcaf72b12');   // 운영사별 설정

/* 세션 */
define('DIR_SESS', '../_session/caps');     // 금융사별 설정
//echo session_cache_expire();
ini_set('session.cookie_domain', '.'.DOMAIN);
session_save_path(DIR_SESS);	// 세션 저장 위치
session_set_cookie_params(0, "/", '.'.DOMAIN, false, true); // http only 속성 추가 XSS 방지
session_start();

if(isset($_SERVER['HTTP_AICT_AGENT'])){
    $_SESSION['AICT_AGENT'] = $_SERVER['HTTP_AICT_AGENT'];
    setcookie('AICT_AGENT', $_SERVER['HTTP_AICT_AGENT'], time() + 86400 * 30, '/', '.'.DOMAIN);
}else if(isset($_GET['app'])){
    if($_GET['app']=="ios") $aict = "Demo/iOS 12.4.8/1.0.0/main/iPhone7,2/320*568";
    else if($_GET['app']=="adr") $aict = "Demo/Android 10(29)/1.0.0/main/LM-G710N/1440x2858/3.5";
    else $aict = "";
    $_SESSION['AICT_AGENT'] = $aict;
    setcookie('AICT_AGENT', $aict, time() + 86400 * 30, '/', '.'.DOMAIN);
}else if(isset($_COOKIE['AICT_AGENT'])){
    $_SESSION['AICT_AGENT'] = $_COOKIE['AICT_AGENT'];
}

if(isset($_SESSION['AICT_AGENT']) && $_SESSION['AICT_AGENT']){
    define('DEVICE_TYPE', 'app');
    define('GRANT_APP', "");
}else{
    define('DEVICE_TYPE', 'web');
    define('GRANT_APP', "");
}

define('PARTNER_PATH','woorift');  // 금융사별 설정
$_SESSION['partner_Path'] = PARTNER_PATH;
define('ESTM_MODE','capital');

if(!isset($_SESSION['id_Member'])){
    define('GRADE_AUTH', 'N');
    define('ID_AUTH', "");
    define('NAME_AUTH', "비회원");
}else{
    //if($_SESSION['state_Member']=="2") define('GRADE_AUTH', "T");   // 비번 강제설정
    //else if($_SESSION['state_Member']!="1") define('GRADE_AUTH', "N");   // 사용 중지 회원
    //else 
    define('GRADE_AUTH', "P");       // 일반 P 관리자 M 제휴 D
    define('ID_AUTH', $_SESSION['id_Member']);
    define('NAME_AUTH', $_SESSION['name_Member']);
    define('GRANT_AUTH', $_SESSION['permit_Member']);
}
// 개발 임시 처리
if(isset($_GET['mode']) && $_GET['mode']) $_SESSION['mode'] = $_GET['mode'];
else $_SESSION['mode'] = "aict";

// API 연동
define('API_MODE',$_SESSION['mode']);      // aict : 개발용. wooridev 테스트용   // woori  운영용(JSON 표시 없음), woori79 운영 테스트용

