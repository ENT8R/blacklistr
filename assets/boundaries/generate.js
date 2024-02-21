const fs = require('fs');
const path = require('path');
const countryCoder = require('@ideditor/country-coder');
const osmtogeojson = require('osmtogeojson');
const { DOMParser } = require('@xmldom/xmldom');

const BOUNDARIES = {
  JOSM: 'https://josm.openstreetmap.de/export/HEAD/josm/trunk/resources/data/boundaries.osm',
  NATURAL_EARTH: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
  GEO_MAPS: 'https://github.com/simonepri/geo-maps/releases/latest/download/countries-coastline-5km.geo.json'
};

// The order of this array also defines the order in the output file
// See https://github.com/ENT8R/blacklistr/issues/18 for more information
const BRING_TO_BACK = [
  'EU', 'FX'
];

fetch(BOUNDARIES.JOSM).then(response => response.text()).then(text => {
  const geojson = osmtogeojson(
    new DOMParser().parseFromString(text)
  );

  geojson.features.forEach((feature, index) => {
    delete feature.id;
    feature.properties = {
      // The file contains both countries with "ISO3166-1 alpha 2" codes and subdivisions with "ISO3166-2" codes
      code: feature.properties['ISO3166-1:alpha2'] || feature.properties['ISO3166-2'],
      name: feature.properties['name:en']
    };

    // Convert LineString to Polygon
    if (feature.geometry.type === 'LineString') {
      feature.geometry = {
        type: 'Polygon',
        coordinates: [
          feature.geometry.coordinates
        ]
      };
    }

    if (BRING_TO_BACK.includes(feature.properties.code)) {
      const to = BRING_TO_BACK.indexOf(feature.properties.code);
      geojson.features.splice(to, 0, geojson.features.splice(index, 1)[0]);
    }
  });

  fs.writeFileSync(path.join(__dirname, 'josm.geojson'), JSON.stringify(geojson), 'utf-8');
});

fetch(BOUNDARIES.NATURAL_EARTH).then(response => response.json()).then(json => {
  json.features.forEach(feature => {
    delete feature.bbox;
    feature.properties = {
      code: feature.properties.ISO_A2,
      name: feature.properties.NAME_LONG
    };

    // Some country codes are missing in this file
    // See e.g. https://github.com/nvkelso/natural-earth-vector/issues/12
    // or https://github.com/nvkelso/natural-earth-vector/issues/284
    const workaround = {
      'Northern Cyprus': 'CY',
      'France': 'FR',
      'Kosovo': 'XK',
      'Norway': 'NO',
      'Somaliland': 'SO'
    };

    if (feature.properties.code === '-99' && workaround[feature.properties.name]) {
      feature.properties.code = workaround[feature.properties.name];
    }
  });

  fs.writeFileSync(path.join(__dirname, 'naturalearth.geojson'), JSON.stringify(json), 'utf-8');
});

fetch(BOUNDARIES.GEO_MAPS).then(response => response.json()).then(json => {
  json.features.forEach(feature => {
    const country = countryCoder.feature(feature.properties.A3);
    feature.properties = {
      code: country.properties.iso1A2,
      name: country.properties.nameEn
    };
  });

  fs.writeFileSync(path.join(__dirname, 'geomaps.geojson'), JSON.stringify(json), 'utf-8');
});
