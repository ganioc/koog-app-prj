const getBalance = require('../../lib/umsc/getbalance')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD
// let ip = platform.IP
// let port = platform.PORT
// let url = platform.GET_BALANCE_URL

getBalance(userid,
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