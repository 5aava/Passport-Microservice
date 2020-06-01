import express from 'express';
import server from '../src/config/config.server';

import { me } from './api/authorized/me';
import { changedata } from './api/authorized/changedata';
import { changepass } from './api/authorized/local/changepass';

import MiddlewareController from './controllers/middleware';
import { check } from 'express-validator';


const router = express.Router();

router.post('/me', me);

// changedata
router.post('/changedata', [
  check('name').isLength({
    min: server.validation.name.lenght.min,
    max: server.validation.name.lenght.max,
  }),
], MiddlewareController, changedata);

// changepass
router.post('/changepass', [
  check('newPassword').exists().isLength({
    min: server.validation.password.lenght.min,
    max: server.validation.password.lenght.max,
  }),
], MiddlewareController, changepass);


export default router;
