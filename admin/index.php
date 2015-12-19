
<?php 
require_once('check.php');
require_once('csv-to-array.php');
include_once('template/header.php');

$sql = "SELECT tbl_customer.cus_id, salutation, full_name, vehicleMake, vehicleModel, body_type,
               date_placed FROM tbl_customer,
               tbl_order, tbl_customer_vehicle WHERE tbl_customer.cus_id = tbl_order.cus_id
               AND tbl_customer_vehicle.order_id = tbl_order.order_id;
                ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["cus_id"]. " - Name: " . $row["full_name"]. " " . $row["date_placed"].
        $row['vehicleMake']. " " . $row['vehicleModel']."<br>";
        
        foreach($bodytype_service as $cost => $cw)
     {
          
      foreach($cw as $cc => $dd)
      {
         if($dd['vehicle_class_definition'] == $row['body_type'])
          echo "Cost: $" . $dd['car_wash_cost']. "<br/>";;
          
      }
      
  }  
        
        }
} else {
    echo "0 results";
}
$conn->close();

  


?>

<a href="logout.php">Log Out</a>
<?php include_once('template/footer.php'); ?>