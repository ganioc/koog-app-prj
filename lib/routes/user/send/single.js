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
  // check user's unused number
  // if unused > 0
  let fb = await getUser({ username: req.session.username });
  if (fb.error) {
    logger.error('Can not find the user:%s', req.session.username)
    return res.json({
      code: ErrCode.DB_QUERY_FAIL,
      data: { message: 'Not find user' }
    })
  }
  logger.debug(util.format('%o',fb.data));

  if (fb.data.unused <= 0) {
    logger.error('Not enough quota')
    return res.json({
      code: ErrCode.USER_QUOTA_FAIL,
      data: { message: 'Not enough quota' }
    })
  }

  // check phone number

  // check text length

  // send it out， using umsc API
  // fb = await umsc.single(mobile, content)
  reqSingleSend(
    true, 
    'urlencode', 
    userid,
    pwd,
    faci.getSingleSendUrl(platform),
    mobile,
    content + platform.TAG,
    async (err,response,body)=>{
      if(err){
        logger.err('send single network fail')
        return res.json({
          code: ErrCode.UMSC_NETWORK_FAIL,
          data:{}
        })
      }
      logger.debug(util.format('%o', body))
      try{
        let fb = JSON.parse(body.toString())
        if(fb.result === 0 ){
          // decrease unused
          let rtn = await minusUser(req.session.username ,1);

          if(rtn.code !== 0){
            logger.error('minusUser error')
          }

          // save msg, only for reference only!
          rtn = await setMsg(
            req.session.username, 
            1, 
            [mobile],
            content, 
            fb,
            fb.custid)
          if(rtn.code !== 0){
            logger.error('setMsg error')
          }

          // save msgton, only update msgton later
          // rtn = await setMsgton(
          //   req.session.username,
          //   [mobile],
          //   fb.msgid,
          //   fb.custid
          // )

          // if (rtn.code !== 0) {
          //   logger.error('setMsgton error')
          // }

          // send ok
          return res.json({
            code:0,
            data:{}
          })

        }else{
          return res.json({
            code: ErrCode.UMSC_GET_FAIL,
            data:{}
          })
        }
      }catch(e){
        res.json({
          code: ErrCode.UMSC_JSON_PARSE_FAIL,
          data: {}
        })
      }
    });


  // 失败的话，再做一次。对于客户来说实际上是发送出去了
  // 这里是不能够失败的，在后台可以反复查询结果
  // 无论成功失败，都会把这条消息记录下来
  // let result = await setMsg(
  //   req.session.username,
  //   1,
  //   [mobile],
  //   content,
  //   fb.data);
  /*
  setTimeout(async () => {
    let result = await bullmq.sendSingleMsg({
      username: req.session.username,
      mobiles: [mobile],
      content: content,
      data: fb.data  // 格式见umsc/funcsingle , nBody
    })
    if (result.id) {
      logger.info('sendSingMsg Job succeed ' + result.id)
    } else {
      logger.error('sendSingleMsg failed!')
    }
  }, bullmq.SEND_DELAY)


  if (fb.code === 0) {
    // ok
    logger.debug(util.format('%o', fb.data))
    // input, mobile, content
    // input, feedback
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