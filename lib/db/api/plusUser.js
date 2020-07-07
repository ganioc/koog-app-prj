
const logger = require('../logger')
const minusUser = require('./minusUser')
/**
 * 
 * @param {*} name 
 * @param {*} num 
 * 
 * Add to unused equals minus minus num
 */
module.exports = (name, num) => {
  logger.debug('plusUserInfo()')

  return minusUser(name, -num)

}