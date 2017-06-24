<?php


class Utils{
    const SERVER_NAME = "localhost";
    const USER_NAME = "root";
    const PASSWORD = "root";
    const DB_NAME = "wiki_data";


    public static function getsome()
    {
    	return "from the function";
    }

    public static function getConnectionObject()
    {
		return mysqli_connect(Utils::SERVER_NAME, Utils::USER_NAME, Utils::PASSWORD, Utils::DB_NAME);
    }
}


?>