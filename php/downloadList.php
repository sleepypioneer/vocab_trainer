<?php
    $ListToDownload = $_GET["listToDownload"] ;
	include('dbconnection.php');
    $query = "SELECT * FROM ".$ListToDownload; 
    $myJSON1 = array ();
    $run = mysqli_query($connection, $query);
	while($result = mysqli_fetch_assoc($run)){
       array_push($myJSON1,$result);
	}	
    echo json_encode($myJSON1);

   	mysqli_close($connection);     
?> 