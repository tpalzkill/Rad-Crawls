import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-morgan';
import bodyParser from 'koa-bodyparser';
import router from './routes';

const app = new Koa();
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
app.use(bodyParser());

// Logger
app.use(
  logger('dev', {
    skip: () => app.env === 'test'
  })
);

// Enable CORS
app.use(cors());

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
      message: err.message
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Routes
app.use(router.routes());

export default app;
