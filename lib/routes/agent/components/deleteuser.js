const util = require('util')
const UserModel = require('../../../db/model/user.js');
const UserInfoModel = require('../../../db/model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger');
const mongoose = require('mongoose')
const deleteUserAction = require('../../../db/api/action/deleteUser')

module.exports = async (req, res) => {
  // router.post('/api/admin/deleteuser', authJWT, verifyAdmin, async (req, res) => {
  logger.debug('/api/agent/deleteuser')
  logger.debug(util.format('%o', req.body))

  let username = req.body.username

  if (username === undefined) {
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: {
        message: "参数不全"
      }
    })
  }

  const db = mongoose.connection;
  const session = await db.startSession();
  await session.startTransaction();

  let oldUnused = 0;

  try {
    let user = await UserModel.findOne({ username: req.body.username ,creator: req.session.username}).session(session)

    oldUnused = user.unused;

    await UserModel.findOneAndDelete({ username: req.body.username , creator: req.session.username}).session(session)

    // remove userinfo
    // let agentInfo = 
    await UserInfoModel.findOneAndDelete({ username: req.body.username }).session(session);

    // await agentInfo.remove();

    let boss = await UserModel.findOne({ username: req.session.username }).session(session);

    boss.unused = boss.unused + oldUnused;

    await boss.save()

    await deleteUserAction(req.body.username, req.session.username, session)

    await session.commitTransaction()
    session.endSession();

    return res.json({
      code: 0,
      data: {
        message: "删除成功"
      }
    })

  } catch (err) {

    await session.abortTransaction()
    session.endSession();
    logger.error('delete failed');
    logger.error(util.format('%o', err.message))

    return res.json({
      code: ErrCode.DB_OP_FAIL,
      data: {
        message: "delete失败"
      }
    })
  }
}