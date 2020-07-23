const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

const cfgObj = require('../../../../config/config.json')
const faci = require('../../../facility')
const reqSingleSend = require('../../../umsc/reqsinglesend')
// const setMsgton = require('../../../db/api/setMsgton')
const mongoose = require('mongoose')
const UserModel = require('../../../db/model/user')
const createMsg = require('../../../db/api/createmsg')

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD


module.exports = async (req, res) => {
  logger.debug('/api/user/send/single:')
  logger.debug(util.format('%o', req.body));

  let mobile = req.body.mobile;
  let content = req.body.text;

  if (!mobile || !content) {
    logger.error('Invalid input param')
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Invalid input param' }
    })
  }

  const db = mongoose.connection;

  const session = await db.startSession();

  await session.startTransaction();

  try{
    let user = await UserModel.findOne({ username:req.session.username}).session (session)

    if(user.unused <= 0){
      throw new Error("余额不足")
    }

    let creator = user.creator;

    user.unused = user.unused -1;
    user.used = user.used + 1;
    await user.save();

    let result = await new Promise((resolve)=>{
      reqSingleSend(
        true,
        'urlencode',
        userid,
        pwd,
        faci.getSingleSendUrl(platform),
        mobile,
        content + platform.TAG,
        async (err, response, body) => {
          if (err) {
            logger.err('send single network fail')
            throw new Error("网络故障")
          }
          logger.debug(util.format('%o', body))
          resolve(body)
        });
    })

    let fb = JSON.parse(result.toString())
    if(fb.result !== 0){
      throw new Error('无效返回')
    }
    // await minusUser(req.session.username, 1, session)
    await createMsg(
      1, 
      req.session.username,
      creator,
      [mobile],
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
  }catch(err){
    logger.error(util.format('%o', err.message))
    await session.abortTransaction()
    session.endSession();

    res.json({
      code: ErrCode.MSG_SEND_FAIL,
      data: {message: err.message}
    })

  }
  
}