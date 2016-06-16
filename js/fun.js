var mymap = L.map('mapid', { scrollWheelZoom: false }).setView([39.2859485, -76.6166236], 13);

var cat = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
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

// interaction with buttons

$('#goButton').click(function (evt) {
    makecanvas($('#widthInput').val(), $('#heightInput').val())
    evt.preventDefault();
})

$("#latLngInput").submit(function (event, val) {
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