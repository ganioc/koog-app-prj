const getRpt = require('../../lib/umsc/getrpt')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
const MsgModel = require('../../lib/db/model/msg')
const logger = require('../../lib/logger')
const plusUser = require('../../lib/db/api/plusUser')
const setMsgton = require('../../lib/db/api/setMsgton')
const ErrCode = require('../../lib/err')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

function handleRpt(rpt){
  logger.debug('start handle Rpt')
  return new Promise((resolve)=>{
    if(rpt.status === 0){
      console.log('pass msgid: ', rpt.msgid)
      console.log('mobile:', rpt.mobile)
      console.log('stime:', rpt.stime)
      console.log('rtime:', rpt.rtime)
      resolve({
        code: 0,
        data:{}
      })
    }else if(rpt.pknum === 1){
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
        async (err, msg)=>{
          if(err){
            logger.error('can not find msg')
            logger.debug('End handle Rpt')
            resolve({
              code: ErrCode.RPT_MSG_NOTFOUND,
              data:{}
            })
            return
          }
          let name = msg.username;
          logger.debug('username: ' + name)
          // update user unused
          let ret = await plusUser(name , 1)
          if(ret.code !== 0){
            logger.error('update unused fail')
          }

          // save to msgton, 不会重复！
          ret = await setMsgton(name, mobile, msgid, 'none',custid, rtime, status )

          if(ret.code !== 0){
            logger.error('update msgton fail')
          }

          logger.debug('End handle Rpt')
          resolve({
            code:0,
            data:{}
          })
        }
      )
    }
  })
}

// Choose md5 or not?
getRpt(true, userid,
  pwd,
  faci.getRptUrl(platform),
  5,
  async (err, res, body) => {
    if (err) {
      console.log('wrong getBalance')
    } else {
      // console.log('res:', res)
      console.log('body:', body)
      console.log(typeof body)
      // parse rpts

      try{
        let bodyObj = JSON.parse(body);
        console.log('result:', bodyObj.result)
        console.log('len:', bodyObj.rpts.length)

        if(bodyObj.result === 0){
          for(let i=0; i< bodyObj.rpts.length; i++){
            logger.debug('No ' + i)
            await handleRpt(bodyObj.rpts[i])
          }
        }

      }catch(e){
        console.log('wrong parsing body')
      }

      // for every rpt

    }
  }
)

