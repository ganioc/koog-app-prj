const util = require('util')
const UserModel = require('../../../db/model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
const setStatusAction = require('../../../db/api/action/setStatus')
const mongoose = require('mongoose')

module.exports = async (req, res) => {
  logger.debug('/api/admin/setagent')
  logger.debug(util.format('%o', req.body))

  let oldUnused = 0;
  let oldStatus = '';

  const db = mongoose.connection;

  const session = await db.startSession();

  await session.startTransaction();

  try{
    let user =  await UserModel.findOne({ username: req.body.username }).session(session);

    oldUnused = user.unused;
    oldStatus = user.status;

    user.status = req.body.status
    user.unused = req.body.unused
    user.email = req.body.email
    user.phone = req.body.phone
    user.address = req.body.address
    user.extra = req.body.extra

    let boss = await UserModel.findOne({ username: 'admin' }).$session(session);

    boss.used = boss.used.add(user.unused - oldUnused);

    await boss.save();

    await user.save();

    if (oldStatus !== user.status) {
      await setStatusAction('admin', req.body.username, 'status', oldStatus, user.status)
    }

    if (oldUnused !== user.unused) {
      await setStatusAction('admin', req.body.username, 'unused', oldUnused, user.unused)
    }

    await session.commitTransaction()
    session.endSession();

    return res.json({
      code: 0,
      data: {}
    })
  }catch(err){
    await session.abortTransaction()
    session.endSession();
    return res.json(
      {
        code: ErrCode.DB_SAVE_FAIL,
        data: { message: 'save agent failed' }
      }
    )
  }
/*
  UserModel.findOne(
    { username: req.body.username },
    function (err, user) {
      if (!err) {
        oldUnused = user.unused;
        oldStatus = user.status;

        user.status = req.body.status
        user.unused = req.body.unused
        user.email = req.body.email
        user.phone = req.body.phone
        user.address = req.body.address
        user.extra = req.body.extra

        user.save(async (err) => {
          if (err) {
            return res.json(
              {
                code: ErrCode.DB_SAVE_FAIL,
                data: { message: 'save user failed' }
              }
            )
          } else {
 
            if (oldStatus !== user.status) {
              await setStatusAction('admin', req.body.username, 'status', oldStatus, user.status)
            }
            if (oldUnused !== user.unused) {
              await setStatusAction('admin', req.body.username, 'unused', oldUnused, user.unused)

              // change admin used
              await plusAdminUsed(user.unused - oldUnused);
            }

            return res.json({
              code: 0,
              data: {}
            })

          }
        })
      } else {
        return res.json({
          code: ErrCode.DB_FIND_NONE,
          data: { message: 'Can not find user by' + req.body.username }
        })
      }
    }
  )
*/
}