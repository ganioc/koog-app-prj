const logger = require("../../logger")
const MsgModel = require('../model/msg')
const ErrCode = require('../../err')

module.exports = () =>{
  logger.debug('getMsgCount()');

  return new Promise((resolve) => {
    MsgModel.countDocuments({},
      (err, count) => {
        if (err) {
          resolve({ code: ErrCode.DB_QUERY_FAIL, data: {} })
        } else {
          resolve({ code: 0, data: count })
        }
      })
  })
}