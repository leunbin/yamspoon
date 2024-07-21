// 인증 관련 기능 : 사용자 인증, 사용자 등록, 비밀번호 관리, 권한 부여, 세션 관리
const { userDAO } = require('../data-access');
const bcrypt = require('bcrypt'); // 비밀번호 해싱
const jwt = require('jsonwebtoken'); // json 객체를 사용해서 정보를 표현, 검증
const config = require('../config');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const validator = require('validator');

class AuthService {

  //@desc 사용자 등록
  async signUp({ userId, name, email, password, nickname, isAdmin }) {
    const user = await userDAO.findUserByUserId(userId);
    console.log(user);

    if (user !== null) {
      throw new AppError(
        commonErrors.inputError,
        "이미 사용 중인 아이디입니다.",
        400,
      );
    }

    const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new AppError(
        commonErrors.inputError,
        '비밀번호는 최소 8자 이상이어야 하고 특수 문자를 포함해야 합니다.',
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!validator.isEmail(email)) {
      throw new AppError(
        commonErrors.inputError,
        '유효하지 않은 이메일 주소입니다.',
        400,
      );
    }
    
    const newUser = await userDAO.create({ 
      userId, 
      name, 
      email, 
      password : hashedPassword, 
      nickname, 
      isAdmin 
    });

    return {
      id: newUser._id,
      userId : newUser.userId,
      name: newUser.name,
      email: newUser.email,
      nickname : newUser.nickname,
      isAdmin : newUser.isAdmin,
    };
  }

  //@desc 아이디 중복 확인
  async verifyId (userId) {
    const user = await userDAO.findUserByUserId(userId);

    if(user) {
      throw new AppError (
        commonErrors.inputError,
        '이미 사용 중인 아이디입니다.',
        400,
      );
    }

    return { message : '사용 가능한 아이디입니다.'};
  }

  //@desc 닉네임 확인 
  async verifyNickname (nickname) {
    const user = await userDAO.findUserByNickname(nickname);

    if(user) {
      throw new AppError (
        commonErrors.inputError,
        '이미 사용 중인 닉네임입니다.',
        400,
      );
    }

    return { message : '사용 가능한 닉네임입니다.'};
  }

  //@desc 사용자 인증
  async login( {userId, plainPassword} ) {
    const user = await userDAO.findUserByUserId(userId);
    // console.log(userId);

    if (!user) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "사용자를 찾을 수 없습니다.",
        404,
      );
    }

    const passwordMatch = await bcrypt.compare(plainPassword, user.password);

    if (!passwordMatch) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        '비밀번호가 일치하지 않습니다.',
        401,
      );
    }

    const userToken = jwt.sign({
      id: user._id,
      userId,
      nickname:user.nickname,
      isAdmin: user.isAdmin,
    }, config.jwtSecret);

    return userToken;
  }

}

module.exports = new AuthService ();
