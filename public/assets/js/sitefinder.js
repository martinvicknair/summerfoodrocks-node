console.log("sitefinder.js loaded");

var input = document.getElementById('pac-input');
var listingArray = [];
var logText = "";
var map;
var marker;
var markerArray = [];
var noResultsString = document.getElementById('noResultsString');

var queryNumSites = 99; // return number of sites within queryRadius for findSitesQuery()
var queryRadius = 3; // initial search radius for findSitesQuery() in miles
var queryTerms = "x";
var queryTermsAnon = "";
var queryX = 0;
var queryY = 0;
var queryZip = 0;

var resultNum = -1;
var resultZip = 0;

var userX = 0;
var userY = 0;
var userZip = 0;

var urlParams = new URLSearchParams(window.location.search);

if (window.location.href.indexOf("?address=") > -1) {
  // urlParams = urlParams.toString();
  // urlParams = decodeURIComponent(urlParams);

  var dec = decodeURI(window.location.search);
  dec = dec.split('?address=').join('');
  queryTerms = dec;
  queryTermsAnon = dec;
  document.getElementById("pac-input").value = queryTerms;
  dec = dec.split(' ').join('+');
 


  // console.log(queryTerms); // "?post=1234&action=edit"


  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
  + dec + 
  "&key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4";
$.ajax({
  url: queryURL,
  method: 'GET'
}).done(function(response) {
  // console.log(response);
  queryY = response.results[0].geometry.location.lat;
  queryX = response.results[0].geometry.location.lng;
  findSitesQuery();
  // window.history.replaceState({}, document.title, "/sitefinder");
  return;
});
} else {
  window.history.replaceState({}, document.title, "/sitefinder");
}

// initial rough user geolocation coordinates on page load from ip or wifi location
// https://developers.google.com/maps/documentation/geolocation/intro
// $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4", {
//     // nothing here, using default parameters
//   },
//   function(data, status) {
//     // console.log(data);
//     userX = data.location.lng;
//     userY = data.location.lat;
//     // console.log(userX , userY);
//     getGeocode();
//   });

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

// prepare findSitesQuery results content area
$("#contentString").empty();
$('#noResultsString').show();

function showPosition(position) {
  // console.log(position);
  queryX = position.coords.longitude;
  queryY = position.coords.latitude;
  // userX = position.coords.longitude;
  // userY = position.coords.latitude;
  findSitesQuery();
  getGeocode();
};

// returns address location data by geocoding coordinates
// from https://developers.google.com/maps/documentation/geocoding/start
function getGeocode() {
  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    queryY + ',' + queryX +
    "&key=AIzaSyAd25a5DYATHihaZXMJLxG4EHCWKc08yy4";
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(response) {
    var searchAddressComponents = response.results[0].address_components;
    $.each(searchAddressComponents, function() {
      if (this.types[0] == "postal_code") {
        // userZip = this.short_name;
        queryZip = this.short_name;
      }
    });
    // console.log(response);
    queryTerms = response.results[0].formatted_address;
    queryTermsAnon = response.results[5].formatted_address
    // console.log(queryTerms);
    // console.log(queryTermsAnon);
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
    title: ""
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
    // console.log(`${place.address_components[1].short_name}, ${place.address_components[2].short_name}, ${place.address_components[3].short_name}, ${place.address_components[5].short_name}, ${place.address_components[7].short_name} `);
    map.setCenter(place.geometry.location);
    map.setZoom(13); // zoom level after search
    marker.setPosition(place.geometry.location);
    marker.setTitle(queryTerms);
    marker.setVisible(true);

    queryTerms = place.formatted_address;
    queryTermsAnon = queryTerms;
    // console.log(queryTermsAnon);
    queryY = autocomplete.getPlace().geometry.location.lat();
    queryX = autocomplete.getPlace().geometry.location.lng();
    var searchAddressComponents = place.address_components;
    $.each(searchAddressComponents, function() {
      if (this.types[0] == "postal_code") {
        queryZip = this.short_name;
      }
    });
    findSitesQuery();
  });
} // end initMap()

