'use strict';

import mongoose from 'mongoose'
import MongooseDao from 'mongoosedao'
import config from '../config'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  salt: { type: String  },
  email: { type: String },
  is_active: { type: Boolean, default: false },
  user_type: { type: Number, default: 0 },
  avatar: { type: String },
  token_key: { type: String  },
  token_time: { type: Date, default: Date.now },

  retrieve_key: { type: String },
  retrieve_time: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
})

const userModel = mongoose.model(config.mongo_perfix + 'user', userSchema)
const userDao = new MongooseDao(userModel)

export default userDao
