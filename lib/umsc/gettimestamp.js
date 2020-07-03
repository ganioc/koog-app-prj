
function formatNum ( n ){
  let strN = n.toString()

  if(strN.length<2){
    strN = '0' + strN
  }else if(strN.length>2){
    strN = strN.slice(strN.length - 2,strN.length)
  }
  return strN
}

// MMDDHHMMSS
module.exports = ()=>{
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

  return yy+ mm+dd+hh+mi
  // return mm + dd + hh + mi +se 

}