import { name, version } from '../package.json';
import Router from 'koa-router';

const router = new Router();
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const localStrategy = require('passport-local').Strategy;
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const options = {};
const yelp = require('yelp-fusion');
const searchRequest = {
  open_now: true,
  sort_by: 'distance',
  categories: 'bars',
  latitude: 30.265602,
  longitude: -97.749739
};
const apiKey = 'OajGsHzjCPKSBq38RccMn2xV-WaMReCMpGxZdzP0N0N_M8jnrqjwgfOcLqsnbsMplCJATa2W7UWKzkTnxR7moN2IZNiOVsBqZdP6AQ4hjnLnkagnDTds4nwm1J14WnYx';
const client = yelp.client(apiKey);
function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
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

passport.serializeUser((user, done) => {
  console.log('serial killa');
  done(null, user.id); });

passport.deserializeUser((id, done) => {
  console.log('ceral killed');
  if (id) {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
}
});

passport.use(new localStrategy(options, (email, password, done) => {
  knex('users').where({ email }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!comparePass(password, user.hashed_password)) {
      console.log('1');
      return done(null, false);
    } else {
      console.log('2');
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));


let butthead = function() {
return client.search(searchRequest).then(response => {
const firstResult = response.jsonBody;
const prettyJson = JSON.stringify(firstResult, null, 4);
console.log(firstResult);
return firstResult;
}).catch(e => {
console.log(e);
});
}

/*
 * GET /
 */
router.get('/', async ctx => {

  try {
    const currLat = ctx.req.currLat;
    const currLon = ctx.req.currLon;
    const users = await knex('users').select('*');
    const parties = await knex('parties').select('*');
    const challenges = await knex('challenges').select('*')
    let bars = await butthead();
    ctx.body = {
      status: 'success',
      data: users, parties, challenges, bars,
    };
  } catch (err) {
    console.log(err)
  }
});

router.get('/challenges', async ctx => {

  try {
    const users = await knex('users').select('*');
    const parties = await knex('parties').select('*');
    const challenges = await knex('challenges').select('*');
    ctx.body = {
      status: 'success',
      data: users, challenges,
    };
  } catch (err) {
    console.log(err)
  }
});

router.get('/challenges/:id', async ctx => {

  try {
    let someDeet = ctx.params.id;
    const users = await knex('users').select('*');
    const parties = await knex('parties').select('*');
    const challenges = await knex('challenges').select('*').where({ id: ctx.params.id });
    ctx.body = {
      status: 'success',
      data: users, challenges,
    };
  } catch (err) {
    console.log(err)
  }
});

router.get('/users/:id', async ctx => {

  try {
    let someDeet = ctx.params.id;
    const users = await knex('users').select('*').where({ id: ctx.params.id });
    const parties = await knex('parties').select('*');
    const challenges = await knex('challenges').select('*');
    ctx.body = {
      status: 'success',
      data: users,
    };
  } catch (err) {
    console.log(err)
  }
});
// router.get('/challenges/:id', async ctx => {
//
//   try {
//     let someDeet = ctx.params.id;
//     const users = await knex('users').select('*');
//     const parties = await knex('parties').select('*');
//     const challenges = await knex('challenges').select('*').where({ id: ctx.params.id });
//     ctx.body = {
//       status: 'success',
//       data: users, challenges,
//     };
//   } catch (err) {
//     console.log(err)
//   }
// });

router.get('/parties', async ctx => {

  try {
    const users = await knex('users').select('*');
    const parties = await knex('parties').select('*');
    const userparty = await knex('user_party').select('*');
    const challenges = await knex('challenges').select('*');
    ctx.body = {
      status: 'success',
      data: parties,userparty
    };
  } catch (err) {
    console.log(err)
  }
});

router.post('/login', async ctx => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.body = {status:"logged in foo"};
    } else {
      ctx.status = 400;
      ctx.body = { status: err,user,info, status };
    }
  })(ctx);
});

router.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.body = {status:'I Logged out fool'};
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});



router.post('/new_challenge', async ctx => {
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

router.post('/new_party', async ctx => {
  try {
    const new_party = await knex('parties').insert(ctx.request.body).returning('*');
    if (new_party.length) {
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
