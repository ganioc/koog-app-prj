
const logger = require('../logger')
const minusUserInfo = require('./minusUserInfo')
/**
 * 
 * @param {*} name 
 * @param {*} num 
 * 
 * Add to unused equals minus minus num
 */
module.exports = (name, num) => {
  logger.debug('plusUserInfo()')

  return minusUserInfo(name, -num)

}