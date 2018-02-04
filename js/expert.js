let controlPressed = false;

$(document).ready(function() {
  $(this).keydown(function(e) {
    if (e.ctrlKey) {
      controlPressed = true;
    }
  });
  $(this).keyup(function(e) {
    controlPressed = false;
  });
});
