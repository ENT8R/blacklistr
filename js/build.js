const fs = require('fs');

const boundaries = {
  josm: JSON.parse(fs.readFileSync('./assets/boundaries/josm/josm.geojson', 'utf-8')),
  naturalearth: JSON.parse(fs.readFileSync('./assets/boundaries/naturalearth/naturalearth.geojson', 'utf-8'))
};

fs.writeFileSync('./assets/boundaries/boundaries.js',
  `exports.JOSM = ${JSON.stringify(boundaries.josm)};
   exports.NaturalEarth = ${JSON.stringify(boundaries.naturalearth)};`,
  'utf8');
