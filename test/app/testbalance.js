const getBalance = require('../../lib/umsc/getbalance')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

// Choose md5 or not?
getBalance(true, userid,
  pwd, 
  faci.getBalanceUrl(platform),
  (err, res, body)=>{
    if(err){
      console.log('wrong getBalance')
    }else{
      // console.log('res:', res)
      console.log('body:', body)
    }
  }
)