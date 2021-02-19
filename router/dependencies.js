const CheckAuth = require('./use-cases/check-auth');

const checkAuth = new CheckAuth({
  allowedGroups: process.env.ALLOWED_GROUPS.split(',')
});

const checkBasicAuth = new CheckAuth({
  allowedGroups: process.env.BASIC_ALLOWED_GROUPS.split(',')
});

module.exports = { checkBasicAuth, checkAuth };
