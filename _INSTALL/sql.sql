CREATE TABLE tbl_customer_vehicle(
veh_id int AUTO_INCREMENT,
vehicleMake varchar(15) not null,
vehicleModel varchar(15),
pet_hair int,
tyre_shine int,
dashboard_shine int,
intensive_inside int,
bug_tar_removal int,
order_id int,
PRIMARY KEY(veh_id)
);

CREATE table tbl_customer(
cus_id int AUTO_INCREMENT,
salutation varchar(5) not null,
full_name varchar(30) not null,
contact_number varchar(20) not null,
email varchar(20) not null,
address varchar(30) not null,
PRIMARY KEY(cus_id)
);

CREATE TABLE tbl_order(
order_id int AUTO_INCREMENT,
cus_id int,
date_placed date not null,
PRIMARY KEY(order_id)
);