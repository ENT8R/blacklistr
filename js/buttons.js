window.Buttons = {
  ScreenshotButton: L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.type = 'button';
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<i class="material-icons">camera_alt</i>';
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.onclick = function() {
        container.style.backgroundColor = '#ffa726';
        leafletImage(map, function(err, canvas) {
          const a = document.createElement('a');
          a.href = canvas.toDataURL();
          a.download = 'blacklistr-screenshot.png';
          document.getElementById('images').innerHTML = '';
          document.getElementById('images').appendChild(a);
          a.click();
          container.style.backgroundColor = 'white';
        });
      }
      return container;
    }
  }),
  ResetButton: L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.type = 'button';
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<i class="material-icons">autorenew</i>';
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.onclick = function() {
        container.style.backgroundColor = '#ffa726';
        map.setView([30, 0], 2);
        container.style.backgroundColor = 'white';
      }
      return container;
    }
  }),
  HideButton: L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.type = 'button';
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<i class="material-icons">keyboard_hide</i>';
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.onclick = function() {
        container.style.backgroundColor = '#ffa726';
        toggleSide();
        map._onResize();
        container.style.backgroundColor = 'white';
      }
      return container;
    }
  })
}
