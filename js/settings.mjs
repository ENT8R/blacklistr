import placeholder from '../assets/placeholder.txt';

const DEFAULTS = {
  boundaries: 'josm',
  content: placeholder
};

export function get(key) {
  return window.localStorage.getItem(key) || DEFAULTS[key];
}

export function set(key, value) {
  window.localStorage.setItem(key, value);
}

export function setup() {
  const boundary = get('boundaries');
  document.querySelector(`input[type="radio"][name="boundaries"][value="${boundary}"]`).checked = true;

  document.querySelectorAll('input[type="radio"][name="boundaries"]').forEach(element => {
    element.addEventListener('change', event => {
      set('boundaries', event.target.value);
      document.getElementById('map').dispatchEvent(new Event('change-boundaries'));
    });
  });
}
