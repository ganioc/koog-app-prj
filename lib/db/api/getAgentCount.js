const logger = require("../../logger")
const AgentModel = require('../../../db/model/agent')
const ErrCode = require('../../../err')

module.exports = () => {
  logger.debug('getAgentCount()');

  new Promise((resolve) => {
    AgentModel.countDocuments({},
      (err, count) => {
        if (err) {
          resolve({ code: ErrCode.DB_QUERY_FAIL, data: {} })
        } else {
          resolve({ code: 0, data: count })
        }
      })
  })
}