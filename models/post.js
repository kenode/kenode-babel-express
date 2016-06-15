'use strict';

import mongoose from 'mongoose'
import MongooseDao from 'mongoosedao'
import config from '../config'

const Schema = mongoose.Schema
const ObjectId  = Schema.ObjectId

const postSchema = new Schema({
  titlename: { type: String },  // 标题名称
  tags: [Schema.Types.Mixed],  // 标签
  content: { type: String },  // 正文
  is_note: { type: Boolean, default: false },  // 是否作为笔记
  user_id: { type: ObjectId },  // 所属用户ID
  create_at: { type: Date, default: Date.now },  // 帐号创建时间
  update_at: { type: Date, default: Date.now }  // 帐号修改时间
})

const postModel = mongoose.model(config.mongo_perfix + 'post', postSchema)
const postDao = new MongooseDao(postModel)

export default postDao