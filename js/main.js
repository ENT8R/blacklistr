$(document).ready(function() {
  $('#countries').change(function() {
    updateMap();
  });
  $('#disabled').change(function() {
    updateMap();
  });
  $('#mode').change(function() {
    updateMap();
  });
  $('#borders').change(function() {
    updateMap();
  });

  if (!$('#countries').val()) updateMap();
});

let geoJSONLayer;

const bringToBack = ['EU'];

const map = L.map('map', {
  minZoom: 2,
  maxZoom: 22,
  preferCanvas: true,
  renderer: L.canvas()
}).setView([30, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/ent8r/cjd7swe4x8ccm2so23wkllidk/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  maxZoom: 22,
  accessToken: 'pk.eyJ1IjoiZW50OHIiLCJhIjoiY2pkNGt1cjVwNXpydjM0bGd4ZnprejNtYyJ9.D4uCEBHanButbKh65nX0ZQ',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

init();

//Get the URL params and use them to e.g. show the data on the map
function init() {
  const url = new URL(window.location.href);

  const data = url.searchParams.get('data');
  const disabled = url.searchParams.get('disabled');
  const mode = url.searchParams.get('mode');
  const borders = url.searchParams.get('borders');

  if (data) $('#countries').val(data);
  updateMap();
  if (mode == 1 || mode == 'whitelist' || mode == 'white') {
    $('#mode').prop('checked', true);
    updateMap();
  }
  if (borders == 1 || borders == 'true') {
    $('#borders').prop('checked', true);
    updateMap();
  }

  if (data || disabled || mode || borders) {
    const uri = window.location.toString();
    if (uri.indexOf('?') > 0) {
      window.history.replaceState({}, document.title, uri.substring(0, uri.indexOf('?')));
    }
  }
}

function updateMap() {
  if (geoJSONLayer) map.removeLayer(geoJSONLayer);
  let countries = jsyaml.safeLoad($('#countries').val());
  if (!countries) countries = [];
  if (!Array.isArray(countries)) countries = countriesToArray(countries);

  let disabled = jsyaml.safeLoad($('#disabled').val());
  if (!disabled) disabled = [];
  if (!Array.isArray(disabled)) disabled = countriesToArray(disabled);

  geoJSONLayer = L.geoJSON(countryBoundaries, {
    style: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags);
      if (disabled.includes(countryCode)) {
        return getStyle('orange');
      }
      if (countries.includes(countryCode)) {
        return $('#mode').is(':checked') ? getStyle('green') : getStyle('red');
      } else {
        return $('#mode').is(':checked') ? getStyle('red') : getStyle('green');
      }
    },
    filter: function(feature) {
      return getCountryCode(feature.properties.tags) != null && !bringToBack.includes(getCountryCode(feature.properties.tags));
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        click: function(e) {
          const countryCode = getCountryCode(e.target.feature.properties.tags);
          const countries = countriesToArray($('#countries').val());
          const index = countries.indexOf(countryCode);
          if (index > -1) {
            countries.splice(index, 1);
          } else {
            countries.push(countryCode);
          }
          $('#countries').val(countries.toString());
          Materialize.updateTextFields();
          updateMap();
        }
      });
    }
  }).addTo(map);
}

function getStyle(color) {
  const style = {
    red: {
      fillColor: '#c62828',
      weight: 1.2,
      fillOpacity: 0.8
    },
    orange: {
      fillColor: '#ffa726',
      weight: 1.2,
      fillOpacity: 0.8
    },
    green: {
      fillColor: '#2e7d32',
      weight: 0.4
    }
  }
  if ($('#borders').is(':checked')) {
    style.red.stroke = false;
    style.green.stroke = false;
    style.orange.stroke = false;
  }
  return style[color];
}

function getCountryCode(tags) {
  return tags['ISO3166-2'] || tags['ISO3166-1:alpha2'];
}

function countriesToArray(countries) {
  if (Array.isArray(countries)) return countries;
  else if (countries.includes(', ')) return countries.split(', ');
  else if (countries.includes(',')) return countries.split(',');
  else if (countries.includes(' ')) return countries.split(' ');
  else if (countries.includes('\n')) return countries.split('\n');
  else if (!countries) return [];
  else return [countries];
}

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
map.addControl(new screenshotButton());
