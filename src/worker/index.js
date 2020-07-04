
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

assert(process.env.WORKER_DELAY, 'WORKER_DELAY undefined')
const DELAY = parseInt(process.env.WORKER_DELAY)

let work = ()=>{
  return new Promise((resolve)=>{
    console.log('get the report')
    resolve('OK')
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

 


