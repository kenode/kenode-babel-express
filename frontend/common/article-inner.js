'use strict';

import win from './init-window'

let [myScroll] = []

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
  $('.goto-top').on('click', (e) => {
    myScroll.scrollBy(0, -myScroll.y, 100)
  })
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
  myScroll.on('scroll', scrollHandle)
  document.addEventListener('touchmove', e => e.preventDefault(), false)
}

const scrollHandle = () => {
  if (!win.IsMobile) {
    $('.goto-top').css('display', myScroll.y < -100 ? 'block' : 'none')
  }
}

export default {
  scrollRefresh
}
