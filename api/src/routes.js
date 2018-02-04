import { name, version } from '../package.json';
import Router from 'koa-router';

const router = new Router();
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const localStrategy = require('passport-local').Strategy;
const session = require('koa-session');
const bodyParser = require('koa-bodyparser')
passport.use('local', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {

    knex('users').where('email', email)  //find user where email = input email
    .then (function (results, err) {

      if (err) {
        return done(err);
      }
      if (!results[0].email) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      //compare hashed password in database against password entered
      bcrypt.compare(password, results[0].hashed_password)
            .then(function(results) {
              if (!results) {
                  return done(null, false, req.flash('loginMessage', 'Wrong password.'))
              }
            })

        return done(null, results);

    })

}));




//serialize user for the session -- keep them logged in
passport.serializeUser(function(user, done) {
  console.log('i am serializedddddddddddd')
  console.log(user, 'serial user')
  done(null, user);

})


passport.deserializeUser(function(id, done) {
console.log('im deserialized boooooooo')
  knex('users').where('id', id[0].id)
    .then(function(results) {
      if (results) {
        done(null, results[0].id)
      }
    })
})
/**
 * GET /
 */
router.get('/', async ctx => {
  try {
    const users = await knex('users').select('*');
    ctx.body = {
      status: 'success',
      data: users
    };
  } catch (err) {
    console.log(err)
  }
});

router.post('/login', async ctx => {
  return passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  successFlash: true,
  failureFlash: true

})(ctx);
});

router.post('/register', async ctx => {
  const saltRounds = 10;
  try {

  const new_user = await knex('users')
        .insert({
          email: ctx.request.body.email,
          hashed_password: bcrypt.hashSync(ctx.request.body.password, saltRounds),
          profile_photo: ctx.request.body.profile_photo,
          full_name: ctx.request.body.full_name,
          location: ctx.request.body.location,
        })
        .returning('*');

    if (new_user.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: ctx.request.body
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: request.body || 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message:  err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.post('/create', async ctx => {
  try {
    const new_challenge = await knex('challenges').insert(ctx.request.body).returning('*');
    if (new_challenge.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: ctx.request.body
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: ctx.request.body || 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: ctx.request.body || 'Sorry, an error has occurred.'
    };
  }
})



export default router;
