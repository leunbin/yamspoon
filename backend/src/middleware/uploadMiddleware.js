const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config');


const s3 = new S3Client({
  region : 'ap-northeast-2',
  credentials : {
      accessKeyId : config.s3Key,
      secretAccessKey : config.s3Secret
  }
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'yamspoon',
    key: function (req, file, cb) {
      const filename = `${Date.now().toString()}-${file.originalname}`; // 새 파일 이름에 원래 파일 이름 포함
      cb(null, filename) 
    }
  })
})

async function deleteS3File(key) {
  try {
    const deleteParams = {
      Bucket: 'yamspoon',
      Key: key
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`File deleted successfully: ${key}`);
  } catch (err) {
    console.error("Error occurred while trying to delete file from S3:", err);
    throw err; // 에러를 던져서 상위 호출자가 처리할 수 있게 함
  }
}

module.exports = {
  upload,
  s3,
  deleteS3File
};