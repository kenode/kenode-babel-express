'use strict';

import { Cipher, Decipher, Parse, Stringify } from './tools'

export default class Storage {

  constructor (name, type = 'session') {
    this.name = name
    this.storage = sessionStorage
    if (type.toLocaleLowerCase() === 'local') {
      this.storage = localStorage
    }
    let _data = require('../data/' + this.name).default
    this.data = Parse(this.storage.getItem(name)) || _data
  }

  get (key) {
    return key ? this.data[key] : this.data
  }

  set (key, val) {
    if (val) {
      this.data[key] = val
    } else {
      this.data = key
    }
    this.storage.setItem(this.name, Stringify(this.data))
  }

  remove (key) {
    if (!key) {
      this.data = {}
      this.storage.removeItem(this.name)
      return
    }
    delete this.data[key]
    this.storage.setItem(this.name, Stringify(this.data))
  }

}
