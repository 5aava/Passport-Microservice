import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import server from '../src/config/config.server';

import MiddlewareController from './controllers/middleware';
import { AuthController } from './controllers/authcontrol';
import * as ErrorController from './controllers/errorscontrol';
import { check } from 'express-validator';

import morgan from 'morgan';
import routes from './routes';

import { login } from './api/login';
import { register } from './api/register';
import { verificate } from './api/verificate';


const app = express();
const protocol = server.server.protocol;
const host = server.server.host;
const port = process.env.ENV == 'test' ? 5000 : server.server.port;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

if (process.env.ENV != 'test') {app.use(morgan('combined'));}

// add a basic route
app.get('/ping', (req, res) => {
  return server.sendOk(res, 'pong');
});

// clientkey
app.post('*', [
  check('clientkey').custom(value => value === server.clientkey),
], MiddlewareController);


// login
app.post('/login', [
  check('email').exists().isEmail(),
  check('type').exists().isLength({
    min: server.validation.type.lenght.min,
    max: server.validation.type.lenght.max,
  }),
  check('password').exists().isLength({
    min: server.validation.password.lenght.min,
    max: server.validation.password.lenght.max,
  }),
], MiddlewareController, login);

// register
app.post('/register', [
  check('email').exists().isEmail(),
  check('name').exists().isLength({
    min: server.validation.name.lenght.min,
    max: server.validation.name.lenght.max,
  }),
  check('type').exists().isLength({
    min: server.validation.type.lenght.min,
    max: server.validation.type.lenght.max,
  }),
  check('password').exists().isLength({
    min: server.validation.password.lenght.min,
    max: server.validation.password.lenght.max,
  }),
], MiddlewareController, register);

// verificate email
app.get('/verificate', verificate);

// API routes
app.use('/auth', AuthController, routes);


// Error Handling
app.get('/servererror', ErrorController.serverError);
app.get('/buggyroute', ErrorController.buggyRoute);

app.use(ErrorController.errorHandler);
app.use(ErrorController.nullRoute);

app.listen(port, host, () => {
  console.log(`Server listening on ${protocol}://${host}:${port}`);
});

module.exports = app;
