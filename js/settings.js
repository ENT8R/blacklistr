const Boundaries = require('../assets/boundaries/boundaries.js');

function getBoundaries() {
  let value = Boundaries.JOSM;
  if (localStorage.getItem('boundaries') === 'naturalearth') {
    value = Boundaries.NaturalEarth;
  }
  return value;
}

function setBoundaries(value) {
  localStorage.setItem('boundaries', value);
  require('./main.js').updateMap();
}

function init() {
  const boundarySelect = document.getElementById('boundaries');
  if (localStorage.getItem('boundaries')) {
    boundarySelect.value = localStorage.getItem('boundaries');
  }

  boundarySelect.addEventListener('change', (e) => {
    setBoundaries(e.target.value);
  });
}

exports.getBoundaries = getBoundaries;
exports.init = init;
