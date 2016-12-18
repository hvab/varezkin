$(document).ready(function(){

  var drawer = $('.page__drawer');
  var obfuscator = $('.page__obfuscator');

  $('.page__drawer-button').on('click', function(e) {
      e.preventDefault();

      if (drawer.hasClass('drawer_opened')) {
        drawer.removeClass('drawer_opened');
        obfuscator.removeClass('obfuscator_visible');
      } else {
        drawer.addClass('drawer_opened');
        obfuscator.addClass('obfuscator_visible');
      }
  });


  $('.page__obfuscator').on('click', function(e) {
      e.preventDefault();

      drawer.removeClass('drawer_opened');
      obfuscator.removeClass('obfuscator_visible');
  });


  $(document).on('keyup', function(e) {
    if (e.keyCode == 27) {
      drawer.removeClass('drawer_opened');
      obfuscator.removeClass('obfuscator_visible');
    }
  });

});
