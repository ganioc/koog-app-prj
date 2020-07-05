const Queue = require('bullmq').Queue;
const assert=require('assert')
const defaultQueueName = 'DefaultQueue'
const defaultJobName = 'DefaultJob'
const singleMsgJobName = 'singleMsg'
const multiMsgJobName = 'multiMsg'

assert(process.env.SECRET_REDIS, 'SECRET_REDIS undefined')
assert(process.env.HOST_REDIS, 'HOST_REDIS undefined')
assert(process.env.PORT_REDIS, 'PORT_REDIS undefined')

const defaultQueue = new Queue(defaultQueueName, 
  {
  connection:{
  host: process.env.HOST_REDIS,
  port: parseInt(process.env.PORT_REDIS),
  password:process.env.SECRET_REDIS
}
}
)

module.exports = {
  SEND_DELAY: 30000,
  DEFAULT_QUEUE_NAME: defaultQueueName,
  DEFAULT_JOB_NAME: defaultJobName,
  SINGLE_MSG_JOB: singleMsgJobName,
  MULTI_MSG_JOB: multiMsgJobName,
  // send a default job out
  sendDefaultQueue: async (data) => {
    return defaultQueue.add(defaultJobName, data)
  },
  /** data:
   * username
   * mobiles  // [mobile] 只有一个电话号码
   * content  // 短信内容
   * data { 发送回来的数据原样 } object
   */
  sendSingleMsg: async (data) => {
    return defaultQueue.add(singleMsgJobName, data)
  },
  sendMultiMsg: async (data) => {
    return defaultQueue.add(multiMsgJobName, data)
  }
}