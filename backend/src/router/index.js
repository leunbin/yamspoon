const express = require("express");
const recipeRouter = require("./recipeRouter");
const ingredientRouter = require("./ingredientRouter");
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

// 버전 1용 라우터.
// REST API의 경우 버저닝을 통해 새로운 API들을 추가하거나, 기존 API들을 보강해서 출시한다.
// 많은 기업들이 REST API를 배포할 때 버전을 달아서 배포한다.
// API는 한 번 공개하면 수정하기가 매우 어렵다. 버그 수정은 해야겠지만 기본 기능은 변경하기가 어렵기 때문에 새로운 버전을 만들어 배포(공개)하는 경우가 많다.
// (이미 많은 사용자들이 자신들의 어플리케이션에서 사용하고 있기 때문에 기능을 수정할 경우 그들의 비즈니스에 심각한 임팩트를 줄 가능성이 있다.)
// API를 개발할 때는 책임감을 가지고 "개발"하고 "테스트"하고 "배포"하고 "관리"해야한다.
const v1Router = express.Router();


v1Router.use('/auth', authRouter);
v1Router.use('/user',userRouter);
v1Router.use("/recipes", recipeRouter);
v1Router.use("/ingredients", ingredientRouter);


module.exports = {
  v1: v1Router, // API 버저닝을 위해 v1Router는 v1에 할당
};
