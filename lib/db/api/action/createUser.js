const ActionModel = require('../../model/action')
const logger = require('../../../logger')
const util = require('util')

module.exports = (username, creator) => {
  return new Promise((resolve) => {
    ActionModel.create({
      action: 1,
      creator: creator.toLowerCase(),
      username: username.toLowerCase(),
      date: new Date(),
      verb: 'create',
      oldstate: '0',
      newstate: 'user',
    }, (err) => {
      if (err) {
        logger.error('create user action failed');
        logger.error(util.format('%o', err))
      }
      logger.debug('create user action succeed')
      resolve({
        code: 0,
        data: {
          username: username
        }
      })
    })
  })
}