const mongoose = require("mongoose");
const { userSchema } = require("../schema");

// postSchema를 이용하여 Post 모델 클래스를 생성. 이후 postDAO 객체가 이 클래스를 사용해서 mongoDB를 향해 CRUD를 수행함.
const User = mongoose.model("User", userSchema);

module.exports = User;