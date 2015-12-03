<?php
	require 'slim/slim/Slim/Slim.php';
	\Slim\Slim::registerAutoLoader();

	$app = new \Slim\Slim();

	// returns future dates on which 2 bookings have been made
	$app->get('/fullybooked/', function(){
		$respBody = array();
		// $db creation goes here. Cannot show over github as it contains credentials for SQL server on my site

		$result = $db->query("SELECT start_time FROM bookings where start_time >= NOW() order by start_time");
		$lastDate = 0; 
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	$currentDate = date('Y-m-d', strtotime($row["start_time"]));
		    	if($currentDate == $lastDate){
		    		$respBody[] = $currentDate;
		    	}
		        $lastDate = $currentDate;
		    }
		} else {
		    $respBody[] = "0 results";
		}

		echo json_encode($respBody);
		$db->close();
	});

	$app->get('/', function(){
		echo "You're not wanted here.";
	});

	$app->run();
?>