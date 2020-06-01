import server from '../../../config/config.server';
import { Users, Auths } from '../../../database/models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserAttributes } from '../../../modules/utils';


export const changepass = (req, res) => {

  let token = req.body.token ? req.body.token : req.headers['x-api-key'];
  let decoded = jwt.verify(token, server.jwtkey);

  let newPassword = req.body.newPassword;

  Users.findOne({
    where: {
      email: decoded.email,
    },
    attributes: getUserAttributes(),
  }).then(user => {
    if (!user) {return server.sendError(res, 404);}

    Auths.findOne({
      where: {
        userId: user.id,
        type: 'local',
      },
    }).then(auth => {
      if (!auth) {return server.sendError(res, 404);}

      bcrypt.hash(newPassword, 12).then(newhash => {
        auth.update({
          password: newhash,
        }).then(()=>{
          return server.sendOk(res, user);
        });
      });

    });
  });
};
