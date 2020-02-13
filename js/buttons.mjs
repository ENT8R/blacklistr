/* globals L */
/* globals leafletImage */

export const Screenshot = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.innerHTML = '<img alt="take a screenshot" src="images/camera.svg"></img>';
    container.style.height = '24px';
    container.onclick = () => {
      container.style.backgroundColor = '#ffa726';
      leafletImage(map, (err, canvas) => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = 'blacklistr-screenshot.png';
        document.getElementById('images').innerHTML = '';
        document.getElementById('images').appendChild(a);
        a.click();
        container.style.backgroundColor = 'white';
      });
    };
    return container;
  }
});

export const Reset = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.innerHTML = '<img alt="reload map" src="images/autorenew.svg"></img>';
    container.style.height = '24px';
    container.onclick = () => {
      map.setView([30, 0], 2);
    };
    return container;
  }
});

export const Settings = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.innerHTML = '<img alt="open settings" src="images/settings.svg"></img>';
    container.style.height = '24px';
    container.onclick = () => {
      const modal = document.getElementById('settings');
      const [ close ] = document.getElementsByClassName('close');

      modal.style.display = 'block';
      close.onclick = function() {
        modal.style.display = 'none';
      };
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    };
    return container;
  }
});

export const Hide = L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.backgroundColor = 'white';
    container.innerHTML = '<img alt="hide editor" src="images/keyboard-close.svg"></img>';
    container.style.height = '24px';
    container.onclick = () => {
      document.body.dispatchEvent(new Event('toggle-side'));
    };
    return container;
  }
});
