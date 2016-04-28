'use strict';

const IsMobile = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i
                 .test(navigator.userAgent)

const Init = () => {
  IEBlocker()
  MobileMenu()
  if (!IsMobile) {
    $('[data-toggle="tooltip"]').tooltip()
  }
}

const IEBlocker = () => {
  if (/edge/i.test(navigator.userAgent)) {
    $('.navbar-top .nav-group a').css('border-bottom', 0)
  }
  if (document.documentMode === 10) {
    $('body').load('/json/ie-blocker.html')
  }
}

const MobileMenu = () => {
  $('[data-menubar="menu"], #tools-bar>.mask').on('click', e => {
    if ($('#tools-bar').hasClass('online')) {
      $('#tools-bar').removeClass('online')
    }
    else {
      $('#tools-bar').addClass('online')
    }
  })
}

export default {
  Init,
  IsMobile
}
