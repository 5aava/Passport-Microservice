import server from '../../../config/config.server';
import { Users, Auths } from '../../../database/models';
import jwt from 'jsonwebtoken';
import { getUserAttributes } from '../../../modules/utils';
import { emailResetPassHtml } from '../modules/templates';


export const resetpass = (req, res) => {

  let email = req.body.email;

  Users.findOne({
    where: {
      email: email,
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

      let emailToken = jwt.sign({ email: email }, server.jwtkey, { expiresIn: '1d' });
      let preparedTemplate = emailResetPassHtml(email, emailToken, user.name);
      sendBySmtp(email, preparedTemplate);

      let data = {
        id: user.id,
        email: user.email,
        name: user.name,
        message: 'We are sent reset link to confirm your email',
      };

      return server.sendOk(res, data);

    });
  });
};
