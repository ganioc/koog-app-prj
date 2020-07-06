const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
const logger = require('../logger')
const urlencode = require('urlencode');
const getCustId = require('./getcustid')
const util = require('util')

const send = require('./send')

let tStr = getTimeStamp(1)

function reqBatchSend(bMd5, mode, userid, pwd, url, mobiles,content,callback){
  logger.debug('umsc/ reqBatchSend()')

  let paramObj = {
    userid: userid,
    mobile: mobiles,
    // content: urlencode.encode(content),
    custid: getCustId()
  }

  if (mode === 'plain') {
    paramObj.content = content
  } else if (mode === 'urlencode') {
    paramObj.content = urlencode.encode(content, 'utf8')
  } else {
    throw new Error('Unknown mode ' + mode)
  }

  if (bMd5 === true) {
    paramObj.pwd = getsecretstr(userid, pwd, tStr)
    paramObj.timestamp = tStr
  } else {
    paramObj.pwd = pwd
  }
  logger.debug(util.format('%o', paramObj))

  send(paramObj, url, callback);
}

module.exports = reqBatchSend
