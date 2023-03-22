// maybe flag local restaurants or tourist spots
// there is also a function called getCenter() that gives lat/long of the center of the map
// could use for searching through the map
// maybe find a way to click on map to drop pin

// @license
// Copyright 2019 Google LLC. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var surpriseBtn = $('#surprise-btn');
var clearStorage = $('#clear-storage-btn')
var localStorageData;
var lastSearchName;
var lat;
var lng;
var placeName;
var placeID;
var latLng;
var storedLat;
var storedLng;
var map;
var card;
var input;
var place;
var autocomplete;
var marker;
var storedInfo = [];
var surpriseList = [
    ['Lima, Peru', -12.0463731, -77.042754],
    ['Umbria, Italy', 42.938004, 12.6216211],
    ['Fukuoka, Japan', 33.5901838, 130.4016888],
    ['Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia', 3.1569486, 101.712303],
    ['South Africa', -30.559482, 22.937506],
    ['Nova Scotia, Canada', 44.6922613, -62.6571885], 
    ['Bhutan', 27.514162, 90.433601],
    ['Magdalena, Columbia', 11.3064409, -74.0657561],
    ['Istanbul, Turkey', 41.0082376, 28.9783589],
    ['Western Australia, Australia', -27.6728168, 121.6283098],
    ['Zambia', -13.133897, 27.849332],
    ['Dominica', 15.414999,-61.37097600000001],
    ['Halkidiki, Greece', 40.3694997,23.287085],
    ['Jamaica', 18.109581, -77.297508],
    ['Jordan', 30.585164, 36.238414],
    ['Malta', 35.937496, 14.375416],
    ['Raja Ampat Regency, West Papua, Indonesia', -1.032046750338687, 130.5052175718387],
    ['Accra, Ghana', 5.6037168, -0.1869644],
    ['Albania', 41.153332, 20.168331],
    ['Sydney NSW, Australia', -33.8688197, 151.2092955],
    ['Guyana', 4.860416, -58.93018],
    ['Boise, ID, USA', 43.6150186, -116.2023137],
    ['Alaska, USA', 64.2008413, -149.4936733],
    ['New Mexico, USA', 34.5199402, -105.8700901],
    ['El Salvador', 13.794185, -88.89653],
    ['Dresden, Germany', 51.0504088, 13.7372621],
    ['Marseille, France', 43.296482, 5.36978],
    ['Manchester, UK', 53.4807593, -2.2426305], 
    ['Scotland, UK', 56.49067119999999, -4.2026458],
    ['Montevideo, Uruguay', -34.8181587, -56.2138256]
];

// Getting local storage through key length and getting key name and latlng
for (var i = 0; i < localStorage.length; i++) {

    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    value = value.replaceAll('"','');
    value = value.split(',');

    storedLat = Number(value[0]);
    storedLng = Number(value[1]);
    // console.log('city: ' + key + '; lat: ' + storedLat + '; lng: ' + storedLng)
    storedInfo[i] = [key, storedLat, storedLng, i];
    
}

// Sets the previous searched places to be listed in the map as flags
function setMarkers(map) {

    var image = {
      url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32),
    };

    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };

    for (var i = 0; i < storedInfo.length; i++) {

      let marker = new google.maps.Marker({
        position: { lat: storedInfo[i][1], lng: storedInfo[i][2] },
        map,
        icon: image,
        shape: shape,
        latitude: storedInfo[i][1],
        longitude: storedInfo[i][2],
        title: storedInfo[i][0],
        zIndex: storedInfo[i][3],
        
      });

      // Click event listener to the flags to zoom in when clicked on and add red marker
// need to work on after click still have search bar showing
      marker.addListener('click', function(){
          
        var clicked = { lat: marker.get("latitude"), lng: marker.get("longitude") };
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 6,
          center: clicked,
        });
        // card = document.getElementById("pac-card");
        // input = document.getElementById("pac-input");
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
  
        // autocomplete = new google.maps.places.Autocomplete(input);
      
        marker = new google.maps.Marker({
          position: clicked,
          map: map,
        });
        

  //       autocomplete.addListener("place_changed", () => {
  //         marker.setVisible(false);
          
  //         place = autocomplete.getPlace();
  
  //         placeID = place.place_id;
  //         placeName = place.formatted_address;
    
  //         if (!place.geometry || !place.geometry.location) {
  //         // User entered the name of a Place that was not suggested and
  //         // pressed the Enter key, or the Place Details request failed.
          
  // // CHANGE THIS TO MODAL AND ADD GIF
  //             window.alert("No details available for input: '" + place.name + "'");
  //             return;
  //         }
    
  //       // If the place has a geometry, then present it on a map.
  //         if (place.geometry.viewport) {
  //             map.fitBounds(place.geometry.viewport);
  //         } else {
  //             map.setCenter(place.geometry.location);
  //             map.setZoom(17);
  //         }
    
  //         marker.setPosition(place.geometry.location);
  //         marker.setVisible(true);
  
  //     });
      })
    }
}

// map function to display map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 1,
      mapTypeControl: false,
    });

    if (localStorage.length !== 0){
        setMarkers(map);
    };

    card = document.getElementById("pac-card");
    input = document.getElementById("pac-input");
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
  
    autocomplete = new google.maps.places.Autocomplete(input);
  
    marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, 0),
    });
  
    autocomplete.addListener("place_changed", () => {
        marker.setVisible(false);
        
        place = autocomplete.getPlace();

        placeID = place.place_id;
        placeName = place.formatted_address;

        // getting lat lng
        fetch ('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + placeID + '&key=AIzaSyBtgd8tFi13h7xX6R0bVuKhWddciq5pd94')
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            latLng = lat + ',' + lng;
            saveSearch();
        });
  
        if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        
// CHANGE THIS TO MODAL AND ADD GIF
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
  
      // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
  
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

    });
    
}

// Calling Map function to display
window.initMap = initMap;

// Save last search to local storage function
function saveSearch() {
    localStorage.setItem(placeName, JSON.stringify(latLng));
}

// Clear storage click listener
clearStorage.on('click', function () {
  localStorage.clear();
  location.reload();
});

// randomizer for click event surprise me
surpriseBtn.on('click', function () {
  var random = Math.floor(Math.random() * 30); //<< gets random number from 0 - 29 for index
  console.log(surpriseList[random][1])

  var rdmPlace = { lat: surpriseList[random][1], lng: surpriseList[random][2] };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: rdmPlace,
  });
      
  marker = new google.maps.Marker({
    position: rdmPlace,
    map: map,
  });
});