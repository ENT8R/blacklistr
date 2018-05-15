/* globals L */
/* globals CodeMirror */

const Countries = require('./countries.js');
const Buttons = require('./buttons.js');
const Boundaries = require('../assets/boundaries.js');
const Codes = require('../assets/codes.min.js');
const placeholder = require('../assets/placeholder.js');

const config = {
  // see https://github.com/ENT8R/blacklistr/issues/18 for more information
  bringToBack: ['EU', 'FX', 'AU-NSW'],
  questDirectory: 'https://raw.githubusercontent.com/westnordost/StreetComplete/master/app/src/main/java/de/westnordost/streetcomplete/quests/'
};

let geoJSONLayer;

const screenshotButton = new Buttons.Screenshot();
const resetButton = new Buttons.Reset();

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

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  minZoom: 2,
  maxZoom: 19
}).addTo(map);

map.addControl(new Buttons.Hide());
map.addControl(screenshotButton);
map.addControl(resetButton);

const editor = CodeMirror(document.getElementById('codemirror-container'), {
  lineNumbers: true,
  value: hasURLParams() ? '' : placeholder,
  placeholder: 'Input all ISO-3166 country codes seperated by a comma or line break (comments are allowed too)',
  theme: 'material',
  mode: 'javascript',
  autofocus: true,
  lineWrapping: true,
  smartIndent: false
});
editor.on('change', () => {
  updateMap();
});

init();
updateMap();

// Get the URL params and use them to e.g. show the data on the map
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
    request(file).then(value => {
      editor.setValue(value);
      updateMap();
    });
  }
  if (java) {
    let url = java;
    if (!isUrl(java)) {
      url = config.questDirectory + java;
    }
    request(url).then(value => {
      editor.setValue(Countries.parseJava(value));
      updateMap();
    });
  }
}

function request(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(http.responseText);
        } else {
          reject(http.responseText);
        }
      }
    };
    http.open('GET', url, true);
    http.send();
  });
}

function updateMap() {
  if (geoJSONLayer) {
    map.removeLayer(geoJSONLayer);
  }
  const input = Countries.parse(editor.getValue());
  const countries = input.countries;
  // const comments = input.comments;
  const mode = input.mode;

  geoJSONLayer = L.geoJSON(Boundaries, {
    style(feature) {
      const countryCode = getCountryCode(feature.properties);
      if (countries.includes(countryCode)) {
        if (mode === Countries.modes.blacklist) {
          return getStyle('red');
        } else {
          return getStyle('green');
        }
      } else {
        return getStyle('invisible');
      }
    },
    filter(feature) {
      const countryCode = getCountryCode(feature.properties);
      return countryCode != null && !config.bringToBack.includes(countryCode);
    },
    onEachFeature(feature, layer) {
      layer.on({
        click(e) {
          const countryCode = getCountryCode(e.target.feature.properties);
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

  if (input.mode === Countries.modes.blacklist) {
    finalString += 'Blacklisted in ';
  } else if (input.mode === Countries.modes.whitelist) {
    finalString += 'Whitelisted in ';
  }

  for (let i = 0; i < input.countries.length; i++) {
    finalString += Codes[input.countries[i]];
    if (input.countries.indexOf(input.countries[i]) !== input.countries.length - 1) {
      finalString += ', ';
    }
  }
  const countryList = document.getElementById('country-list');
  if (input.countries.length > 0) {
    countryList.innerHTML = finalString;
  } else {
    countryList.innerHTML = '';
  }
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
  };
  return style[color];
}

function getCountryCode(tags) {
  return tags['ISO3166-2'] || tags['ISO3166-1:alpha2'];
}

function isUrl(url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url); // eslint-disable-line no-useless-escape
}

function hasURLParams() {
  const url = new URL(window.location.href);
  return url.searchParams.get('data') != null || url.searchParams.get('file') != null || url.searchParams.get('java') != null;
}

function toggleSide(map) {
  const mapContainer = document.getElementById('map');

  if (hasClass(mapContainer, 's8')) {
    mapContainer.classList.remove('s8');
    mapContainer.classList.add('s12');
    map.removeControl(screenshotButton);
    map.removeControl(resetButton);
  } else {
    mapContainer.classList.remove('s12');
    mapContainer.classList.add('s8');
    map.addControl(screenshotButton);
    map.addControl(resetButton);
  }
  editor.refresh();
}

function hasClass(element, cls) {
  if ((`${element.className}`).replace(/[\n\t]/g, ' ').includes(cls)) {
    return true;
  }
  return false;
}

exports.toggleSide = toggleSide;
