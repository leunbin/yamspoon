/* mongoose와 같이 외부 시스템과 소통을 하거나 해야할 때 필요한 client 객체들을 초기화할 때 사용하는 함수들의 묶음 */
const mongoose = require("mongoose");
const config = require("../config");

// mongoose를 이용해서 mongoDB에 연결
async function connectMongoDB() {
  // 연결 상태를 체크하기 위한 이벤트 리스너들
  mongoose.connection.on("connecting", () => {
    console.log("Mongoose가 MongoDB 서버에 연결중입니다!");
  });
  mongoose.connection.on("connected", () => {
    console.log("Mongoose가 MongoDB에 정상적으로 연결되었습니다.");
  });
  mongoose.connection.on("disconnecting", () => {
    console.log("Mongoose가 MongoDB와의 연결을 끊고 있습니다!");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose가 MongoDB와의 연결을 정상적으로 끊었습니다.");
  });
  mongoose.connection.on("error", (error) => {
    console.log(`Mongoose에서 에러가 발생하였습니다: ${error}`);
  });

  // mongoDB로 연결. 여기서 await를 해주면 연결할 때까지 기다리고 다음 코드를 수행
  // await를 안하면 mongoose가 첫 쿼리를 실행할 때 딜레이가 생길 수 있다. 연결이 안되면 쿼리를 요청할 수 없기 때문에 연결될 때까지 기다리기 때문
  await mongoose.connect(config.mongoDBUri);
}

// mongoDB와 연결된 mongoose의 연결 상태를 끊는다.
// 어플리케이션이 종료할 때는 항상 DB와의 연결을 명시적으로 끊어주는 것이 바람직하다.
// 끊지 않으면 불필요한 연결 상태가 mongoDB쪽에 일정 기간 누적되어 mongoDB와 연결을 일시적으로 맺지 못할 가능성이 있다.
// 그 이유는 mongoDB가 맺을 수 있는 연결의 갯수가 정해져있기 때문이다.
// 특히 개발중일 때는 코드가 수정 될 때마다 프로세스를 재시작하도록 하는 환경을 많이 사용하는데(nodemon같은 것들을 이용한)
// 이는 프로세스가 재시작할 때마다 새롭게 mongoDB와 연결을 맺도록 하기 때문에 프로세스가 재시작의 빈도가 높으면 mongoDB의 최대 연결 갯수를 금방 다 채울 수도 있다.
// 특히 여러 명이서 한 프로젝트를 개발하는 경우 그럴 가능성이 매우 높아진다. 정말 주의하자. bin/index.js 코드를 보면 프로세스가 죽기 전에 실행하는 코드가 있으니 참고 바란다.
async function disconnectMongoDB() {
  await mongoose.disconnect();
}

async function load() {
  await connectMongoDB();
}

async function unload() {
  await disconnectMongoDB();
}

module.exports = {
  load,
  unload,
};
