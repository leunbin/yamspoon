// 공통적으로 자주 발생하는 에러의 이름들 묶음.
// AppError 객체를 생성할 때 name값으로써 사용한다
const commonErrors = {
  authenticationError: `Authentication Error`,
  authorizationError: `Authorization Error`,
  inputError: `Input Error`,
  argumentError: `Argument Error`,
  businessError: `Business Error`,
  configError: `Config Error`,
  databaseError: `DB Error`,
  fatalError: `Fatal Error`,
  objectCreationError: `Object Creation Error`,
  resourceNotFoundError: `Resource Not Found Error`,
  resourceDuplicationError: `Resource Duplication Error`,
  remoteStorageError: `Remote Storage Error`,
  requestValidationError: `Request Validation Error`,
};

module.exports = commonErrors;
