const md5hex = require('md5-hex');

const FIXED_STR = '00000000'

module.exports = (userid, pwd, timestamp)=>{
  
  let origin = userid + FIXED_STR + pwd + timestamp
  console.log('origin:', origin)
  let salted = md5hex(origin)
  console.log('salted:', salted)
  return salted
}