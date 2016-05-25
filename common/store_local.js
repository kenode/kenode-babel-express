'use strict';

import utility from 'utility'
import path from 'path'
import fs, { existsSync, mkdirSync } from 'fs'
import _ from 'lodash'
import { uploadPath, uploadUtil } from './uploadutil'

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath)
  uploadUtil.forEach( item => {
    if (!existsSync(item.path)) {
      mkdirSync(item.path)
    }
  })
}

const upload = (file, options, callback) => {
  let filename = options.filename
  let newFilename = utility.md5(filename + String((new Date()).getTime())) + path.extname(filename)
  let upload_item = _.find(uploadUtil, { name: options.type || 'other' })
  let base_url = upload_item.url
  let filePath = path.join(upload_item.path, newFilename)
  let fileUrl = base_url + '/' + newFilename

  file.on('end', () => {
    callback(null, { url: fileUrl, path: filePath })
  })

  file.pipe(fs.createWriteStream(filePath))
}

export default {
  upload
}
