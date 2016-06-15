'use strict';

import _ from 'lodash'

const draftData = {
  titlename: '',  // 标题名称
  tags: [],  // 标签
  content: '',  // 正文
}

const getDraftData = info => {
  return _.assign(draftData, _.pick(info, ['titlename', 'tags', 'content', 'post_id', 'user_id']))
}

export default getDraftData
