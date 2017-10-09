<?php

/**
* 
*/
class User 
{
	
	var $username;
	var $revtime;
	var $pagetitle;
	var $isReverted;
	var $revertTime;
	var $color;
	var $pageCategory;

	function __construct($username,$revtime,$pagetitle,$isReverted,$revertTime,$color,$pageCategory)
	{
		$this->username = $username;
		$this->revtime = $revtime;
		$this->pagetitle = $pagetitle;
		$this->isReverted = $isReverted;
		$this->revertTime = $revertTime;
		$this->color = $color;
		$this->pageCategory = $pageCategory;
	}


}

?>
