
  // Store our API endpoint inside queryUrl
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
  
  // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    
    console.log(earthquakeData);
    var worldMarkers = [];

    for (var i = 0; i <= earthquakeData.length - 1; i++) {  
        var mag = String(earthquakeData[i].properties.mag);
        var coordinates = [];
        coordinates = earthquakeData[i].geometry.coordinates;
        var lng = coordinates[0];
        var lat = coordinates[1];
        var newcoo = [lat, lng];
        var place = earthquakeData[i].properties.place;
        var time = new Date(earthquakeData[i].properties.time);

        worldMarkers.push(
            L.circle(newcoo, {
              stroke: true,
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.75,
              color: "black",
              fillColor: chooseColor(earthquakeData[i].properties.mag),
              radius: earthquakeData[i].properties.mag * 10000
            }).bindPopup("<h3>" + earthquakeData[i].properties.place + 
            "</h3>" + "<h4>" + earthquakeData[i].properties.mag + "</h4><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>"));
    }
   
    // Define streetmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var world = L.layerGroup(worldMarkers);

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "world" : world
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3,
      layers: [streetmap, world]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // add a legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {

        var div = L.DomUtil.create("div", "info legend");
        var labels = ['<strong>Magnitudes</strong>'];
        categories = ['0-1','1-2','2-3','3-4','4-5', '5+'];
  
  
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
                labels.push('<i style="background:' + getColor(categories[i]) + '"></i> ' +
                    (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
    
  }


  function chooseColor(magnitude) {
    var col;
    if (magnitude < 1) {
        col = "purple"; 
    } 
    else if (magnitude < 2) {
        col = "blue";
    }
    else if (magnitude < 3) {
        col = "green";
    }
    else if (magnitude < 4) {
        col = "yellow";
    }
    else if (magnitude < 5) {
        col = "coral";
    }
    else if (magnitude < 9) {
        col = "red";
    }
    return col;
  }

  function getColor(d) {
    return d === '0-1'  ? "purple" :
           d === '1-2'  ? "blue" :
           d === '2-3' ? "green" :
           d === '3-4' ? "yellow" :
           d === '4-5' ? "coral" :
           d === '5+' ? "red" : "chartreuse";
   }