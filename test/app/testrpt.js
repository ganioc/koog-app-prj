const getRpt = require('../../lib/umsc/getrpt')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

// Choose md5 or not?
getRpt(false, userid,
  pwd,
  faci.getRptUrl(platform),
  100,
  (err, res, body) => {
    if (err) {
      console.log('wrong getBalance')
    } else {
      // console.log('res:', res)
      console.log('body:', body)
    }
  }
)

