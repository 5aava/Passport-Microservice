import fs from 'fs';
import mustache from 'mustache';
import server from '../../src/config/config.server';

const appName = 'TEST APP';
const appContacts = 'Test contacts';


export const emailVerifyHtml = (email, emailToken, userName) => {

  let content = fs.readFileSync(__dirname + '/templates/email.html', 'utf8');
  let view = {
    userName: userName,
    appName: appName,
    emailText: `Thanks for signing up for ${appName}! We hope you will be our regular user.`,
    buttonText: 'Verify Email',
    appLink: server.server.protocol + '://' + server.server.domain + ':' + server.server.port +
            '/verificate?email=' + email + '&token=' + emailToken,
    appContacts: appContacts,
  };

  var output = mustache.render(content, view);

  return {
    subject: 'Please verify your email',
    html: output,
  };
};


export const emailResetPassHtml = (email, emailToken, userName) => {

  let content = fs.readFileSync(__dirname + '/templates/email.html', 'utf8');
  let view = {
    userName: userName,
    appName: appName,
    emailText: 'If you want to change your password, click button to verify your email! </p>',
    buttonText: 'Reset password',
    appLink: server.server.protocol + '://' + server.server.url +
            '/resetpass?email=' + email + '&token=' + emailToken,
    appContacts: appContacts,
  };

  var output = mustache.render(content, view);

  return {
    subject: 'Reset password',
    html: output,
  };
};
