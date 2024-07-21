const createApp = require("../src/app");

async function main() {
  // 서버 어플리케이션 객체를 생성
  const app = await createApp();

  // 처리하지 못한 에러를 캐치하는 리스너 + 핸들러
  // 이 이벤트 리스너는 매우 중요하다. 개발자가 실수로 놓친 에러를 잡아준다.
  process.on("uncaughtException", (error) => {
    console.log(`uncaughtException: ${error}`);
  });

  // OS의 kill signal에 반응하도록 설정
  // SIGINT 신호가 바로 ctrl + c 조합
  for (const signal of ["SIGTERM", "SIGHUP", "SIGINT", "SIGUSR2"]) {
    // 위의 4가지 OS 신호 중 하나라도 발생하면 현재 실행중인 서버를 안전하게 중지시킨다.
    // 이를 graceful shutdown(한국어로 "정상적인 셧다운"?이라고 한다)
    process.on(signal, async () => {
      if (!app.isShuttingDown) {
        console.log(
          `시스템 시그널, ${signal}을 수신하였습니다. 의도된 서버 중지 신호입니다. Graceful shutdown을 실시합니다.`
        );
        await app.stop();
        console.log(`Graceful shutdown이 완료되었습니다.`);
        console.log(`바이바이 👋`);
        process.exit(0);
      }
    });
  }

  // 전체 웹 어플리케이션 서버 시작
  app.start();
}

// 메인 함수 실행으로 전체 어플리케이션 구동
main();
