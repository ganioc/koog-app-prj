const ActionModel = require('../../model/action')
const logger = require('../../../logger')
const util = require('util')

module.exports = (creator, username, verb, oldState, newState) => {
  return new Promise((resolve) => {

    ActionModel.create({
      action: 2,
      creator: creator,
      username: username,
      date: new Date(),
      verb: verb,
      oldstate: oldState,
      newstate: newState,
    }, (err) => {
      if (err) {
        logger.error('create setstatus action failed');
        logger.error(util.format('%o', err))
      }
      logger.debug('create setstatus action succeed')
      resolve({
        code: 0,
        data: {
          username: username
        }
      })
    })

  })

}