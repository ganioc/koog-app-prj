const ActionModel = require('../../model/action')

module.exports = (username, creator, num, session) => {
  return ActionModel.create([{
    action: 4,
    creator: creator,
    username: username.toLowerCase(),
    date: new Date(),
    verb: 'redeem',
    oldstate: '0',
    newstate: num.toString(),
  }], { session: session })
}