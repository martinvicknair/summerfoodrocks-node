console.log("ready!");

var logText = "";
var listingArray = [];
var map;
var markerArray = [];
var resultNum = 0;
var resultZip = 00000;
var searchTerms = "SELF";
var searchX = 0;
var searchY = 0;

var searchNumSites = 99;
var searchRadius = 3;

var userNeighborhood = "unresolved";
var userX;
var userY;
var userZip = 00000;

var noResultsString = document.getElementById('noResultsString');
$("#contentString").empty();
$('#noResultsString').show();
// getUserNeighborhood();
// get userIP
$.get("https://ipapi.co/json/", function(response) {
  console.log(response);
  userNeighborhood = response.city + response.ip;
  // console.log(userNeighborhood);
});

// determine user location on page load
// https://developers.google.com/maps/documentation/geolocation/intro
$.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4",
{
  // nothing here, using default parameters
},
function(data, status){
    // console.log(data);
    userX = data.location.lat;
    userY = data.location.lng;
    // console.log(userX ,  userY);
});

//determine user location on "show my getLocation"
// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $('#contentString') = "Geolocation is not supported by this browser.";
  }
};
function showPosition(position) {
  userX = position.coords.longitude;
  userY = position.coords.latitude;
  getUserNeighborhood();
};

// returns user neighborhood, and starts a query
// from https://developers.google.com/maps/documentation/geocoding/start
function getUserNeighborhood() {
  // userNeighborhood = JSON.stringify(userIP);
  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    userY + ',' + userX +
    "&key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4";
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(response) {
    console.log(response);
    userNeighborhood = response.results[1].formatted_address;
    userZip = response.results[1].address_components[5].long_name;
    searchTerms = response.results[1].formatted_address;
    searchY = response.results[0].geometry.location.lat;
    searchX = response.results[0].geometry.location.lng;
    map.setCenter(response.results[0].geometry.location);
    map.setZoom(14); // search results zoom level
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: "assets/images/ltblue-dot.png",
      title: userNeighborhood
    });
    // markerArray.push(marker);
    marker.setPosition(response.results[0].geometry.location);
    marker.setVisible(true);
    findSitesQuery();
    console.log("userZip: " + userZip);
  });
};

// This example requires the Places library. Include the "&libraries=places parameter" when you first load the API.
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
function initMap() {
  console.log("start initMap");
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.0000,
      lng: -97.0000
    },
    zoom: 4
  });
  var input = document.getElementById('pac-input');
  var options = {
    componentRestrictions: {
      country: 'us' //bias autocomplete search initially to USA; always biases to viewport by default
    }
  };

  infoWindow = new google.maps.InfoWindow;
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: "assets/images/ltblue-dot.png",
    title: searchTerms
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
  searchTerms = place.formatted_address;
    map.setCenter(place.geometry.location);
    map.setZoom(14); // zoom level after search
    marker.setPosition(place.geometry.location);
    marker.setTitle(searchTerms);
    marker.setVisible(true);
    searchTerms = place.formatted_address;

    //this sets the coordinates from the the google placesAPI results for the subsequent findSitesQuery
    searchY = autocomplete.getPlace().geometry.location.lat();
    searchX = autocomplete.getPlace().geometry.location.lng();
    findSitesQuery();
  });
    console.log("end initMap");
} // end initMap()

