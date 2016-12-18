//=require slick-carousel/slick/slick.js


$(document).ready(function(){

  $('.slider').slick({
    dots: false,
    arrows: true,
    infinite: true,
    dotsClass: 'slider__dots',
    prevArrow: '<button type="button" class="slider__arrow-prev"></button>',
    nextArrow: '<button type="button" class="slider__arrow-next"></button>',
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 8000
  });

});
