import server from '../../config/config.server';
import { Users } from '../../database/models';
import jwt from 'jsonwebtoken';
import { getUserAttributes } from '../../modules/utils';


export const changedata = (req, res) => {

  let token = req.headers['x-api-key'];
  let decoded = jwt.verify(token, server.jwtkey);

  let isSubscribe = req.body.isSubscribe;
  let referral = req.body.referral;
  let name = req.body.name;

  Users.findOne({
    where: {
      email: decoded.email,
    },
    attributes: getUserAttributes(),
  }).then(user => {
    if (!user) {return server.sendError(res, 404);}

    if (isSubscribe === true) {user.update({ isSubscribe: true });}

    if (isSubscribe === false) {user.update({ isSubscribe: null });}

    if (referral) {user.update({ referral: referral });}

    if (name) {user.update({ name: name });}

    return server.sendOk(res, user);
  });

};
