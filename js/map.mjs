/* globals L */
import * as Buttons from './buttons.mjs';
import { MODE } from './parser.mjs';

let map, layer;

const STYLES = {
  RED: {
    fillColor: '#c62828',
    weight: 1.2,
    fillOpacity: 0.8
  },
  ORANGE: {
    fillColor: '#ffa726',
    weight: 1.2,
    fillOpacity: 0.8
  },
  GREEN: {
    fillColor: '#2e7d32',
    weight: 1.2,
    fillOpacity: 0.8
  },
  DEFAULT: {
    fillColor: '#3388ff',
    weight: 1.2, // Actual Leaflet default value is at 3
    fillOpacity: 0.8 // Actual Leaflet default value is at 0.2
  },
  INVISIBLE: {
    fillOpacity: 0,
    weight: 0
  }
};

const buttons = {
  screenshot: new Buttons.Screenshot(),
  reset: new Buttons.Reset(),
  settings: new Buttons.Settings(),
  hide: new Buttons.Hide()
};

export function setup(listener) {
  map = L.map('map', {
    minZoom: 2,
    maxZoom: 18,
    preferCanvas: true,
    zoomControl: false,
    maxBounds: [
      [90, 180],
      [-90, -180]
    ]
  }).setView([30, 0], 2);

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  }).addTo(map);

  layer = L.geoJSON(null, {
    style: STYLES.INVISIBLE,
    filter(feature) {
      return feature.properties.code != null;
    },
    onEachFeature(feature, layer) {
      layer.on({
        click(e) {
          listener(e.target.feature.properties.code);
        }
      });
    }
  }).addTo(map);

  // Add all controls
  map.addControl(buttons.hide);
  showControl();
}

// Adds data to the original GeoJSON layer (used to show the country boundaries)
export function add(data) {
  layer.clearLayers();
  layer.addData(data);
}

export function update(input) {
  layer.eachLayer(layer => {
    let style = STYLES.INVISIBLE;
    const mentionned = input.countries.map(country => country.toUpperCase()).includes(layer.feature.properties.code);
    if (mentionned) {
      switch (input.mode) {
      case MODE.BLACKLIST:
        style = STYLES.RED;
        break;
      case MODE.WHITELIST:
        style = STYLES.GREEN;
        break;
      case MODE.NONE:
        style = STYLES.DEFAULT;
        break;
      }
    }
    layer.setStyle(style);
  });
}

export function resize() {
  map._onResize();
}

export function showControl() {
  map.addControl(buttons.screenshot);
  map.addControl(buttons.reset);
  map.addControl(buttons.settings);
}

export function hideControl() {
  map.removeControl(buttons.screenshot);
  map.removeControl(buttons.reset);
  map.removeControl(buttons.settings);
}
