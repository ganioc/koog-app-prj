const logger = require('../../logger')
const ErrCode = require('../../err')
const MsgModel = require('../model/msg')
const plusUser = require('../api/plusUser')
const setMsgton = require('../api/setMsgton')

module.exports = (rpt) => {
  logger.debug('start handle Rpt')
  return new Promise((resolve) => {
    if (rpt.status === 0) {
      logger.info('pass msgid: '+rpt.msgid)
      logger.info('mobile:'+ rpt.mobile)
      logger.info('stime:'+ rpt.stime)
      logger.info('rtime:'+ rpt.rtime)
      resolve({
        code: 0,
        data: {}
      })
    } else if (rpt.status !== 0 && rpt.pknum === 1) {
      // only record failure rpt to msgton
      let msgid = rpt.msgid
      let custid = rpt.custid
      let mobile = rpt.mobile
      let rtime = rpt.rtime
      // let errcode = rpt.errcode
      let status = rpt.status

      // get username by msgid from Msg
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
    }
  })
}