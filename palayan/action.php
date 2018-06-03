<?php
if(isset($_POST['field1'])) {
    $data = $_POST['field1'];
    
    /*if($ret === false) {
      die('There was an error writing this file');
    }
    else {
        echo "$ret bytes written to file";
    }
}
else {
   die('no post data to process');*/
   
    $crime=NULL;
    $cost=NULL;
    $traffic=NULL;
    $lat=NULL;
    $long=NULL;
    
    //header("Location: index1.html");
   $handle = @fopen("Crime.txt", "r");
    if ($handle) {
       $flag=0;
       while (!feof($handle)) {
          $entry_array = explode(" ",fgets($handle));
          if ($entry_array[0] == $data) {
          $crime=$entry_array[1];
          $flag=1;
          //echo $crime," ";
          break;
      }
    }
 
  }
  fclose($handle);
  
  
  $handle = @fopen("Cost.txt", "r");
    if ($handle) {
       while (!feof($handle)) {
          $entry_array = explode(" ",fgets($handle));
          if ($entry_array[0] == $data) {
          $cost=$entry_array[1];
          //echo $cost," ";
          break;
      }
    }
  }
  fclose($handle);
 
  $handle = @fopen("Traffic.txt", "r");
    if ($handle) {
       while (!feof($handle)) {
          $entry_array = explode(" ",fgets($handle));
          if ($entry_array[0] == $data) {
          $traffic=$entry_array[1];
          echo $traffic," ";
          break;
      }
    }
  }
  fclose($handle);
  
  
  $handle = @fopen("latlong.txt", "r");
    if ($handle) {
       while (!feof($handle)) {
          $entry_array = explode(" ",fgets($handle));
          if ($entry_array[2] == $data) {
          $lat=$entry_array[0];
          $long=$entry_array[1];
          //echo $lat," ",$long;
         
          break;
      }
    }
  }
  fclose($handle);
  if ($crime==NULL)
	$crime="Not_Found\n";
  if ($cost==NULL)
	$cost="Not_Found\n";
  if ($traffic==NULL)
	$traffic="Not_Found\n";
  if ($lat==NULL)
	$lat=0.00;
  if ($long==NULL)
	$long=0.00;
  $handle = @fopen("data.txt", "w");
  //$ret = file_put_contents('data.txt', $crime,$traffic,$cost);
  //$param=$cost.$crime.$traffic.$lat.'\n'.$long;
  fprintf($handle, "%s%s%s%s\n%s",$cost,$crime,$traffic,$lat,$long);
  fclose($handle);
  //file_put_contents('data.txt', $param);
  header("Location: index1.html");
}

