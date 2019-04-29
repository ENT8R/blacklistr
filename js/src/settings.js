const boundaries = require('./boundaries');

function getBoundaries() {
  /* return new Promise((resolve, reject) => {
    import(/* webpackChunkName: "boundaries" */ /* './boundaries').then(module => {
      const boundaries = module.default;

      let value = boundaries.josm;
      if (window.localStorage.getItem('boundaries') === 'naturalearth') {
        value = boundaries.naturalearth;
      }
      return resolve(value);
    });
  });*/
  let value = boundaries.josm;
  if (window.localStorage.getItem('boundaries') === 'naturalearth') {
    value = boundaries.naturalearth;
  }
  return value;
}

function setBoundaries(value) {
  window.localStorage.setItem('boundaries', value);
  document.getElementById('map').dispatchEvent(new Event('change-boundaries'));
}

function init() {
  const boundarySelect = document.getElementById('boundaries');
  if (window.localStorage.getItem('boundaries')) {
    boundarySelect.value = window.localStorage.getItem('boundaries');
  }

  boundarySelect.addEventListener('change', (e) => {
    setBoundaries(e.target.value);
  });
}

module.exports = {
  getBoundaries,
  init
};
