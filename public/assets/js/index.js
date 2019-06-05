var input = document.getElementById('pac-input');
var placeResult = "";

google.maps.event.addDomListener(window, 'load', initialize);
    function initialize() {
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
    var place = autocomplete.getPlace();
    // place variable will have all the information you are looking for.
    $('#lat').val(place.geometry['location'].lat());
    $('#long').val(place.geometry['location'].lng());
    //https://stackoverflow.com/questions/49640884/save-result-from-google-place-autocomplete
    placeResult = place.formatted_address;
    console.log(placeResult);
    window.location.href = "/sitefinder?" + placeResult;
    });

}

function showPlace() {
    console.log("showPlace()")
}


