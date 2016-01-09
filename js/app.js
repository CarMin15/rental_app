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

      if (data.length > 0) {
        mapResetMarkers();

        $(data).each(function(i, apartment) {
          apartment.liked = (apartment.user_liked) ? "" : "not_liked";  
          apartment.instant_book = (apartment.instant_book) ? "active" : "";
          apartment.primary_picture_url = apartment.pictures[0].url;
          
          var rentalHTML = rentalTemplate(apartment);
          html += rentalHTML;

          mapAddMarker(apartment.lat, apartment.lng, apartment.id, rentalHTML);

        });

        map.fitBounds(bounds);
      } else {
        html = "<p>No results found.</p>";
      }

      /** add elements to the DOM **/
      $( "#apartments" ).html(html);

      initializedCarousel();

    });
  };

/** initialize carousel **/

  var initializedCarousel = function(){
    $('.jcarousel').jcarousel();

    $('.jcarousel-control-prev')
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .jcarouselControl({
        target: '-=1'
      });

    $('.jcarousel-control-next')
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .jcarouselControl({
        target: '+=1'
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

  /***** Updating the results list with the same dates if changing cities ******/

  $( "#citiesList" ).change(function(e){
    updateListingFromForm();
  });



	/***** SEARCH RESULTS - APARTMENTS ******/


  /***** APARTMENTS - Liked or not button ******/

	$(document).on('click', '.like_button', function() {
		$(this).toggleClass("not_liked");
	});


  /***** Map -- markers  and infowindows ******/

  var map;
  var bounds = new google.maps.LatLngBounds();
  var markers = [];
  var openInfowindow;

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7833, lng: -122.4167},
    zoom: 13,
    streetViewControl: false,
    mapTypeControl: false
  });

  var mapAddMarker = function(lat, lng, id, html) {
    var position = new google.maps.LatLng(lat, lng);
    
    bounds.extend(position);

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: 'images/marker.png'
    });

    marker.id = id;

    var infowindow = new google.maps.InfoWindow({
      content: html
    });

    marker.addListener('click', function() {
      if (openInfowindow) {
        openInfowindow.close();
        openInfowindow = undefined;
      }

      infowindow.open(map, marker);
      openInfowindow = infowindow;
      initializedCarousel();
    });

    markers.push(marker);
  };

  var mapResetMarkers = function() {
    while (markers.length > 0) {
      var marker = markers.pop();
      marker.setMap(null);
    }

    bounds = new google.maps.LatLngBounds();
  };


  /***** Handlebars templates ******/

  var rentalTemplate = Handlebars.compile($("#rentals-template").html());


});

