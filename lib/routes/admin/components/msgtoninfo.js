const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

const MsgtonModel = require('../../../db/model/msgton')

module.exports = async (req, res) => {
  logger.debug('/api/admin/msgtoninfo:')

  MsgtonModel.countDocuments(
    {},
    (err, count) => {
      if (err) {
        logger.error('DB count query failed')
        logger.error(util.format('%o', err))
        res.json({
          code: ErrCode.DB_OP_FAIL,
          data: {}
        })
        return
      }
      res.json({
        code: 0,
        data: {
          msgtoncount: count
        }
      })
    }
  )
}
