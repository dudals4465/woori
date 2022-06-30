<?php

class Controller
{
	public $db = null;
	function __construct()
	{
		$this->dbConnect();
	}
	
	private function dbConnect()
	{
		$options = array(PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ, PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING);
		$this->db = new PDO(DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS, $options);
	}
	
	public function loadModel($model_name)
	{
		require 'models/' . $model_name . '.php';
		return new $model_name($this->db);
	}
}
