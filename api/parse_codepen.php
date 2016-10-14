<?php
	// ini_set('display_errors', 1);
	// ini_set('display_startup_errors', 1);
	// error_reporting(E_ALL);
	
	header("Content-Type:text/html; charset=utf-8");
  header('Access-Control-Allow-Origin: *');  
  	// mb_internal_encoding('UTF-8');

  //determine args
  $type="json";

  if (isset($_GET["type"]))
    $type=$_GET["type"];  
  
  $urls=$_GET["urls"];
  $alldata=array();

  $cachetxt=file_get_contents("data/codepen_cache.txt");
  $cache=json_decode($cachetxt);

  // print_r($cache);

  //parsing all url in urls
  for($i=0;$i<count($urls);$i++){
    $now_url=$urls[$i] ;
    $re = '/pen\/([a-zA-Z]*)/';
    $str = $now_url;

    preg_match_all($re, $str, $matches);
    $key_url=$matches[1][0];
    // Print the entire match result
    // print_r($matches);

    // print_r($cache->$key_url);

    if (is_null ($cache->$key_url)){
       // echo "parse!!! ".$key_url."<br>";
       $parse_data=parsePen($now_url);
       // echo $parse_data;
       $cache->$key_url=$parse_data;
    }else{
      // print_r($cache->$key_url);
      // echo $cache->$key_url;
    }

    array_push($alldata,$cache->$key_url);

  }
  file_put_contents("data/codepen_cache.txt", json_encode($cache));

  // Print the entire match result
  if ($type=="json"){
      echo json_encode($alldata);
      
  }else if ($type=="printr"){
      print_r($alldata);
  }

  //get pen data
  function parsePen($url){
    //parse meta og data
    $parse_url=str_replace("/pen/", "/full/",$url );

    $alltext =  file_get_contents($parse_url);
    $re = '/(og.*)\" content=\"(.*?)\"/';
    preg_match_all($re, $alltext, $matches);


    $data=array();
    $data["url"]=$url;
    // print_r($matches);
    for($i=0;$i<count($matches[1]);$i++){
      $dataname=str_replace(":","_",$matches[1][$i]);
      $data[$dataname]=$matches[2][$i];
    }
    return $data;
  }

?>