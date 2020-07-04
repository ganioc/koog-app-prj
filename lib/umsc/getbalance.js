const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
// const querystring = require('querystring');

const send = require('./send')

function getBalance(bMd5, userid, pwd, url, callback){
  console.log('umsc/ getbalance()')

  let tStr = getTimeStamp()

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
