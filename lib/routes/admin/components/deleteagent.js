const util = require('util')
const UserModel = require('../../../db/model/user.js');
const UserInfoModel = require('../../../db/model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger');
// const getUser = require('../../../db/api/getUser')
// const plusAdminUsed = require('../../../db/api/plusAdminUsed')
// const setDeleteAction = require('../../../db/api/action/setDelete')
const mongoose = require('mongoose')
const deleteAgentAction = require('../../../db/api/action/deleteAgent')

module.exports = async (req, res) => {
  // router.post('/api/admin/deleteuser', authJWT, verifyAdmin, async (req, res) => {
  logger.debug('/api/admin/deleteagent')
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

  try{
    let agent = await UserModel.findOne({ username: req.body.username}).session(session)

    oldUnused = agent.unused;

    await UserModel.findOneAndDelete({ username: req.body.username }).session(session)

    // remove userinfo
    // let agentInfo = 
    await UserInfoModel.findOneAndDelete({username: req.body.username}).session(session);

    // await agentInfo.remove();

    let boss = await UserModel.findOne({ username: 'admin' }).session(session);

    boss.used = boss.used + oldUnused;

    await boss.save()

    await deleteAgentAction(req.body.username, session)

    await session.commitTransaction()
    session.endSession();

    return res.json({
              code: 0,
              data: {
                message: "删除成功"
              }
    })

  }catch(err){

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