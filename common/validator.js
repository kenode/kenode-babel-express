'use strict';

export default {
  user: {
    username: {
      match: /^[a-zA-Z0-9_]{4,12}$/i,
      note: ''
    },
    password: {
      match: /^[a-zA-Z0-9_-]{6,18}$/i,
      note: ''
    }
  }
}