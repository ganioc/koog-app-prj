const verifyAgent = require("../permission").verifyAgent;
const authJWT = require('../jwt')
const dashboard = require('./components/dashboard')
const getUsers = require('./components/getusers')
const getActions = require('./components/getactions')
const createUser = require('./components/createuser')
const getUser = require('./components/getuser')
const setUser = require('./components/setuser')
const deleteUser = require('./components/deleteuser')
const smshistory = require('./components/smshistory')
const msgtons = require('./components/msgtons')

let func = (router) => {
  router.get('/api/agent/dashboard', authJWT, verifyAgent, dashboard);
  router.get('/api/agent/getusers', authJWT, verifyAgent, getUsers);
  router.get('/api/agent/getuser', authJWT, verifyAgent, getUser);
  router.get('/api/agent/getactions', authJWT, verifyAgent, getActions);
  // /api/agent/sms/history
  router.get('/api/agent/sms/history', authJWT, verifyAgent, smshistory);
  router.get('/api/agent/sms/msgtons', authJWT, verifyAgent, msgtons);

  // create new user
  router.post('/api/agent/createuser', authJWT, verifyAgent, createUser)
  router.post('/api/agent/setuser', authJWT, verifyAgent, setUser)
  router.post('/api/agent/deleteuser', authJWT, verifyAgent, deleteUser)
}

module.exports = func;
