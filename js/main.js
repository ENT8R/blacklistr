$(document).ready(function() {
  $('#countries').change(function() {
    updateMap(jsyaml.safeLoad($('#countries').val()));
  });

  $('#mode').change(function() {
    updateMap(jsyaml.safeLoad($('#countries').val()));
  });

  updateMap();
});

const http = new XMLHttpRequest();
let geoJSONLayer;

const bringToBack = ['EU'];

const map = L.map('map', {
  minZoom: 2,
  maxZoom: 22
}).setView([30, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 22,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function updateMap(countries) {
  if (geoJSONLayer) map.removeLayer(geoJSONLayer);
  if (!countries) countries = [];
  if (!Array.isArray(countries)) countries = countriesToArray(countries);

  geoJSONLayer = L.geoJSON(countryBoundaries, {
    style: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags)
      if (countries.includes(countryCode)) {
        return getStyle(true);
      } else {
        return getStyle(false);
      }
    },
    filter: function(feature) {
      return getCountryCode(feature.properties.tags) != null && !bringToBack.includes(getCountryCode(feature.properties.tags));
    },
    onEachFeature: function(feature, layer) {
      if (bringToBack.includes(getCountryCode(feature.properties.tags))) {
        layer.bringToBack();
        layer.remove();
        //return;
      }
      layer.on({
        click: function(e) {
          console.log(e);
          const countryCode = getCountryCode(e.target.feature.properties.tags);
          const countries = countriesToArray($('#countries').val());
          console.log(countries);
          const index = countries.indexOf(countryCode);
          if (index > -1) {
            countries.splice(index, 1);
          } else {
            countries.push(countryCode);
          }
          console.log(countries.toString());
          $('#countries').val(countries.toString());
          Materialize.updateTextFields();
          updateMap(jsyaml.safeLoad(countries.toString()));
        }
      });
    }
  }).addTo(map);
}

function getStyle(which) {
  const style = {
    red: {
      fillColor: '#c62828',
      weight: 1.2,
      fillOpacity: 0.8
    },
    green: {
      fillColor: '#2e7d32',
      weight: 0.4
    }
  }
  if ($('#mode').is(":checked")) {
    return which ? style.green : style.red;
  } else {
    return which ? style.red : style.green;
  }
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
