//Initiate Leaflet map funtion
let map = L.map("map").setView([40.7, -73.97], 11);

//////////////////////////////////////////////////////////
// call Openstreet map to serve as the base layer       //
//////////////////////////////////////////////////////////
let leafletMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 19,
  noWrap: true,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// //add a marker
let marker = L.circleMarker([40.77, -73.97], {
  radius: 50,
  color: "red",
  fillColor: "yellow",
}).addTo(map);

//////////////////////////////////////////////////////////
//        Add GoogleMap Layer                          //
//////////////////////////////////////////////////////////
let googleMap = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
googleMap.addTo(map);
googleMap.once("data:loaded", function () {
  console.log("finished loaded googleMap");
});

//////////////////////////////////////////////////////////
//        Add Google Satellite Layer                    //
//////////////////////////////////////////////////////////

let googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
googleSat.addTo(map);
googleSat.once("data:loaded", function () {
  console.log("finished loaded googleSat layer");
});

//////////////////////////////////////////////////////////
//  Add the New York City Shapefile      static Shapefile//
//////////////////////////////////////////////////////////
let shapefile = new L.Shapefile("assets/New_York_State_Five_Borough_shp.zip", {
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.bindPopup(
        Object.keys(feature.properties)
          .map(function (k) {
            return k + ": " + feature.properties[k];
          })
          .join("<br />"),
        {
          maxHeight: 200,
        }
      );
    }
  },
});
shapefile.addTo(map);
shapefile.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});

//////////////////////////////////////////////////////////
//        Call the API            New York City Data    //
//////////////////////////////////////////////////////////

async function fetchMyApi() {
  let url = "https://data.cityofnewyork.us/resource/tgrn-h24f.geojson?";
  let response = await fetch(url);
  let result = await response.json();
  console.log("The result is", result);
  return result;
}

//fetch and add all features to Popup
fetchMyApi().then(function (data) {
  L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        layer.bindPopup(
          Object.keys(feature.properties)
            .map(function (i) {
              return i + ": " + feature.properties[i];
            })
            .join("<br />"),
          {
            maxHeight: 200,
          }
        );
      }
    },
  }).addTo(map);
});

//////////////////////////////////////////////////////////
//       Layer Control                                 //
//////////////////////////////////////////////////////////
let baseLayers = {
  OpenStreetMap: leafletMap,
  GoogleMap: googleMap,
  GoogleSat: googleSat,
};

let overlays = {
  Marker: marker,
};

L.control.layers(baseLayers, overlays).addTo(map);

marker.bindPopup("I am marker.");
marker.openPopup();

//////////////////////////////////////////////////////////
//       Activate currently clicked location            //
//////////////////////////////////////////////////////////
let popup = L.popup();
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent(
      "The currently clicked location is -<br>" +
        "<b>latitude:</b> " +
        e.latlng.lat +
        "<br>" +
        "<b>longitude:</b> " +
        e.latlng.lng
    )
    .openOn(map);
}
map.on("click", onMapClick);
