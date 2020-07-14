const logger = require("../../logger")
const UserModel = require('../model/user')
const ErrCode = require('../../err')

module.exports = () => {
  logger.debug('getUserCount()');

  return new Promise((resolve) => {
    UserModel.countDocuments({role:1},
      (err, count) => {
        if (err) {
          resolve({ code: ErrCode.DB_QUERY_FAIL, data: {} })
        } else {
          resolve({ code: 0, data: count })
        }
      })
  })
}