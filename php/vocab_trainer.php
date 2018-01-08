<?php
    include('../php/dbconnection.php');
    $query = "SELECT * FROM vocab";  
    $run = mysqli_query($connection, $query);
    $result = mysqli_fetch_assoc($run);
?>

<script type="text/javascript">
    var vocab2 = <?php echo json_encode($result, JSON_PRETTY_PRINT) ?>;
    console.log(vocab2);
</script>

<?php
   mysqli_close($connection);     
?>