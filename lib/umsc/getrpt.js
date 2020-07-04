const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
// const querystring = require('querystring');
const logger = require('../logger')

const send = require('./send')

function getRpt(bMd5, userid, pwd, url, retsize, callback) {
  logger.debug('umsc/ getbalance()')

  let tStr = getTimeStamp(1)

  let paramObj = (bMd5 === true) ? {
    userid: userid,
    pwd: getsecretstr(userid, pwd, tStr),
    timestamp: tStr,
    retsize: retsize
  } : {
      userid: userid,
      pwd: pwd,
      retsize: retsize
    }

  send(paramObj, url, callback);
}

module.exports = getRpt;
