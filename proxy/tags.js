'use strict';

import config from '../config'
import _ from 'lodash'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const tagsFile = path.join(process.cwd(), config.tags_file)
const tagsData = [
  {
    name: '其他',
    pane: []
  }
]

function loadTags () {
  if (!existsSync(tagsFile)) {
    return tagsData
  }
  let alltags = JSON.parse(readFileSync(tagsFile, 'utf-8'))
  if (alltags.length === 1) {
    alltags[0].name = '全部'
  }
  return alltags
}

function addTags (tags) {
  let alltags = loadTags()
  let _tagsData = []
  if (!existsSync(tagsFile)) {
    _tagsData = tagsData
    _tagsData[0].pane = tags
    writeFileSync(tagsFile, JSON.stringify(_tagsData, null, 2))
  }
  let other = _.find(alltags, { name: alltags.length === 1 ? '全部' : '其他' })
  other.pane = _.uniq(_.concat(other.pane, tags))
  _tagsData = alltags
  _tagsData.map((group, i) => {
    if (group.name === '其他' || group.name === '全部') {
      _tagsData[i] = other
      return
    }
  })
  writeFileSync(tagsFile, JSON.stringify(_tagsData, null, 2))
}

function moveGroup (tags, group) {
  let alltags = loadTags()
  let _tagsData = alltags
  _tagsData.map((g, i) => {
    if (g.name === group) {
      _tagsData[i].pane = _.uniq(_.concat(g.pane, tags))
    }
    else {
      _tagsData[i].pane = _.remove(_tagsData[i].pane, (n) => {
        return tags.indexOf(n) === -1
      })
    }
  })
  if (!_.find(alltags, { name: group })) {
    _tagsData.splice(_tagsData.length - 1, 0, {
        name: group,
        pane: tags
      })
  }
  writeFileSync(tagsFile, JSON.stringify(_tagsData, null, 2))
}

// addTags(['node.js', 'nginx', 'git'])
// moveGroup(['node.js'], '开发语言')

export default {
  loadTags,
  addTags,
  moveGroup
}
