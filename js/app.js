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



$.getJSON("http://rental-app-rails.herokuapp.com/cities/new-york/rentals.json?start_date&end_date5&nb_guests=1", function(data){
  var html = "";

  $(data).each(function(i, apartment) {
    
    var liked = (apartment.user_liked) ? "" : "not_liked";  

    var instant_book = (apartment.instant_book) ? "active" : "";

    html += ' \
    <div class="apartment"> \
      <div class="apartment_gallery"> \
        <ul class="gallery"> \
          <li> \
            <img src="'+ apartment.pictures[0].url +'" alt="'+ apartment.name +'" class="apartment_p"> \
          </li> \
        </ul> \
        <i class="like_button '+ liked +'"></i> \
        <div class="price_wrapper"> \
          <span class="currency">$</span> \
          <span class="price">' + apartment.price + '</span> \
          <img src="images/instant_book.png" alt="Instant booking available!" class="instant_book ' + instant_book + '" /> \
        </div> \
      </div> \
      <div class="apartment_description"> \
        <a href="' + apartment.user.profile_url + '"> \
          <img src="'+ apartment.user.profile_picture_url + '" alt="' + apartment.user.name + '" class="owner"> \
        </a> \
        <a href="#"> \
          <span class="apartment_name">' + apartment.name + '</span> \
          <span class="apartment_kind">' + apartment.kind + '</span> \
          <span class="apartment_score">&bull; ' + apartment.score + '/5</span> \
          <span class="apartment_reviews">&bull; '+ apartment.reviews_count + ' reviews</span> \
        </a> \
      </div> \
    </div>'; 
    });


    $( "#apartments" ).html(html);
  });


	/***** SEARCH RESULTS - APARTMENTS ******/

	$(document).on('click', '.like_button', function() {
		$(this).toggleClass("not_liked");
	});
});

