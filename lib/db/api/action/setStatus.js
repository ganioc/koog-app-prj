const ActionModel = require('../../model/action')
// const logger = require('../../../logger')
// const util = require('util')

module.exports = (creator, username, verb, oldState, newState,session) => {
  
  return ActionModel.create(
    [{  
      action: 2,
      creator: creator,
      username: username,
      date: new Date(),
      verb: verb,
      oldstate: oldState,
      newstate: newState}],{session:session})

}