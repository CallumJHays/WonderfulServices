CREATE TABLE tbl_customer_vehicle(
int veh_id primary AUTO_INCREMENT;
vehicleMake varchar(15) not null;
vehicleModel varchar(15);
int pet_hair;
int tyre_shine;
int dashboard_shine;
int intensive_inside;
int bug_tar_removal;

int order_id;
);

CREATE table tbl_customer(
int cus_id primary AUTO_INCREMENT;
salutation varchar(5) not null;
full_name varchar(30) not null;
number varchar(20) not null;
email varchar(20) not null;
address var
);

CREATE TABLE tbl_order(
int order_id primary AUTO_INCREMENT;
int cus_id;
date date_placed not null;
);