<?php
	ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

	
	header("Content-Type:text/html; charset=utf-8");
  header('Access-Control-Allow-Origin: *');  
  	// mb_internal_encoding('UTF-8');


  //determine args
  $type="json";

  if (isset($_GET["type"]))
    $type=$_GET["type"];  
  
  $urls=$_GET["urls"];
  $alldata=[];

  $cachetxt=file_get_contents("data/codepen_cache.txt");
  $cache=(array)json_decode($cachetxt);
  // print_r($cache);

  // parsing all url in urls
  for($i=0;$i<count($urls);$i++){
    $now_url=$urls[$i] ;
    $re = '/pen\/([a-zA-Z]*)/';
    $str = $now_url;

    preg_match_all($re, $str, $matches);
    $key_url=$matches[1][0];
    // Print the entire match result
    // print_r($matches);
    // echo array_key_exists ($key_url,$cache);

    if (!array_key_exists ($key_url,$cache)){
       // echo "parse!!! ".$key_url."<br>";
       $parse_data=parsePen($now_url);
       $cache[$key_url] = $parse_data;

       array_push($alldata,$parse_data);
    }else{
      // echo "not null..";
      // print_r($cache->$key_url);
      // echo $cache->$key_url;
      array_push($alldata,$cache[$key_url]);
    }

    

  }
  file_put_contents("data/codepen_cache.txt", json_encode($cache));

  // Print the entire match result
  if ($type=="json"){
      echo json_encode($alldata);
      
  }else if ($type=="printr"){
      print_r($alldata);
  }
  // echo "end";

  //get pen data
  function parsePen($url){
    //parse meta og data
    $parse_url=str_replace("/pen/", "/full/",$url );

    $alltext =  file_get_contents($parse_url);
    $re = '/(og.*)\" content=\"(.*?)\"/';
    preg_match_all($re, $alltext, $matches);


    $data=[];
    $data["url"]=$url;
    $data["time"]= date('Y-m-d H:i:s');
    // print_r($matches);
    for($o=0;$o<count($matches[1]);$o++){
      $dataname=str_replace(":","_",$matches[1][$o]);
      $data[$dataname]=$matches[2][$o];
    }
    return $data;
  }

?>