<?php
	include('./php/dbconnection.php');
    $query = "SELECT * FROM vocab_standard";  
    $run = mysqli_query($connection, $query);
	$myJSON1 = array ();
	while($result = mysqli_fetch_assoc($run)){

		array_push($myJSON1,$result);
	}	
    $query2 = "SELECT * FROM vocab_shopping";  
    $run2 = mysqli_query($connection, $query2);
	$myJSON2 = array ();
	while($result2 = mysqli_fetch_assoc($run2)){

		array_push($myJSON2,$result2);
	}	
?>      


<script type="text/javascript" language="javascript">
    let importedVocab = <?php echo json_encode($myJSON2); ?>;
    


</javascript>

<?php
   	mysqli_close($connection);     
?> 