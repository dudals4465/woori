<?php
class App extends Controller
{
    public function index()
    {
        header("location:/");
        exit;
    }
    public function version($ver)
    {
        if(!isset($ver)){
            exit;
        }
        if(strpos($ver,"-")!==false){
            $tmpV = explode("-",$ver);
            $ver = $tmpV[0];
            $os = $tmpV[1];
        }
        if((isset($os) && $os=="ios") ||  DEVICE_PATH=="ios"){
            if($ver < "0.9.8"){
                $data['result'] = "success";
                $data['message'] = "업데이트 하셔야만 이용하실 수 있습니다.";
                $data['work'] = "necessary";
            }else if($ver < "1.0.0"){
                $data['result'] = "success";
                $data['message'] = "원활한 이용을 위해 업데이트가 필요합니다.";
                $data['work'] = "recommend";
            }else if($ver == "1.0.0"){
                $data['result'] = "success";
                $data['message'] = "최신버전입니다.";
                $data['work'] = "latest";
            }else{
                $data['result'] = "failure";
                $data['message'] = "정상적인 호출이 아닙니다.";
                $data['work'] = "unidentified";
            }
        }else{
            if($ver < "0.9.8"){
                $data['result'] = "success";
                $data['message'] = "업데이트 하셔야만 이용하실 수 있습니다.";
                $data['work'] = "necessary";
            }else if($ver < "1.0.0"){
                $data['result'] = "success";
                $data['message'] = "원활한 이용을 위해 업데이트가 필요합니다.";
                $data['work'] = "recommend";
            }else if($ver == "1.0.0"){
                $data['result'] = "success";
                $data['message'] = "최신버전입니다.";
                $data['work'] = "latest";
            }else{
                $data['result'] = "failure";
                $data['message'] = "정상적인 호출이 아닙니다.";
                $data['work'] = "unidentified";
            }
        }
        echo json_encode($data);
    }
    public function token()
    {
        if($_POST['token'] && $_POST['version']){
            $login_model = $this->loadModel('loginModel');
            if(DEVICE_PATH=="android") $os = 1;
            else if(DEVICE_PATH=="ios") $os = 2;
            else $os = 0;    // android = 1, ios = 2;
            $device_data = $login_model->getDeviceIdx($_POST['token'],$os);
            if($device_data){   // update
                $idx = $device_data->iIdx_Device;
                $data = array(
                    "cVersion_Device" => $_POST['version'],
                    "cAgent_Device" => $_SERVER['HTTP_USER_AGENT']
                );
                if(isset($_SESSION['idx_Member']) && $_SESSION['idx_Member'])  $data["iIdx_Member"] = $_SESSION['idx_Member'];
                $device_rslt = $login_model->updateDevice($idx,$data);
                $json['job'] = "update";
            }else{
                $data = array(
                    "cToken_Device" => $_POST['token'],
                    "cVersion_Device" => $_POST['version'],
                    "cOS_Device" => $os,
                    "cAgent_Device" => $_SESSION['AICT_AGENT']
                );
                if(isset($_SESSION['idx_Member']) && $_SESSION['idx_Member'])  $data["iIdx_Member"] = $_SESSION['idx_Member'];
                $device_rslt = $login_model->addDevice($data);
                $idx = $device_rslt;
                $json['job'] = "insert";
            }
            $json['result'] = "success";
            $json['no'] = $idx;
            $json['token'] = $_POST['token'];
            $_SESSION['token'] = $idx;
        }else if($job=="recent"){
            
        }
        echo json_encode($json);
    }
    public function dev()
    {
        $dirLnb = "dev";
        $titleGnb ="App 개발";
        require 'views/_layout/header.php';
        require 'views/app/dev.php';
        require 'views/_layout/footer.php';
    }
}
?>