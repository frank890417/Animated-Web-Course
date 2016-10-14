<?php
	// ini_set('display_errors', 1);
	// ini_set('display_startup_errors', 1);
	// error_reporting(E_ALL);
	
	header("Content-Type:text/html; charset=utf-8");
  	header('Access-Control-Allow-Origin: *');  
  	mb_internal_encoding('UTF-8');

    $msg="";

    if (isset($_GET["account"])){

      $filename="data/account/".$_GET["account"].".txt";

      if ($_GET["type"]=="save"){
        file_put_contents($filename, $_GET["data"]);
        $msg="save success!!";
      }else{
        if (file_exists($filename)){
            $msg="success get from ".$_GET["account"];
            $data=file_get_contents($filename);

        }else{
            $msg= "This Account is empty and ok to use.";
        } 
      }

      $response=Array();
      $response["msg"]=$msg;
      if ($data) $response["data"]=$data;
      
      if ($_GET["type"]=="show")
        var_dump($response);
      else
        echo json_encode($response);
    }



?>