// this is the main query which returns data about nearby sites
// api from https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services
// https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services/Summer_Meal_Sites_2017/FeatureServer/0/query
function findSitesQuery() {
  $('#pac-input').val('');
  $(window).scrollTop(0);
  snackTime = '';
  listingArray = [];
  clearMarkers();
  deleteMarkers();
  $("#contentString").empty();
  $('#noResultsString').show();
  if (queryRadius > 48) {
    responseText = "<strong>" + 'No sites were found within ' + queryRadius + ' miles of ' + queryTerms + '.</strong>';
    document.getElementById("responseText").innerHTML = responseText;
    queryRadius = 3;
    return;
    
  }

  queryURL = "https://services1.arcgis.com/RLQu0rK7h4kbsBq5/ArcGIS/rest/services/Summer_Meal_Sites_2020/FeatureServer/0/query?where=&objectIds=&time=&geometry=%7Bx%3A" +
    queryX + "%2C+y%3A" +
      queryY +  "%7D&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=" +
    queryRadius + ".&units=esriSRUnit_StatuteMile&returnGeodetic=false&outFields=siteName%2CsponsoringOrganization%2CsiteAddress%2CcontactPhone%2CstartDate%2CendDate%2CdaysofOperation%2CbreakfastTime%2ClunchTime%2CdinnerSupperTime%2C&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=" +
    queryNumSites + "&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function(response) {
    obj = JSON.parse(response);
    results = obj.features;
    console.log(results);

    resultNum = results.length;
    if (resultNum <= 1) {
      queryRadius += queryRadius;
      findSitesQuery();
    return;
    }
    if (results.length >= 1 && queryRadius >= 48) {
      $('#pac-input').val('');
      $('#noResultsString').hide();
      queryRadius = 3;
      // console.log(`queryRadius = ${queryRadius}`)
    };
    logText = "The 2020 Summer Food Rocks! Site Finder found " + resultNum + " Free Summer Meal sites near " + queryTermsAnon + ".";
    console.log(logText);
    responseText = "<strong>" + queryTerms + "</strong> has <strong>" + resultNum + "</strong> sites nearby." + "\n";
    document.getElementById("responseText").innerHTML = responseText;

    // log tracking data into mysql
    pushSQLData();

 

    // loop through the results for displaying data on webpage
    for (var i = 0; i < results.length; i++) {
      siteAddress = results[i].attributes.siteAddress;
      if (typeof breakfastTime === undefined) {
        breakfastTime = 'x'
      } else {
       breakfastTime = results[i].attributes.breakfastTime;
      } 
      // breakfastTime = results[i].attributes.breakfastTime;
      contactPhone = formatPhoneNumber(results[i].attributes.contactPhone);
      daysofOperation = results[i].attributes.daysofOperation;
      dinnerSupperTime = results[i].attributes.dinnerSupperTime;
      endDate = moment(results[i].attributes.endDate).format("MMMM D, YYYY");
      latLng = results[i].geometry.y + ", " + results[i].geometry.x;
      lunchTime = results[i].attributes.lunchTime;
      siteName = results[i].attributes.siteName;
      AsnackTime = results[i].attributes.snackTime;
      // let snackTime = typeof results[i].attributes.snackTime === "undefined" || !results[i].attributes.snackTime ? 'x' : results[i].attributes.snackTime;
      sponsoringOrganization = results[i].attributes.sponsoringOrganization;
      startDate = moment(results[i].attributes.startDate).format("MMMM D");

      calcDistance = Math.round((google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(results[i].geometry.y, results[i].geometry.x),
        new google.maps.LatLng(queryY, queryX)) * 0.000621371) * 10) / 10;
        var bounds = new google.maps.LatLngBounds();

        // contentString is the result listing itself
        contentString = `
        <strong>${siteName}</strong><br>
        ${sponsoringOrganization}<br>
        <a href="https://www.google.com/maps/search/?api=1&query=${siteAddress}">${siteAddress}</a><br>
        ${startDate} - ${endDate}<br>
        Serving on: ${daysofOperation}<br>
        Breakfast: ${breakfastTime ? breakfastTime : 'y'} --- Lunch: ${lunchTime}<br>
        Snack: ${snackTime ? snackTime : 'y'} --- Dinner: ${dinnerSupperTime}<br>
        Call <a href="tel:+1-'${contactPhone}">${contactPhone}</a> to confirm meal times</p></li>'
        `;
      // contentString = '<strong>' + siteName + '</strong><br>' +
      //   sponsoringOrganization + '<br>' +
      //   '<a href="https://www.google.com/maps/search/?api=1&query=' + siteAddress + '">' + siteAddress + '</a>' + '<br>' +
      //   startDate + ' - ' + endDate + '<br>' +
      //   'Serving on: ' + daysofOperation + '<br>' +
      //   'Breakfast: ' + breakfastTime + ' --- ' + 'Lunch: ' + lunchTime + '<br>' +
      //   'Snack: ' + snackTime + ' --- ' + 'Dinner: ' + dinnerSupperTime + '<br>' +
      //   'Call ' + '<a href="tel:+1-' + contactPhone + '">' + contactPhone + '</a>' + ' to confirm meal times</p></li>';

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
    // order listings by distance from search point
    listingArray.sort(function(a, b) {
      return a.calcDistance - b.calcDistance
    });

    map.setCenter({
      lat: queryY,
      lng: queryX
    });
    // map.setZoom(13); // search results zoom level
    map.fitBounds(bounds);

    marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: "assets/images/ltblue-dot.png",
      title: ""
    });
    marker.setPosition({
      lat: userY,
      lng: userX
    });
    // marker.setVisible(true);
    addMarkers();
    marker.setVisible(true);
  });
  // console.log(`queryRadius = ${queryRadius}`)
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
  var bounds = new google.maps.LatLngBounds();
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
    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
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
    async:true,
    data: newSearch
  })
  // .then(function(data) {
  //   console.log("newSearch posted");
  // })
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
