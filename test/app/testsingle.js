const cfgObj = require('../../config/config.json')
const faci = require('../../lib/facility')

console.log('config:')
console.log(cfgObj)

let platform = cfgObj.platform
let userid = platform.ACCOUNT
let pwd = platform.PWD


