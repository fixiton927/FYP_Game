<?php
session_start();

include_once("dbconn.php");

try {
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
 $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
 $input_password = $_POST["passwordinput"];
 $input_username = $_POST["username"];
 
 $que = $conn->prepare("select user_id from users where user_name = :username AND user_pw = md5(:pw)");
 $que->bindParam(':username', $input_username);
 $que->bindParam(':pw', $input_password);
 $que->execute();
 
 $user_id_bool = $que->fetchColumn();
 
   if ($user_id_bool == false) {
    echo "Wrong password or username, please check again ";
    echo "<a href = ../index.php>Back to login page</a>";
  }
  
  else {
      $_SESSION["uid"] =$user_id_bool;
      $_SESSION["uname"] =$input_username;
      setcookie("cid", $user_id_bool, time()+60*60);
      echo "login success";
      echo "<a href = ../index.php>Back to login page</a>";
      
  }
} 
catch (Exception $e) {
  /*** if we are here, something has gone wrong ***/
  $message = 'We are unable to process your request. ' .
             $e->getMessage();
  
  echo $message;
 }
 
 


?>
<html>
<head>
  <title>PHP Login</title>
</head>

<body>
<p>
    
</body>
</html>


