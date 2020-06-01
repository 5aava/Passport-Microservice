import server from '../config/config.server';
import { Users, Auths } from '../database/models';
import { getIp, isValidType } from '../modules/utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as discord from '../modules/discord';


export function login (req, res) {

  let type = req.body.type;
  let email = req.body.email;
  let password = req.body.password;

  Users.findOne({
    where: {
      email: email,
    },
  }).then(user => {
    if (!user) {return server.sendError(res, 404);}
    if (!isValidType(type)) {return server.sendError(res, 403);}
    if (!user.isEmail) {
      return server.sendError(res, 403);
    }

    Auths.findOne({
      where: {
        userId: user.id,
        type: type,
      },
    }).then(auth => {
      if (!auth) {return server.sendError(res, 404);}

      bcrypt.compare(password, auth.password).then(match => {
        if (!match) {return server.sendError(res, 401);}

        let jwttoken = jwt.sign({ email: email }, server.jwtkey);
        user.update({ ip: getIp(req) });

        let data = {
          id: user.id,
          email: user.email,
          name: user.name,
          token: jwttoken,
        };

        if (server.discord.active && process.env.ENV != 'test') {
          let message = `User ${user.name} ${user.email} logged in`;
          discord.sendhook(message);
        }

        return server.sendOk(res, data);
      });
    });

  });
}
