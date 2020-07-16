const logger = require("../../logger")
const UserModel = require('../model/user')
const ErrCode = require('../../err')

module.exports = () => {
  logger.debug('getAgentUserCount()');

  return new Promise((resolve) => {
    UserModel.countDocuments({role:2},
      (err, count) => {
        if (err) {
          resolve({ code: ErrCode.DB_QUERY_FAIL, data: {} })
        } else {
          resolve({ code: 0, data: count })
        }
      })
  })
}