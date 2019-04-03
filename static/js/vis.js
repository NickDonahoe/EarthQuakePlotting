// Set intial postion of the map
var myMap = L.map("map",{
    center: [34.913015, -117.017435],
    zoom: 6
});

// Add tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 15,
  id: "mapbox.streets",
  accessToken: API_Key
}).addTo(myMap);

var geojson;

// Api link
var apiLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Access api data using d3
d3.json(apiLink, function(data) {
  
  // console.log(data.features[0].properties.mag)
  // console.log(data.features)
  console.log(data.features)
    
    // Formats each marker 
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
        };
        
    // Creating a GeoJSON layer with the retrieved data
    // Formats the marker based on data retrieved
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
    // Creates a popup feature to display info of earthquake
    "onEachFeature": function(feature, layer){
      // console.log(layer)
      layer.bindPopup("<div class=\"info\"><h3>Location: " + 
      feature.properties.place + "</h3><h3> Magnitude: " + feature.properties.mag +
      "</h3></div>")
    }
    
    }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["0-1","1-2","2-3","3-4","4-5", "5+"];
    var colors = ["#00FF00","#AAFF00","#FFFF00", "#FFA500","#FF7700","#FF0000"];
    // console.log(limits);
    // console.log(colors);

    // Formates the legend on the map 
    var legendInfo = "<h1>Magnitudes</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"limits\" style=\"float: left\">" + 
      "<ul>" +
      "<li>" + limits[0] + "</li>" + 
      "<li style=\"background-color: " + colors[0] + ";color:" + colors[0] +"\">" + "a" + "</li>" +
      "</ul>" +
      "<ul>" +
      "<li>" + limits[1] + "</li>" +
      "<li style=\"background-color: " + colors[1] + ";color:" + colors[1] +"\">" + "a" + "</li>" + 
      "</ul>" + 
      "<ul>" +
      "<li>" + limits[2] + "</li>" + 
      "<li style=\"background-color: " + colors[2] + ";color:" + colors[2] +"\">" + "a" + "</li>" +
      "</ul>" +
      "<ul>" +
      "<li>" + limits[3] + "</li>" + 
      "<li style=\"background-color: " + colors[3] + ";color:" + colors[3] +"\">" + "a" + "</li>" +
      "</ul>" +
      "<ul>" +
      "<li>" + limits[4] + "</li>" + 
      "<li style=\"background-color: " + colors[4] + ";color:" + colors[4] +"\">" + "a" + "</li>" +
      "</ul>" +
      "<ul>" +
      "<li>" + limits[5] + "</li>" + 
      "<li style=\"background-color: " + colors[5] + ";color:" + colors[5] +"\">" + "a" + "</li>" +
      "</ul>" +
      "</div></div>";

    div.innerHTML = legendInfo;

    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
    
  });