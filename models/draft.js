'use strict';

import mongoose from 'mongoose'
import MongooseDao from 'mongoosedao'
import config from '../config'

const Schema = mongoose.Schema
const ObjectId  = Schema.ObjectId

const draftSchema = new Schema({
  titlename: { type: String },  // 标题名称
  tags: [Schema.Types.Mixed],  // 标签
  content: { type: String },  // 正文
  post_id: { type: ObjectId },  // 对应发布的文章ID
  user_id: { type: ObjectId },  // 所属用户ID
  create_at: { type: Date, default: Date.now },  // 帐号创建时间
  update_at: { type: Date, default: Date.now }  // 帐号修改时间
})

const draftModel = mongoose.model(config.mongo_perfix + 'draft', draftSchema)
const draftDao = new MongooseDao(draftModel)

export default draftDao