'use strict';

export default {

  // 调试模式
  debug: true,

  // 服务主机
  host: 'localhost',

  // 服务端口
  port: 3000,

  // Session 
  session_secret: 'kenode_secret',

  // Redis
  resdis_host: '127.0.0.1',
  resdis_port: 6379,

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
  }
}
