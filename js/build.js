const fs = require('fs');

const countryBoundaries = JSON.parse(fs.readFileSync('./assets/boundaries.geojson', 'utf-8'));

fs.writeFileSync('./assets/boundaries.js', 'window.boundaries = ' + JSON.stringify(countryBoundaries), 'utf8');
