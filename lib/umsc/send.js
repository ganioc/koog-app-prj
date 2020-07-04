const getQueryString = require('./getquerystring')
const querystring = require('querystring');
const util = require('util')
const logger = require('../logger')
const request = require('request');

function send(form, url, callback) {
  logger.debug('send:')
  let formData = querystring.stringify(form);
  // let formData = getQueryString(form)
  logger.debug('formData:');
  logger.debug(util.format('%o', formData));

  let contentLength = formData.length;
  logger.debug('formData len: ' + contentLength)

  // console.log('\nSend msg out');
  request({
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    uri: url,
    body: formData,
    method: 'POST'
  }, (err, res, body) => {
    if (err) {
      // logger.error(util.format('%o', err))
      callback(err);
    } else {
      // logger.debug('receive OK')
      // logger.debug(util.format('%o', body))
      callback(null, res, body);
    }
  });
}

module.exports = send