'use strict';

import _ from 'lodash'

const postData = {
  titlename: '',  // 标题名称
  tags: [],  // 标签
  content: '',  // 正文
  is_note: false,  // 是否作为笔记
}

const getPostData = info => {
  return _.assign(postData, _.pick(info, ['titlename', 'tags', 'content', 'is_note', 'user_id']))
}

export default getPostData
