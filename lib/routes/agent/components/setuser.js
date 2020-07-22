const util = require('util')
const UserModel = require('../../../db/model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const setStatusAction = require('../../../db/api/action/setStatus')
const mongoose = require('mongoose')

module.exports = async (req, res) => {
  logger.debug('/api/agent/setuser')
  logger.debug(util.format('%o', req.body))

  let oldUnused = 0;
  let oldStatus = '';

  const db = mongoose.connection;

  const session = await db.startSession();

  await session.startTransaction();

  try {
    let user = await UserModel.findOne({ username: req.body.username , creator: req.session.username}).session(session);

    oldUnused = user.unused;
    oldStatus = user.status;

    user.status = req.body.status
    user.unused = req.body.unused
    user.email = req.body.email
    user.phone = req.body.phone
    user.address = req.body.address
    user.extra = req.body.extra

    let boss = await UserModel.findOne({ username: req.session.username }).session(session);
    boss.unused = boss.unused - (user.unused - oldUnused)
    boss.used = boss.used + (user.unused - oldUnused);

    await boss.save();

    await user.save();

    if (oldStatus !== user.status) {
      await setStatusAction(req.session.username, req.body.username, 'status', oldStatus, user.status, session)
    }

    if (oldUnused !== user.unused) {
      await setStatusAction(req.session.username, req.body.username, 'unused', oldUnused, user.unused, session)
    }

    // throw new Error({message:"test"});

    await session.commitTransaction()
    session.endSession();

    return res.json({
      code: 0,
      data: {}
    })
  } catch (err) {
    logger.error(util.format('%o', err.message))
    await session.abortTransaction()
    session.endSession();
    return res.json(
      {
        code: ErrCode.DB_SAVE_FAIL,
        data: { message: 'save user failed' }
      }
    )
  }
}