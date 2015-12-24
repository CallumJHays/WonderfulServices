<?php
//dummy content - this file is created by the installer
require_once "parsecsv-for-php/parsecsv.lib.php";

if(file_exists("../../install.php"))
{
    echo("Installer still exists - please delete");
    exit;
    
} 

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