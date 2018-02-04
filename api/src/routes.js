import { name, version } from '../package.json';
import Router from 'koa-router';

const router = new Router();
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
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

export default router;
