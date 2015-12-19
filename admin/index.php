<?php 

require_once('check.php');
require_once('lib/db.php');


$sql = "SELECT tbl_customer.cus_id ,salutation, full_name, date_placed FROM tbl_customer, tbl_order WHERE tbl_customer.cus_id = tbl_order.cus_id; ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["cus_id"]. " - Name: " . $row["full_name"]. " " . $row["date_placed"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>

<a href="logout.php">Log Out</a>