'use strict';

import markdownIt from 'markdown-it'

const MarkdownIt = markdownIt({
    html: true,
    xhtmlOut: true,
    linkify: true,
    typographer: true
  })
  .use(require('markdown-it-highlightjs'))

export default MarkdownIt
