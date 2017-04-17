<?php
include_once("dbconn.php");

try {
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
 $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 $inputpw = $_POST["pw"];
 $inputName = $_POST["userid"];
 $inputEmail = $_POST["Email"];
 
 $que = $conn->prepare("insert into users (user_name, user_email, user_pw) values (:userid, :Email, md5(:pw) )");
 $que->bindParam(':userid', $inputName);
 $que->bindParam(':Email', $inputEmail);
 $que->bindParam(':pw', $inputpw);
 $que->execute();
 
 $conn=null;
}
catch (PDOException  $e) {
  /*** if we are here, something has gone wrong ***/
  if ($e->getCode() === 42000) {
        exit("Query could not be executed!<br/>");
    } elseif ($e->getCode() === 1045) {
        exit("Unable to make a connection to the database");
    } else {
        exit($e->getMessage());
    }
}

?>

<html>
    <body>
        <h3>
            Thanks for registering, your username is <?=$_POST["userid"]?>
            <br />
            <a href="../index.php">Back to index</a>
            
        </h3>
        
    </body>
    
    
</html>