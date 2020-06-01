import server from '../../src/config/config.server';
import jwt from 'jsonwebtoken';


export const AuthController = (err, req, res, next) => {

  var token = req.headers['x-api-key'];
  if (!token) {return server.sendError(res, 403);}

  jwt.verify(token, server.jwtkey, function (err) {
    if (err) {
      return server.sendError(res, 403);
    } else {
      next();
    };
  });

};

