
const logger = require('../../logger')
const UserModel = require('../model/user')
const ErrCode = require('../../err')

// num must be less than unused

module.exports = (name, num) => {
  logger.debug('minusUserInfo()')
  logger.debug(name + ' ' + num)

  return new Promise((resolve) => {
    UserModel.findOne(
      { username: name },
      (err, user) => {
        if (err) {
          logger.warning('findOne failed')
          resolve({
            code: ErrCode.DB_QUERY_FAIL,
            data: err
          })
          return
        }
        // find it
        logger.debug(user.unused)

        // update it
        user.unused = user.unused - num
        logger.debug(user.unused)
        user.save(
          (err) => {
            if (err) {
              resolve({
                code: ErrCode.DB_SAVE_FAIL,
                data: null
              })
              return
            }
            logger.debug('userinfo saved')
            resolve({
              code: 0,
              data: null
            })
          }
        )
      }
    )
  })
}