'use strict';

import errcode from '../../common/error'
import AES from 'crypto-js/AES'
import encUtf8 from 'crypto-js/enc-utf8'

const [isEncrypt, encryptKey] = [
  true,
  'fx4eCXvQ'
]

const error = (code) => _.find(errcode, { code: code })

const Cipher = (decrypted, crypto = AES) => 
  crypto.encrypt(decrypted.toString(), encryptKey).toString()

const Decipher = (encrypted, crypto = AES) => {
  try {
    return crypto.decrypt(encrypted.toString(), encryptKey).toString(encUtf8)
  } catch (e) {
    return false
  }
}

const Parse = str => JSON.parse(isEncrypt ? Decipher(str) : str)

const Stringify = obj => {
  let str = JSON.stringify(obj)
  return isEncrypt ? Cipher(str) : str
}

export { error, Cipher, Decipher, Parse, Stringify }
