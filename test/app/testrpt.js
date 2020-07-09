const getRpt = require('../../lib/umsc/getrpt')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
// const MsgModel = require('../../lib/db/model/msg')
const logger = require('../../lib/logger')
// const plusUser = require('../../lib/db/api/plusUser')
// const setMsgton = require('../../lib/db/api/setMsgton')
// const ErrCode = require('../../lib/err')
const handleRpt = require('../../lib/db/api/handlerpt')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

// Choose md5 or not?
getRpt(true, userid,
  pwd,
  faci.getRptUrl(platform),
  100,
  async (err, res, body) => {
    if (err) {
      console.log('wrong getBalance')
    } else {
      // console.log('res:', res)
      console.log('body:', body)
      // console.log(typeof body)
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
    }
  }
)

