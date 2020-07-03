const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
// const querystring = require('querystring');

const sendjson = require('./sendjson')

function getBalance(userid, pwd, url, callback) {
  console.log('umsc/ getbalance()')

  let tStr = getTimeStamp()

  let paramObj = {
    userid: userid,
    pwd: getsecretstr(userid, pwd, tStr),
    // pwd: pwd,
    timestamp: tStr
  }

  sendjson(paramObj, url, callback);
}

module.exports = getBalance;