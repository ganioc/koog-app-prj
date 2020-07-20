const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan')
const util = require('util')
const assert = require('assert')

// routes
const authRouter = require('../../lib/routes/auth')
const adminRouter = require('../../lib/routes/admin')
const userRouter = require('../../lib/routes/user')
const authJWT = require('../../lib/routes/jwt')
const agentRouter = require('../../lib/routes/agent')

const ErrCode = require('../../lib/err')
const logger = require('../../lib/logger')


logger.error('================ start ===============')

////////////////////////////////////////////////
// assert(process.env.SECRET_KEY_JWT, "Undefined SECRET_KEY_JWT")

assert(process.env.MONGO_IP, "MONGO_IP undefined") 
assert(process.env.MONGO_PORT, "MONGO_PORT undefined") 
assert(process.env.PORT, "PORT undefined")


const MAX_SESSION_TIME = 3600000


const cfgObj = require('../../config/config.json');
logger.info('config:')
logger.info(util.format('%o', cfgObj))

if (!cfgObj) {
  logger.error('No config.json');
  process.exit(1);
}

let dbName = cfgObj.mongo_dbname;

let dbIp = process.env.MONGO_IP
let dbPort = process.env.MONGO_PORT

// let header = cfgObj.mongo_user + ':'
//   + encodeURIComponent(cfgObj.mongo_passwd) + '@';
let header = ''

let uri = 'mongodb://'
  + header
  + dbIp
  + ':'
  + dbPort
  + '/' + dbName
  + '?replicaSet=rs0';

logger.debug('mongodb uri:');
logger.debug(uri);

mongoose.set('useCreateIndex', true) //加上这个
mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(error => {
    logger.error('Connection error')
    logger.error(util.format('%o', error));
    process.exit(1);
  });


/////////////////////////////////////////


const app = express();

app.set('port', process.env.PORT || 3300)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use MongoStore session
app.use(session({
  resave: true, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  secret: cfgObj.sessionSecret,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  maxAge: MAX_SESSION_TIME
}));

// use morgan, http 
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr
}))

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout
}))

////////////////////////////////////


let router = new express.Router();
router.get('/api/test', (req, res) => {
  let data = {
    name: 'Jason Krol',
    website: 'http://kroltech.com'
  };
  res.json({ code: 0, data });
});

router.get('/api', authJWT, (req, res) => {
  let data = {
    name: 'api'
  };
  res.json({ code: ErrCode.NO_ERR, data });
});

authRouter(router);
adminRouter(router);
userRouter(router);
agentRouter(router);

app.use('/', router);

app.use('*', (req, res) => {

  res.json({
    code: 1,
    data: {
      name: null,
      url: req.url
    }
  });
})

app.listen(app.get('port'), '0.0.0.0', () => {
  logger.debug('Server up');
  logger.debug(app.get('port'))
});

