const ActionModel = require('../../model/action')
const logger = require('../../../logger')
const util = require('util')


module.exports = (creator, username, verb) => {
  return new Promise((resolve) => {
    ActionModel.create({
      action: 3,
      creator: creator,
      username: username,
      date: new Date(),
      verb: verb,
      oldstate: '',
      newstate: '',
    }, (err) => {
      if (err) {
        logger.error('delete action failed');
        logger.error(util.format('%o', err))
      }
      logger.debug('delete action succeed')
      resolve({
        code: 0,
        data: {
          username: username
        }
      })
    })



  })

}