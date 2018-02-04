const bringToBack = ['EU', 'FX'];

const modes = {
  blacklist: 'blacklist',
  whitelist: 'whitelist'
}
const queryTypes = {
  allExcept: 'all except',
  only: 'only'
}

//Get the URL params and use them to e.g. show the data on the map
function init() {
  const url = new URL(window.location.href);

  const data = url.searchParams.get('data');
  const file = url.searchParams.get('file');

  if (data) {
    $('#countries').val(data);
    updateMap();
  }
  if (file) {
    request(file, function(value) {
      $('#countries').val(value);
      updateMap();
    });
  }
}

function request(url, callback) {
  const http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(http.responseText);
    }
  };
  http.open('GET', url, true);
  http.send();
}

function updateMap() {
  if (geoJSONLayer) map.removeLayer(geoJSONLayer);
  const input = parseInput($('#countries').val());
  const countries = input.countries;
  const comments = input.comments;
  const mode = input.mode;

  geoJSONLayer = L.geoJSON(countryBoundaries, {
    style: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags);
      if (countries.includes(countryCode)) {
        if (mode == modes.blacklist) {
          return getStyle('red');
        } else {
          return getStyle('green');
        }
      } else {
        if (mode == modes.blacklist) {
          return getStyle('green');
        } else {
          return getStyle('red');
        }
      }
    },
    filter: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags);
      return countryCode != null && countries.includes(countryCode);
    },
    onEachFeature: function(feature, layer) {
      const countryCode = getCountryCode(feature.properties.tags);
      if (comments[countryCode]) {
        let text = comments[countryCode];
        if (isUrl(text)) text = text.link(text);
        layer.bindPopup(text);
      }
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
      weight: 1.2,
      fillOpacity: 0.8
    }
  }
  return style[color];
}

function getCountryCode(tags) {
  return tags['ISO3166-2'] || tags['ISO3166-1:alpha2'];
}

function parseInput(input) {
  let parsed = {
    countries: [],
    comments: {},
    mode: ''
  };

  if (!input) return parsed;
  const lines = input.split('\n');
  if (!lines) return parsed;

  for (let i = 0; i < lines.length; i++) {
    //Filter out lines with comments
    if (lines[i].startsWith('#') || lines[i] == '' || lines[i] == '\n') continue;

    //Set the mode if not set yet
    if (!parsed.mode) {
      if (lines[i].startsWith(queryTypes.allExcept)) parsed.mode = modes.blacklist;
      if (lines[i].startsWith(queryTypes.only)) parsed.mode = modes.whitelist;
      continue;
    }

    const data = lines[i].split('#', 2);
    const countries = normalizeArray(data[0].split(','));
    const comments = data[1];

    for (let i = 0; i < countries.length; i++) {
      parsed.countries.push(normalizeValue(countries[i]));
    }

    if (comments) {
      parsed.comments[countries[countries.length - 1]] = comments.replace(' ', '');
    }
  }

  return parsed;
}

function normalizeValue(value) {
  return value.replace(/ /g, '');
}
function normalizeArray(array) {
  let tempArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] == '' || array[i].length < 2) continue;
    tempArray.push(normalizeValue(array[i]));
  }
  return tempArray;
}

function isUrl(url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}
