const getTimeStamp = require('../../lib/umsc/gettimestamp')
const getSecretStr = require('../../lib/umsc/getsecretstr')

getSecretStr('J10003', '111111', '0803192020')

let timeStamp = getTimeStamp()
console.log('M00004','Yd7Uh9', timeStamp)
getSecretStr('M00004', 'Yd7Uh9', timeStamp)