$(document).foundation();

$(document).ready(function() {
    $('.show-on-focus').keydown(function(e) {
      if (e.keyCode == 13) {
        $('#content').attr('tabindex', '-1').focus();
      }
    });
    
    $('#content').on('blur focusout', function() {
        $(this).removeAttr('tabindex');
    });
});