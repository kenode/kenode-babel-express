'use strict';

const [limit, timeout] = [1, 5000]

class Message {
  
  constructor (opts) {
    this.init()
    this.limit = opts.limit || limit
  }

  init () {
    if ($('.bodyer-wrap:has(.message-wrap)').length === 0) {
      $('.bodyer-wrap').append('<div class=\"message-wrap\"><\/div>')
    }
  }

  success (msg) {
    this.send(msg, 'success')
  }

  info (msg) {
    this.send(msg, 'info')
  }

  warning (msg) {
    this.send(msg, 'warning')
  }

  danger (msg) {
    this.send(msg, 'danger')
  }

  send (msg, status = 'info') {
    let [that, _message, _type, _ltr] = [
      this,
      {
        timestamp: moment().format('x'),
        content: msg
      },
      {
        'success': 'message msg-success',
        'info': 'message msg-info',
        'warning': 'message msg-warning',
        'danger': 'message msg-danger'
      }
    ]
    $('.message-wrap').css('z-index', '3')
    $('.message-wrap').prepend('<div class=\"' + _type[status] 
                              + '\" data-message=\"' + _message.timestamp 
                              + '\">' + _message.content 
                              + '<\/div>')
    if ($('.message-wrap>.message').length > this.limit) {
      that.remove('.message:last-child')
    }
    _ltr = setTimeout( () => {
      that.remove('[data-message="' + _message.timestamp + '"]', _ltr)
    }, timeout)
  }

  remove (child, clear = null) {
    let _ptr
    $('.message' + child).css('animation', 'msg-hide .8s 1 linear')
    _ptr = setTimeout( () => {
      $('.message').remove(child)
      if ($('.message-wrap:has(.message)').length === 0) {
        $('.message-wrap').css('z-index', '-1')
      }
      if (clear) {
        clearTimeout(clear)
      }
      clearTimeout(_ptr)
    }, 500)
  }

}

export default Message
