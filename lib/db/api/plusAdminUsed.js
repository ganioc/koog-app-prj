const logger = require('../../logger')
const UserModel = require('../model/user')
const ErrCode = require('../../err')

module.exports = (num) => {
  logger.debug('plusAdminUsed()')
  logger.debug( num)

  return new Promise((resolve)=>{
    UserModel.findOne({
      username: 'admin'
    },
    (err,user)=>{
      if (err) {
        logger.warning('findOne failed')
        return resolve({
          code: ErrCode.DB_QUERY_FAIL,
          data: err
        })
        
      }
      logger.debug(user.used)
      user.used = user.used?user.used:0 + num
      logger.debug(user.used)
      user.save(
        (err)=>{
          if (err) {
            return resolve({
              code: ErrCode.DB_SAVE_FAIL,
              data: null
            })
          }
          logger.debug('updated')
          resolve({
            code:0,
            data:{}
          })
        }
      )
    })
  })

}