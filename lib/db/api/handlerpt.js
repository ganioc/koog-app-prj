const logger = require('../../logger')
// const ErrCode = require('../../err')
const MsgModel = require('../model/msg')
// const plusUser = require('../api/plusUser')
// const setMsgton = require('../api/setMsgton')
const mongoose = require('mongoose')
const UserModel = require('../model/user')
const MsgtonModel = require('../model/msgton')
const checkMobile = require('../../facility').checkMobile
const redeemUser = require('../../db/api/action/redeemUser')
const util = require('util')

module.exports = async (rpt) => {
  logger.debug('start handle Error Rpt')

  // only record failure rpt to msgton
  let msgid = rpt.msgid
  let custid = rpt.custid
  let mobile = checkMobile(rpt.mobile)
  let rtime = rpt.rtime
  // let errcode = rpt.errcode
  let status = rpt.status
  let pknum = rpt.pknum
  let pktotal = rpt.pktotal

  logger.debug('msgid:' + msgid)
  logger.debug('custid:' + custid)

  const db = mongoose.connection;
  const session = await db.startSession();
  await session.startTransaction();

  try {
    let msg = await MsgModel.findOne({ msg_id: msgid }).session(session)
    let name = msg.username
    let creator = msg.creator
    logger.debug('name:' + name)
    logger.debug('creator:' + creator)
    logger.debug(util.format('%o', msg))

    let user = await UserModel.findOne({ username: name }).session(session)
    // msg usernmae unused + 1
    user.used = user.used - 1
    // msg username used - 1
    user.unused = user.unused + 1

    await user.save()

    await MsgtonModel.create([{
      username: name,
      creator: creator,
      pknum: pknum,
      pktotal: pktotal,
      mobile: mobile,
      msg_id: msgid,
      batch_id: 'none',
      x_id: custid,
      date: new Date(rtime),
      status: status
    }], { session: session })

    await redeemUser(name, creator, 1, session)
    logger.info('save redeem action succeed')

    await session.commitTransaction()
    session.endSession();
    logger.info('save msgton succeed')
  }
  catch (error) {
    await session.abortTransaction()
    session.endSession();
    logger.error('save msgton failed')
    logger.error(error.message)
  }
}