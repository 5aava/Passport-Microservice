import server from '../../config/config.server';
import { Users } from '../../database/models';
import jwt from 'jsonwebtoken';
import { getUserAttributes } from '../../modules/utils';


export const me = (req, res) => {

  let token = req.headers['x-api-key'];
  let decoded = jwt.verify(token, server.jwtkey);

  Users.findOne({
    where: {
      email: decoded.email,
    },
    attributes: getUserAttributes(),
  }).then(user => {
    if (!user) {return server.sendError(res, 404);}

    return server.sendOk(res, user);
  });

};

