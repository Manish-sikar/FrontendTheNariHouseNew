(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: false,
        dots: false,
        loop: true,
        margin: 50,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonial carousel

    $(".owl-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: true,
        dots: true,
        loop: true,
        margin: 0,
        nav : true,
        navText: false,
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


     // Fact Counter

     $(document).ready(function(){
        $('.counter-value').each(function(){
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            },{
                duration: 2000,
                easing: 'easeInQuad',
                step: function (now){
                    $(this).text(Math.ceil(now));
                }
            });
        });
    });

})(jQuery);

  document.addEventListener('DOMContentLoaded', function() {
    // Get the current URL path
    const currentPath = window.location.pathname;
    
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav a');

    // Loop through each link and check if it matches the current path
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });


//   for testimonial 
 
//   $(document).ready(function() {
//     $('.owl-carousel').owlCarousel({
//         loop: true,
//         margin: 10,
//         nav: true,
//         items: 1,  // Change the number of visible items
//         autoplay: true,  // Enable autoplay
//         autoplayTimeout: 3000,  // Set autoplay speed
//         autoplayHoverPause: true  // Pause on hover
//     });
// });

$(window).on('load', function () {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
    });
});
 



 
 
