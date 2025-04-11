const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

exports.deleteFromS3 = async (imageUrl) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  // Ambil nama file dari URL
  const key = imageUrl.split(`.amazonaws.com/`)[1];

  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(deleteParams));
};
