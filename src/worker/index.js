
/**
 * 
 * 这是一个永远在运行的任务，每隔5秒钟执行一次
 * 
 * get_rpt
 * 
 * Save the result to db
 * 
 */
const logger = require('../../lib/logger')
const assert = require('assert')
const getRpt = require('../../lib/umsc/getrpt')
const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')
const handleRpt = require('../../lib/db/api/handlerpt')

assert(process.env.WORKER_DELAY, 'WORKER_DELAY undefined')
const DELAY = parseInt(process.env.WORKER_DELAY)

assert(process.env.FETCH_NUM, "FETCH_NUM undefined")
const fetchNum = parseInt(process.env.FETCH_NUM)

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD


let work = ()=>{
  return new Promise((resolve)=>{
    logger.debug('get the report')

    getRpt(true, userid,
      pwd,
      faci.getRptUrl(platform),
      fetchNum,
      async (err, res, body) => {
        if (err) {
          logger.error('wrong getRpt')

        } else {
          // console.log('body:', body)
          try {
            let bodyObj = JSON.parse(body);
            logger.debug('result:'+ bodyObj.result)
            logger.debug('len:'+ bodyObj.rpts.length)

            if (bodyObj.result === 0) {
              for (let i = 0; i < bodyObj.rpts.length; i++) {
                logger.debug('No ' + i)
                await handleRpt(bodyObj.rpts[i])
              }
            }

          } catch (e) {
            console.log('wrong parsing body')
          }
        }

        resolve('OK')
      }
    )

  })
}

let main = async function main(){
  await new Promise((resolve) =>{
    setTimeout( ()=> {
      logger.info('worker triggered')
      resolve();
    }, DELAY);
  })

  await work()
  main()
}

 main()

 


