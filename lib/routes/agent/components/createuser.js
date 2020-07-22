const util = require('util')
const UserModel = require('../../../db/model/user');
// const UserInfoModel = require('../../../db/model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const bcrypt = require('bcrypt');
const createUserAction = require('../../../db/api/action/createUser')
// const getUser = require('../../../db/api/getUser')
const mongoose = require('mongoose')
const createUserInfo = require('../../../db/api/createUserInfo')
const setStatusAction = require('../../../db/api/action/setStatus')

module.exports = async (req, res) => {
  logger.debug('/api/agent/createuser')
  logger.debug(util.format('%o', req.body))
  // 生成user
  if (!req.body.username || !req.body.password) {
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      message: '参数不全'
    })
  }

  let userObj = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    creator: req.session.username,
    role: 1,
    usertype: 'external',
    unused: 0,
    used: 0,
    status: (req.body.status === undefined) ? 'invalid' : req.body.status,
    email: (!req.body.email) ? '' : req.body.email,
    createdate: new Date(),
    phone: (!req.body.phone) ? '' : req.body.phone,
    address: (!req.body.address) ? '' : req.body.address,
    extra: (!req.body.extra) ? '' : req.body.extra
  }

  // will not config unused here!
  const db = mongoose.connection;
  const session = await db.startSession();
  await session.startTransaction()

  try{
    // let agent = await UserModel.findOne({username: req.session.username}).session(session)

    await UserModel.create([userObj], {session:session})
    await createUserInfo(userObj.username, 'external', 'none', session)

    await createUserAction(userObj.username, req.session.username)

    await setStatusAction(req.session.username, userObj.username, 'status', '', userObj.status, session)

    await session.commitTransaction()
    session.endSession();

    return res.json({
      code: 0,
      data: {
        username: userObj.username,
        message: '生成User成功:' + userObj.username
      }
    })

  }catch(err){
    await session.abortTransaction()
    session.endSession();

    logger.error('createuser failed');
    logger.error(util.format('%o', err.message))

    return res.json({
      code: 0,
      data: {
        username: req.body.username
      }
    })

  }


  /*
  let result = await getUser(req.session.username);
  if(result.code !== 0){
    return res.json({
      code:ErrCode.DB_FIND_NONE,
      message:'user not found'
    })
  }
  let agent = result.data;
  logger.debug(util.format('%o',agent))

  if (agent.unused < parseInt(req.body.unused)){
    return res.json({
      code: ErrCode.UMSC_QUOTA_NOT_ENOUGH,
      message:'quota not enough'
    })
  }

  let userObj = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    creator: req.session.username,
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
        logger.error(util.format('%o', err))
        logger.error(util.format('%o',err.message))
        return res.json({
          code: ErrCode.DB_SAVE_FAIL,
          data: {
            username: req.body.username,
            message:  err.message
          }
        })
      }
      // 生成UserInfoModel
      UserInfoModel.create({
        username: req.body.username,
        usertype: 'external',
        lastlogin: new Date(),
        tag: '',
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

          // minus agent unused
          // await 

          // action user valid

          // action user unused to 



          await createUserAction(req.body.username, req.session.username);

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
          //   return res.json({
          //     code: 0,
          //     data: {
          //       username: req.body.username
          //     }
          //   })
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
  */
}