'use strict';

import _ from 'lodash'
import tagsProxy from '../proxy/tags'


const getWriterData = info => {
  let alltags = tagsProxy.loadTags()
  /*if (alltags.length === 1) {
    alltags[0].name = '全部'
  }*/
  let writerData = {
    alltags: JSON.stringify(alltags)
  }
  if (!info) {
    return writerData
  }
  return _.assign(writerData, {
    titlename: info.titlename,
    tags: JSON.stringify(info.tags || []),
    content: info.content,
    postid: info.postid || undefined,
    submit: JSON.stringify({
      type: info.type || 'publish',
      isnote: false
    })
  })
}

export default getWriterData
