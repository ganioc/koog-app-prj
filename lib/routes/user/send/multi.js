const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

// const UserInfoModel = require('../../../model/userinfo')
const getUser = require('../../../db/api/getUser')
// const umsc = require('../../../umsc/index')
// const setMsg = require('../../../db/setMsg')
// const bullmq = require('../../../bullmq')
const cfgObj = require('../../../../config/config.json')
const faci = require('../../../facility')
const reqBatchSend = require('../../../umsc/reqbatchsend')
const minusUser = require('.././../../db/api/minusUser')
const setMsg = require('../../../db/api/setMsg')
const createMsg = require('../../../db/api/createmsg')
const mongoose = require('mongoose')
const UserModel = require('../../../db/model/user')

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD


module.exports = async (req, res) => {
  logger.debug('/api/user/send/multi:')
  logger.debug(util.format('%o', req.body));

  let mobileArr = req.body.mobiles;
  let content = req.body.text;
  let TAG = req.body.tag;

  if (!mobileArr || !content || !TAG) {
    logger.error('Invalid input param')
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Invalid input params' }
    })
  }


  const db = mongoose.connection;

  const session = await db.startSession();

  await session.startTransaction();

  try {
    let user = await UserModel.findOne({ username: req.session.username }).session(session)

    if (user.unused < mobileArr.length) {
      throw new Error('余额不足')
    }

    let tags = user.extra;
    let tagLst = tags.split(' ');

    if (tagLst.indexOf(TAG) === -1) {
      throw new Error("错误的签名")
    }

    let creator = user.creator;

    user.unused = user.unused - mobileArr.length;
    user.used = user.used + mobileArr.length;
    await user.save()

    let result = await new Promise((resolve) => {
      reqBatchSend(true,
        'urlencode',
        userid,
        pwd,
        faci.getBatchSendUrl(platform),
        mobileArr.join(','),
        content + '【' + TAG + '】',
        async (err, response, body) => {
          if (err) {
            logger.err('send multi network fail')
            throw new Error("网络故障")
          }
          logger.debug(util.format('%o', body))
          resolve(body)
        })
    })

    let fb = JSON.parse(result.toString())
    if (fb.result !== 0) {
      throw new Error('无效返回')
    }

    await createMsg(
      2,
      req.session.username,
      creator,
      mobileArr,
      content,
      fb.msgid,
      fb.custid,
      session)

    await session.commitTransaction()
    session.endSession();
    // send ok
    return res.json({
      code: 0,
      data: {}
    })
  } catch (err) {
    logger.error(util.format('%o', err.message))
    await session.abortTransaction()
    session.endSession();

    res.json({
      code: ErrCode.MSG_SEND_FAIL,
      data: { message: err.message }
    })
  }
}