<?php
	include('dbconnection.php');
    $query = "SHOW TABLES";  
    $run = mysqli_query($connection, $query);
	while($result = mysqli_fetch_assoc($run)){
		
?> 

<html>
    <li class="DBList" data-vocabList ="<?php echo $result['Tables_in_vocab_trainer']; ?>">DB: <?php echo $result['Tables_in_vocab_trainer']; ?> </li> 

</html>
        
<?php
	}	

   	mysqli_close($connection);     
?> 