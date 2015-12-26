$(function() {

  /***** HEADER ******/

	$.getJSON("http://rental-app-rails.herokuapp.com/cities.json", function(data) {
		var html = "";

		$(data).each(function(i, city) {
			html += "<option value='" + city.slug + "'>" + city.name + "</option>\n";
		});

		$( "#citiesList" ).html(html);

    updateListingFromForm();
	});

	/**** SEARCH BOXES - CALENDAR & BUTTON ******/


  $( "#start_date" ).datepicker({
    dateFormat: "dd-mm-yy",
    minDate: new Date()
  });

  $( "#end_date" ).datepicker({
    dateFormat: "dd-mm-yy",
    minDate: +1
  });

  $( "#start_date" ).datepicker("setDate", new Date());
  $( "#end_date" ).datepicker("setDate", +1);

  $( "#start_date" ).on("change", function(e){
    var start_date = moment($( "#start_date" ).val(), "DD-MM-YYYY");
    var following_day = start_date.clone().add(1, "days").format("DD-MM-YYYY");

    $( "#end_date" ).datepicker( "option", "minDate", following_day );
  });


  var updateListing = function(city, start_date, end_date, nb_guests){
    var url = "http://rental-app-rails.herokuapp.com/cities/" + city + "/rentals.json?";
    url += "start_date="+ start_date +"&end_date="+ end_date +"&nb_guests="+ nb_guests;

    $.getJSON(url, function(data){
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
  };


  var updateListingFromForm = function(){
    var city = $( "#citiesList" ).val();
    var start_date = moment($( "#start_date" ).val(), "DD-MM-YYYY");
    var end_date = moment($( "#end_date" ).val(), "DD-MM-YYYY");
    var nb_guests = $("#nb_guests" ).val();


    updateListing(city, start_date.format("DD-MM-YYYY"), end_date.format("DD-MM-YYYY"), nb_guests);
  };

  

  $( "#rentals_search" ).on("submit", function(e){
    e.preventDefault();
    updateListingFromForm();

  });

/***** Updating the results with the same dates if changing cities ******/

  $( "#citiesList" ).change(function(e){
    updateListingFromForm();
  });



	/***** SEARCH RESULTS - APARTMENTS ******/

	$(document).on('click', '.like_button', function() {
		$(this).toggleClass("not_liked");
	});
});

