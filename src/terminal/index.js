const prompts = require('prompts');
const DB = require('./db')

const onCancel = () => {
  console.log('quit')
  process.exit(1)
}

const cfgObj = require('../../config/config.json')
console.log('config:')
console.log(cfgObj)

const arg = {
  mongo_db:cfgObj.mongo_db,
  mongo_user: cfgObj.mongo_user,
  mongo_passwd: cfgObj.mongo_passwd,
  mongo_dbname: cfgObj.mongo_dbname,
  mongo_ip:'127.0.0.1',
  mongo_port:'27011',
}

let dbi = new DB(arg);

async function handleCmd(cmds, cb) {

  let words = cmds.replace(/\s+/g, ' ').split(' ');

  if (words.length < 1) {
    return;
  }
  const cmd1 = words[0].toLowerCase();
  const args = words.splice(1, words.length - 1)

  console.log('cmd:', cmd1)
  console.log('args:', args)

  switch (cmd1) {
    case 'list':
      dbi.cmdList(args, cb);
      break;
    case 'add':
      dbi.cmdAdd(args, cb);
      break;
    case 'create':
      dbi.cmdCreateUserinfo(args, cb);
      break;
    case 'delete':
      dbi.cmdDelete(args, cb);
      break;
    case 'modify':
      dbi.cmdModify(args, cb);
      break;
    case 'q':
    case 'quit':
    case 'quit()':
      console.log('Bye\n');
      dbi.close();
      await new Promise((resolve)=>{
        setTimeout(()=>{
          resolve()
        },1000)
      })
      process.exit(0);
      break;
    default:
      console.log('Unknown cmds:', cmd1)
      cb(null);
      break;
  }
}


(async () => {
  await new Promise((resolve) => {
    console.log('To delay');
    setTimeout(() => {
      console.log('Delay over\n');
      resolve();
    }, 2000);
  });
  console.log('To prompts');

  while (true) {
    const response = await prompts({
      type: 'text',
      name: 'cmd',
      message: ''
      // validate: value => value< 18?'Nightclub is 18+ only': true
    },
      { onCancel })

    console.log(response)
    await new Promise((resolve, reject) => {
      handleCmd(response.cmd, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    }).catch(err => {
      console.log('ERR:', err);
    });
  }

})();

