import server from '../config/config.server';
import { Users } from '../database/models';
import jwt from 'jsonwebtoken';


export function verificate (req, res) {

  let decoded = jwt.verify(req.query.token, server.jwtkey);

  console.log(req.query.token);
  console.log(decoded);

  Users.findOne({
    where: {
      email: decoded.verifyEmail,
      isEmail: null,
    },
  }).then(user => {
    if (!user) {return server.sendError(res, 404);}

    user.update({
      isEmail: 1,
    }).then(() => {
      return res.status(302).redirect(server.email.redirectUrl);
    });

  });
}
