// const util = require('util')
const logger = require('../../logger')

// let UserModel = require('../../model/user.js');
// let UserInfo = require('../../model/userinfo')
const authJWT = require('../jwt')
const ErrCode = require('../../err')

const getUser = require('../../db/api/getUser');
const sendSingle = require('./send/single')
const sendMulti = require('./send/multi')
const smsHistory = require('./sms/history')

let func = (router) => {
  router.get('/api/user/info', authJWT, async (req, res) => {
    // When a user is created, userInfo is created
    if (!req.session.username) {
      res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
      return;
    }
    let fb = await getUser({ username: req.session.username });
    if (fb.error) {
      logger.error('Can not find userInfo of %s', req.session.username)
      return res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
    }
    res.json({
      code: 0,
      data: {
        unused: fb.data.unused
      }
    })
  });

  router.post('/api/user/send/single', authJWT, sendSingle);
  router.post('/api/user/send/multi', authJWT, sendMulti);

  router.get('/api/user/sms/history', authJWT, smsHistory);
}

module.exports = func;