'use strict';

import path from 'path'

export default {

  // 调试模式
  debug: true,

  name: 'kBlog',

  // 服务主机
  host: 'localhost',

  // 服务端口
  port: 3000,

  // Session 
  session_secret: 'kenode_secret',

  // Redis
  redis_host: '127.0.0.1',
  redis_port: 6379,

  // MongoDB
  mongo_uri: 'mongodb://localhost:27017/kenode_demo',
  mongo_perfix: 'kn_',

  // 日志
  logger: {
    filename: 'access.log',
    maxlogsize: 500,
    category: 'kenode_demo',
    format: ':method :url :status',
    level: 'auto'
  },

  // sign
  sign: {
    sign_in: '/sign-in',
    sign_up: '/sign-up',
    sign_forget: '/sign-forget',
    sign_out: '/sign-out',
    setting: '/setting'
  },

  // admin
  admin: {
    username: 'admin',
    email: 'admin@xxx.com',
    password: '123456',
    user_type: 9999
  },

  // user
  reset_pass_time: 1000 * 60 * 60 * 24,

  // mailer
  mailer: {
    host: '',
    port: 25,
    auth: {
      user: '',
      pass: ''
    }
  },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: '/public/upload',
    url: '/upload'
  },

  file_limit: '1MB'
}
