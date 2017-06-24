<?php

require("../Entity/user.php");
require("../Util/Utils.php");

if (isset($_POST['fromDate'])) {

        echo GetRequestedUsers($_POST['fromDate'],$_POST['toDate']);
    }
    else
    {
    	echo GetRequestedUsersTest();
    }


function GetRequestedUsers($fromDate,$toDate)
{
$conn = Utils::getConnectionObject();
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	try{
	$sql = "
 SELECT username,revtime,pagetitle,isReverted,revertTime,'#f00' as color FROM vandalUsers 
 where revtime between '".$fromDate."' and '".$toDate. "'";
	
	$result = $conn->query($sql);
	$itemsData = array();
		if ($result->num_rows > 0) {
		    while($row = $result->fetch_assoc()) {
		    		$toAdd = new user($row["username"],$row["revtime"],$row["pagetitle"],$row["isReverted"],$row["revertTime"],$row["color"]);
					$itemsData[] = $toAdd;
		    }
		}
		return json_encode($itemsData);
	}
	catch( Exception $e)
	{
		return json_encode($e);
	}
	$conn->close();

}

function GetRequestedUsersTest()
{
	$conn = Utils::getConnectionObject();
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	try{
	$sql = "

 SELECT username,revtime,pagetitle,isReverted,revertTime,'#f00' as color FROM vandalusers 
 where revtime between '2013-12-01' and '2013-12-30'
	";
	$result = $conn->query($sql);
	$itemsData = array();
		if ($result->num_rows > 0) {
		    while($row = $result->fetch_assoc()) {
		    		$toAdd = new user($row["username"],$row["revtime"],$row["pagetitle"],$row["isReverted"],$row["revertTime"],$row["color"]);
					$itemsData[] = $toAdd;
		    }
		}
		return json_encode($itemsData);
	}
	catch( Exception $e)
	{
		return json_encode($e);
	}
	$conn->close();
}

?>