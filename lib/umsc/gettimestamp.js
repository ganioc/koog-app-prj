
function formatNum ( n ){
  let strN = n.toString()

  if(strN.length<2){
    strN = '0' + strN
  }
  return strN
}

// MMDDHHMMSS
module.exports = ()=>{
  let t = new Date()
  console.log(t)

  let mm = formatNum(t.getMonth()+1);
  console.log(mm)

  let dd = formatNum(t.getDate())
  console.log(dd)

  let hh = formatNum(t.getHours())
  console.log(hh)

  let mi = formatNum(t.getMinutes())
  console.log(mi)

  let se = formatNum(t.getSeconds())
  console.log(se)

  return mm+dd+hh+mi+se

}