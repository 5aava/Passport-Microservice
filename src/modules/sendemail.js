import server from '../../src/config/config.server';
import nodemailer from 'nodemailer';
import { Users, Emails } from '../database/models';


export const sendBySmtp = (email, template) => {

  let transporter = nodemailer.createTransport({
    host: server.email.host,
    port: server.email.port,
    secure: server.email.secure,
    auth: {
      user: server.email.user,
      pass: server.email.pass,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: server.email.from,
    to: email,
    subject: template.subject,
    html: template.html,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);

  Users.findOne({
    where: {
      email: email,
    },
  }).then(user=>{
    if (!user) {return server.sendError(res, 404);}
    Emails.create({
      userId: user.id,
      params: {
        userId: user.id,
        email: email,
        subject: template.subject,
      },
    });
  });

};
