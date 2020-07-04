const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
// const querystring = require('querystring');
const logger = require('../logger')

const send = require('./send')

function getBalance(bMd5, userid, pwd, url, callback){
  logger.debug('umsc/ getbalance()')

  let tStr = getTimeStamp(1)

  let paramObj = (bMd5=== true)? {
    userid: userid,
    pwd: getsecretstr(userid,pwd,tStr),
    timestamp: tStr
  }:{
      userid: userid,
      pwd: pwd,
  }
  
  send(paramObj,url,callback);
}

module.exports = getBalance;
