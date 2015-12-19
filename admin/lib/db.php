<?php

require_once 'parsecsv-for-php/parsecsv.lib.php';

$servername = "localhost";
$username = "mattd360";
$password = "";
$dbname = "c9";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

?>