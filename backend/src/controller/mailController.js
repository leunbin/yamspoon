const { mailService } = require('../service');
const nodemailer = require('nodemailer');
const config = require('../config');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const mailController = {

  //@desc send email
  //@route POST /auth/send-verification-email
  async sendEmail(req, res, next) {
    const { email } = req.body;
    try {
      const verificationCode = await mailService.sendVerificationEmail(email);

      req.session.verificationCode = verificationCode; 
      res.status(200).json({ message: 'Verification email sent', verificationCode });
    } catch (error) {
      console.error('이메일 전송 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '이메일을 보내는 동안 오류가 발생했습니다.' });
      next(error);
    }
  },  

  //@desc verify email
  //@route POST /auth/verify
  async verifyEmail(req, res, next) {
    res.status(200).json({ message: 'Email verified successfully' });
  }
};

module.exports = mailController;