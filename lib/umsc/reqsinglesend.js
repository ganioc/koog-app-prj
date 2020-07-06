const getsecretstr = require("./getsecretstr");
const getTimeStamp = require('./gettimestamp')
const logger = require('../logger')
const urlencode = require('urlencode');
const getCustId = require('./getcustid')
const util = require('util')

const send = require('./send')

let tStr = getTimeStamp(1)

function reqSingleSend( bMd5, mode, userid, pwd, url, mobile, content, callback){
  logger.debug('umsc/ reqSingleSend()')

  let paramObj = {
    userid: userid,
    mobile: mobile,
    // content: urlencode.encode(content, 'GBK'),
    custid: getCustId()
  }

  if(mode === 'plain'){
    paramObj.content = content
  }else if(mode === 'urlencode'){
    paramObj.content = urlencode.encode(content, 'utf8')
  }else{
    throw new Error('Unknown mode ' + mode)
  }

  if(bMd5 === true){
    paramObj.pwd=  getsecretstr(userid, pwd, tStr)
    paramObj.timestamp= tStr
  }else{
    paramObj.pwd = pwd
  }
  logger.debug(util.format('%o', paramObj))
  
  send(paramObj, url, callback);
}

module.exports = reqSingleSend;

