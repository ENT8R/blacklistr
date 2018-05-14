/* globals require */

const fs = require('fs');

const countryBoundaries = JSON.parse(fs.readFileSync('./assets/boundaries.geojson', 'utf-8'));

fs.writeFileSync('./assets/boundaries.js', `window.Boundaries = ${JSON.stringify(countryBoundaries)}`, 'utf8');
