$(document).foundation();

$(document).ready(function() {
    $('.show-on-focus').keydown(function(e) {
      if (e.keyCode == 13) {
        $('#content').focus();
      }
    });
});