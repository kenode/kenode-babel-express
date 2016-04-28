'use strict';

import win from './init-window'

const scrollRefresh = () => {
  if (win.IsMobile) {
    return false;
  }
  $('.bodyer-wrap .body-inner').on('scroll', scrollHandle)
  $('.goto-top').on('click', gotoTop)
}

const gotoTop = () => {
  $('.bodyer-wrap .body-inner').animate({
    scrollTop: 0, function () {
      $('.bodyer-wrap .body-inner').trigger('scrollDone')
    }
  })
}

const scrollHandle = (e) => {
  $('.goto-top').css('display', e.target.scrollTop > 100 ? 'block' : 'none')
}

export default {
  scrollRefresh
}
