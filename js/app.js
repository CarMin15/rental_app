	/***** HEADER ******/
	/**** SEARCH BOXES - CALENDAR & BUTTON ******/
	/***** SEARCH RESULTS - APARTMENTS ******/


$(function() {
	var infoCities = "http://rental-app-rails.herokuapp.com/cities.json";
	$.getJSON( infoCities, {})
	.done(function(data) {
		console.log(data);
	})


	$(document).on('click', '.like_button', function() {
		$(this).toggleClass("not_liked");
	});

	
});
