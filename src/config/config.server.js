require('dotenv').config();


module.exports = {
  clientkey: process.env.CLIENTKEY,
  jwtkey: process.env.JWTKEY,
  logs: {
    type: process.env.LOGS_TYPE,
    path: process.env.LOGS_PATH,
  },
  server: {
    protocol: process.env.SERVER_PROTOCOL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    domain: process.env.SERVER_DOMAIN,
  },
  validation: {
    password:   { lenght: { min:6, max:32 } },
    type:       { lenght: { min:5, max:32 } },
    name:       { lenght: { min:2, max:32 } },
  },
  discord: {
    active: false,
    WebHookId: process.env.DSICORD_ID,
    WebHookToken: process.env.DSICORD_TOKEN,
  },
  email: {
    active: true,
    secure: true,
    port: 465,
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
    from: process.env.EMAIL_FROM,
    redirectUrl: process.env.EMAIL_REDIRECT_URL,
  },
  test: {
    email: 'emailfortests@gmail.com',
    name: 'testname',
    password: 'testpassword',
  },
  sendError: (res, status) => {
    let errors = {
      401: '401: Authorization failed. Incorrect request data',
      403: '403: Forbinden. Incorrect request data',
      404: '404: Not found. Incorrect request data',
      409: '409: Conflict. Dublicate request data',
      500: '500: Internal server error',
    };
    return res.status(status).json({
      status: 'error',
      data: errors[status],
    });
  },
  sendOk: (res, data) => {
    return res.status(200).json({
      status: 'ok',
      data: data,
    });
  },
};
