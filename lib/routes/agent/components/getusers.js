
const util = require('util')
const UserModel = require('../../../db/model/user.js');
const ErrCode = require('../../../err')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  logger.debug('/api/agent/getusers:');
  logger.debug(util.format('%o', req.query))
  let curPage = parseInt(req.query.curpage);
  let numPage = parseInt(req.query.numpage);

  curPage = (curPage < 0) ? 0 : curPage;
  numPage = (numPage > 50) ? 10 : numPage;

  let amount = 0

  UserModel.find({ role: 1 }).exec((err, results) => {
    if (err) {
      res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
    } else {
      amount = results.length;

      UserModel.find({ role: 1 , creator: req.session.username})
        .sort({ createdate: 'desc' })
        .limit(numPage)
        .skip((curPage - 1) * numPage)
        .then((results) => {
          let trimmedResults = [];
          for (let i = 0; i < results.length; i++) {
            trimmedResults.push({
              createdate: results[i].createdate,
              username: results[i].username,
              status: results[i].status,
              unused: results[i].unused,
              used: results[i].used,
              creator: results[i].creator
            })
          }

          return res.json({
            code: 0,
            data: {
              amount: amount,
              numpage: numPage,
              curpage: curPage,
              data: trimmedResults
            }
          })
        })
        .catch(err => {
          return res.json({
            code: ErrCode.DB_OP_FAIL,
            data: { err }
          })
        })
    }
  })


}