const  verifyAgent  = require("../permission").verifyAgent;
const authJWT = require('../jwt')
const dashboard = require('./components/dashboard')
const getUsers = require('./components/getusers')

let func = (router) => {
  router.get('/api/agent/dashboard', authJWT, verifyAgent, dashboard);
  router.get('/api/agent/getusers', authJWT, verifyAgent, getUsers);
  
}

module.exports = func;
