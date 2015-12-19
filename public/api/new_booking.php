<?php
$salutation = $_POST['title'];
$full_name = $_POST['fullname'];
$contact_number = $_POST['phone'];
$email = $_POST['email'];
$address = $_POST['booking_place'];

$time = $_POST['booking_time'];


if(isset($salutation) && isset($full_name) && isset($contact_number)
     && isset($email) && isset($address)){
    
    require_once('../../admin/lib/db.php');

    $sql = "INSERT INTO tbl_customer(salutation, full_name, contact_number, email, address)
            VALUES('".$salutation."', '".$full_name."', '".$contact_number."','".$email."', '".$address."');";
    
    if ($conn->query($sql) === TRUE) {
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
     $sql = "INSERT INTO tbl_order(date_placed,cus_id)
             VALUES('".$time."','".$conn->insert_id."');";
    
    if ($conn->query($sql) === TRUE) {
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $order_id = $conn->insert_id;
    
    $index=0;
    //for each vehicle entered add it to the database
    foreach ($_POST['vehicleMake'] as $vehicleMake)
    {
        $vehicleModel = $_POST['vehicleModel'][$index];
    
         $sql = "INSERT INTO tbl_customer_vehicle(vehicleMake, vehicleModel, pet_hair, tyre_shine,
                 dashboard_shine, intensive_inside, bug_tar_removal, order_id)
                 VALUES('".$vehicleMake."','".$vehicleModel."','".$POST['pet_hair'][$index]."', '".$POST['tyre_shine'][$index]."',
                 '".$POST['dashboard_shine'][$index]."', '".$POST['intensive_inside'][$index]."', '".$POST['bug_tar_removal'][$index]."',
                 '".$order_id."');";

        if ($conn->query($sql) === TRUE) {
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
            
        $index=$index+1;
    }
    
    $conn->close();
}else{
     echo("Please enter all values on the booking form");   
    }
?>