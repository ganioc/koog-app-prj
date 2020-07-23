const logger = require('../../lib/logger')
// const assert = require('assert')
const getRpt = require('../../lib/umsc/getrpt')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
const handleRpt = require('../../lib/db/api/handlerpt')
const assert = require('assert')
const mongoose = require('mongoose')
const util = require('util')

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD



assert(process.env.MONGO_IP, "MONGO_IP undefined")
assert(process.env.MONGO_PORT, "MONGO_PORT undefined")

let header = ''
let dbIp = process.env.MONGO_IP
let dbPort = process.env.MONGO_PORT
let dbName = cfgObj.mongo_dbname;


let uri = 'mongodb://'
  + header
  + dbIp
  + ':'
  + dbPort
  + '/' + dbName
  + '?replicaSet=rs0';

logger.debug('mongodb uri:');
logger.debug(uri);

mongoose.set('useCreateIndex', true) //加上这个
mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(error => {
    logger.error('Connection error')
    logger.error(util.format('%o', error));
    process.exit(1);
  });




async function main() {

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, 3000)
  })

  console.log('ready')

  getRpt(true, userid,
    pwd,
    faci.getRptUrl(platform),
    1,
    async (err, res, body) => {
      if (err) {
        logger.error('wrong getRpt')
        return
      }
      // console.log('body:', body)
      try {
        let bodyObj = JSON.parse(body);
        logger.debug('result:' + bodyObj.result)
        logger.debug('len:' + bodyObj.rpts.length)

        if (bodyObj.result === 0) {
          for (let i = 0; i < bodyObj.rpts.length; i++) {
            logger.debug('No ' + i)
            let rpt = bodyObj.rpts[i]

            if (rpt.status !== 0) {
              logger.info('pass msgid: ' + rpt.msgid)
              logger.info('mobile:' + rpt.mobile)
              logger.info('stime:' + rpt.stime)
              logger.info('rtime:' + rpt.rtime)
            } else {
              await handleRpt(rpt)
            }
          }
        }
      } catch (e) {
        console.log('wrong parsing body')
        logger.error(e.message)
      }
      logger.info('end of getrpt')
    }
  )
}

main()