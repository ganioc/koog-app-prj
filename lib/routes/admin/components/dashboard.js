const UserModel = require('../../../db/model/user.js');
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const util = require('util');
const getMsgCount = require('../../../db/api/getMsgCount.js');
const getUser = require('../../../db/api/getuser.js');
const getAgentCount = require('../../../db/api/getAgentCount.js');
const getUserCount = require('../../../db/api/getUserCount.js');


module.exports = async (req, res) => {
  logger.debug('/api/admin/dashboard:');

  let used = 0;
  let unused = 0;
  let numAgent = 0;
  let numUser = 0;
  let numMsg = 0;

  let result = await getUser({username:'admin'});

  if (result.code !== 0){
    return res.json(result);
  }
  logger.debug(util.format('%o', result.data));
  used = result.data.used;
  unused = result.data.unused;

  // msg
  result = await getMsgCount();

  if(result.code !== 0){ return res.json(result)}
  
  numMsg = result.data;
  logger.debug("msg count: " + numMsg)

  // agent num
  result = await getAgentCount();

  if(result.code !== 0){ return res.json(result)}
  numAgent = result.data;
  logger.debug("agent count: " + numAgent)

  // user num
  result = await getUserCount();
  if(result.code !== 0){ return res.json(result)}
  numUser = result.data;
  logger.debug("user count: " + numUser)

  res.json({
    used:used,
    numAgent: numAgent,
    numUser: numUser,
    numMsg: numMsg,
    unused: unused
  })
}