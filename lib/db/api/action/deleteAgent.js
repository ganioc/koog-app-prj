const ActionModel = require('../../model/action')

module.exports = (username, session) => {
  return ActionModel.create([{
    action: 3,
    creator: 'admin',
    username: username.toLowerCase(),
    date: new Date(),
    verb: 'delete',
    oldstate: '0',
    newstate: 'agent',
  }], {session:session})
}