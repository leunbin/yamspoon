const mailMiddleware = require('./mailMiddleware');
const authMiddleware = require('./authMiddleware');
const uploadMiddleware = require('./uploadMiddleware');

module.exports = {
  mailMiddleware,
  authMiddleware,
  uploadMiddleware,
};
