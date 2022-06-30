<?php

class Application
{
    private $controller = null;
    private $action = null;
    
    public function __construct()
    {
        $cancontroll = false;
        $url = "";
        if(isset($_GET['url'])) {
            $url = rtrim($_GET['url'], '/');
            $url = filter_var($url, FILTER_SANITIZE_URL);
        }
        $params = explode('/', $url);
        $counts = count($params);
        $this->controller = "home";
        if(isset($params[0]) && $params[0]=="D"){
            $this->controller = $params[0];
        }else if(isset($_SESSION['count_Error']) && $_SESSION['count_Error']>=5 && $params[0]!="service" && (!isset($params[1]) || $params[1]!="message" ) && (!isset($params[1]) || $params[1]!="reset" )){
            header("location:/service/message/error");
            exit;
        }else if(GRADE_AUTH=="T" && $params[0]!="login" && !($params[0]=="service" && isset($params[1]) && $params[1]=="reset")){
            header("location:/service/reset");
            exit;
        /* }else if(DEVICE_TYPE!='app' && DEVICE_SIZE!='mobile' && (!isset($_SESSION['mode']) || !$_SESSION['mode']) && !($params[0]=="app" || ($params[0]=="service" && $params[1]=="message"))){
            header("location:/service/message/pc");
            exit; */
        }else if(isset($params[0]) && $params[0]) {
            if(GRADE_AUTH=="N" && $params[0]=="service" && isset($params[1]) && $params[1]=="reset" && !isset($_SESSION['custNo'])){
                header("location:/service/certify/searchpw");
                exit;
            }else if(GRADE_AUTH=="N" && $params[0]=="service" && isset($params[1]) && $params[1]=="apply" && !isset($_SESSION['custNo'])){
                header("location:/service/certify/apply");
                exit;
            }else if(GRADE_AUTH=="N" && $params[0]!="login" && $params[0]!="home" && $params[0]!="app" && $params[0]!="service" && $params[0]!="D"){
                $rtn = "/".$params[0];
                if(isset($params[1]) && $params[1]) $rtn .= "/".$params[1];
                if(isset($params[2]) && $params[2]) $rtn .= "/".$params[2];
                $_SESSION['return'] = $rtn;
                if(isset($_COOKIE['pathLogin']) && $_COOKIE['pathLogin']=="mct") header("location:https://m.hanacapital.co.kr/partner/bzn/common/login.hnc?lgnType=lr");
                else header("location:/");
                exit;
            }else if(GRADE_AUTH!="N" && $params[0]=="service" && isset($params[1]) && $params[1]!="policy" && $params[1]!="certify" && $params[1]!="reset"){
                header("location:/desk");
                exit;
            }elseif($params[0]=="admin" && strpos(GRANT_AUTH,"M")===false){
                if(GRADE_AUTH=="N") header("location:/");
                else header("location:/desk");
                exit;
            }
            if($params[0]) $this->controller = $params[0];
        }else{  // 홈
            if(strpos("PMD",GRADE_AUTH)!==false){   // 이용자는 desk 이동
                header("location:/desk");
                exit;
            }
        }
        if (file_exists('./controllers/' . $this->controller . '.php')) {
            require './controllers/' . $this->controller . '.php';
            $this->controller = new $this->controller();
            $this->action = "index";
            if(isset($params[1])) {
                if($params[1]) $this->action = $params[1];
            }
            if (method_exists($this->controller, $this->action)) {
                $cancontroll = true;
                switch ($counts) {
                    case '0':
                    case '1':
                    case '2':
                        $this->controller->{$this->action}();
                        break;
                    case '3':
                        $this->controller->{$this->action}($params[2]);
                        break;
                    case '4':
                        $this->controller->{$this->action}($params[2],$params[3]);
                        break;
                    case '5':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4]);
                        break;
                    case '6':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4],$params[5]);
                        break;
                    case '7':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4],$params[5],$params[6]);
                        break;
                    case '8':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4],$params[5],$params[6],$params[7]);
                        break;
                    case '9':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4],$params[5],$params[6],$params[7],$params[8]);
                        break;
                    case '10':
                        $this->controller->{$this->action}($params[2],$params[3],$params[4],$params[5],$params[6],$params[7],$params[8],$params[9]);
                        break;
                }
            }
        }
        if($cancontroll === false) header("location:/");    // header("location:/error.html");
    }
}

