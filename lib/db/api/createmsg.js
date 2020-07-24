
const logger = require('../../logger')

const checkMobiles = require('../../facility').checkMobiles
const MsgModel = require('../../db/model/msg');

module.exports = (mSingle, name, creator, mobile, content, msgid, xid, session) => {
  logger.debug('createmsg')
  if (mSingle === 1) {
    return MsgModel.create([{
      username: name,
      creator: creator,
      msg_id: msgid,
      batch_id: 'none',
      x_id: xid,
      type: 1,
      date: new Date(),
      deliverdate: new Date(0),
      submitted: true,
      delivered: false,
      mobiles: checkMobiles(mobile),
      content: content
    }], { session: session })
  } else if (mSingle === 2) {
    return MsgModel.create([{
      username: name,
      creator: creator,
      msg_id: msgid,
      batch_id: 'none',
      x_id: xid,
      type: 2,
      date: new Date(),
      deliverdate: new Date(0),
      submitted: true,
      delivered: false,
      mobiles: checkMobiles(mobile),
      content: content
    }], { session: session })
  } else {
    return new Error("Unknown msg type")
  }
}