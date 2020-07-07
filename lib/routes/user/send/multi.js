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

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD


module.exports = async (req, res) => {
  logger.debug('/api/user/send/multi:')
  logger.debug(util.format('%o', req.body));

  let mobileArr = req.body.mobiles;
  let content = req.body.text;

  if (!mobileArr || !content) {
    logger.error('Invalid input param')
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Invalid input params' }
    })
  }

  // if unused > 0
  let fb = await getUser({ username: req.session.username });
  if (fb.error) {
    logger.error('Can not find the user:%s', req.session.username)
    return res.json({
      code: ErrCode.DB_QUERY_FAIL,
      data: { message: 'Not find user' }
    })
  }
  console.log(fb.data);

  if (fb.data.unused < mobileArr.length) {
    logger.error('Not enough quota ' + fb.data.unused + ' to ' + mobileArr.length)
    return res.json({
      code: ErrCode.USER_QUOTA_FAIL,
      data: { message: 'Not enough quota ' + fb.data.unused }
    })
  }

  // send it out
  // fb = await umsc.multi(mobileArr, content);
  reqBatchSend(
    true,
    'urlencode',
    userid,
    pwd,
    faci.getBatchSendUrl(platform),
    mobileArr.join(','),
    content + platform.TAG,
    async (err, response, body) =>{
      if (err) {
        logger.err('send batch network fail')
        return res.json({
          code: ErrCode.UMSC_NETWORK_FAIL,
          data: { message:'UMSC网络不通'}
        })
      }
      logger.debug(util.format('%o', body))

      try {
        let fb = JSON.parse(body.toString())
        if(fb.result === 0 ){
          // decrease unused
          let rtn = await minusUser(req.session.username, mobileArr.length);

          if (rtn.code !== 0) {
            logger.error('minusUser error')
          }

          // save msg, only for reference only!
          rtn = await setMsg(
            req.session.username,
            2,
            mobileArr,
            content,
            fb,
            fb.custid)
          if (rtn.code !== 0) {
            logger.error('setMsg error')
          }

          return res.json({
            code: 0,
            data: {}
          })

        }else{
          return res.json({
            code: ErrCode.UMSC_GET_FAIL,
            data: {}
          })
        }
      }catch(e){
        res.json({
          code: ErrCode.UMSC_JSON_PARSE_FAIL,
          data: {}
        })
      }
    }
  )


  /*
  setTimeout(async () => {
    let result = await bullmq.sendMultiMsg({
      username: req.session.username,
      mobiles: mobileArr, // string array format
      content: content,
      data: fb.data // 见umsc/multi的返回格式
    })
    if (result.id) {
      logger.info('sendMultiMsg Job succeed ' + result.id)
    } else {
      logger.error('sendMultiMsg failed')
    }
  }, bullmq.SEND_DELAY)

  if (fb.code === 0) {
    logger.debug(util.format('%o', fb.data))

    res.json({
      code: 0,
      data: { message: 'OK' }
    })

  } else {
    logger.error('submit fail')
    res.json({
      code: fb.code,
      data: { message: 'submit fail' }
    })
  }
  */
}