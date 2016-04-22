'use strict';

import win from './init-window'

let [myScroll, ltr_time, ltr_limit, ltr_start, pullUpFlag, pullDownFlag] = [
  ,
  moment().format('x'),
  10,
  10,
  0,
  0
]

const scrollRefresh = () => {
  mobileScroll()
  /*if (!win.IsMobile) {
    mobileScroll()
  }
  else {
    desktopScroll()
  }*/
}

const mobileScroll = () => {
  $('.bodyer-wrap .body-inner').css('overflow', 'hidden')
  myScroll = new IScroll('.body-inner', { 
    probeType: 3,
    momentum: true, // 关闭惯性滑动
    scrollbars: true, // 滚动条可见
    mouseWheel: true, // 鼠标滚轮开启
    interactiveScrollbars: true, // 滚动条可拖动
    fadeScrollbars: true, // 滚动条渐隐
    click: true, // 屏幕可点击
    //shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩
    //useTransform: true, // CSS转化
    //useTransition: true, // CSS过渡
    //bounce: true, // 反弹
    //freeScroll: false, // 只能在一个方向上滑
    //snap: 'li'
  })
  myScroll.on('scrollEnd', scrollEndHandle)
  myScroll.on('scroll', scrollHandle)
  document.addEventListener('touchmove', e => e.preventDefault(), false)
}

const scrollHandle = () => {
  // 判断上拉
  if (myScroll.maxScrollY-80 >= myScroll.y) {
    pullUpFlag = 1
  }
  // 判断下拉
  if (myScroll.y >= 80) {
    pullDownFlag = 1
  }
}

const scrollEndHandle = () => {
  let _ltr_time = moment().format('x')
  if (_ltr_time - ltr_time <= 5000) {
    pullUpFlag = pullDownFlag = 0
    return false
  }
  // 上拉操作
  if (pullUpFlag === 1) {
    $('.article-list .loading:last-child').show()
    myScroll.refresh()
    myScroll.scrollBy(0, -40)
    ltr_time = _ltr_time
    pullUpFlag = 0
    // 发送请求
    setTimeout(() => {
      getArticleList(ltr_start, ltr_start + ltr_limit - 1)
    }, 3000)
  }
  // 下拉操作
  if (pullDownFlag === 1) {
    $('.article-list .loading:first-child').show()
    myScroll.refresh()
    ltr_time = _ltr_time
    pullDownFlag = 0
    // 发送请求
    setTimeout(() => {
      getArticleList(0, 9)
    }, 3000)
  }
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
    ltr_start = 10
  }
  else {
    $('.article-list .loading:last-child').hide()
    ltr_start += ltr_limit
  }
  if (myScroll) {
    myScroll.refresh()
  }
}

export default {
  scrollRefresh
}
