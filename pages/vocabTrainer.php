<?php
    include('../php/dbconnection.php');
    $query = "SELECT * FROM vocab";  
    $run = mysqli_query($connection, $query);
    $result = mysqli_fetch_assoc($run);
?>

<script type="text/javascript">
    let vocab2 = <?php echo json_encode($result, JSON_PRETTY_PRINT) ?>;
    console.log(vocab2);
</script>
<!-- vocab Trainer page -->
<div>
	<div>
		<h3>Write the word below in <span class="titleText">German</span> with the correct Article </h3>
	</div>

	<div class="input">
		<h1 id="wordToGuess">Website</h1>
		<input type="text" class="answer" id="answer" placeholder="Your Answer.." pattern="[A-Za-z]"/>
		<form class="rowNav">
			<input type="button" id="back" value="<" />
			<i id="hint" class="fa fa-question-circle" aria-hidden="true"></i>
			<i id="info" class="fa fa-info-circle" aria-hidden="true"></i>
			<input type="button" id="next" value=">" />
		</form>
	</div>
</div>


<?php
   mysqli_close($connection);     
?>