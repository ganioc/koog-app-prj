

module.exports = (obj)=>{
  let keys = Object.keys(obj)
  let out = []

  for(let i=0; i< keys.length; i++){
    out.push(keys[i] + '=' + obj[keys[i]])
  }
  let str = out.join('&')
  // console.log('getQuerystring()')
  // console.log(str)
  return str
}