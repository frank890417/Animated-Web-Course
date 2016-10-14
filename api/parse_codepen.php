<?php
	// ini_set('display_errors', 1);
	// ini_set('display_startup_errors', 1);
	// error_reporting(E_ALL);
	
	header("Content-Type:text/html; charset=utf-8");
  header('Access-Control-Allow-Origin: *');  
  	// mb_internal_encoding('UTF-8');

  $type="json";

  if (isset($_GET["type"]))
    $type=$_GET["type"];  
  
  $urls=$_GET["urls"];
  $alldata=array();

  for($i=0;$i<count($urls);$i++){
    array_push($alldata,parsePen($urls[$i]));
  }

  // Print the entire match result
  if ($type=="json"){
      echo json_encode($alldata);
      
  }else if ($type=="printr"){
      print_r($alldata);
  }

  
  function parsePen($url){
    //parse meta og data
    $alltext =  file_get_contents($url);
    $re = '/(og.*)\" content=\"(.*?)\"/';
    preg_match_all($re, $alltext, $matches);


    $data=array();
    for($i=0;$i<count($matches[1]);$i++){
      $dataname=str_replace(":","_",$matches[1][$i]);
      $data[$dataname]=$matches[2][$i];
    }
    return $data;
  }

?>