'use strict';

import mongoose from 'mongoose'
import MongooseDao from 'mongoosedao'
import config from '../config'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },  // 用户名
  password: { type: String, required: true },  // 密码 md5
  salt: { type: String  },  // 密码 md5对应的salt
  email: { type: String },  // 电子邮箱
  is_active: { type: Boolean, default: false },  // 是否激活
  user_type: { type: Number, default: 0 },  // 用户类型
  avatar: { type: String },  // 用户头像
  token_key: { type: String  },
  token_time: { type: Date, default: Date.now },

  retrieve_key: { type: String },  // 找回密码的密钥
  retrieve_time: { type: Number, default: 0 },  // 找回密码的密钥时间
  create_at: { type: Date, default: Date.now },  // 帐号创建时间
  update_at: { type: Date, default: Date.now }  // 帐号修改时间
})

const userModel = mongoose.model(config.mongo_perfix + 'user', userSchema)
const userDao = new MongooseDao(userModel)

export default userDao
