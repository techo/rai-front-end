function initUI() {
  $('ul li:first-child').addClass('first');
  $('ul li:last-child').addClass('last');


  $('.sidebar .topc ul li .tt').click(function (ev) {
    ev.preventDefault();
    closeCharts();
    closeTables();
    $('#fichaBarrio').css('display', 'none');
    var active = $(this).parents('li').hasClass('slider');
    $('.sidebar .topc ul li.slider').removeClass('slider');
    $('.sidebar .bottomc ul li.slider').removeClass('slider');
    $('.filter-compile').removeClass('active');
    if (active) {
      $(this).parents('li').removeClass("slider");
    } else {
      $(this).parents('li').addClass("slider");
    }
    openedDetails = false;
    deepLink();
    $('.sidebar .topc ul li .bt .fold-menu').click(function (ev) {
      ev.preventDefault();

      $(this).parents('li').removeClass('slider');

      return false;

    });

    return false;

  });


  $('.sidebar .bottomc ul li .tt, .summary-download').click(function (ev) {
    ev.preventDefault();
    closeCharts();
    closeTables();
    $('#fichaBarrio').css('display', 'none');

    var completed = localStorage.downloadCompleted;
    $('.sidebar .topc ul li.slider').removeClass('slider');
    $('.filter-compile').removeClass('active');

    if (completed) {
      $(".download-menu").toggleClass("slider");
    } else {
      $(".download-user-data").toggleClass('slider');
      $(".request-error").removeClass("active");
    }

    openedDetails = false;
    deepLink();

    return false;

  });

  $('.sidebar .bottomc ul li .bt .fold-menu').click(function (ev) {
    ev.preventDefault();
    $(this).parents('li').removeClass('slider');

    return false;

  });

  $('.sidebar .bottomc ul li .bt.bttick .toprow').click(function (ev) {
    $(this).toggleClass('ticked');
  });


  $(".mCustomScrollbars").mCustomScrollbar({
    scrollButtons: {enable: true},
    scrollbarPosition: "outside"
  });


  $('.sidebar .topc .bt.wscroll .midt .rows .toprow.clickeable').click(function (ev) {
    ev.preventDefault();
    var active = $(this).hasClass("active");
    $('.sidebar .topc .bt.wscroll .midt .rows .toprow.clickeable').removeClass("active");
    if (active) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
    }

    $(this).siblings('.botrow.clickeable').slideToggle();
    $(this).parent('.rows').siblings('.rows').find('.botrow.clickeable').slideUp();

  });


  $('.sidebar .topc .bt .midt .rows .botrow .blockin .blocktops').click(function (ev) {
    ev.preventDefault();
    $(this).siblings('.blockbots').slideToggle();
    $(this).parents('.blockins').siblings('.blockins').find('.blockbots').slideUp();

  });


  $(".search-wrap").on("click", function (ev) {
    ev.stopPropagation();
  });
  $(".search-wrap input[type=text]").on("focus", function (ev) {
    $("#search_input").val('');
    $(".filter-compile").removeClass("active");
  });
  $(".search-wrap input[type=text]").on("blur", function (ev) {
    $('.search-botc').fadeOut();
  });

  $('#nav ul').clone().appendTo('.mobmenu .top2');
  $('#logo').clone().appendTo('.mobmenu .top1');


  $('.menubtn').click(function (ev) {
    ev.preventDefault();
    $('.menuwrap').slideToggle();

    $('.closeb').click(function (ev) {
      ev.preventDefault();
      $('.menuwrap').slideUp();
    });

    return false;

  });

  $('.sidebar .topc ul li .tt a em').wrapInner('<b></b>');
  $('.sidebar .bottomc ul li .tt a em').wrapInner('<b></b>');

};


function wResize() {


  var h1 = $('.sidebar .topc .bt').height();
  $('.mCustomScrollbars').css('height', h1 - 90);

  $('.idvt-slider .mCustomScrollbars').css('height', 315);

  var h2 = $('.filter-compile').height();
  $('.mcsbar').css('height', h2 - 100);


}

$(window).resize(function () {
  wResize();
});

$(window).load(function () {
  wResize();
});

    
	


