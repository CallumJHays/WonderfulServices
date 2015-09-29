$(function(){

	var carQueryApiURL = "http://www.carqueryapi.com/api/0.3/?callback=?";
	var jobLengthHours = [9.9];
	var jobPrices = [99.99];

	// handle all setting up of the document. The rest is event based
	function setupForm(){
		// setup make select input
		var makeList = ["Abarth","AC","Acura","Alfa Romeo","Allard","Alpina","Alpine","Alvis","AMC","Ariel","Armstrong Siddeley","Ascari","Aston Martin","Audi","Austin","Austin-Healey","Autobianchi","Auverland","Avanti","Beijing","Bentley","Berkeley","Bitter","Bizzarrini","BMW","Brilliance","Bristol","Bugatti","Buick","Cadillac","Caterham","Checker","Chevrolet","Chrysler","Citroen","Dacia","Daewoo","DAF","Daihatsu","Daimler","Datsun","De Tomaso","DKW","Dodge","Donkervoort","Eagle","Fairthorpe","Ferrari","Fiat","Fisker","Ford","GAZ","Geely","Ginetta","GMC","Holden","Honda","Hudson","Humber","Hummer","Hyundai","Infiniti","Innocenti","Isuzu","Italdesign","Jaguar","Jeep","Jensen","Kia","Koenigsegg","Lada","Lamborghini","Lancia","Land Rover","Lexus","Lincoln","Lotec","Lotus","Luxgen","Mahindra","Marcos","Maserati","Matra-Simca","Maybach","Mazda","MCC","McLaren","Mercedes-Benz","Mercury","MG","Mini","Mitsubishi","Monteverdi","Moretti","Morgan","Morris","Nissan","Noble","NSU","Oldsmobile","Opel","Packard","Pagani","Panoz","Peugeot","Pininfarina","Plymouth","Pontiac","Porsche","Proton","Reliant","Renault","Riley","Rolls-Royce","Rover","Saab","Saleen","Samsung","Saturn","Scion","Seat","Simca","Singer","Skoda","Smart","Spyker","SsangYong","SSC","Steyr","Studebaker","Subaru","Sunbeam","Suzuki","Talbot","Tata","Tatra","Tesla","Toyota","Trabant","Triumph","TVR","Vauxhall","Vector","Venturi","Volkswagen","Volvo","Wartburg","Westfield","Willys-Overland","Xedos","Zagato","Zastava","ZAZ","Zenvo","ZIL"];
		var vehicleMakeOptionsHtml;
		$.each(makeList, function(index, name){
			vehicleMakeOptionsHtml += '<option>'+name+'</option>';
		});
		$('#vehicleMake').html(vehicleMakeOptionsHtml);
	    
		populateModelSelectList($('#vehicle1'));

		// setup dateTimePicker
		var fullyBookedDates = []; // populate with server-side database
	    $('#bookingpicker').datetimepicker({
	    	daysOfWeekDisabled: [0, 6],
	    	format: "dddd, MMMM Do, h:mm a - ",
	    	stepping: 30,
	    	minDate: moment().add(3, 'day').day(8).hour(8).minute(0),
	    	defaultDate: moment().add(3, 'day').day(8).hour(9).minute(0),
	    	disabledDates: fullyBookedDates,
	    	sideBySide: true, 
	    	enabledHours: [9,10,11,12,13,14,15]// Change as necessary
	    });
	}
	setupForm();

	// calculate and change the quote label
	function updateCostAndTime($vehicle){
		jobPrices.splice($vehicle.find('#quote').val());
		$vehicle.find('#quote').html("loading...");
		$.getJSON(carQueryApiURL, {cmd:"getTrims", model:$vehicle.find('#vehicleModel').val()}, function(response){
			if(response.Trims[0].model_body == null){
				// assume that the model body is not available and charge the max
				response.Trims[0].model_body = "Not Available";
			}
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
			jobLengthHours.push(0.5); // push the hours it takes from the google sheets
		});
	}

    function changeBookingPickerFinishTime(){
    	var totalJobLengthHours = 0;
    	$.each(jobLengthHours, function(index, vehiclehours){
    		totalJobLengthHours += vehiclehours
    	});
		var finishtime = $('#bookingpicker').data("DateTimePicker").date().add(totalJobLengthHours, 'hour').format('h:mm');
		$('#bookingpicker').data("DateTimePicker").format("dddd, MMMM Do, h:mm a - " + finishtime);
    }

	$(document).on('change', "#service", function(){
		var hasPetCount = $(this).parent().parent().find(".checkbox").length;
		if($(this).val() == "exterior_only"){
			if(hasPetCount != 0){
				$(this).parent().parent().find(".checkbox").fadeOut('slow', function(){$(this).remove()});
			}
		}else{
			if(hasPetCount == 0){
				$('<div class="checkbox col-sm-1"><label class="control-label" for="hasPet" data-toggle="tooltip" title="If there are any traces of pet hair in the car, interior cleaning is more expensive."><input type="checkbox" id="hasPet" value="">Had Pet?</label></div>')
					.insertAfter($(this).parent());
			}
		}
	});

	$(document).on('change', '#vehicleMake', function(){
		populateModelSelectList($(this).parent().parent());
	});

	$(document).on('change', '#vehicleModel', function(){
		calculateQuote($(this).parent().parent());
	});

	$(document).on('change', '#service', function(){
		calculateQuote($(this).parent().parent());
	});

	$(document).on('dp.change', '#bookingpicker', function(){
		changeBookingPickerFinishTime();
	});
});