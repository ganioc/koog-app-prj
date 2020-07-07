
let funCheckMobile = (mobile) => {
  // sometimes you will get 86130xxxxxxxx, 
  let out = mobile;
  if (out.length > 11) {
    out = out.slice(out.length - 11)
  }
  return out;
}


module.exports = {
  checkMobile: funCheckMobile,
  checkMobiles: (mobileArr) => {
    let outs = []

    for (let i = 0; i < mobileArr.length; i++) {
      let mobile = funCheckMobile(mobileArr[i])
      outs.push(mobile)
    }

    return outs;
  },
  getBalanceUrl: (platform) =>{
    let url = 'http://'
      + platform.IP
      + ':'
      + platform.PORT
      + platform.GET_BALANCE_URL
    console.log('balance url:', url)
    return url
  },
  getSingleSendUrl: (platform) =>{
    let url = 'http://'
      + platform.IP
      + ':'
      + platform.PORT
      + platform.SINGLE_URL
    console.log('single send url:', url)
    return url
  },
  getBatchSendUrl: (platform) => {
    let url = 'http://'
      + platform.IP
      + ':'
      + platform.PORT
      + platform.BATCH_URL
    console.log('batch send url:', url)
    return url
  },
  getRptUrl: (platform) => {
    let url = 'http://'
      + platform.IP
      + ':'
      + platform.PORT
      + platform.RPT_URL
    console.log('rpt url:', url)
    return url
  }
}