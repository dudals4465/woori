<?php
class Desk extends Controller
{
	public function index()
	{
	    
	    $titleGnb = "온라인 견적";
	    $dirGnb = "desk";
	    $dirLnb = "main";
	    
	    require 'views/_layout/header.php';
	    require 'views/desk/main.php';
	    require 'views/_layout/footer.php';
	}
	public function save($idx)
	{
	    require 'views/_layout/header.php';
	    require 'views/desk/save.php';
	    require 'views/_layout/footer.php';
	}
}
