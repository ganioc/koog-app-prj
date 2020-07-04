var urlencode = require('urlencode');
const Iconv = require('iconv').Iconv

console.log('test urlencode')

let msg = '验证码：6666，打死都不要告诉别人哦！'

console.log(msg)
let out = urlencode.encode(msg)

console.log(out)

let outdec = urlencode.decode(out)

console.log(outdec)

let chara = '中文'
console.log(chara)
let charaOut = urlencode.encode(chara)
console.log(charaOut)
let charaDec = urlencode.decode(charaOut)
console.log(charaDec)

// let charaGbk = iconv.encode(chara, 'gbk')
// let charaGbkOut = urlencode.encode(charaGbk,'gbk')
// console.log(charaGbkOut)

// gbk
console.log('\nconversion')
let iconv = new Iconv('UTF-8', 'GBK')
let charaGbk = iconv.convert(chara)
console.log(charaGbk)
let charaGbkUrl = urlencode(chara, 'GBK')
console.log(charaGbkUrl)

console.log('\nConversion 2')
console.log(urlencode.encode(msg, 'GBK'))
console.log(urlencode.decode('%36','GBK'))
