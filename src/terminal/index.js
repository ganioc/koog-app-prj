const prompts = require('prompts');

const onCancel = () => {
  console.log('quit')
  process.exit(1)
}

const cfgObj = require('../../config/config.json')
console.log('config:')
console.log(cfgObj)

