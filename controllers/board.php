<?php
class Board extends Controller
{
    public function index()
    {
        header("location:/board/notice/list");
        exit;
    }
	public function notice($idx)
	{
	    if(($idx=="add" || $idx=="edit")  && strpos($_SESSION['permit_Member'],"M")===false){
	        header("location:/board/notice/list");
	        exit;
	    }
	    
	    $titleGnb = "공지사항(즉시출고)";
	    $dirGnb = "board";
	    $dirLnb = "notice";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    $codeBoard=boardName($dirLnb);
	    if($idx=="edit") $bNo = $_GET['no'];
	    else if($idx!="list" && $idx!="add") $bNo = $idx;
	    else $bNo = 0;
	    
	    $community_model = $this->loadModel('communityModel');
	    if($idx=="list"){
	        $unit = 20;		// 한 페이지 표시 갯수
	        $page = (isset($_GET["page"]) && $_GET["page"]) ? $_GET["page"]:1;		// 현재 페이지
	        $board_data = $community_model->getBoardList($unit, $page,"",$codeBoard,1);
	        
	        $board_list = $board_data['list'];
	        $board_total = $board_data['total'];
	        
	        $page_list = pageList($board_total->count, $unit, $page);
	    }else if($bNo){
	        $board_data = $community_model->getBoardView($bNo,$codeBoard);
	        if(!isset($_SESSION['read_'.$bNo])){   // 카운트
	            $community_model->updateBoardCount($bNo);
	            $_SESSION['read_'.$bNo] = 1;
	        }
	        $attach_list = $community_model->getFileList($bNo);
	        if(!$board_data){
	            header('location: /board/'.$dirLnb.'/list/');
	            exit;
	        }
	    }
	    
	    require 'views/_layout/header.php';
	    if($idx=="list")  require 'views/board/list.php';
	    else if($idx=="add" || $idx=="edit")  require 'views/board/edit.php';
	    else require 'views/board/view.php';
	    require 'views/_layout/footer.php';
	}
	public function guide($idx)
	{
	    if(($idx=="add" || $idx=="edit")  && strpos($_SESSION['permit_Member'],"M")===false){
	        header("location:/board/guide/list");
	        exit;
	    }
	    
	    $titleGnb = "이용안내";
	    $dirGnb = "board";
	    $dirLnb = "guide";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    $codeBoard=boardName($dirLnb);
	    if($idx=="edit") $bNo = $_GET['no'];
	    else if($idx!="list" && $idx!="add") $bNo = $idx;
	    else $bNo = 0;
	    
	    $community_model = $this->loadModel('communityModel');
	    if($idx=="list"){
	        $unit = 20;		// 한 페이지 표시 갯수
	        $page = (isset($_GET["page"]) && $_GET["page"]) ? $_GET["page"]:1;		// 현재 페이지
	        $board_data = $community_model->getBoardList($unit, $page,"",$codeBoard,1);
	        
	        $board_list = $board_data['list'];
	        $board_total = $board_data['total'];
	        
	        $page_list = pageList($board_total->count, $unit, $page);
	    }else if($bNo){
	        $board_data = $community_model->getBoardView($bNo,$codeBoard);
	        if(!$board_data){
	            header('location: /board/'.$dirLnb.'/list/');
	            exit;
	        }
	    }
	    
	    require 'views/_layout/header.php';
	    if($idx=="list")  require 'views/board/list.php';
	    else if($idx=="add" || $idx=="edit")  require 'views/board/edit.php';
	    else require 'views/board/view.php';
	    require 'views/_layout/footer.php';
	}
	public function faq($idx)
	{
	    if(($idx=="add" || $idx=="edit") && strpos($_SESSION['permit_Member'],"M")===false){
	        header("location:/board/faq/list");
	        exit;
	    }
	    
	    $titleGnb = "FAQ";
	    $dirGnb = "board";
	    $dirLnb = "faq";
	    
	    $num = rand(1000000000000000, 9999999999999999);
	    $_SESSION['token'] = encodeDocu($num);
	    
	    $codeBoard=boardName($dirLnb);
	    if($idx=="edit") $bNo = $_GET['no'];
	    else if($idx!="list" && $idx!="add") $bNo = $idx;
	    else $bNo = 0;
	    
	    $community_model = $this->loadModel('communityModel');
	    if($idx!="add" && $idx!="edit"){
	        $unit = 0;		// 한 페이지 표시 갯수
	        $page = (isset($_GET["page"]) && $_GET["page"]) ? $_GET["page"]:1;		// 현재 페이지
	        $board_data = $community_model->getBoardList($unit, $page,"",$codeBoard,1);
	        
	        $board_list = $board_data['list'];
	        $board_total = $board_data['total'];
	        
	    }else if($bNo){
	        $board_data = $community_model->getBoardView($bNo,$codeBoard);
	        if(!$board_data){
	            header('location: /board/'.$dirLnb.'/list/');
	            exit;
	        }
	    }
	    
	    require 'views/_layout/header.php';
	    if($idx=="add" || $idx=="edit")  require 'views/board/edit.php';
	    else require 'views/board/faq.php';
	    require 'views/_layout/footer.php';
	}
	public function action($code)
	{
	    if(!isset($_SESSION['id_Member']) || !boardName($code)){
	        header('location: /');
	        exit;
	    }
	    if(strpos($_SESSION['permit_Member'],"M")===false){
	        header("location:/board/".$code."/list");
	        exit;
	    }
	    $codeBoard=boardName($code);
	    $community_model = $this->loadModel('communityModel');
	    if($_POST["act"]=="add" || $_POST["act"]=="mod"){		// 추가, 수정
	        if(isset($_POST["format"]) && $_POST["format"]=="html"){
	            $_POST["message"] = preg_replace("!<TEXTAREA(.*?)>!is","[TEXTAREA]",$_POST["message"]);
	            $_POST["message"] = preg_replace("!</TEXTAREA(.*?)>!is","[/TEXTAREA]",$_POST["message"]);
	            $_POST["message"]=preg_replace("!<script(.*?)<\/script>!is","",$_POST["message"]);
	            $_POST["message"]=preg_replace("!<iframe(.*?)<\/iframe>!is","",$_POST["message"]);
	            $_POST["message"]=preg_replace("!<meta(.*?)>!is","",$_POST["message"]);
	            $_POST["message"]=preg_replace("!<style(.*?)<\/style>!is","",$_POST["message"]);
	            $_POST["message"] = htmlspecialchars($_POST["message"]);
	        }else{
	            $_POST["format"] = "text";
	        }
	        $data = array(
	            "cSubject_Board" => $_POST["subject"],
	            "cFormat_Board" => $_POST["format"],
	            "tMessage_Board" => $_POST["message"]
	        );
	        if($_POST["act"]=="add"){
	            $data['cID_Member'] = $_SESSION['id_Member'];
	            $data['iCode_Board'] = $codeBoard;
	            $board_rslt = $community_model->addBoard($data);
	            $idx = $board_rslt;
	        }else if($_POST["act"]=="mod"){
	            $data['iState_Board'] = $_POST["state"];
	            $idx = $_POST["idx"];
	            $community_model->updateBoard($idx,$data,"");
	        }
	        // 첨부 파일 처리
	        $odr = 0;
	        if(isset($_POST['attachAct'])){
	            foreach ($_POST['attachAct'] as $key => $val) {
	                if($_POST['attachKind'][$key]=="photo" && $val == "add" &&  $_FILES['attachFile']['name'][$key]){  // 파일 처리
	                    $odr++;
	                    $error = $_FILES['attachFile']['error'][$key];
	                    $name = $_FILES['attachFile']['name'][$key];
	                    var_dump($name);
	                    $tmp = explode('.', $name);
	                    $ext = strtolower(array_pop($tmp));
	                    $data = array(
	                        "iIdx_Board" => $idx,
	                        "cKind_File" => $_POST["attachKind"][$key],
	                        "cSubject_File" => $_POST["attachSubject"][$key],
	                        "iOrder_File" => $odr
	                    );
	                    if( $error == UPLOAD_ERR_OK ) {
	                        $uploads_dir = 'photo/'.date("Ym");
	                        $allowed_ext = array('jpg','jpeg','png','gif');
	                        if(in_array($ext, $allowed_ext) ) {
	                            $idxF = $community_model->addFile($data);
	                            $name = $idxF.".".$ext;
	                            if(!is_dir(UPLOAD_PATH.$uploads_dir)){
	                                mkdir(UPLOAD_PATH.$uploads_dir);
	                            }
	                            move_uploaded_file( $_FILES['attachFile']['tmp_name'][$key], UPLOAD_PATH.$uploads_dir."/".$name);
	                            $data = array(
	                                "cName_File" => $name,
	                                "cDirectory_File" => $uploads_dir
	                            );
	                            $community_model->updateFile($idxF,$data);
	                        }
	                    }
	                }else if($_POST['attachKind'][$key]=="file" && $val == "add" &&  $_FILES['attachFile']['name'][$key]){  // 파일 없음
	                    $odr++;
	                    $error = $_FILES['attachFile']['error'][$key];
	                    $name = $_FILES['attachFile']['name'][$key];
	                    $ext = strtolower(array_pop(explode('.', $name)));
	                    $data = array(
	                        "iIdx_Board" => $idx,
	                        "cKind_File" => $_POST["attachKind"][$key],
	                        "cSubject_File" => $name,
	                        "iOrder_File" => $odr
	                    );
	                    if( $error == UPLOAD_ERR_OK ) {
	                        $uploads_dir = 'docu/'.date("Ym");
	                        $allowed_ext = array('pdf');
	                        $allowed_ext = array('xls','xlsx','xlsm','doc','docx','docm','ppt','pptx','pptm','pdf','hwp');
	                        if(in_array($ext, $allowed_ext) ) {
	                            $idxF = $community_model->addFile($data);
	                            $name = $idxF.".".$ext;
	                            if(!is_dir(UPLOAD_PATH.$uploads_dir)){
	                                mkdir(UPLOAD_PATH.$uploads_dir);
	                            }
	                            move_uploaded_file( $_FILES['attachFile']['tmp_name'][$key], UPLOAD_PATH.$uploads_dir.'/'.$name);
	                            $data = array(
	                                "cName_File" => $name,
	                                "cDirectory_File" => $uploads_dir
	                            );
	                            $community_model->updateFile($idxF,$data);
	                        }
	                    }
	                }else if($val == "add" || $val == "mod"){
	                    $odr ++;
	                    $data = array(
	                        "iIdx_Board" => $idx,
	                        "cKind_File" => $_POST["attachKind"][$key],
	                        "cSubject_File" => $_POST["attachSubject"][$key],
	                        "iOrder_File" => $odr
	                    );
	                    if($_POST["attachKind"][$key]!="photo" && $_POST["attachKind"][$key]!="file") $data["cDirectory_File"] = $_POST["attachUrl"][$key];
	                    if($val == "add"){
	                        $community_model->addFile($data);
	                    }else if($val == "mod"){
	                        $community_model->updateFile($_POST["attachIdx"][$key],$data);
	                    }
	                }else if($val == "del"){
	                    $community_model->updateFile($_POST["attachIdx"][$key],array("iState_File"=>9));
	                    rename( UPLOAD_PATH.$_POST["images"][$key], UPLOAD_PATH.str_replace(".","._",$_POST["images"][$key]));
	                }
	                //$community_model->updateBoard($idx,array("cAttach_Board"=>$odr),$_SESSION['idx_Member']);  // 첨부파일 갯수
	            }
	        }
	    }else if ($_POST["act"]=="blind") {	// 관리자
            $data = array("iState_Board" => 2);
            $board_rslt= $community_model->updateBoard($_POST["idx"],$data,"");
	    }else if ($_POST["act"]=="open") {	// 관리자
            $data = array("iState_Board" => 1);
            $board_rslt= $community_model->updateBoard($_POST["idx"],$data,"");
	    }else if ($_POST["act"]=="pushup") {	// 관리자
            $data = array("iNotice_Board" => 9);
            $board_rslt= $community_model->updateBoard($_POST["idx"],$data,"");
	    }else if ($_POST["act"]=="pushdown") {	// 관리자
            $data = array("iNotice_Board" => 0);
            $board_rslt= $community_model->updateBoard($_POST["idx"],$data,"");
	    }else if ($_POST["act"]=="order") {	// 관리자
	        $community_model->changeBoardOrder($_POST['idx']);
	    }
	    if($code=="faq"){
	        header('location: /board/faq/list');
	    }else if($_POST["act"]=="add" || $_POST["act"]=="mod"){
	        header('location: /board/'.$code."/".$idx);
	    }else{
	        header('location: /board/'.$code."/list");
	    }
	}
}
