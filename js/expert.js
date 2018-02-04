let controlPressed = false;
let geoJSONLayer;

$(document).ready(function() {
  $('#countries').change(function() {
    updateMap();
  });

  if (!$('#countries').val()) updateMap();

  $(this).keydown(function(e) {
    if (e.ctrlKey) {
      controlPressed = true;
    }
  });
  $(this).keyup(function(e) {
    controlPressed = false;
  });
});

const map = L.map('map', {
  minZoom: 2,
  maxZoom: 22,
  preferCanvas: true,
  renderer: L.canvas()
}).setView([30, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/ent8r/cjd7swe4x8ccm2so23wkllidk/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  minZoom: 2,
  maxZoom: 22,
  accessToken: 'pk.eyJ1IjoiZW50OHIiLCJhIjoiY2pkNGt1cjVwNXpydjM0bGd4ZnprejNtYyJ9.D4uCEBHanButbKh65nX0ZQ',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

init();

const screenshotButton = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.type = 'button';
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.style.backgroundImage = "url(https://upload.wikimedia.org/wikipedia/commons/1/15/Ic_camera_alt_48px.svg)";
    container.style.backgroundSize = "30px 30px";
    container.style.width = '32px';
    container.style.height = '30px';
    container.onclick = function() {
      container.style.backgroundColor = '#ffa726';
      leafletImage(map, function(err, canvas) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = 'blacklistr-screenshot';
        document.getElementById('images').innerHTML = '';
        document.getElementById('images').appendChild(a);
        a.click();
        container.style.backgroundColor = 'white';
      });
    }
    return container;
  }
});
const resetButton = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.type = 'button';
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.style.backgroundImage = "url(https://lh5.ggpht.com/fufQfzgZYckcX4OKwJcuYrODdDXmIIZDXcf9ak2uHeJbahauAbmhqAYgWJE1v5Xg0eJj=w300)";
    container.style.backgroundSize = "30px 30px";
    container.style.width = '34.3px';
    container.style.height = '34px';
    container.onclick = function() {
      container.style.backgroundColor = '#ffa726';
      map.setView([30, 0], 2);
      container.style.backgroundColor = 'white';
    }
    return container;
  }
});
map.addControl(new screenshotButton());
map.addControl(new resetButton());
