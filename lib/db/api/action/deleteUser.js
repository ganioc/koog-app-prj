const ActionModel = require('../../model/action')

module.exports = (username, creator, session) => {
  return ActionModel.create([{
    action: 3,
    creator: creator,
    username: username.toLowerCase(),
    date: new Date(),
    verb: 'delete',
    oldstate: '0',
    newstate: 'agent',
  }], { session: session })
}