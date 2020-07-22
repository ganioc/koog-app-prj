const ActionModel = require('../../model/action')
// const logger = require('../../../logger')
// const util = require('util')

module.exports = (username, session)=>{
  return ActionModel.create([{
    action: 1,
    creator: 'admin',
    username: username.toLowerCase(),
    date: new Date(),
    verb: 'create',
    oldstate: '0',
    newstate: 'agent',
  }], {session:session})
    /*return new Promise((resolve)=>{

  
    ActionModel.create({
      action: 1,
      creator: 'admin',
      username: username.toLowerCase(),
      date: new Date(),
      verb: 'create',
      oldstate: '0',
      newstate: 'agent',
    }, (err) => {
      if (err) {
        logger.error('create agent action failed');
        logger.error(util.format('%o',err))
      }
      logger.debug('create agent action succeed')
      resolve({
        code: 0,
        data: {
          username: username
        }
      })
    })
  })
  */
}