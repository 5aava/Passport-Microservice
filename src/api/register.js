import server from '../config/config.server';
import { Users, Auths } from '../database/models';
import { getIp, isValidType } from '../modules/utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendBySmtp } from '../modules/sendemail';
import { emailVerifyHtml } from '../modules/templates';

import * as discord from '../modules/discord';


export function register (req, res) {

  let type = req.body.type;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let isSubscribe = req.body.isSubscribe ? req.body.isSubscribe : null;
  let referral = req.body.referral ? req.body.referral : null;

  Users.findOne({
    where: {
      email: email,
    },
  }).then(find_user => {
    if (find_user) {return server.sendError(res, 409);}
    if (!isValidType(type)) {return server.sendError(res, 403);}

    Users.create({
      name: name,
      email: email,
      ip: getIp(req),
      isSubscribe: isSubscribe,
      referral: referral,
    }).then(user => {
      if (!user) {return server.sendError(res, 404);}

      bcrypt.hash(password, 12).then(hash => {

        Auths.create({
          type: type,
          userId: user.id,
          password: hash,
        }).then(() => {

          if (process.env.ENV != 'test') {
            // send email
            if (server.email.active) {
              let emailToken = jwt.sign({ verifyEmail: email }, server.jwtkey, { expiresIn: '1d' });
              let preparedTemplate = emailVerifyHtml(email, emailToken, user.name);
              sendBySmtp(email, preparedTemplate);
            }

            // send discord
            if (server.discord.active) {
              let message = `New user ${user.name} ${user.email} registered`;
              discord.sendhook(message);
            }
          }

          let data = {
            email: user.email,
            name: user.name,
            message: 'Please confirm your email',
          };

          return server.sendOk(res, data);
        });
      });

    });
  });
}
