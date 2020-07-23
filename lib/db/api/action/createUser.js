const ActionModel = require('../../model/action')
const logger = require('../../../logger')
const util = require('util')

module.exports = (username, creator, session) => {
  return ActionModel.create([{
    action: 1,
    creator: creator,
    username: username.toLowerCase(),
    date: new Date(),
    verb: 'create',
    oldstate: '0',
    newstate: 'user',
  }], { session: session })
}