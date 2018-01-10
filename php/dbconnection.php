<?php
$server     = "localhost";
$username   = "root";
$password   = "";
$database   = "vocab_trainer";

try {
    $connection = mysqli_connect($server, $username, $password, $database);
    
    if($connection){
        // set this color a symbol in nav bar to show that db is connected, similary the erro should change the element to red
        echo "Database connection was successful";
    }
} catch (Exception $errormsg){
    echo $errormsg->getMessage();
}



?>