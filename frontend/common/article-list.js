'use strict';

import win from './init-window'

let [myScroll, ltr_time, ltr_limit, ltr_start] = [
  ,
  moment().format('x'),
  10,
  10
]


const scrollRefresh = () => {
  if (win.IsMobile) {
    mobileScroll()
  }
  else {
    desktopScroll()
  }
}

const mobileScroll = () => {
  $('.bodyer-wrap .body-inner').css('overflow', 'hidden')
  myScroll = new IScroll('.body-inner', { 
    scrollbars: true,
    mouseWheel: true,
    click: true
  })
  myScroll.on('scrollEnd', () => {
    let _ltr_time = moment().format('x')
    // 拉到底部
    if (myScroll.maxScrollY >= myScroll.y && _ltr_time - ltr_time > 5000) {
      $('.article-list .loading:last-child').show()
      myScroll.refresh()
      myScroll.scrollBy(0, -80)
      ltr_time = _ltr_time
      // 发送请求
      setTimeout(() => {
        getArticleList(ltr_start, ltr_start + ltr_limit - 1)
      }, 3000)
    }
    // 拉到顶部
    if (myScroll.y === 0 && _ltr_time - ltr_time > 5000) {
      $('.article-list .loading:first-child').show()
      myScroll.refresh()
      ltr_time = _ltr_time
      // 发送请求
      setTimeout(() => {
        getArticleList(0, 9)
      }, 3000)
    }
  })
  document.addEventListener('touchmove', e => e.preventDefault(), false)
}

const desktopScroll = () => {
  $('.body-inner').on('scroll', e => {
    let [target, _ltr_time] = [
      e.target,
      moment().format('x')
    ]
    let _ltr_scroll = target.scrollHeight - target.offsetHeight - target.scrollTop
    if (_ltr_scroll < 1 && _ltr_time - ltr_time > 5000) {
      $('.article-list .loading:last-child').show()
      let _scrollFoot = $('.body-inner')[0].scrollHeight - $('.body-inner')[0].clientHeight
      $('.body-inner').scrollTop(_scrollFoot)
      ltr_time = _ltr_time
      // 发送请求
      setTimeout(() => {
        getArticleList(ltr_start, ltr_start + ltr_limit - 1)
      }, 3000)
    }
  })
}


const getArticleList = (start, end) => {
  console.log('limit: %d-%d', start, end)
  if (start === 0) {
    $('.article-list .loading:first-child').hide()
  }
  else {
    $('.article-list .loading:last-child').hide()
    ltr_start += ltr_limit
  }
  if (win.IsMobile) {
    myScroll.refresh()
  }
}

export default {
  scrollRefresh
}
