const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
const reqSingleSend = require('../../lib/umsc/reqsinglesend')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

reqSingleSend(true, 'plain', userid,
  pwd,
  faci.getSingleSendUrl(platform),
  '18621661947',
  'Hello 123456' + platform.TAG,
  (err, res, body) => {
    if (err) {
      console.log(err)
      console.log('wrong single_send')

    } else {
      // console.log('res:', res)
      console.log('body:', body)
    }
  }
)