// this is the main query which returns data about nearby sites
// api from https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services
// https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services/Summer_Meal_Sites_2017/FeatureServer/0/query
function findSitesQuery() {
  $(window).scrollTop(0);
  listingArray = [];
  deleteMarkers();
  $("#contentString").empty();
  $('#noResultsString').show();
  searchDate = moment().format('YYYY-MM-DD dd h:mm a');

  queryURL = "https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services/Summer_Meal_Sites_2017/FeatureServer/0/query?geometry=%7Bx%3A" +
    searchX + "%2C+y%3A" +
    searchY + "%7D&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&distance=" +
    searchRadius + ".&units=esriSRUnit_StatuteMile&returnGeodetic=false&outFields=siteName%2CsponsoringOrganization%2C+address%2CcontactPhone%2CstartDate%2C+endDate%2C+daysofOperation%2C+breakfastTime%2C+lunchTime%2C+snackTime%2C+dinnerSupperTime&returnGeometry=true&multipatchOption=xyFootprint&resultRecordCount=" +
    searchNumSites + "&returnExceededLimitFeatures=true&f=pjson&token=";

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(response) {
    obj = JSON.parse(response);
    results = obj.features;
    resultNum = results.length;
    if (results.length > 0) {
      $('#noResultsString').hide();
    };

    logText = "'" + userNeighborhood + "'" + " searched for " + "'" + searchTerms + "'" + " which returned " + "'" + resultNum + "'" + " listings";
    console.log(logText);
    console.log(userX);
    responseText = "<strong>" + searchTerms + "</strong> has <strong>" + resultNum + "</strong> sites nearby";
    document.getElementById("responseText").innerHTML = responseText;

    // log tracking data into mysql
    pushSQLData();

    // loop through the results for data
    for (var i = 0; i < results.length; i++) {
      siteAddress = results[i].attributes.address;
      breakfastTime = results[i].attributes.breakfastTime;
      contactPhone = formatPhoneNumber(results[i].attributes.contactPhone);
      daysofOperation = results[i].attributes.daysofOperation;
      dinnerSupperTime = results[i].attributes.dinnerSupperTime;
      endDate = moment(results[i].attributes.endDate).format("MMMM D, YYYY");
      latLng = results[i].geometry.y + ", " + results[i].geometry.x;
      lunchTime = results[i].attributes.lunchTime;
      siteName = results[i].attributes.siteName;
      snackTime = results[i].attributes.snackTime;
      sponsoringOrganization = results[i].attributes.sponsoringOrganization;
      startDate = moment(results[i].attributes.startDate).format("MMMM D");

      calcDistance = Math.round((google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(results[i].geometry.y, results[i].geometry.x),
        new google.maps.LatLng(searchY, searchX)) * 0.000621371) * 10) / 10;

      // contentString is the result listing itself
      contentString = '<strong>' + siteName + '</strong><br>' +
        sponsoringOrganization + '<br>' +
        '<a href="https://www.google.com/maps/search/?api=1&query=' + siteAddress + '">' + siteAddress + '</a>' + '<br>' +
        startDate + ' - ' + endDate + '<br>' +
        'Serving on: ' + daysofOperation + '<br>' +
        'Breakfast: ' + breakfastTime + ' --- ' + 'Lunch: ' + lunchTime + '<br>' +
        'Call ' + '<a href="tel:+1-' + contactPhone + '">' + contactPhone + '</a>' + ' to confirm meal times</p></li>';

      // listObj is the data we wish to add for each listing and marker
      listObj = {
        calcDistance: calcDistance,
        contentString: contentString,
        latLng: latLng,
        lat: results[i].geometry.y,
        lng: results[i].geometry.x,
        siteName: siteName,
      };
      listingArray.push(listObj);
    } // end for (var i = 0; i < results.length
    listingArray.sort(function(a, b) {
      return a.calcDistance - b.calcDistance
    });
    addMarkers();
  });
}; // end function findSites()


function addMarkers() {
  // console.log(listingArray);
  var iw = new google.maps.InfoWindow();
  var oms = new OverlappingMarkerSpiderfier(map, {
    markersWontMove: true,   // we promise not to move any markers, allowing optimizations
    markersWontHide: true,   // we promise not to change visibility of any markers, allowing optimizations
    basicFormatEvents: true,  // allow the library to skip calculating advanced formatting information
    keepSpiderfied: true,
    ignoreMapClick: true,
  });
  // looping through the listingArray data
  for (var i = 0, length = listingArray.length; i < length; i++) {
    markerLabel = (i + 1);
    listingArray[i].contentString = '<li class="list-group-item text-left"><p><strong>#' + markerLabel + '</strong> - ' + listingArray[i].calcDistance + ' miles away<br>' +
      listingArray[i].contentString;
    $("#contentString").append(listingArray[i].contentString);
    var data = listingArray[i],
      latLng = new google.maps.LatLng(listingArray[i].lat, listingArray[i].lng);
    // Creating a marker and putting it on the map
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: data.siteName,
      // label: markerLabel,
      animation: google.maps.Animation.DROP,
    });
        markerArray.push(marker);
          oms.addMarker(marker);
    // Creating a closure to retain the correct data, otherwise infowindows will only show last result from loop
    // pass the current data in the loop into the closure (marker, data)
    (function(marker, data) {
      // Attaching a click event to the current marker
      google.maps.event.addListener(marker, "spider_click", function(e) {
        infowindow.setContent(data.contentString);
        infowindow.open(map, marker);
      });
    })(marker, data);
  }; //for (var i = 0, length = listingArray.length
}; // end function addMarkers()

// function pushFireData() {
//   database.ref().push({
//     dateAdded: firebase.database.ServerValue.TIMESTAMP,
//     resultNum: resultNum,
//     logText: logText,
//     searchTerms: searchTerms,
//     searchX: searchX,
//     searchY: searchY,
//     userNeighborhood: userNeighborhood,
//     userX: userX,
//     userY: userY
//   });
// }
function pushSQLData() {
  var newSearch = {
    resultNum: resultNum,
    logText: logText,
    searchTerms: searchTerms,
    searchX: searchX,
    searchY: searchY,
    userNeighborhood: userNeighborhood,
    userX: userX,
    userY: userY
	}
	$.ajax("/api/searches",{
		method: "POST",
		data: newSearch
	}).then(function(data){
		console.log(data);
		// location.href = "/";
	})
}
// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
function formatPhoneNumber(s) {
  var s2 = ("" + s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? null : m[1] + "-" + m[2] + "-" + m[3];
} // end function formatPhoneNumber

// https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}
// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markerArray = [];
}
