var path = require('path');
var appDir = path.dirname(require.main.filename);
const getBalance = require('../../lib/umsc/getbalance')
const getTimeStamp = require('../../lib/umsc/gettimestamp')

// console.log(appDir)

console.log('\ngetbalance test:')

getBalance()

