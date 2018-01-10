
<?php
	include('./php/dbconnection.php');
    $query = "SELECT * FROM vocab";  
    $run = mysqli_query($connection, $query);
	$myJSON = array ();
	while($result = mysqli_fetch_assoc($run)){

		array_push($myJSON,$result);
	}	
?>
<script type="text/javascript" language="javascript">
	vocab =<?php echo json_encode($myJSON); ?> ;
	console.log(vocab);
	let vocabMine = vocab;
</script>

<!DOCTYPE html>
<html>

	<head>
		<meta http-equiv="content-type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale =1.0">
		<title>Vocab Trainer - @sleepypioneer </title>

		<!-- Add icon library -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

		<!-- Add Google Fonts -->
		<link href="https://fonts.googleapis.com/css?family=Nova+Round|Numans|Orbitron|NTR|Poiret+One" rel="stylesheet">

		<!-- Add Style Sheet -->
		<link rel="stylesheet" type="text/css" href="styleSheets/mainStyles.css">

	</head>

	<body>
		<noscript> This site needs JavaScript to run </noscript>

		<nav>
			<ul class="rowNav topbar">
				<li id="home">
					<i class="fa fa-home" aria-hidden="true"></i>
				</li>
				<li id="timer" style="font-size: large;"></li>
				<li id="score">
					<i class="fa fa-trophy" aria-hidden="true"></i>
					<h4> <span id="actualScore"></span>pts</h4>
				</li>
				<li id="account">
					<i class="fa fa-user-circle-o" aria-hidden="true"></i>
				</li>
			</ul>
		</nav>



		<div id="content">

		</div>


		<div class="footer">
			<div class="banner wide-nav">
				<p>
					Also works offline!
				</p>
			</div>
		</div>

		<script src="scripts/mainScripts.js"></script>
		<script src="scripts/popups.js"></script>
	</body>

</html>

<?php


   	mysqli_close($connection);     
?>