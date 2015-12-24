<html>
    <head>
        <title>Wonderful Services Installer</title>
    </head>
    <body>
        <h1>WS Installer</h1>
        <h3>Databse Credentials</h3>
        <form action="install.php" method="post">
            <label for="servername">Server Name:</label>
            <input type="text" name="servername"/><br/>
            <label for="username">User Name:</label>
            <input type="text" name="username"/><br/>
            <label for="password">Password:</label>
            <input type="text" name="password"/><br/>
            <label for="dbname">Database Name:</label>
            <input type="text" name="dbname"/><br/>
            <input type="submit" value="Submit"/>
        </form>

<?php
$servername = $_POST['servername'];
$username = $_POST['username'];
$password = $_POST['password'];
$dbname = $_POST['dbname'];

//check for correct post values
if(isset($_POST['servername']) && isset($_POST['username']) && isset($_POST['dbname'])){
//checks what os we are using = unix based os is required for this installer
function serverOS()
{
    $sys = strtoupper(PHP_OS);
 
    if(substr($sys,0,3) == "WIN")
    {
        $os = 1;
    }
    elseif($sys == "LINUX")
    {
        $os = 2;
    }
    else
    {
        $os = 3;
    }
 
    return $os;
}

if(serverOS() == 2){

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//get the installer files for sql tables
$login_db = file_get_contents('_INSTALL/login.sql');
$main_db = file_get_contents('_INSTALL/main.sql');

$sql = $login_db;

if ($conn->query($sql) === TRUE) {
    echo "<p>Tables in Login.sql created successfully</p>";
} else {
    echo "<p>Error creating table: " . $conn->error . "</p>";
}

//create array for sql statements
$main_table = explode(';',$main_db);

//trim final comma of sql table
if(empty($main_table[count($main_table)-1])) {
    unset($main_table[count($main_table)-1]);
}


foreach($main_table as $main_db){

$sql = $main_db;

if ($conn->query($sql) === TRUE) {
    echo "<p>Tables in Login.sql created successfully</p>";
} else {
    echo "<p>Error creating table: " . $conn->error . "</p>";
}
}

//contents of database config gile created on the fly
$contents = '<?php

require_once "parsecsv-for-php/parsecsv.lib.php";

if(file_exists("../../install.php"))
{
    echo("Installer still exists - please delete");
    exit;
    
} 

$servername = "'.$servername.'";
$username = "'.$username.'";
$password = "'.$password.'";
$dbname = "'.$dbname.'";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

?>';
//save database file
file_put_contents('admin/lib/db.php', $contents);

echo "<p>Settings file created</p>";
//delete installer folder and change file permisisons
exec("rm _INSTALL -rf");
exec("chmod 644 00_ADMIN_CSV_FOLDER");

class DeleteOnExit
{
    function __destruct()
    { 
        unlink(__FILE__);
    }
}

//delete this current file
$g_delete_on_exit = new DeleteOnExit();

echo "<h2 style='color:green;'>Success - Installer completed!</h2>";
echo "<h3 style='color:green;'>Please navigate to /admin/ or /public/ to begin.</h3>";

}else
{
    echo "<h3>Warning - Software only compatible with Linux Based Operating systems</h3>";
}
}
?>
    </body>
</html>
