<?php
$server     = "localhost";
$username   = "root";
$password   = "";
$database   = "vocab_trainer";

try {
    $connection = mysqli_connect($server, $username, $password, $database);
    
    if($connection){
    }
} catch (Exception $errormsg){
    //echo $errormsg->getMessage();
}



?>