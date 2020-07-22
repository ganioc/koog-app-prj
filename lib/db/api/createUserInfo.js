const UserInfoModel = require('../../db/model/userinfo')
const logger = require('../../logger')
const util = require('util')

module.exports = (username,type,tag, session) => {

  return UserInfoModel.create([{
    username: username,
    usertype: type,
    lastlogin: new Date(),
    tag: tag,
    undelivered: 0,
    delivered: 0,
    submitted: 0
  }],{session: session})
  /*
  return new Promise((resolve) => {
    UserInfoModel.create({
      username: username,
      usertype: type,
      lastlogin: new Date(),
      tag: tag,
      undelivered: 0,
      delivered: 0,
      submitted: 0
    },
      (err) => {
        if (err) {
          logger.error('createagent userinfo failed')
          logger.error(util.format('%o', err))
        }
        logger.debug('createagent succeed')

        resolve({code:0, data:{}})

      })

  });

  */
}