// const util = require('util')
// const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
// const bcrypt = require('bcrypt');
const getBalance = require('../../../umsc/getbalance')
const cfgObj = require('../../../../config/config.json')
const faci = require('../../../facility')

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD

module.exports = async (req, res) => {
  logger.debug('/api/admin/info:');

  // 直接从网上获得这个信息
  getBalance(
    true,
    userid,
    pwd,
    faci.getBalanceUrl(platform),
    (err, response, body) => {
      if (err) {
        logger.error('wrong getBalance')
        res.json({
          code: ErrCode.UMSC_GET_FAIL,
          data: {}
        })

      } else {
        // console.log('res:', res)
        console.log('body:', body)
        try{
          let fb = JSON.parse(body.toString())
          if(fb.result === 0){
            res.json({
              code:0,
              data:{
                amount: fb.balance
              }
            })
          }else{
            throw new Error('wrong feedback')
          }
        }catch(e){
          res.json({
            code: ErrCode.UMSC_JSON_PARSE_FAIL,
            data:{}
          })
        }
      }
    }
  )
}
