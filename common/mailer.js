'use strict';

import mailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from '../config'
import logger from './logger'
import swig from 'swig'
import path from 'path'
import util from 'util'

const mailOpts = smtpTransport(config.mailer)
const transports = mailer.createTransport(mailOpts)
const mailFrom = util.format('%s <%s>', config.name, config.mailer.auth.user)

const mailTemplate = (file) => swig.compileFile(path.join(process.cwd(), 'mails', file))

const sendMail = data => {
  if (config.debug) {
    //return false
  }
  transports.sendMail(Object.assign({ from: mailFrom }, data), err => {
    if (err) {
      logger.error(err) 
    }
  })
}

const sendActiveMail = (who, token, name) => {
  let template = mailTemplate('activemail.html')
  sendMail({
    to: who,
    subject: config.name + '帐号激活',
    html: template({
      sitename: config.name,
      siteurl: config.siteurl || 'http://' + config.host + ':' + config.port,
      username: name,
      token: token
    })
  })
}

const sendResetPassMail = (who, token, name) => {
  let template = mailTemplate('resetpassmail.html')
  sendMail({
    to: who,
    subject: config.name + '密码重置',
    html: template({
      sitename: config.name,
      siteurl: config.siteurl || 'http://' + config.host + ':' + config.port,
      username: name,
      token: token
    })
  })
}

export {
  mailTemplate,
  sendMail,
  sendActiveMail,
  sendResetPassMail
}


