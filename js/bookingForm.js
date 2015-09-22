var finishtime;
$(function(){
	$(document).on('click', "#service", function(){
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
	
	// TODO make automatically calculated
	finishtime = "4:30"; 
	// TODO use database to populate
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