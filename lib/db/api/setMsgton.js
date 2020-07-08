
const util = require('util')
const logger = require('../../logger')
const MsgtonModel = require('../model/msgton')
const ErrCode = require('../../err')

// function checkMobile(mobile) {
//   let out = mobile;
//   if (out.length > 11) {
//     out = out.slice(out.length - 11)
//   }
//   return out;
// }

let checkMobile = require('../../facility').checkMobile

module.exports = (name, mMobile, smsid, batchid, xid, sDate, nStatus) => {
  logger.debug('setMsgton()')
  return new Promise((resolve) => {
    let mobile = mMobile;
    let msgId = smsid;
    let batchId = batchid ? batchid : 'none';

    if (msgId === undefined && batchId === undefined) {
      resolve({
        code: ErrCode.USER_INVALID_PARAM,
        data: { message: "Undefined msgid or batchid" }
      })
      return
    }

    // if mobiles = 861223233, remove 86
    mobile = checkMobile(mobile);

    // let info = {}
    // if (msgId && msgId !== 'none') {
    //   info = {
    //     mobile: mobile,
    //     msg_id: msgId
    //   }
    // } else if (batchId && batchId !== 'none') {
    //   info = {
    //     mobile: mobile,
    //     batch_id: batchId
    //   }
    // } else {
    //   logger.error('Wrong input params')
    //   resolve({
    //     code: ErrCode.USER_INVALID_PARAM,
    //     data: {}
    //   })
    // }
    let info = {
      msg_id: msgId,
      mobile: mobile
    }

    logger.debug('input query info')
    logger.debug(util.format('%o', info))

    MsgtonModel.countDocuments(info, (err, count) => {
      if (err) {
        logger.error('Msgton count failed')
        logger.error(util.format('%o', err))
        resolve({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
        return;
      }
      if (count > 0) {
        logger.info('Msgton already exists')
        resolve({
          code: 0,
          data: {}
        })
        return;
      }
      // count == 0
      let obj = {
        username: name,
        mobile: mobile,
        msg_id: msgId,
        batch_id: batchId,
        x_id: xid,
        date: new Date(sDate),
        status: nStatus
      }
      logger.debug(util.format('%o', obj))

      let msgton = MsgtonModel(obj)

      msgton.save((err) => {
        if (err) {
          logger.error('setMsgton failed')
          logger.error(util.format('%o', err));
          resolve({
            code: 0,
            data: null
          })
        } else {
          logger.info('setMsgton OK')
          resolve({
            code: 0,
            data: null
          })
        }
      })
    })
  })
}