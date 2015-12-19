<?php 
require_once('check.php');
$csv = new parseCSV();
$csv->parse('../00_ADMIN_CSV_FOLDER/bodytype_service_pricing_minutes.csv');
$bodytype_service = array($csv->data);

$csv->parse('../00_ADMIN_CSV_FOLDER/extra_pricing_minutes.csv');
$extra_pricing = array($csv->data);

$csv->parse('../00_ADMIN_CSV_FOLDER/service_discounts.csv');
$service_discounts = array($csv->data);
?>