'use strict';

import config from './config'
import Promise from 'bluebird'
import userProxy from './proxy/user'

const UserProxy = Promise.promisifyAll(userProxy)

UserProxy.removeAllAsync()
         .then( doc => {
            console.log(doc.result)
            return UserProxy.newAndSaveAsync(config.admin)
         })
         .then( doc => {
            console.log(doc)
         })
         .then( () => process.exit(0) )
         .catch( err =>  {
            console.log(err)
            process.exit(0)
         })
