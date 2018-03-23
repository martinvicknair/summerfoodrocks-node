console.log("logic.js ready!");

var input = document.getElementById('pac-input');
var listingArray = [];
var logText = "";
var map;
var marker;
var markerArray = [];
var noResultsString = document.getElementById('noResultsString');

var queryNumSites = 99; // return number of sites within queryRadius for findSitesQuery()
var queryRadius = 3; // radius of findSitesQuery() in miles
var queryTerms = "";
var queryX = 0;
var queryY = 0;
var queryZip = 0;

var resultNum = -1;
var resultZip = 0;

var userNeighborhood = "";
var userX = 0;
var userY = 0;
var userZip = 0;


// prepare findSitesQuery results content area
$("#contentString").empty();
$('#noResultsString').show();


// initial rough user geolocation coordinates on page load from ip or wifi location
// https://developers.google.com/maps/documentation/geolocation/intro
$.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4", {
    // nothing here, using default parameters
  },
  function(data, status) {
    // console.log(data);
    userX = data.location.lng;
    userY = data.location.lat;
    // console.log(userX , userY);
    getUserNeighborhood();
  });

// refines user geolocation with user permission
// then starts a findSitesQuery for that location
// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $('#contentString') = "Geolocation is not supported by this browser.";
  }
};

function showPosition(position) {
  // console.log(position);
  queryX = position.coords.longitude;
  queryY = position.coords.latitude;
  userX = position.coords.longitude;
  userY = position.coords.latitude;
  getUserNeighborhood();
  findSitesQuery();
};

// returns a userNeighborhood by geocoding coordinates
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
    // console.log(response);
    // console.log(response.results[0].geometry.location);
    userNeighborhood = response.results[2].formatted_address;
    userZip = response.results[0].address_components[response.results[0].address_components.length - 1].short_name;
    queryNeighborhood = response.results[2].formatted_address;
    queryTerms = response.results[2].formatted_address;
    queryZip = response.results[0].address_components[response.results[0].address_components.length - 1].short_name;
    console.log(userNeighborhood);
  });
};

// This example requires the Places library. Include the "&libraries=places parameter" when you first load the API.
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.0000,
      lng: -97.0000
    },
    zoom: 4
  });
  input = document.getElementById('pac-input');
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

  marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: "assets/images/ltblue-dot.png",
    title: queryTerms
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
    // console.log(place);
    map.setCenter(place.geometry.location);
    map.setZoom(13); // zoom level after search
    marker.setPosition(place.geometry.location);
    marker.setTitle(queryTerms);
    marker.setVisible(true);
    queryTerms = place.formatted_address;
    queryY = autocomplete.getPlace().geometry.location.lat();
    queryX = autocomplete.getPlace().geometry.location.lng();
    queryZip = place.address_components[place.address_components.length - 1].short_name;
    findSitesQuery();
  });
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

  queryURL = "https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services/Summer_Meal_Sites_2017/FeatureServer/0/query?geometry=%7Bx%3A" +
    queryX + "%2C+y%3A" +
    queryY + "%7D&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&distance=" +
    queryRadius + ".&units=esriSRUnit_StatuteMile&returnGeodetic=false&outFields=siteName%2CsponsoringOrganization%2C+address%2Czip%2CcontactPhone%2CstartDate%2C+endDate%2C+daysofOperation%2C+breakfastTime%2C+lunchTime%2C+snackTime%2C+dinnerSupperTime&returnGeometry=true&multipatchOption=xyFootprint&resultRecordCount=" +
    queryNumSites + "&returnExceededLimitFeatures=true&f=pjson&token=";

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

    logText = "The 2018 Summer Food Rocks! site finder found " + resultNum + " SFSP Summer Meal sites near "  + queryTerms + ".";
    console.log(logText);
    responseText = "<strong>" + queryTerms + "</strong> has <strong>" + resultNum + "</strong> sites nearby." + "\n";
    document.getElementById("responseText").innerHTML = responseText;

    // log tracking data into mysql
    pushSQLData();

    // loop through the results for displaying data
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
        new google.maps.LatLng(queryY, queryX)) * 0.000621371) * 10) / 10;

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
    };
    // order listings by distance from queryX & queryY
    listingArray.sort(function(a, b) {
      return a.calcDistance - b.calcDistance
    });

    map.setCenter({
      lat: queryY,
      lng: queryX
    });
    map.setZoom(13); // search results zoom level

    marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: "assets/images/ltblue-dot.png",
      title: userNeighborhood
    });

    marker.setPosition({
      lat: userY,
      lng: userX
    });
    marker.setVisible(true);
    addMarkers();
  });
}; // end function findSites()


function addMarkers() {
  // console.log(listingArray);
  var iw = new google.maps.InfoWindow();
  var oms = new OverlappingMarkerSpiderfier(map, {
    markersWontMove: true, // we promise not to move any markers, allowing optimizations
    markersWontHide: true, // we promise not to change visibility of any markers, allowing optimizations
    basicFormatEvents: true, // allow the library to skip calculating advanced formatting information
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
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: data.siteName,
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
  };
}; // end function addMarkers()

function pushSQLData() {
  var newSearch = {
    logText: logText,
    resultNum: resultNum,
    queryTerms: queryTerms,
    queryX: queryX,
    queryY: queryY,
    queryZip: queryZip,
    userX: userX,
    userY: userY,
    userZip: userZip
  }
  $.ajax("/api/searches", {
    method: "POST",
    data: newSearch
  }).then(function(data) {
    console.log(data);
  })
}
// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
function formatPhoneNumber(s) {
  var s2 = ("" + s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? null : m[1] + "-" + m[2] + "-" + m[3];
}; // end function formatPhoneNumber

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
  marker = 0;
}
