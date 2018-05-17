const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('110m.geojson', 'utf-8'));

const workaround = {
  'Ashmore and Cartier Islands': 'AU',
  'Indian Ocean Territories': 'IO',
  'Northern Cyprus': 'CY',
  'Norway': 'NO',
  'Somaliland': 'SO',
  'France': 'FR',
};

for (let i = 0; i < geojson.features.length; i++) {
  const countryName = geojson.features[i].properties.NAME_LONG;
  const countryCode = getCountryCode(geojson.features[i].properties, countryName);

  geojson.features[i].properties = {
    'ISO3166-1:alpha2': countryCode,
    'name:en': countryName
  };
}

function getCountryCode(properties, countryName) {
  let countryCode = properties.ISO_A2;
  if (countryCode === '-99' && workaround[countryName]) {
    countryCode = workaround[countryName];
  }
  return countryCode;
}

fs.writeFileSync('naturalearth.geojson', JSON.stringify(geojson, null, 2), 'utf-8');
