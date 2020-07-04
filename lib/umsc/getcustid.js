const getTimeStamp = require('./gettimestamp')
/**
 * custid is 64 bytes long
 * 10 bytes timestamp
 * 
 * timestamp with ms
 * 
 * + 4byts random num
 * 
 */
function getFourRandom(){
  let num = Math.random()
  let str = num.toString()
  console.log('getFourRandom()', str)

  return str.slice(2,6)
}

module.exports = () =>{
  let str = getTimeStamp(3) + '-' + getFourRandom()
  return str
}