<?php
header('Content-Type: application/json');
require_once '../parsecsv-for-php/parsecsv.lib.php';

$csv = new parseCSV();
$csv->parse('../../../00_ADMIN_CSV_FOLDER/bodytype_service_pricing_minutes.csv');
echo json_encode($csv->data);

?>