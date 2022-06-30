<?php
class Home extends Controller
{
	public function index()
	{
	    $dirGnb = "home";
	    $dirLnb = "login";
	    $titleGnb = "우리금융캐피탈 온라인 견적";
	    
	    require 'views/_layout/loginH.php';
	    require 'views/home/login.php';
	    require 'views/_layout/loginF.php';
	}
}
