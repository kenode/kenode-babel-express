'use strict';

$(() => {
  // tooltip
  $('[data-toggle="tooltip"]').tooltip()

  $('[data-menubar="menu"], #tools-bar>.mask').on('click', e => {
    if ($('#tools-bar').hasClass('online')) {
      $('#tools-bar').removeClass('online')
    }
    else {
      $('#tools-bar').addClass('online')
    }
  })

})