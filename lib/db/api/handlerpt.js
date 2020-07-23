const logger = require('../../logger')
// const ErrCode = require('../../err')
const MsgModel = require('../model/msg')
// const plusUser = require('../api/plusUser')
// const setMsgton = require('../api/setMsgton')
const mongoose = require('mongoose')
const UserModel = require('../model/user')
const MsgtonModel = require('../model/msgton')
const checkMobile = require('../../facility').checkMobile

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

    await session.commitTransaction()
    session.endSession();
    logger.info('save msgton succeed')
  }
  catch (error) {
    await session.abortTransaction()
    session.endSession();
    logger.error('save msgton failed')
  }

  // get username by msgid from Msg
  /*
  MsgModel.findOne(
    {
      msg_id: msgid
    },
    async (err, msg) => {
      if (err) {
        logger.error('can not find msg')
        logger.debug('End handle Rpt')
        resolve({
          code: ErrCode.RPT_MSG_NOTFOUND,
          data: {}
        })
        return
      }
      let name = msg.username;
      logger.debug('username: ' + name)
      // update user unused
      let ret = await plusUser(name, 1)
      if (ret.code !== 0) {
        logger.error('update unused fail')
      }

      // save to msgton, 不会重复！
      ret = await setMsgton(name, mobile, msgid, 'none', custid, rtime, status)

      if (ret.code !== 0) {
        logger.error('update msgton fail')
      }

      logger.debug('End handle Rpt')
      resolve({
        code: 0,
        data: {}
      })
    }
  )
*/
}