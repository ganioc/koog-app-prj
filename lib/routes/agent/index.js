const  verifyAgent  = require("../permission").verifyAgent;
const authJWT = require('../jwt')
const dashboard = require('./components/dashboard')


let func = (router) => {
  router.get('/api/agent/dashboard', authJWT, verifyAgent, dashboard);
  
}

module.exports = func;
