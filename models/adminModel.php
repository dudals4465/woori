<?php

class AdminModel
{
	function __construct($db) {
		try {
			$this->db = $db;
		} catch (PDOException $e) {
			exit('데이터베이스 연결에 오류가 발생했습니다.');
		}
	}
	public function addPartner($data)
	{
		$dataSet = dbDataSet($data);
		$sql = "INSERT INTO dgb_Partner SET ".$dataSet['fields'];
		$query = $this->db->prepare($sql);
		$query->execute($dataSet['values']);
		return $this->db->lastInsertId();
	}
	public function updatePartner($idx,$data)
	{
	    $dataSet = dbDataSet($data);
	    $dataSet['values'][':idx'] = $idx;
	    $where = "iIdx_Partner=:idx ";
	    $sql = "UPDATE dgb_Partner SET ".$dataSet['fields']." where ".$where;
	    $query = $this->db->prepare($sql);
	    $query->execute($dataSet['values']);
	}
	public function getPartnerView($idx)
	{
	    $select = "*";
	    $where = "iIdx_Partner=:idx AND iState_Partner!=:state ";
	    $sql = "SELECT $select FROM dgb_Partner  WHERE $where ";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':idx' => $idx,':state' => 9));
	    return $query->fetch();
	}
	public function getPartnerSet($code)
	{
	    $select = "*";
	    $where = "cCode_Partner=:code AND iState_Partner!=:state ";
	    $sql = "SELECT $select FROM dgb_Partner  WHERE $where ";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':code' => $code,':state' => 9));
	    return $query->fetch();
	}
	public function getUniqueCode($table,$code)
	{
	    $exec[':code']= $code;
	    if($table=="member"){
	        $sql = "SELECT COUNT(*) as count FROM dgb_Member WHERE cID_Member=:code ";
	    }else if($table=="partner"){
	        $sql = "SELECT COUNT(*) as count FROM dgb_Partner WHERE cCode_Partner=:code ";
	    }
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    return $query->fetch();
	}
	public function getPartnerList($kind, $unit, $page)
	{
	    $where = "cKind_Partner=:kind ";
	    $exec[':kind']= $kind;
	    if(isset($_GET['state']) && $_GET['state']!=""){
	        $where .= "AND iState_Partner=:state ";
	        $exec[':state']= $_GET['state'];
	    }else{
	        $where .= "AND iState_Partner!=:state ";
	        $exec[':state']= 9;
	    }
	    if(isset($_GET['group']) && $_GET['group']!=""){
	        $where .= "AND cGroup_Partner=:group ";
	        $exec[':group']= $_GET['group'];
	    }
	    if(isset($_GET['search']) && $_GET['search'] && isset($_GET['keyword']) && $_GET['keyword']){
	        if($_GET['search']=="name") $where .= "AND cName_Partner  LIKE CONCAT('%', :keyword ,'%') ";
	        else if($_GET['search']=="memo") $where .= "AND cMemo_Partner  LIKE CONCAT('%', :keyword ,'%') ";
	        $exec[':keyword']= $_GET['keyword'];
	    }
	    $sql = "SELECT COUNT(*) as count FROM dgb_Partner WHERE $where ";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    $total = $query->fetch();
	    
	    $from = $unit * ($page - 1);
	    $odr = "iOrder_Partner ASC, iIdx_Partner DESC ";
	    $sql = "SELECT * FROM dgb_Partner WHERE $where ORDER BY $odr LIMIT $from,$unit ";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    $list = $query->fetchAll();
	    return array("total"=>$total,"list"=>$list);
	}
	public function getPartnerDefine($no,$kind)
	{
	    $where = "cKind_Partner=:kind ";
	    $exec[':kind']= $kind;
	    if($no && count($no)){
	        $nos = "";
	        foreach($no as $val){
	            if($nos) $nos .= ",";
	            $nos .= $val;
	        }
	        $where .= "AND iIdx_Partner IN ($nos) ";
	    }
	    $sql = "SELECT * FROM dgb_Partner WHERE $where";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    return $query->fetchAll();
	}
	public function getDealerApply()
	{
	    $select = "*";
	    $where = "iState_Partner=:state";      // cKind_Partner=:kind AND 
	    $sql = "SELECT * FROM dgb_Partner WHERE $where";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':state'=>1));   // ,':kind'=>'dealer'
	    return $query->fetchAll();
	}
	public function addGoods($data)
	{
	    $dataSet = dbDataSet($data);
	    $sql = "INSERT INTO dgb_Goods SET ".$dataSet['fields'].",dInsert_Goods=now()";
	    $query = $this->db->prepare($sql);
	    $query->execute($dataSet['values']);
	    return $this->db->lastInsertId();
	}
	public function updateGoods($idx,$data)
	{
	    $dataSet = dbDataSet($data);
	    $dataSet['values'][':idx'] = $idx;
	    $where = "iIdx_Goods=:idx ";
	    $sql = "UPDATE dgb_Goods SET ".$dataSet['fields']." where ".$where;
	    $query = $this->db->prepare($sql);
	    $query->execute($dataSet['values']);
	}
	public function updateGoodsState1($kind)
	{
	    $where = "iState_Goods=:state2 AND cKind_Goods=:kind ";
	    $sql = "UPDATE dgb_Goods SET iState_Goods=:state1 where ".$where;
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':kind' => $kind,':state1' => 1,':state2' => 2));
	}
	public function getGoodsView($idx)
	{
	    $select = "*";
	    $where = "iIdx_Goods=:idx AND iState_Goods!=:state ";
	    $sql = "SELECT $select FROM dgb_Goods  WHERE $where ";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':idx' => $idx,':state' => 9));
	    return $query->fetch();
	}
	public function getGoodsList($unit, $page)
	{
	    $where = "iState_Goods!=:state ";
	    $exec[':state']= 9;
	    if(isset($_GET['kind']) && $_GET['kind']!=""){
	        $where .= "AND cKind_Goods=:kind ";
	        $exec[':kind']= $_GET['kind'];
	    }
	    if(isset($_GET['search']) && $_GET['search'] && isset($_GET['keyword']) && $_GET['keyword']){
	        if($_GET['search']=="name") $where .= "AND cName_Goods  LIKE CONCAT('%', :keyword ,'%') ";
	        else if($_GET['search']=="memo") $where .= "AND cMemo_Goods  LIKE CONCAT('%', :keyword ,'%') ";
	        $exec[':keyword']= $_GET['keyword'];
	    }
	    $sql = "SELECT COUNT(*) as count FROM dgb_Goods WHERE $where ";
	    $query = $this->db->prepare($sql);
	    if(isset($exec)) $query->execute($exec);
	    else $query->execute();
	    $total = $query->fetch();
	    
	    $from = $unit * ($page - 1);
	    $odr = "iState_Goods DESC, iIdx_Goods DESC ";
	    $sql = "SELECT * FROM dgb_Goods WHERE $where ORDER BY $odr LIMIT $from,$unit ";
	    $query = $this->db->prepare($sql);
	    if(isset($exec)) $query->execute($exec);
	    else $query->execute();
	    $list = $query->fetchAll();
	    return array("total"=>$total,"list"=>$list);
	}
	public function getGoodsCopyList($kind,$idx)
	{
	    $where = "cKind_Goods=:kind AND dApply_Goods!=:apply AND iIdx_Goods!=:idx";
	    $exec[':kind']= $kind;
	    $exec[':idx']= $idx;
	    $exec[':apply']= "0000-00-00 00:00:00";
	    $odr = "iState_Goods DESC, iIdx_Goods DESC ";
	    $sql = "SELECT * FROM dgb_Goods WHERE $where ORDER BY $odr LIMIT 10 ";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    return $query->fetchAll();
	}
	public function copyGoodsSet($idx,$copy)
	{
	    $exec[':idx']= $idx;
	    $exec[':copy']= $copy;
	    $sql = "UPDATE dgb_Goods SET tSet_Goods=(SELECT A.tSet_Goods FROM dgb_Goods A WHERE A.iIdx_Goods=:copy) WHERE iIdx_Goods=:idx";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	}
	public function copyGoodsConfig($idx,$copy)
	{
	    $sql = "CREATE TEMPORARY TABLE temp_config AS SELECT * FROM dgb_GoodsConfig WHERE iIdx_Goods=:copy";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':copy' => $copy));
	    $sql = "UPDATE temp_config set iIdx_Goods=:idx";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':idx' => $idx));
	    $sql = "INSERT INTO dgb_GoodsConfig SELECT * FROM temp_config";
	    $query = $this->db->prepare($sql);
	    $query->execute();
	}
	public function getGoodsConfigCount($idx)
	{
	    $exec[':idx']= $idx;
	    $sql = "SELECT count(*) as count FROM dgb_GoodsConfig WHERE iIdx_Goods=:idx"; 
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    return $query->fetch();
	}
	public function getGoodsConfigList($idx,$table,$code)
	{
	    $where = "iIdx_Goods=:idx ";
	    $exec[':idx']= $idx;
	    if($table){
	        $where .= "AND cTable_Vehicle=:table AND iIdx_Vehicle IN($code)";
	        $exec[':table']= $table;
	    }
	    $sql = "SELECT * FROM dgb_GoodsConfig WHERE $where";
	    $query = $this->db->prepare($sql);
	    $query->execute($exec);
	    return $query->fetchAll();
	}
	public function changeUpdateGoodsConfig($tname){
	    $sql = "INSERT INTO dgb_GoodsConfig (iIdx_Goods,cTable_Vehicle,iIdx_Vehicle,tData_Config,dUpdate_Config) ";
	    $sql .= "VALUES (:idx,:tname,:tcode,:data,now()) ";
	    $sql .= "ON DUPLICATE KEY UPDATE tData_Config=:data,dUpdate_Config=now()";
	    $del = "DELETE FROM dgb_GoodsConfig WHERE iIdx_Goods=:idx AND cTable_Vehicle=:tname AND iIdx_Vehicle=:tcode";
	    foreach ($_POST['codes'] as $code) {
	        $val = "";
	        foreach ($_POST['config'] as $key => $config) {
	            $_POST["config_".$code."_".$config] = trim($_POST["config_".$code."_".$config]);
	            if($config=="Delivery1" && strlen($_POST["config_".$code."_".$config])==6){
	                $_POST["config_".$code."_".$config] = substr($_POST["config_".$code."_".$config],0,3)." ".substr($_POST["config_".$code."_".$config],3,3);
	            }
	            if($key==0 && trim($_POST["config_".$code."_".$config]) != ""){
	                $val .= $config."\t".trim($_POST["config_".$code."_".$config]);
	            }else if($key>0 && $val){
	                $val .= "\n".$config."\t".trim($_POST["config_".$code."_".$config]);
	            }
	        }
	        if($val){
	            $query = $this->db->prepare($sql);
	            $query->execute(array(':idx' => $_POST['idx'],':tname' => $tname,':tcode' => $code,':data' => $val));
	        }else{
	            $query = $this->db->prepare($del);
	            $query->execute(array(':idx' => $_POST['idx'],':tname' => $tname,':tcode' => $code));
	        }
	    }
	}
	public function deleteGoodsConfig($idx,$tname,$tcode){
	    $del = "DELETE FROM dgb_GoodsConfig WHERE iIdx_Goods=:idx AND cTable_Vehicle=:tname AND iIdx_Vehicle=:tcode";
	    $query = $this->db->prepare($del);
	    $query->execute(array(':idx' => $idx,':tname' => $tname,':tcode' => $tcode));
	}
	
	// changeUpdateGoodsConfig
	
	public function getCodesList($grp)
	{
	    $select = "*";
	    $where = "cGroup_Codes=:grp";
	    $sql = "SELECT $select FROM caps_Codes WHERE $where ORDER BY iOrder_Codes ASC";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':grp' => $grp));
	    return $query->fetchAll();
	}
	public function getCodesView($grp,$cod)
	{
	    $select = "*";
	    $where = "cGroup_Codes=:grp AND cCode_Codes=:cod";
	    $sql = "SELECT $select FROM caps_Codes WHERE $where";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':grp' => $grp,':cod' => $cod));
	    return $query->fetch();
	}
	public function getCodesApply()
	{
	    $select = "*";
	    $where = "cGroup_Codes!=:grp and iState_Codes=:state";
	    $sql = "SELECT * FROM caps_Codes WHERE $where ORDER BY iOrder_Codes ASC";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':state'=>1,':grp'=>'group'));
	    return $query->fetchAll();
	}
	public function addCodes($data)
	{
	    $dataSet = dbDataSet($data);
	    $sql = "INSERT INTO caps_Codes SET ".$dataSet['fields'];
	    $query = $this->db->prepare($sql);
	    $query->execute($dataSet['values']);
	    return $this->db->lastInsertId();
	}
	public function updateCodes($grp,$cod,$data)
	{
	    $dataSet = dbDataSet($data);
	    $dataSet['values'][':grp'] = $grp;
	    $dataSet['values'][':cod'] = $cod;
	    $where = "cGroup_Codes=:grp AND cCode_Codes=:cod";
	    $sql = "UPDATE caps_Codes SET ".$dataSet['fields']." where ".$where;
	    $query = $this->db->prepare($sql);
	    $query->execute($dataSet['values']);
	}
	public function changeOrderCodes($grp,$cod){
	    $sql = "UPDATE caps_Codes SET iOrder_Codes=:odr WHERE cGroup_Codes=:grp AND cCode_Codes=:cod";
	    $query = $this->db->prepare($sql);
	    $odr = 10;
	    foreach ($cod as $val) {
	        $odr ++;
	        $query->execute(array(':odr' => $odr, ':cod' => $val, ':grp' => $grp));
	    }
	}
	public function changeGroupCodes($cod,$codO)
	{
	    $sql = "UPDATE caps_Codes SET cGroup_Codes=:cod WHERE cGroup_Codes=:codO";
	    $query = $this->db->prepare($sql);
	    $query->execute(array(':cod' => $cod, ':codO' => $codO));
	}
}