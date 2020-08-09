const logger = require('../../../logger')
const getUser = require('../../../db/api/getUser')
const ErrCode = require('../../../err')
const util = require('util')

module.exports = async (req, res) => {
  logger.debug('/api/user/dashboard:');

  // username is from session, so user won't input a username , here
  if (!req.session.username) {
    return res.json({
      code: ErrCode.DB_QUERY_FAIL,
      data: {}
    })
  }

  let username = req.session.username;

  let result = await getUser({ username: username })
  logger.debug(util.format('%o', result))


  if (result.code !== 0) {
    return res.json({
      code: result.code,
      data: {
        message: '用户不存在'
      }
    })
  }

  delete result.data.password
  logger.debug(util.format('%o', result))

  return res.json({
    code: 0,
    data: {
      unused: result.data.unused,
      used: result.data.used,
      status: result.data.status,
      tags: result.data.extra
    }
  });

}