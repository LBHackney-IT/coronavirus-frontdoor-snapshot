const server = require('restana')();
const app = require('next')({ dev: false });
const files = require('serve-static');
const path = require('path');
const nextRequestHandler = app.getRequestHandler();
const { checkAuth, checkBasicAuth } = require('./dependencies');

server.use(require('cookie-parser')());
server.use(files(path.join(__dirname, 'build')));
server.use(files(path.join(__dirname, 'public')));

// public routes
server.all('/api/resources', (req, res) => nextRequestHandler(req, res)); // auth is handled by the authorizer
server.all('/api/prompts', (req, res) => nextRequestHandler(req, res)); // auth is handled by the authorizer
server.all('/api/resources/fss', (req, res) => nextRequestHandler(req, res)); // auth is handled by the authorizer
server.all('/api/referrals', (req, res) => nextRequestHandler(req, res)); // auth is handled by the authorizer
server.all(
  '/api/*',
  (req, res, next) => apiAuthoriseHandler(req, res, next),
  (req, res) => nextRequestHandler(req, res)
); // auth is handled by the authorizer
server.all('/_next/static/*', (req, res) => nextRequestHandler(req, res)); // next generated js and css
server.all('/js/*', (req, res) => nextRequestHandler(req, res)); // public js
server.all('/assets/*', (req, res) => nextRequestHandler(req, res)); // public assets
server.all('/favicon.ico', (req, res) => nextRequestHandler(req, res)); // favicon

const authoriseHandler = (req, res, next) => {
  const isAuthenticated = checkAuth.execute({
    token: req.cookies.hackneyToken
  });
  if (!isAuthenticated && req.url !== '/loggedout') {
    res.writeHead(302, { Location: '/loggedout' });
    return res.end();
  }
  next();
};

const basicAuthoriseHandler = (req, res, next) => {
  const isAuthenticated = checkBasicAuth.execute({
    token: req.cookies.hackneyToken
  });
  if (!isAuthenticated && req.url !== '/loggedout') {
    res.writeHead(302, { Location: '/loggedout' });
    return res.end();
  }
  next();
};

const apiAuthoriseHandler = (req, res, next) => {
  const isAuthenticated = checkAuth.execute({
    token: req.cookies.hackneyToken
  });
  if (!isAuthenticated) {
    res.writeHead(403);
    return res.end();
  }
  next();
};

// private routes
server.all(
  '/',
  (req, res, next) => basicAuthoriseHandler(req, res, next),
  (req, res) => nextRequestHandler(req, res)
);

server.all(
  '*',
  (req, res, next) => authoriseHandler(req, res, next),
  (req, res) => nextRequestHandler(req, res)
);

if (process.env.ENV === 'dev') {
  server.start(process.env.PORT || 3000).then(s => {});
} else {
  module.exports.handler = require('serverless-http')(server);
}
