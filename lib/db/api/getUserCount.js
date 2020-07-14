const logger = require("../../logger")
const UserModel = require('../../../db/model/user')
const ErrCode = require('../../../err')

module.exports = () => {
  logger.debug('getUserCount()');

  new Promise((resolve) => {
    UserModel.countDocuments({},
      (err, count) => {
        if (err) {
          resolve({ code: ErrCode.DB_QUERY_FAIL, data: {} })
        } else {
          resolve({ code: 0, data: count })
        }
      })
  })
}