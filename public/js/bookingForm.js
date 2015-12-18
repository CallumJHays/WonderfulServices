$(function(){

	var carQueryApiURL = "http://www.carqueryapi.com/api/0.3/?callback=?";
	var googleMapsApiURL = "AIzaSyAaOPQK_wlM2RgpvZdMreY8pURP0shnY_s";
	var jobLengthHours = [9.9];
	var jobPrices = [99.99];
	var travelTime = 0;
	var placeIsValid = false;
	var bodyTypes = ["Not Available"];
	var dealsCSV, extrasCSV, discountsCSV;

	// setup form
	var makeList = ["Abarth","AC","Acura","Alfa Romeo","Allard","Alpina","Alpine","Alvis","AMC","Ariel","Armstrong Siddeley","Ascari","Aston Martin","Audi","Austin","Austin-Healey","Autobianchi","Auverland","Avanti","Beijing","Bentley","Berkeley","Bitter","Bizzarrini","BMW","Brilliance","Bristol","Bugatti","Buick","Cadillac","Caterham","Checker","Chevrolet","Chrysler","Citroen","Dacia","Daewoo","DAF","Daihatsu","Daimler","Datsun","De Tomaso","DKW","Dodge","Donkervoort","Eagle","Fairthorpe","Ferrari","Fiat","Fisker","Ford","GAZ","Geely","Ginetta","GMC","Holden","Honda","Hudson","Humber","Hummer","Hyundai","Infiniti","Innocenti","Isuzu","Italdesign","Jaguar","Jeep","Jensen","Kia","Koenigsegg","Lada","Lamborghini","Lancia","Land Rover","Lexus","Lincoln","Lotec","Lotus","Luxgen","Mahindra","Marcos","Maserati","Matra-Simca","Maybach","Mazda","MCC","McLaren","Mercedes-Benz","Mercury","MG","Mini","Mitsubishi","Monteverdi","Moretti","Morgan","Morris","Nissan","Noble","NSU","Oldsmobile","Opel","Packard","Pagani","Panoz","Peugeot","Pininfarina","Plymouth","Pontiac","Porsche","Proton","Reliant","Renault","Riley","Rolls-Royce","Rover","Saab","Saleen","Samsung","Saturn","Scion","Seat","Simca","Singer","Skoda","Smart","Spyker","SsangYong","SSC","Steyr","Studebaker","Subaru","Sunbeam","Suzuki","Talbot","Tata","Tatra","Tesla","Toyota","Trabant","Triumph","TVR","Vauxhall","Vector","Venturi","Volkswagen","Volvo","Wartburg","Westfield","Willys-Overland","Xedos","Zagato","Zastava","ZAZ","Zenvo","ZIL"];

	Papa.parse("00_ADMIN_CSV_FOLDER/bodytype_service_pricing_minutes.csv", {
		download: true,
		complete: function(result) {
			dealsCSV = result.data;
		}
	});

	Papa.parse("00_ADMIN_CSV_FOLDER/extra_pricing_minutes.csv", {
		download: true,
		complete: function(result) {
			extrasCSV = result.data;
		}
	});

	Papa.parse("00_ADMIN_CSV_FOLDER/service_discounts.csv", {
		download: true,
		complete: function(result) {
			discountsCSV = result.data;
		}
	});

	$.getJSON("/wonderfulservices/api/fullybooked", {}, function(response){
		var fullyBookedDates = [];
		$.each(response, function(i, date){
			fullyBookedDates.push(moment(new Date(date)));
		});
		$('#booking_time').data("DateTimePicker").disabledDates(fullyBookedDates);
	});

	$('#bookings').validator({
		custom: {
			validateplace: function($el){
				return placeIsValid;
			}
		},
		errors: {
			validateplace: "Place is not valid."
		}
	});

	var vehicleMakeOptionsHtml;
	$.each(makeList, function(index, name){
		vehicleMakeOptionsHtml += '<option>'+name+'</option>';
	});
	$('#vehicleMake').html(vehicleMakeOptionsHtml);
    
	populateModelSelectList($('#vehicle1'));

	// setup dateTimePicker
    $('#booking_time').datetimepicker({
    	daysOfWeekDisabled: [0, 6],
    	format: "dddd, MMMM Do, h:mm a",
    	stepping: 30,
    	minDate: moment().add(3, 'day').day(8).hour(8).minute(0),
    	defaultDate: moment().add(3, 'day').day(8).hour(8).minute(30),
    	sideBySide: true, 
    	enabledHours: [8, 9, 10, 11, 12, 13, 14, 15, 16]// Change as necessary
    });

	// calculate and change the quote label
	function updateCostAndTime($vehicle){
		$('#totalQuote').html('loading...');
		$vehicle.find('#quote').html("loading...");
		$.getJSON(carQueryApiURL, {cmd:"getTrims", model:$vehicle.find('#vehicleModel').val(), make:$vehicle.find('#vehicleMake').val().toLowerCase()}, function(response){
			function getCSVdata(csv, rowText, columnText){
				var row, column;
				$.each(csv[0], function(i, val){
					if(val == columnText){
						column = i;
					}
				});
				$.each(csv, function(i, val){
					if(val[0] == rowText){
						row = i;
					}
				});
				return csv[row][column];
			}
			var cost = 0, minutes = 0, model = '';
			if(response.Trims[0] === undefined){
				model = "Not Available";
			}
			else if(response.Trims[0].model_body === null){
				// assume that the model body is not available and charge the max
				model = "Not Available";
			} else{
				model = response.Trims[0].model_body;
			}
			var service = $vehicle.find('#service').val();
			// from body type
			cost += parseFloat(getCSVdata(dealsCSV, model, service + "_cost"));
			minutes += parseFloat(getCSVdata(dealsCSV, model, service + "_minutes"));

			// from extras
			function addExtras(extraID){
				if($vehicle.find('#' + extraID).is(':checked')){
					cost += parseFloat(getCSVdata(extrasCSV, extraID, 'extra_price'));
					minutes += parseFloat(getCSVdata(extrasCSV, extraID, 'extra_minutes'));
				}
			}
			addExtras('pet_hair'); // pet hair

			if(service == 'car_wash' || service == 'exterior_only'){
				addExtras('tyre_shine'); // tyre shine
				addExtras('dashboard_shine'); // dashboard shine
				addExtras('intensive_inside'); // intensive inside
				addExtras('bug_tar_removal'); // bug & tar removal
			}

			var listIndex = parseInt($vehicle.attr('id').slice(-1)) - 1;
			jobPrices[listIndex] = cost;
			jobLengthHours[listIndex] = minutes / 60; // convert from minutes to hours

			$vehicle.find('#quote').html("$" + String(jobPrices[listIndex].toFixed(2)));
			var totalJobPrices = 0;
			$.each(jobPrices, function(index, price){
				totalJobPrices += price;
			});
			$('#totalQuote').html("$" + String(totalJobPrices.toFixed(2)));
			changebooking_timeFinishTime();
		});
	}

	// use carquery api to populate the model list
	function populateModelSelectList($vehicle){
		$vehicle.find('#vehicleModel').html("loading...");
		$.getJSON(carQueryApiURL, {cmd:"getModels", make:$vehicle.find('#vehicleMake').val().toLowerCase()}, function(response){
			var vehicleModelOptionsHtml = "";
			$.each(response.Models, function(index, model){
				vehicleModelOptionsHtml += '<option>'+ model.model_name +'</option>';
			});
			$vehicle.find('#vehicleModel').html(vehicleModelOptionsHtml);
			updateCostAndTime($vehicle);
		});
	}

    function changebooking_timeFinishTime(){
    	var totalJobLengthHours = travelTime/3600;
    	$.each(jobLengthHours, function(index, hours){
    		totalJobLengthHours += hours;
    	});

    	var hoursEnabled = [];
    	for(var h=parseInt(8 + travelTime/3600); h <= 16.5-totalJobLengthHours; h++){
    		hoursEnabled[h-8] = h;
    	}
    	if(hoursEnabled == []){
    		// if no hours enabled, enable 8am only.
    		hoursEnabled = [8];
    	}
    	$('#booking_time').data("DateTimePicker").enabledHours(hoursEnabled);
		var finishtime = $('#booking_time').data("DateTimePicker").date().add(totalJobLengthHours, 'hour').format('h:mm a');
		$('#finish_time').text('Appointment Finish: ' + finishtime);
    }

	$(document).on('change', '#vehicleMake', function(){
		populateModelSelectList($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#vehicleModel', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#service', function(){
		var $vehicle = $(this).parents('.clonedInput_1');
		function disableEnableExtras(disabledChecked, disabledUnchecked, enabled){
			$.each(disabledChecked, function(index, extraID){
				$vehicle.find('#'+extraID).prop('disabled', true).prop('checked', true);
			});
			$.each(disabledUnchecked, function(index, extraID){
				$vehicle.find('#'+extraID).prop('disabled', true).prop('checked', false);
			});
			$.each(enabled, function(index, extraID){
				$vehicle.find('#'+extraID).prop('disabled', false);
			});
		}
		switch($(this).val()){
			case "car_wash":
				disableEnableExtras([], [], ['pet_hair', 'tyre_shine', 'bug_tar_removal', 'dashboard_shine', 'intensive_inside']);
				break;
			case "exterior_only":
				disableEnableExtras([], ['pet_hair', 'dashboard_shine', 'intensive_inside'], ['bug_tar_removal', 'tyre_shine']);
				break;
			case "mini_detail":
				disableEnableExtras(['tyre_shine', 'bug_tar_removal', 'dashboard_shine'], ['intensive_inside'], ['pet_hair']);
				break;
			case "full_detail":
				disableEnableExtras(['tyre_shine', 'bug_tar_removal', 'dashboard_shine', 'intensive_inside'], [], ['pet_hair']);
				break;
		}
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});
	
	$(window).bind('gMapsLoaded', function(){
		var map = new google.maps.Map($('#map-canvas')[0], {
			center: {lat: -27.666551, lng: 153.138169},
			zoom: 17,
			draggable: false,
			panControl: false
		});
		var autocomplete = new google.maps.places.Autocomplete($('#booking_place')[0], {bounds: new google.maps.LatLngBounds(
			new google.maps.LatLng(-27.811894, 152.708538),
			new google.maps.LatLng(-27.211479, 153.240935)
			)});

		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0,-29)
		});

		autocomplete.addListener('place_changed', function(){
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if(!place.geometry){
				placeIsValid = false;
				return;
			}

			// If the place has a geometry, then present it on the map.
			if(place.geometry.viewport){
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17); // 17 looks good.
			}

			marker.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));

			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if(place.address_components){
				address = [
					(place.address_components[0] && place.address_components[0].short_name || ''),
					(place.address_components[1] && place.address_components[1].short_name || ''),
					(place.address_components[2] && place.address_components[2].short_name || '')
					].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
			placeIsValid = true;

			var service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix( 
				{
					origins: ['2/13 Logandowns Dr, Meadowbrook QLD 4131'], 
					destinations: [address],  
					avoidTolls: true,
						travelMode: google.maps.TravelMode.DRIVING,
					transitOptions: {
						arrivalTime: new Date($('#booking_time').val())
					}
				}, 
				function(result, status){
					if(result.rows[0].elements[0].duration === undefined){
						placeIsValid = false;
						return;
					} else{
						travelTime = result.rows[0].elements[0].duration.value;
						if(travelTime > 3600){
							placeIsValid = false;
							return;
							// throw an error specific to distance
						}else{
							changebooking_timeFinishTime();
						}
					}
				}
			);
		});
	});

	$(document).on('change', '#pet_hair', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#tyre_shine', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#dashboard_shine', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#intensive_inside', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('change', '#bug_tar_removal', function(){
		updateCostAndTime($(this).parents('.clonedInput_1'));
	});

	$(document).on('dp.change', '#booking_time', function(){
		changebooking_timeFinishTime();
	});

	$('#btnAdd_1').click(function () {
        var num     = $('.clonedInput_1').length, // Checks to see how many "duplicatable" input fields we currently have
            newNum  = new Number(num + 1),      // The numeric ID of the new input field being added, increasing by 1 each time
            newElem = $('#vehicle' + num).clone().attr('id', 'vehicle' + newNum).attr('name', 'vehicle' + newNum).fadeIn('slow'); // create the new element via clone(), and manipulate it's ID using newNum value
	    
	    /*  This is where we manipulate the name/id values of the input inside the new, cloned element
	        Below are examples of what forms elements you can clone, but not the only ones.
	        There are 2 basic structures below: one for an H2, and one for form elements.
	        To make more, you can copy the one for form elements and simply update the classes for its label and input.
	        Keep in mind that the .val() method is what clears the element when it gets cloned. Radio and checkboxes need .val([]) instead of .val('').
	    */
	    // keep variables making sense
	    jobPrices.push(0);
	    jobLengthHours.push(0);

	    // Insert the new element after the last "duplicatable" input field
	        $('#vehicle' + num).after(newElem);
	        $('#ID' + newNum + '_title').focus();

	    // Enable the "remove" button. This only shows once you have a duplicated section.
	        $('#btnDel_1').attr('disabled', false);

	    // Right now you can only add 4 sections, for a total of 5. Change '5' below to the max number of sections you want to allow.
        // This first if statement is for forms using input type="button" (see older demo). Delete if using button element.
        if (newNum == 5)
        $('#btnAdd_1').attr('disabled', true).prop('value', "You've reached the limit"); // value here updates the text in the 'add' button when the limit is reached
        // This second if statement is for forms using the new button tag (see Bootstrap demo). Delete if using input type="button" element.
        if (newNum == 5)
        $('#btnAdd_1').attr('disabled', true).text("Max 5 cars"); // value here updates the text in the 'add' button when the limit is reached 
    	populateModelSelectList($('#vehicle' + newNum));
    });

    $('#btnDel_1').click(function () {
    	// Confirmation dialog box. Works on all desktop browsers and iPhone.
        if (confirm("Are you sure you wish to remove this vehicle? This cannot be undone."))
            {
                var num = $('.clonedInput_1').length;
                jobPrices.pop();
                jobLengthHours.pop();
                // how many "duplicatable" input fields we currently have
                $('#vehicle' + num).slideUp('slow', function () {
                	$(this).remove();
                	updateCostAndTime($('#vehicle1'));
	                // if only one element remains, disable the "remove" button
	                    if (num -1 === 1)
	                $('#btnDel_1').attr('disabled', true);
	                // enable the "add" button. IMPORTANT: only for forms using input type="button" (see older demo). DELETE if using button element.
	                $('#btnAdd_1').attr('disabled', false).prop('value', "Add vehicle");
	                // enable the "add" button. IMPORTANT: only for forms using the new button tag (see Bootstrap demo). DELETE if using input type="button" element.
	                $('#btnAdd_1').attr('disabled', false).text("Add vehicle");
            	});
            }
        return false; // Removes the last section you added
    });
    // Enable the "add" button
    $('#btnAdd_1').attr('disabled', false);
    // Disable the "remove" button
    $('#btnDel_1').attr('disabled', true);
});