<?php
$_GET["listToDownload"]
	include('dbconnection.php');
    $query = "SELECT ".$_GET["listToDownload"] ;  
    $run = mysqli_query($connection, $query);
	while($result = mysqli_fetch_assoc($run)){
		

        echo $result;


	}	

   	mysqli_close($connection);     
?> 