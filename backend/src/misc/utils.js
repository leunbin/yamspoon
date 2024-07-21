/* 유틸 함수들의 묶음 */
// 데이터 클랜징용 함수, 특정 객체에서 값이 undefined인 key가 있으면 해당 key-value를 삭제한다.
// e.g. input: { a: undefined, b: 1 } / output: { b: 1 }
// undefined 인 키를 삭제하여 데이터를 정리
function sanitizeObject(obj) {
  const result = Object.entries(obj).reduce((map, [key, value]) => {
    if (value !== undefined) {
      map[key] = value;
    }
    return map;
  }, {});
  return result;
}

// HTTP 응답을 보낼 때 일관된 응답을 보내주기 위한 보조 함수
// 만약 에러 메시지가 있다면 메시지를 담아서 보내주고 없다면 null로 하여 보내준다.
// 일관된 응답 메시지를 보냄으로써 클라이언트가 응답으로 받은 데이터를 다루기 쉽게 해준다.
// 
function buildResponse(data, errorMessage) {
  if (errorMessage) {
    return {
      error: errorMessage,
      data: null,
    };
  }
  return { data };
}

module.exports = {
  sanitizeObject,
  buildResponse,
};
