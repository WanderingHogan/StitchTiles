var mymap = L.map('mapid', { scrollWheelZoom: false }).setView([39.2859485, -76.6166236], 13);
var access_token = 'pk.eyJ1Ijoic2Vuc29yY29sbGVjdGl2ZSIsImEiOiJjaXAzNzh5ZmowMGh3dTBtM25wOGtkdTJkIn0.29-vseOhNO5WBISkHnVgrQ';

var streetmapURL = 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + access_token;
var satelliteUrl = 'https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=' + access_token;

var cat = L.tileLayer(streetmapURL, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    unloadInvisibleTiles: true
}).addTo(mymap);

var coordsMarker = {
    radius: 12,
    fillColor: "#ff7800",
    color: "#fff",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.75
}
var locationMarker = L.circleMarker([-99999999999, -99999999999], coordsMarker).addTo(mymap);

function makecanvas(width, height) {

    if (!width) {
        width = $('#mapid').width();
    }
    if (!height) {
        height = $('#mapid').height();
    }
    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");

    _.mapValues(cat._tiles, function (o, v) {
        var image = new Image();
        image.src = o.currentSrc;
        image.onload = function (image, val) {
            return function () {
                var adjustedPoint = mymap.layerPointToContainerPoint([o.x, o.y])
                context.drawImage(image, adjustedPoint.x, adjustedPoint.y, val.width, val.height);
            }
        } (image, o);
    });
}

// get location from browser

function geo_success(position) {
    mymap.setView([position.coords.latitude, position.coords.longitude], 18);
    setTextInputValue()
}

function geo_error() {
console.log('Sorry, no position available. Setting location to Baltimore.');
mymap.setView([39.289580, -76.615160], 18);
}

var geo_options = {
enableHighAccuracy: true, 
maximumAge        : 30000, 
timeout           : 3500
};

var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

function setTextInputValue(){
    // $('#locationInput').val(mymap.getCenter().lat + ', ' + mymap.getCenter().lng)
    document.getElementById("locationInput").defaultValue = (mymap.getCenter().lat + ', ' + mymap.getCenter().lng);
}

mymap.on('moveend', function(e){
    setTextInputValue()
})
// interaction with buttons

$('#goButton').click(function (evt) {
    makecanvas($('#widthInput').val(), $('#heightInput').val())
    evt.preventDefault();
})

$('#latLngInput').submit(function (event, val) {
    try {
        var newCoords = $("#locationInput").val().split(',');

        mymap.panTo([Number(newCoords[0]), Number(newCoords[1])]);
        locationMarker.setLatLng([Number(newCoords[0]), Number(newCoords[1])]);

    }
    catch (err) {
        alert('Problem with input coordinates, make sure it is latitude, longitude')
    }
    event.preventDefault();
});

$('#reloadPage').click(function(){
    location.reload();
})

$('#basemapToggle').click(function(evt){
    console.log($('#basemapToggle').text())
    if($('#basemapToggle').text() === ' Sat'){
        cat.setUrl(satelliteUrl)
        $('#basemapToggle').html('<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> Street')
    }
    else {
        cat.setUrl(streetmapURL)
        $('#basemapToggle').html('<span class="glyphicon glyphicon-globe" aria-hidden="true"></span> Sat')
    }
    evt.preventDefault();
})

