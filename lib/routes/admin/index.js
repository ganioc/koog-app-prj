
const authJWT = require('../jwt')
const verifyAdmin = require('../permission').verifyAdmin

const deleteuser = require('./components/deleteuser')
const createUser = require('./components/createuser')
const setUser = require('./components/setuser')
const smsHistory = require('./sms/history')
const smsMsgton = require('./sms/getmsgton')
const msgInfo = require('./components/msginfo')
const getUsers = require('./components/getusers')
const getUser = require('./components/getuser')
const users = require('./components/users')
const infolib = require('./components/info.js')
const getactions = require('./components/getactions')
const dashboard = require('./components/dashboard')
const getAgents = require('./components/getagents')
const createAgent = require('./components/createagent')
const setAgent = require('./components/setagent')
const deleteagent = require('./components/deleteagent')
const msgtonInfo = require('./components/msgtoninfo')

let func = (router) => {
  router.get('/api/admin/dashboard', authJWT, verifyAdmin, dashboard);

  router.get('/api/admin/users', authJWT, verifyAdmin, users);

  // get balance 
  router.get('/api/admin/info', authJWT, verifyAdmin, infolib);

  // getUsers 
  router.get('/api/admin/getusers', authJWT, verifyAdmin, getUsers)

  // getAgents 
  router.get('/api/admin/getagents', authJWT, verifyAdmin, getAgents)

  // get user
  router.get('/api/admin/getuser', authJWT, verifyAdmin, getUser);

  // create new user
  router.post('/api/admin/createuser', authJWT, verifyAdmin, createUser)

  // create new agent
  router.post('/api/admin/createagent', authJWT, verifyAdmin, createAgent)
  router.post('/api/admin/setagent', authJWT, verifyAdmin, setAgent)
  router.post('/api/admin/deleteagent', authJWT, verifyAdmin, deleteagent)

  // set  user
  router.post('/api/admin/setuser', authJWT, verifyAdmin, setUser)

  // hook deleteuser 
  // deleteuser(router);
  router.post('/api/admin/deleteuser', authJWT, verifyAdmin, deleteuser)

  router.get('/api/admin/sms/history', authJWT, verifyAdmin, smsHistory)
  router.get('/api/admin/sms/msgton', authJWT, verifyAdmin, smsMsgton)
  router.get('/api/admin/msginfo', authJWT, verifyAdmin, msgInfo)
  router.get('/api/admin/msgtoninfo', authJWT, verifyAdmin, msgtonInfo)
  router.get('/api/admin/getactions', authJWT, verifyAdmin, getactions)
}


module.exports = func;