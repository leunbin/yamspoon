const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");

const loader = require("./loader");
const config = require("./config");
const AppError = require("./misc/AppError");
const commonErrors = require("./misc/commonErrors");
const apiRouter = require("./router");

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// express application을 "생성"해주는 함수
async function create() {
  // MongoDB에 연결
  await loader.load();

  console.log("express application을 초기화합니다.");
  const expressApp = express();

  expressApp.use(express.json());

  // Health check API
  expressApp.get("/health", (req, res, next) => {
    res.json({
      status: "OK",
    });
  });

  
  expressApp.use(cookieParser());

  expressApp.use(
    session({
      secret: config.sessionSecret,
      resave: config.sessionResave,
      saveUninitialized: config.sessionSaveUninitialized,
      store: MongoStore.create({ mongoUrl: config.sessionStoreUrl }),
      cookie: { maxAge: config.cookieMaxAge },
    })
  )
  // version 1의 api router를 등록
  expressApp.use("/api/v1", apiRouter.v1);

  const file = fs.readFileSync(path.resolve(__dirname, "swagger.yaml"), "utf8");
  const swaggerDocument = YAML.parse(file);

  expressApp.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  // 해당되는 URL이 없을 때를 대비한 미들웨어
  expressApp.use((req, res, next) => {
    next(
      new AppError(
        commonErrors.resourceNotFoundError,
        "Resource not found",
        404
      )
    );
  });

  // 에러 핸들러 등록
  expressApp.use((error, req, res, next) => {
    console.log(error);
    res.statusCode = error.httpCode ?? 500;
    res.json({
      data: null,
      error: error.message,
    });
  });
  console.log("express application 준비가 완료되었습니다.");

  // express와 http.Server을 분리해서 관리하기 위함.
  const server = http.createServer(expressApp);

  const app = {
    // 서버 어플리케이션을 시작하기 위한 메소드
    start() {
      server.listen(config.port);
      server.on("listening", () => {
        console.log(
          `🚀${config.applicationName}가 포트 ${config.port}에서 운영중입니다.`
        );
        console.log(
          `📜${config.applicationName}의 REST API 문서는 /api-docs에서 확인 가능합니다.`
        );
      });
    },
    // 서버 어플리케이션을 중지하기 위한 메소드
    // 이 함수는 어플리케이션이 죽기 전(예를 들어 개발자가 ctrl+c를 누른 직후)에 실행될 예정이다.
    // 죽기 전에 실행됨으로서:
    // 1) 서버가 더 이상 외부로부터 요청을 받지 않도록 하고(죽는 도중에 요청을 받으면 해당 요청은 응답을 못 받을 가능성이 매우 높기 때문에 애초에 서버가 죽기 전에는 받지 않도록 해주는 것이 좋다)
    // 2) mongoDB와의 연결을 안전하게 끊는다.
    stop() {
      console.log("🔥 서버를 중지 작업을 시작합니다.");
      this.isShuttingDown = true;
      return new Promise((resolve, reject) => {
        server.close(async (error) => {
          if (error !== undefined) {
            console.log(`- HTTP 서버 중지를 실패하였습니다: ${error.message}`);
            reject(error);
          }
          console.log("- 들어오는 커넥션을 더 이상 받지 않도록 하였습니다.");
          await loader.unload();
          console.log("- DB 커넥션을 정상적으로 끊었습니다.");
          console.log("🟢 서버 중지 작업을 성공적으로 마쳤습니다.");
          this.isShuttingDown = false;
          resolve();
        });
      });
    },
    isShuttingDown: false, // 서버가 중지하는 상태인지를 확인하는 플래그
    _app: expressApp,
  };

  return app;
}

module.exports = create;
