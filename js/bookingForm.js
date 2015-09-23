var finishtime;
$(function(){
	$(document).on('change', "#service", function(){
		var hasPetCount = $(this).parent().parent().find(".checkbox").length;
		if($(this).val() == "Exterior only"){
			if(hasPetCount != 0){
				$(this).parent().parent().find(".checkbox").fadeOut('slow', function(){$(this).remove()});
			}
		}else{
			if(hasPetCount == 0){
				$('<div class="checkbox col-sm-1"><label class="control-label" for="hasPet"><input type="checkbox" id="hasPet" value="">Had Pet?</label></div>')
					.insertAfter($(this).parent())
			}
		}
	});

	// use carquery api to populate makeList
	var makeList = ["Abarth","AC","Acura","Alfa Romeo","Allard","Alpina","Alpine","Alvis","AMC","Ariel","Armstrong Siddeley","Ascari","Aston Martin","Audi","Austin","Austin-Healey","Autobianchi","Auverland","Avanti","Beijing","Bentley","Berkeley","Bitter","Bizzarrini","BMW","Brilliance","Bristol","Bugatti","Buick","Cadillac","Caterham","Checker","Chevrolet","Chrysler","Citroen","Dacia","Daewoo","DAF","Daihatsu","Daimler","Datsun","De Tomaso","DKW","Dodge","Donkervoort","Eagle","Fairthorpe","Ferrari","Fiat","Fisker","Ford","GAZ","Geely","Ginetta","GMC","Holden","Honda","Hudson","Humber","Hummer","Hyundai","Infiniti","Innocenti","Isuzu","Italdesign","Jaguar","Jeep","Jensen","Kia","Koenigsegg","Lada","Lamborghini","Lancia","Land Rover","Lexus","Lincoln","Lotec","Lotus","Luxgen","Mahindra","Marcos","Maserati","Matra-Simca","Maybach","Mazda","MCC","McLaren","Mercedes-Benz","Mercury","MG","Mini","Mitsubishi","Monteverdi","Moretti","Morgan","Morris","Nissan","Noble","NSU","Oldsmobile","Opel","Packard","Pagani","Panoz","Peugeot","Pininfarina","Plymouth","Pontiac","Porsche","Proton","Reliant","Renault","Riley","Rolls-Royce","Rover","Saab","Saleen","Samsung","Saturn","Scion","Seat","Simca","Singer","Skoda","Smart","Spyker","SsangYong","SSC","Steyr","Studebaker","Subaru","Sunbeam","Suzuki","Talbot","Tata","Tatra","Tesla","Toyota","Trabant","Triumph","TVR","Vauxhall","Vector","Venturi","Volkswagen","Volvo","Wartburg","Westfield","Willys-Overland","Xedos","Zagato","Zastava","ZAZ","Zenvo","ZIL"],
		apiURL = "http://www.carqueryapi.com/api/0.3/?callback=?";

	// update the select list with makelist
	var vehicleMakeOptionsHtml;
	$.each(makeList, function(index, name){
		vehicleMakeOptionsHtml += '<option value='+name+'>'+name+'</option>';
	});
	$('#vehicleMake').html(vehicleMakeOptionsHtml);

	// use carquery api to populate the model list
	function returnModelList(manufacturer){
		$.getJSON(apiURL, {cmd:"getModels", make:manufacturer.toLowerCase()}, function(response){
			var vehicleModelOptionsHtml;
			console.log(response);
			$.each(response.Models, function(index, name){
				vehicleModelOptionsHtml += '<option>'+name+'</option>';
			});
			return vehicleModelOptionsHtml;
		});
	}
	$('#vehicleModel').html(returnModelList($("#vehicleMake").val()));

	$(document).on('change', '#vehicleMake', function(){
		$(this).parent().parent().find('#vehicleModel').html(returnModelList($("#vehicleMake").val()));
		$.getJSON(apiURL, {cmd:"getModel", 
			model_name:$(this).parent().parent().find('#vehicleModel').val()}, 
			function(response){
				console.log(response);
				calculateQuote(response[0].model_name, 
					$(this).parent().parent().find('#service').val(), 
					$(this).parent().parent().find('#hasPet').val());
		});
	});

	// calculate and change the quote label
	function calculateQuote(bodyType, service, hasPet){

	}
	
	// TODO make automatically calculated
	finishtime = "4:30"; 

	var fullyBookedDates = []; 
    $('#bookingpicker').datetimepicker({
    	daysOfWeekDisabled: [0, 6],
    	format: "dddd, MMMM Do, h:mma - " + finishtime,
    	stepping: 30,
    	minDate: moment().add(3, 'day').day(8).hour(8).minute(0),
    	disabledDates: fullyBookedDates,
    	sideBySide: true, 
    	enabledHours: [9,10,11,12,13,14,15]// Change as necessary
    });
});