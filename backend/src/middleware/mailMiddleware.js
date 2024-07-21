const nodemailer = require('nodemailer');
const config = require('../config');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const isVerified = (req, res, next) => {
  const { verificationCode } = req.body;


  try {
    const storedVerificationCode = req.session.verificationCode;
    console.log(storedVerificationCode);

    if (verificationCode == storedVerificationCode) {

      next();
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('이메일 인증 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '이메일 인증 중 오류가 발생했습니다.' });
    next(error);
  }
};

module.exports = {
  isVerified,
}
