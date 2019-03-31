// Set intial postion of the map
var myMap = L.map("map",{
    center: [34.913015, -117.017435],
    zoom: 10
});

// Add tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 8,
  id: "mapbox.streets",
  accessToken: API_Key
}).addTo(myMap);

var geojson;
var apiLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

d3.json(apiLink, function(data) {
  
  // console.log(data.features[0].properties.mag)
  // console.log(data.features)
  console.log(data.features)
    
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
        };
        
        // Creating a GeoJSON layer with the retrieved data
    geojson = L.geoJson(data,{
        "pointToLayer": function (feature, latlng) {
        // console.log(feature);
      if (feature.properties.mag <= 1.0){
        geojsonMarkerOptions.radius = 10
        geojsonMarkerOptions.fillColor ="#00FF00"
      }
      else if(feature.properties.mag <= 2.0){
        geojsonMarkerOptions.radius = 15
        geojsonMarkerOptions.fillColor ="#AAFF00"
      }
      else if(feature.properties.mag <= 3.0){
        geojsonMarkerOptions.radius = 20
        geojsonMarkerOptions.fillColor ="#FFFF00"
      }
      else if(feature.properties.mag <= 4.0){
        geojsonMarkerOptions.radius = 25
        geojsonMarkerOptions.fillColor ="#FF7700"
      }
      else if(feature.properties.mag >= 5.0){
        geojsonMarkerOptions.radius = 30
        geojsonMarkerOptions.fillColor ="#FF0000"
      }
      return L.circleMarker(latlng, geojsonMarkerOptions)
    },
    "onEachFeature": function(feature, layer){
      // console.log(layer)
      layer.bindPopup("<h3>" + feature.properties.mag +
      "</h3>")
    }
    
    }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "topleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["0-1","1-2","2-3","3-4","4-5"];
    var colors = ["#00FF00","#AAFF00","#FFFF00","#FF7700","#FF0000"];
    var labels = [];
    console.log(limits);
    console.log(colors);

    // Add min & max
    var legendInfo = "<h1>Magnitudes</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"limits\">" + limits[0] + "</div>" +
        "<div class=\"limit\">" + limits[3] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      console.log()
    });

    console.log(labels)

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
    
  });
