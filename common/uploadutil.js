'use strict';

import config from '../config'
import path from 'path'

const uploadPath = path.join(process.cwd(), config.upload.path)

const uploadUtil = [
  {
    name: 'avatar',
    type: [
      'image/png', 
      'image/jpeg', 
      'image/gif'
    ],
    path: path.join(uploadPath, 'avatar'),
    url: config.upload.url + '/avatar'
  },
  {
    name: 'image',
    type: [
      'image/png', 
      'image/jpeg', 
      'image/gif',
      'image/svg'
    ],
    path: path.join(uploadPath, 'image'),
    url: config.upload.url + '/image'
  },
  {
    name: 'other',
    path: path.join(uploadPath, 'other'),
    url: config.upload.url + '/other'
  },
]

export { uploadPath, uploadUtil }
