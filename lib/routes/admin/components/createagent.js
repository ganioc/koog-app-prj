const util = require('util')
const UserModel = require('../../../db/model/user');
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const bcrypt = require('bcrypt');
const createAgentAction = require('../../../db/api/action/createAgent')
const createUserInfo = require('../../../db/api/createUserInfo')
const setStatusAction = require('../../../db/api/action/setStatus')
// const plusAdminUsed = require('../../../db/api/plusAdminUsed')
const mongoose = require('mongoose')

module.exports = async (req, res) => {
  logger.debug('/api/admin/createagent')
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
    role: 2,
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

  const db = mongoose.connection;
  const session = await db.startSession();
  await session.startTransaction()

  try{
    await UserModel.create([userObj], {session: session})

    // 生成UserInfoModel
    await createUserInfo(userObj.username, 'external', 'none', session);

    // write action record
    await createAgentAction(userObj.username, session)

    // set status action
    await setStatusAction('admin', userObj.username, 'status', '', userObj.status, session)

    await session.commitTransaction()
    session.endSession();

    return res.json({
      code: 0,
      data: {
        username: userObj.username,
        message: '生成agent成功:' + userObj.username
      }
    })

  }catch(err){

    await session.abortTransaction()
    session.endSession();

    logger.error('createagent failed');
    logger.error(util.format('%o', err.message))
    return res.json({
      code: ErrCode.DB_SAVE_FAIL,
      data: {
        username: req.body.username,
        message: '生成agent失败:' + req.body.username
      }
    })
  }
}