const logger = require("../../../app-srvr-js/lib/logger")

function formatNum ( n ){
  let strN = n.toString()

  if(strN.length<2){
    strN = '0' + strN
  }else if(strN.length>2){
    strN = strN.slice(strN.length - 2,strN.length)
  }
  return strN
}
/**
 * 
 * @param {*} mode 
 * 1 - year
 * 2 - day
 * 3 - for custid
 */

// MMDDHHMMSS
module.exports = (mode)=>{
  let t = new Date()
  console.log(t)

  let yy = formatNum(t.getFullYear())

  let mm = formatNum(t.getMonth()+1);
  // console.log(mm)

  let dd = formatNum(t.getDate())
  // console.log(dd)

  let hh = formatNum(t.getHours())
  // console.log(hh)

  let mi = formatNum(t.getMinutes())
  // console.log(mi)

  let se = formatNum(t.getSeconds())
  // console.log(se)

  let ms = formatNum(t.getMilliseconds())

  if(mode === 1){
    return yy + mm + dd + hh + mi
  }else if(mode === 2){
    return mm + dd + hh + mi + se 
  }else if(mode === 3 ){
    return yy + mm + dd + hh + mi + se + ms 
  }else{
    throw new Error('gettimestamp mode unrecognized ' + mode)
  }

}