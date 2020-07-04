const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
const reqBatchSend = require('../../lib/umsc/reqbatchsend')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

reqBatchSend(false, userid,
  pwd,
  faci.getBatchSendUrl(platform),
  '18621661947,13041686656',
  'Hello 你好 123456',
  (err, res, body) => {
    if (err) {
      console.log('wrong batch_send')
    } else {
      // console.log('res:', res)
      console.log('body:', body)
    }
  }
)
