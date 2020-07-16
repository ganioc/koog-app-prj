const logger = require("../../logger")
const UserModel = require('../model/user')
const ErrCode = require('../../err')

module.exports = (username) => {
  logger.debug('getAgentUserCount()');
  logger.debug(username)


  return new Promise((resolve)=>{
    UserModel.countDocuments(
      {
        creator:username
      },
      (err, count) =>{
        if(err){
          resolve({code:ErrCode.DB_QUERY_FAIL, data:{}})
        }else{
          resolve({code:0, data:count})
        }
      }
    )
  })
}
