const nodemailer = require('nodemailer');
const config = require('../config');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

class MailService {
  //@desc send mail
  async sendVerificationEmail (email) {
    const adminAccount = {
      service : 'gmail',
      host : 'smtp.gmail.com',
      port: 587,
      secure : false,
      auth: {
        user: config.mailId,
        pass: config.mailPassword,
      }
    };

    const transporter = nodemailer.createTransport(adminAccount);
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    const verificationCode = Math.floor(100000+Math.random()*900000);

    const mailOptions =  {
      to: email,
      subject: 'YAMSpoon 인증 이메일',
      text: `메일 인증을 완료하려면 다음 인증번호를 입력하세요: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    return verificationCode;
  }
}

module.exports = new MailService ();