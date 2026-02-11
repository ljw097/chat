// utils/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = 'MY_SECRET';

function sign(payload) {
  return jwt.sign(payload, SECRET);
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { sign, verify };