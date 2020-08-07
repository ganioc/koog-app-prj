const util = require('util')
const UserModel = require('../../../db/model/user');
const UserInfoModel = require('../../../db/model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const bcrypt = require('bcrypt');
const createUserAction = require('../../../db/api/action/createUser')

module.exports = async (req, res) => {
  logger.debug('/api/admin/createuser')
  logger.debug(util.format('%o', req.body))
  // 生成user
  if (!req.body.username || !req.body.password) {
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      message: '参数不全'
    })
  }

  let userObj = {
    username: req.body.username.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, 10),
    creator: 'admin',
    role: 1,
    usertype: 'external',
    unused: (req.body.unused === undefined) ? 0 : parseInt(req.body.unused),
    used: 0,
    status: (req.body.status === undefined) ? 'invalid' : req.body.status,
    email: (!req.body.email) ? '' : req.body.email,
    createdate: new Date(),
    phone: (!req.body.phone) ? '' : req.body.phone,
    address: (!req.body.address) ? '' : req.body.address,
    extra: (!req.body.extra) ? '' : req.body.extra
  }
  UserModel.create(
    userObj,
    (err) => {
      if (err) {
        logger.error('createuser failed');
        // logger.error(util.format('%o', err))
        logger.error(util.format('%o', err.message))
        return res.json({
          code: ErrCode.DB_SAVE_FAIL,
          data: {
            username: req.body.username,
            message: '生成user失败:' + err.message
          }
        })
      }
      // 生成UserInfoModel
      UserInfoModel.create({
        username: req.body.username,
        usertype: 'external',
        lastlogin: new Date(),
        undelivered: 0,
        delivered: 0,
        submitted: 0
      },
        async (err) => {
          if (err) {
            logger.error('createuser userinfo failed')
            logger.error(util.format('%o', err))
          }
          logger.debug('createuser succeed')

          await createUserAction(req.body.username, 'admin');

          // ActionModel.create({
          //   action: 1,
          //   username: req.body.username,
          //   date: new Date(),
          //   content: "新建"
          // }, (err) => {
          //   if (err) {
          //     logger.error('create action failed');
          //     logger.error(util.format('%o],err'))
          //   }
          //   logger.debug('create action succeed')

          // })

          return res.json({
            code: 0,
            data: {
              username: req.body.username
            }
          })

        })
    })
  // 生成userinfo
}