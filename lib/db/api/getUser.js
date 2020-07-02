
let UserModel = require('../model/user.js');
const ErrCode = require('../../err')
const logger = require('../../logger')
const util = require('util')

/**
 * 
 * @param {*} objQuery 
 * 
 * To find a User by a JSON object
 * {
 *   username: ""
 * }
 */

module.exports = (objQuery) => {
  logger.debug('getUser()')
  logger.debug(util.format('%o', objQuery))
  return new Promise((resolve) => {
    UserModel.find(objQuery)
      .exec((err, results) => {
        if (err) {
          resolve({
            code: ErrCode.DB_QUERY_FAIL,
            data: null
          })
          return;
        }
        if (results[0]) {
          resolve({
            code: 0,
            data: results[0]
          })
        } else {
          resolve({
            code: ErrCode.DB_FIND_NONE,
            data: null
          })
        }
      })
  });
}