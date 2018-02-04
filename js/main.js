let geoJSONLayer;

const map = L.map('map', {
  minZoom: 2,
  maxZoom: 22,
  zoomControl: false
}).setView([30, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/ent8r/cjd7swe4x8ccm2so23wkllidk/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  minZoom: 2,
  maxZoom: 22,
  accessToken: 'pk.eyJ1IjoiZW50OHIiLCJhIjoiY2pkNGt1cjVwNXpydjM0bGd4ZnprejNtYyJ9.D4uCEBHanButbKh65nX0ZQ',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

updateMap();

init();
