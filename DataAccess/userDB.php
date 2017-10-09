<?php
ini_set('memory_limit','4024M');

require("../Entity/user.php");
require("../Util/Utils.php");

if (isset($_POST['fromDate'])) {

        echo GetRequestedUsers($_POST['fromDate'],$_POST['toDate'],$_POST['userType']);
    }
    else
    {
    	echo GetRequestedUsersTest();
    }


function GetRequestedUsers($fromDate,$toDate,$type)
{
$conn = Utils::getConnectionObject();
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}

    $sql = "";

	if($type == "Both")
    {
        $sql ="
SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p on vandalusers.pagetitle = p.pagetitle
 where revtime between '".$fromDate."' and '".$toDate. "'"
    .
        "union all
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#F6B67F' as color,p.pagecategories  FROM benignusers
 JOIN pages p on benignusers.pagetitle = p.pagetitle
 where revtime between '".$fromDate."' and '".$toDate. "'"
    ;
    }else if($type == "Benign")
    {
        $sql ="
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#F6B67F' as color,p.pagecategories  FROM benignusers
 JOIN pages p on benignusers.pagetitle = p.pagetitle
 where revtime between '".$fromDate."' and '".$toDate. "'";

    }
    else
    {
        $sql ="
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p on vandalusers.pagetitle = p.pagetitle
 where revtime between '".$fromDate."' and '".$toDate. "'";

    }

	try{



	$result = $conn->query($sql);
	$itemsData = array();
		if ($result->num_rows > 0) {
		    while($row = $result->fetch_assoc()) {
		    		$toAdd = new user($row["username"],$row["revtime"],$row["pagetitle"],$row["isReverted"],$row["revertTime"],$row["color"],$row["pagecategories"]);
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

 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p ON vandalusers.pagetitle = p.pagetitle
 where revtime between '2013-12-01' and '2013-12-30'
	";
	$result = $conn->query($sql);
	$itemsData = array();
		if ($result->num_rows > 0) {
		    while($row = $result->fetch_assoc()) {
		    		$toAdd = new user($row["username"],$row["revtime"],$row["pagetitle"],$row["isReverted"],$row["revertTime"],$row["color"],$row["pagecategories"]);
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