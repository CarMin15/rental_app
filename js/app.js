$(function() {

  /***** HEADER ******/

	$.getJSON("http://rental-app-rails.herokuapp.com/cities.json", function(data) {
		var html = "";

		$(data).each(function(i, city) {
			html += "<option value='" + city.slug + "'>" + city.name + "</option>\n";
		});

		$( "#citiesList" ).html(html);
	});

	/**** SEARCH BOXES - CALENDAR & BUTTON ******/
	/***** SEARCH RESULTS - APARTMENTS ******/

	$(document).on('click', '.like_button', function() {
		$(this).toggleClass("not_liked");
	});
});
