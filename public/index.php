<?php
include '../lib/php-login-minimal/index.php';
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"> 
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<script src="js/jquery.js"></script>
		<script src="js/moment-with-locales.js"></script>
		<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css"></link>
		<script src="bootstrap/js/bootstrap.js"></script>
		<script src="js/bootbox.min.js"></script>
		<link rel="stylesheet" href="css/bootstrap-datetimepicker.css"></link>
		<script src="js/bootstrap-datetimepicker.min.js"></script>
		<script src="js/papaparse.min.js"></script>
		<script src="js/validator.js"></script>
		<script src="js/bookingForm.js"></script>
	</head>

	<body>
		<div class="container">
			<div class="col-sm-offset-2 col-sm-8">
				<div class="col-sm-2">
					<img alt="Wonderful Services Logo" src="img/WSlogo.png" width="50px" height="50px">
				</div>
				<div class="col-sm-10">
					<h1>Wonderful Services Booking</h1>
					<p>Fill out this form to book your Wonderful Services car wash</p>
				</div>

				<form class="form-horizontal col-sm-12" id="bookings" role="form" action="api/new_booking" method="post">
                    <div class="form-group">
                    	<label class="control-label" for="title">Title:</label>
                    	<select class="serviceSelect form-control" id="title" name="title">
                    		<option>Mr.</option>
                    		<option>Mrs.</option>
                    		<option>Ms.</option>
                    		<option>Dr.</option>
                    		<option>Prof.</option>
                		</select>
                	</div>
					<div class="form-group">
						<label class="control-label" for="name">Full Name:</label>
						<input type="text" pattern="[a-z A-Z]+" data-error="Characters and spaces only" required class="form-control" id="fullname" name="fullname" placeholder="Enter full name">
						<div class="help-block with-errors"></div>
					</div>
					<div class="form-group">
						<label class="control-label" for="phone">Contact Number:</label>
						<input type="text" pattern="[+)0-9 (]{8,16}" data-error="Numbers, spaces, plus-signs and brackets only. Between 8 and 16 characters" required class="form-control" id="phone" name="phone" placeholder="Mobile / Landline">
						<div class="help-block with-errors"></div>
					</div>
					<div class="form-group">
						<label class="control-label" for="email">Email Address:</label>
						<input type="email" class="form-control" required data-error="Please input a valid email address" id="email" name="email" placeholder="you@email.com">
						<div class="help-block with-errors"></div>
					</div>
					<div class="form-group">
						<label class="control-label" for="booking_place">Address:</label>
						<input id="booking_place" name="booking_place" class="form-control" data-validateplace="place" required data-error="Please input a valid appointment address from maps address picker. Must be within an hours drive from Canefield's Clubhouse. CHANGE ERROR MESSAGE HERE TO BE MORE DESCRIPTIVE." type="text" placeholder="Appointment Address">
						<div id="map-canvas" class="col-sm-12" style="height:20vh"></div>
						<div class="help-block with-errors"></div>
						<script>
							// setup google maps
				      		function initMap(){
								$(window).trigger('gMapsLoaded');
				      		}
			      		</script>
					    <script async defer
				      		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaOPQK_wlM2RgpvZdMreY8pURP0shnY_s&libraries=places&callback=initMap">
				    	</script>
					</div>
					<br>
			        <div class="form-group">
			            <label>Vehicle list:</label>
			            <p>Describe the vehicles you would like us to wash, and we can give you a quote!</p>
	                    <div class="well clonedInput_1 col-sm-12" id="vehicle1">
	                    	<div class="col-sm-3">
	                    		<label class="control-label" for="vehicleMake">Make</label>
		                        <select class="form-control" id="vehicleMake" name="vehicleMake[]"></select>
	                        </div>
	                    	<div class="col-sm-3">
	                    		<label class="control-label" for="vehicleModel">Model</label>
		                        <select class="form-control" id="vehicleModel" name="vehicleModel[]"></select>
	                        </div>
	                        <div class="col-sm-3">
	                        	<label class="control-label" for="deal">Deal</label>
	                        	<select class="serviceSelect form-control" id="service" name="service[]">
	                        		<option value="car_wash" data-toggle="tooltip" title="With the standard car wash, we clean both the inside and outside of the car">Car Wash</option>
	                        		<option value="exterior_only" data-toggle="tooltip" title="Exterior Only services only wash the exterior of the car.">Exterior Only</option>
	                        		<option value="mini_detail" data-toggle="tooltip" title="Mini detail is ....">Mini Detail</option>
                        		</select>
                        	</div>
                        	<br>
                        	<div class="col-sm-offset-1 col-sm-1">
                        		<label>Quote</label>
                        		<p id="quote">loading...</p>
                    		</div>
                    		<div class="col-sm-12 well" style="background-color:white">
                    			<div class="col-sm-12"><label>Extras:<label></div>
	                        	<div class="checkbox col-sm-2">
		                        	<label class="control-label" data-toggle="tooltip" title="If you want pet hair cleaned out of your vehicle.">
		                        		<input type="checkbox" id="pet_hair" name="pet_hair[]">Pet Hair
		                        		<input type="hidden" name="pet_hair[]" value="off">
		                        	</label>
	                        	</div>
                    			<div class="checkbox col-sm-2">
		                        	<label class="control-label" data-toggle="tooltip" title="Description of Tyre Shine">
		                        		<input type="checkbox" id="tyre_shine" name="tyre_shine[]">Tyre Shine
	                        			<input type="hidden" name="tyre_shine[]" value="off">
		                        	</label>
		                        </div>
                    			<div class="checkbox col-sm-3">
		                        	<label class="control-label" data-toggle="tooltip" title="Description of Dashboard Shine">
		                        		<input type="checkbox" id="dashboard_shine" name="dashboard_shine[]">Dashboard Shine
	                        			<input type="hidden" name="dashboard_shine[]" value="off">
		                        	</label>
		                        </div>
                    			<div class="checkbox col-sm-2">
		                        	<label class="control-label" data-toggle="tooltip" title="Description of Intensive Inside">
		                        		<input type="checkbox" id="intensive_inside" name="intensive_inside[]">Intensive Inside
	                        			<input type="hidden" name="intensive_inside[]" value="off">
		                        	</label>
		                        </div>
                    			<div class="checkbox col-sm-3">
		                        	<label class="control-label" data-toggle="tooltip" title="Description of Bug and Tar Removal">
		                        		<input type="checkbox" id="bug_tar_removal" name="bug_tar_removal[]">Bug & Tar Removal
	                        			<input type="hidden" name="bug_tar_removal[]" value="off">
		                        	</label>
		                        </div>
		                    </div>
	                    </div>
	                    <div class="col-sm-12">
					        <button type="button" id="btnAdd_1" name="btnAdd" class="btn btn-primary col-sm-offset-1 col-sm-3">Add vehicle</button>
					        <button type="button" id="btnDel_1" name="btnDel" class="btn btn-danger col-sm-offset-1 col-sm-3">
					        	<span class="ui-button-text">Remove vehicle</span>
					        </button>
                        	<div class="col-sm-offset-1 col-sm-3">
                        		<label>Total Quote</label>
                        		<p id="totalQuote">loading...</p>
                    		</div>
                		</div>
			        </div>
					<br>

		            <div class="form-group"> <!-- Booking datetimepicker -->
	                	<label class="control-label" for="booking_time">Booking date & time:</label>
		                <div class='input-group date' id='booking_time' name='booking_time'>
		                    <input type='text' class="form-control" required data-error="Please input a valid appointment time"/>
		                    <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
	                    </div>
						<div class="help-block with-errors"></div>
						<span id='finish_time'></span>
					</div>

					<div class="checkbox col-sm-12">
                		<input type="checkbox" required>
                		I agree I have supplied the correct make and model details and service requirements to the best of my knowledge and agree to pay the full cost of any changes of vehicle and or service requirements prior to the booking. Cancellations less than 24 hours before booking time will incur a $20 fee.
                    </div>
                    <br/><br/><br/>

  					<button type="submit" class="btn btn-primary col-sm-8 col-sm-offset-2">Submit</button>
					<br><br>

				</form>
			</div>
		</div>
	</body>
</html>