'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _koa = require('koa');var _koa2 = _interopRequireDefault(_koa);
var _cors = require('@koa/cors');var _cors2 = _interopRequireDefault(_cors);
var _koaMorgan = require('koa-morgan');var _koaMorgan2 = _interopRequireDefault(_koaMorgan);
var _koaBodyparser = require('koa-bodyparser');var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);
var _routes = require('./routes');var _routes2 = _interopRequireDefault(_routes);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const app = new _koa2.default();
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('koa-session');

app.use(passport.initialize());
app.use(passport.session());
app.keys = ['super-secret-key'];
app.use(session(app));


// Set middlewares
app.use((0, _koaBodyparser2.default)());

// Logger
app.use(
(0, _koaMorgan2.default)('dev', {
  skip: () => app.env === 'test' }));



// Enable CORS
app.use((0, _cors2.default)());

// Default error handler middleware
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      statusCode: ctx.status,
      message: err.message };

    ctx.app.emit('error', err, ctx);
  }
});

// Routes
app.use(_routes2.default.routes());exports.default =

app;
//# sourceMappingURL=app.js.map