export const getIp = req => {

  let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

  ip = ip.replace(/^.*:/, '');

  return ip;
};

export const isValidType = type => {
  let flag = false;
  if (type == 'local') {flag = true;}
  if (type == 'google') {flag = true;}
  if (type == 'facebook') {flag = true;}

  return flag;
};

export const getUserAttributes = () => {
  return [
    'id',
    'name',
    'email',
    'isEmail',
    'isSubscribe',
    'referral',
  ];
};

