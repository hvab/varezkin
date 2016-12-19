//=require slick-carousel/slick/slick.js


$(document).ready(function(){

  $('.slider').slick({
    accessibility: true,
    dots: false,
    arrows: true,
    infinite: true,
    prevArrow: '<button type="button" class="slider__arrow-prev"></button>',
    nextArrow: '<button type="button" class="slider__arrow-next"></button>',
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 8000
  });


  var $carousel = $('.slider');
  $(document).on('keydown', function(e) {
    if(e.keyCode == 37) {
      $carousel.slick('slickPrev');
    }

    if(e.keyCode == 39) {
      $carousel.slick('slickNext');
    }
  });

});
