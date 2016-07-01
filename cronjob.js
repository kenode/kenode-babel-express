/**
 * 定时任务 -- cronJob
 * 方法：
 * cronJob.task(name, rule, e => {...})
 * 参数：
 * name<String> -- 任务名称/标签
 * rule<Object> -- 设定执行时间点
 *                 { year, month, date, dayOfWeek, hour, minute, second }
 * evt<Object>  -- 返回值
 *                 { name<该任务名称/标签>, rule<该任务执行时间点>, count<执行次数>}
 */
'use strict';

import cronJob from './common/cronjob'
import logger from './common/logger'
import Promise from 'bluebird'
import writerProxy from './proxy/writer'

const WriterProxy = Promise.promisifyAll(writerProxy)

/**
 * 每天2点30分执行1次清理回收站任务
 */
cronJob.task('clearRecovery', { 
    hour: 2, 
    minute: 30, 
    second: 0 
  }, e => {
  logger.info('Cron Job: <%s> [%d] Start', e.name, e.count)
  WriterProxy.clearRecoveryAsync()
             .then( doc => {
                logger.info(doc)
                logger.info('Cron Job: <%s> [%d] End', e.name, e.count)
             })
             .catch( err => {
                logger.info(err)
                logger.info('Cron Job: <%s> [%d] End', e.name, e.count)
             })
})

logger.info('Task Manager On ...')
