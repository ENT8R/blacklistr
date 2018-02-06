const bringToBack = ['EU', 'FX'];

const modes = {
  blacklist: 'blacklist',
  whitelist: 'whitelist'
}
const queryTypes = {
  allExcept: 'all except',
  only: 'only'
}
const questDirectory = 'https://raw.githubusercontent.com/westnordost/StreetComplete/master/app/src/main/java/de/westnordost/streetcomplete/quests/';

let geoJSONLayer;

const screenshotButton = new Buttons.ScreenshotButton();
const resetButton = new Buttons.ResetButton();

const map = L.map('map', {
  minZoom: 2,
  maxZoom: 22,
  preferCanvas: true,
  zoomControl: false,
  maxBounds: [
    [90, 180],
    [-90, -180]
  ]
}).setView([30, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/ent8r/cjd7swe4x8ccm2so23wkllidk/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  minZoom: 2,
  maxZoom: 22,
  accessToken: 'pk.eyJ1IjoiZW50OHIiLCJhIjoiY2pkNGt1cjVwNXpydjM0bGd4ZnprejNtYyJ9.D4uCEBHanButbKh65nX0ZQ',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.addControl(new Buttons.HideButton());
map.addControl(screenshotButton);
map.addControl(resetButton);

const editor = CodeMirror(document.getElementById('countries'), {
  lineNumbers: true,
  value: 'all except\n' +
    'NL, # https://forum.openstreetmap.org/viewtopic.php?id=60356\n' +
    'DK, # https://lists.openstreetmap.org/pipermail/talk-dk/2017-November/004898.html\n' +
    'NO, # https://forum.openstreetmap.org/viewtopic.php?id=60357\n' +
    'CZ, # https://lists.openstreetmap.org/pipermail/talk-cz/2017-November/017901.html',
  placeholder: 'Input all ISO-3166 country codes seperated by a comma or line break (comments are allowed too)',
  theme: 'material',
  mode: 'yaml',
  autofocus: true,
  lineWrapping: true
});
editor.on('change', function(cm, change) {
  updateMap();
});

init();
updateMap();

//Get the URL params and use them to e.g. show the data on the map
function init() {
  const url = new URL(window.location.href);

  const data = url.searchParams.get('data');
  const file = url.searchParams.get('file');
  const java = url.searchParams.get('java');

  if (data) {
    editor.setValue(data);
    updateMap();
  }
  if (file) {
    request(file, function(value) {
      editor.setValue(value);
      updateMap();
    });
  }
  if (java) {
    let url = java;
    if (!isUrl(java)) url = questDirectory + java;
    request(url, function(value) {
      editor.setValue(Countries.parseJava(value));
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
  const input = Countries.parse(editor.getValue());
  const countries = input.countries;
  const comments = input.comments;
  const mode = input.mode;

  geoJSONLayer = L.geoJSON(boundaries, {
    style: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags);
      if (countries.includes(countryCode)) {
        if (mode == modes.blacklist) {
          return getStyle('red');
        } else {
          return getStyle('green');
        }
      } else {
        return getStyle('invisible');
      }
    },
    filter: function(feature) {
      const countryCode = getCountryCode(feature.properties.tags);
      return countryCode != null && !bringToBack.includes(countryCode);
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        click: function(e) {
          const countryCode = getCountryCode(e.target.feature.properties.tags);
          const index = input.countries.indexOf(countryCode);
          if (index > -1) {
            input.countries.splice(index, 1);
          } else {
            input.countries.push(countryCode);
          }
          editor.setValue(Countries.stringify(input));
          updateMap();
        }
      });
    }
  }).addTo(map);

  updateText(input);
}

function updateText(input) {
  let finalString = '';

  if (input.mode == modes.blacklist) finalString += 'Blacklisted in ';
  else if (input.mode == modes.whitelist) finalString += 'Whitelisted in ';

  for (let i = 0; i < input.countries.length; i++) {
    finalString += codes[input.countries[i]];
    if (input.countries.indexOf(input.countries[i]) != input.countries.length - 1) finalString += ', ';
  }
  //TODO: work with the finalString
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
    },
    invisible: {
      fillOpacity: 0,
      weight: 0
    }
  }
  return style[color];
}

function getCountryCode(tags) {
  return tags['ISO3166-2'] || tags['ISO3166-1:alpha2'];
}

function isUrl(url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}

function toggleSide() {
  if ($('#map').hasClass('s8')) {
    $('#map').removeClass('s8').addClass('s12');
    map.removeControl(screenshotButton);
    map.removeControl(resetButton);
  }
  else {
    $('#map').removeClass('s12').addClass('s8');
    map.addControl(screenshotButton);
    map.addControl(resetButton);
  }
  editor.refresh();
}
