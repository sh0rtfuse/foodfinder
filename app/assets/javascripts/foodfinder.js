function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition);
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
}
//sends lat/long to backend
function sendPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

	// $(document).ajaxSend(function(e, xhr, options) {
	// 	var token = $("meta[name='csrf-token']").attr("content");
	// 	xhr.setRequestHeader("X-CSRF-Token", token);
	// });

	$.ajax({
		// url:'/food_finder',
		url: Routes.food_finders_path(),
		type:'POST',
		dataType:'json',
		data:{
		    latitude: latitude,
		    longitude: longitude
		},
		success:function(data){
		    //pulls JSON with Business Info from create method
			// $.getJSON('/food_finders/results.json', function(data) {
			$.getJSON(Routes.food_finder_path("results", {format: 'json'}), function(data) {
	  			console.log(data);
	  			$('.load-page').remove();
	  			display(data);
			});
		},
		error:function(data){
		    console.log("AJAX Error: " + data);
		    // debugger;
		}
	});

    console.log("Latitude: " + latitude + 
    "| Longitude: " + longitude); 
}

//animate progress bar
function animate(counter) {
	var $bar = $('.progress-bar');

	setTimeout(function () {       
		counter++; 

		var tmp  = counter.toString() + '%';
		$bar.width(tmp);
		$bar.text(tmp);

		if (counter < 100) {
			animate(counter);
		} 
	}, 100)
}

//takes in JSON array, randomly choose a restuarant, displays to user
//if user rejects, display another
//if user accepts, open mapping app with location
function display(data) {
	//tracks which result is being displayed
	var counter = 0;

	//Pass in only businesses array of the Data JSON object to shuffle
	var businesses = shuffle(data.businesses);

	showCard(businesses, counter);

	$("#result-next").click(function(){
		//hide card
		// $('.result-card').attr("hidden", true);

		counter++;
		if(counter < businesses.length) {
			showCard(businesses, counter);
		} else {
			//what to do when there are no more results to show
			// shuffles and re-displays same cards
			counter = 0;
			businesses = shuffle(businesses);
			showCard(businesses, counter);
		}
	});

	$("#result-yes").click(function() {
		// Lat, Long, and Name of business
		var lat = businesses[counter].coordinates.latitude;
		var long = businesses[counter].coordinates.longitude;
		var name = businesses[counter].name.split(' ').join('+');

		window.open(getMapsURL(lat, long, name), "_blank");
	});

	// Support for swapping to accept/reject recommendation
	var card = document.getElementById("result-card");
	var gestures = new Hammer(card);
	gestures.on('swipe', function(ev) {
		console.log(ev);
	});
}
function reject() {

}
//send info to mapping applcation
function accept() {

}
function showCard(businesses, counter) {
	//load card first
	$('#result-pic').attr("src", businesses[counter].image_url); 
	$('#result-title').text(businesses[counter].name);
	$('#result-url').attr("href", businesses[counter].url);
	$('#result-reviews').text("Based on " + businesses[counter].review_count + " Reviews");
	$('#result-ratings').empty();																//clear old rating before display new one
	$('#result-ratings').prepend(getRatingsPath(businesses[counter].rating));  
	$('#result-cats').text(getCategories(businesses[counter].categories));

	//show card
	$('.result-card').attr("hidden", false); 
}
// Takes in Lat/Long of location and name. Returns URL in GMaps Scheme
function getMapsURL(latitude, longitude, name) {
	var url = "http://www.maps.google.com/?q=" + name + "&center=" + latitude + "," + longitude;
	return url;
}

// Takes in categories array. Returns string of categories.
function getCategories(categories) {
	var string = "";
	for(var i = 0; i < categories.length; i++) {
		string += categories[i].title;

		if(i < categories.length - 1) {
			string += " | ";
		}
	}

	return string;
}
// // Takes in rating. Returns image path. Moved to view so I could embed Ruby
// function getRatingsPath(rating) {
// 	var path = "";

// 	switch(rating) {
// 		case 0:
// 			path = '<%= image_tag("stars/small_0@2x.png") %>' ;
// 			// path = "/assets/stars/small_0@2x.png";
// 			break;
// 		case 1:
// 			path = '<%= image_tag("stars/small_1@2x.png") %>' ;
// 			// path = "/assets/stars/small_1@2x.png";
// 			break;
// 		case 1.5:
// 			path = '<%= image_tag("stars/small_1_half@2x.png") %>' ;
// 			// path = "/assets/stars/small_1_half@2x.png";
// 			break;
// 		case 2:
// 			path = '<%= image_tag("stars/small_2@2x.png") %>' ;
// 			// path = "/assets/stars/small_2@2x.png";
// 			break;
// 		case 2.5:
// 			path = '<%= image_tag("stars/small_2_half@2x.png") %>' ;
// 			// path = "/assets/stars/small_2_half@2x.png";
// 			break;
// 		case 3:
// 			path = '<%= image_tag("stars/small_3@2x.png") %>' ;
// 			// path = "/assets/stars/small_3@2x.png";
// 			break;
// 		case 3.5:
// 			path = '<%= image_tag("stars/small_3_half@2x.png") %>' ;
// 			// path = "/assets/stars/small_3_half@2x.png";
// 			break;
// 		case 4:
// 			path = '<%= image_tag("stars/small_4@2x.png") %>' ;
// 			// path = "/assets/stars/small_4@2x.png";
// 			break;
// 		case 4.5:
// 			path = '<%= image_tag("stars/small_4_half@2x.png") %>' ;
// 			// path = "/assets/stars/small_4_half@2x.png";
// 			break;
// 		case 5:
// 			path = '<%= image_tag("stars/small_5@2x.png") %>' ;
// 			// path = "/assets/stars/small_5@2x.png";
// 			break;
// 		default:
// 			path = '<%= image_tag("stars/small_0@2x.png") %>' ;
// 			// path = "/assets/stars/small_0@2x.png";		//default is 0 rating;
// 			break;
// 	}
// 	return path;
// }
// Fisher-Yates to shuffle array contents
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}