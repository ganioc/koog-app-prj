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

// test urlencode
// debug: 'userid=M00004&mobile=18621661947&custid=20070609430147-0904&content=Hello%20123456%E3%80%90%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB%E3%80%91&pwd=9d68ddce769a9596dcae8b9d3fdc4627&timestamp=2007060943'

let sms ='Hello 123456【本来生活】'
console.log(urlencode.encode(sms))
// Hello%20123456%E3%80%90%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB%E3%80%91
let gbkSms = urlencode.encode(sms, 'GBK')
console.log('gbk:')
console.log(gbkSms)
let utf8Sms = urlencode.encode(sms,'utf8')
console.log('')

