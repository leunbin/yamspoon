import { api } from './api';

export default {
  /**
   * @method GET
   * @summary 사용자 정보 조회
   */
  getUser() {
    return api({
      url: '/user',
      method: 'get'
    })
  },

  /**
   * @method PUT
   * @summary 사용자 정보 업데이트
   * @param newUserInfo 새로운 사용자 정보
   */
  updateUser(newUserInfo) {
    return api({
      url: '/user',
      method: 'put',
      data: newUserInfo
    })
  },
  
  /**
   * @method DELETE
   * @summary 사용자 정보 삭제(탈퇴)
   */
  deleteUser() {
    return api({
      url: '/user',
      method: 'delete'
    })
  },

  /**
   * @method POST
   * @summary 회원가입
   * @param userData 사용자 정보
   */
  createUser(userData) {
    return api({
      url: '/auth/signUp',
      method: 'post',
      data: userData
    })
  },

  /**
   * @method POST
   * @summary 로그인
   * @param userData 사용자 정보
   */
  loginUser(userData) {
    return api({
      url: '/auth/login',
      method: 'post',
      data: userData
    })
  },

  /**
   * @method GET
   * @summary 사용자 냉장고 재료 조회
   */
  getUserFridge() {
    return api({
      url: '/user/fridge',
      method: 'get'
    })
  },

  /**
   * @method PUT
   * @summary 사용자 냉장고 재료 업데이트
   * @param userData 사용자 정보
   */
  updateUserFridge(userData) {
    return api({
      url: '/user/fridge',
      method: 'put',
      data: userData
    })
  },

  /**
   * @method GET
   * @summary 사용자 북마크 조회
   */
  getUserBookmark() {
    return api({
      url: '/user/bookmark',
      method: 'get',
    })
  },

  /**
   * @method PUT
   * @summary 사용자 북마크 업데이트
   * @param userData 사용자 정보
   */
  updateUserBookmark(userData) {
    return api({
      url: '/user/bookmark',
      method: 'put',
      data: userData
    })
  },

  /**
   * @method POST
   * @summary 사용자 아이디 찾기
   * @param userData 사용자 정보
   */
  findUserId(userData) {
    return api({
      url: '/user/findUserid',
      method: 'post',
      data: userData
    })
  },

  /**
   * @method POST
   * @summary 사용자 비밀번호 찾기
   * @param userData 사용자 정보
   */
  findUserPassword(userData) {
    return api({
      url: '/user/findUserPassword',
      method: 'post',
      data: userData
    })
  },

  /**
   * @method PUT
   * @summary 비밀번호 재설정
   * @param userId 사용자 아이디
   * @param userData 사용자 정보
   */
  resetPassword(userId, userData) {
    return api({
      url: `/user/resetPassword/${userId}`,
      method: 'put',
      data: userData
    })
  },

  /**
   * @method POST
   * @summary 이메일 인증번호 전송
   * @param email 이메일
   */
  sendEmailCode(email) {
    return api({
      url: '/auth/send-verification-email',
      method: 'post',
      data: email
    })
  },

  /**
   * @method POST
   * @summary 인증번호 확인
   * @param code 인증번호
   */
  verifyCode(code) {
    return api({
      url: '/auth/verify',
      method: 'post',
      data: code
    })
  },

  /**
   * @method POST
   * @summary 아이디 중복 체크
   * @param id 아이디
   */
  verifyId(id) {
    return api({
      url: '/auth/verifyId',
      method: 'post',
      data: id
    })
  },

  /**
   * @method POST
   * @summary 닉네임 중복 체크
   * @param nickname 닉네임
   */
  verifyNickname(nickname) {
    return api({
      url: '/auth/verifyNickname',
      method: 'post',
      data: nickname
    })
  },

  /**
   * @method GET
   * @summary 작성한 레시피 조회
   */
  getCreateRecipe() {
    return api({
      url: 'user/myRecipe',
      method: 'get'
    })
  }
}
