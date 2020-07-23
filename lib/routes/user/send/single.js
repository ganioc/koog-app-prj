const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

// const UserInfoModel = require('../../../model/userinfo')
const getUser = require('../../../db/api/getUser')

const cfgObj = require('../../../../config/config.json')
const faci = require('../../../facility')
const reqSingleSend = require('../../../umsc/reqsinglesend')
const minusUser = require('.././../../db/api/minusUser')
const setMsg = require('../../../db/api/setMsg')
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
          // try {
          //   let fb = JSON.parse(body.toString())
          //   if (fb.result === 0) {
          //     // decrease unused
          //     let rtn = await minusUser(req.session.username, 1);

          //     if (rtn.code !== 0) {
          //       logger.error('minusUser error')
          //     }

          //     // save msg, only for reference only!
          //     rtn = await setMsg(
          //       req.session.username,
          //       1,
          //       [mobile],
          //       content,
          //       fb,
          //       fb.custid)
          //     if (rtn.code !== 0) {
          //       logger.error('setMsg error')
          //     }

          //     // send ok
          //     return res.json({
          //       code: 0,
          //       data: {}
          //     })

          //   } else {
          //     return res.json({
          //       code: ErrCode.UMSC_GET_FAIL,
          //       data: {}
          //     })
          //   }
          // } catch (e) {
          //   res.json({
          //     code: ErrCode.UMSC_JSON_PARSE_FAIL,
          //     data: {}
          //   })
          // }
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
  // check user's unused number
  // if unused > 0
  // let fb = await getUser({ username: req.session.username });
  // if (fb.error) {
  //   logger.error('Can not find the user:%s', req.session.username)
  //   return res.json({
  //     code: ErrCode.DB_QUERY_FAIL,
  //     data: { message: 'Not find user' }
  //   })
  // }
  // logger.debug(util.format('%o',fb.data));

  // if (fb.data.unused <= 0) {
  //   logger.error('Not enough quota')
  //   return res.json({
  //     code: ErrCode.USER_QUOTA_FAIL,
  //     data: { message: 'Not enough quota' }
  //   })
  // }

  // check phone number

  // check text length

  // send it out， using umsc API
  // fb = await umsc.single(mobile, content)
  
}