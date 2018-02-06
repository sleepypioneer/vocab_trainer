<?php
	include('dbconnection.php');
    $query = "SHOW TABLES";  
    $run = mysqli_query($connection, $query);
	while($result = mysqli_fetch_assoc($run)){
		
?> 

<html>
    <option value="<?php echo $result['Tables_in_vocab_trainer']; ?>">
    <?php echo $result['Tables_in_vocab_trainer']; ?> 
    </option>
</html>
        
<?php
	}	

   	mysqli_close($connection);     
?> 