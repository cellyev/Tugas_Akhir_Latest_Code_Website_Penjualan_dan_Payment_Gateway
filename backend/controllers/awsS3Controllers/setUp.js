// Import dependencies
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

/**
 * Validasi environment variables yang dibutuhkan untuk konfigurasi AWS S3.
 * Melempar error jika ada variabel yang belum diset.
 */
const validateEnvVars = () => {
  const requiredVars = [
    "AWS_REGION",
    "AWS_S3_ACCESS_KEY",
    "AWS_S3_SECRET_ACCESS_KEY",
    "AWS_S3_BUCKET_NAME",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Inisialisasi S3 Client dengan konfigurasi retry dan timeout
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3, // Maksimal percobaan ulang saat gagal
  requestTimeout: 30000, // Timeout request 30 detik
});

/**
 * Fungsi untuk mengupload file ke Amazon S3.
 *
 * @param {Object} file - Objek file dari middleware (contoh: multer)
 * @param {Buffer} file.buffer - Isi file dalam bentuk buffer
 * @param {String} file.originalname - Nama asli file
 * @param {String} file.mimetype - Tipe MIME dari file
 * @returns {Promise<String>} URL publik dari file yang berhasil diupload
 */
const uploadToS3 = async (file) => {
  try {
    // Validasi env dan parameter file
    validateEnvVars();

    if (!file || !file.buffer || !file.originalname || !file.mimetype) {
      throw new Error("Invalid file object provided");
    }

    // Ekstensi file yang diizinkan
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file extension: ${fileExtension}`);
    }

    // Generate nama file unik
    const randomFileName = `${crypto.randomUUID()}${fileExtension}`;
    const s3Key = `image_components/${randomFileName}`;

    // Konfigurasi parameter untuk upload
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalname: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    };

    console.log(`[S3] Uploading file: ${file.originalname} as ${s3Key}`);
    console.log(`[S3] File size: ${(file.buffer.length / 1024).toFixed(2)} KB`);

    // Kirim perintah upload ke S3
    const startTime = Date.now();
    await s3Client.send(new PutObjectCommand(uploadParams));
    const uploadTime = Date.now() - startTime;

    console.log(`[S3] Upload completed in ${uploadTime}ms`);

    // Generate URL publik dari file yang diupload
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    return fileUrl;
  } catch (error) {
    console.error("[S3] Upload error:", error);

    // Tangani error spesifik terkait kredensial AWS
    if (error.name === "CredentialsProviderError") {
      throw new Error("AWS credentials are invalid or not configured properly");
    }

    // Tangani error izin akses
    if (error.$metadata && error.$metadata.httpStatusCode === 403) {
      throw new Error("Permission denied when accessing S3 bucket");
    }

    throw error; // Biarkan error diteruskan ke caller
  }
};

/**
 * Mengekstrak S3 object key dari URL publik
 * @param {String} url - URL publik dari file di S3
 * @returns {String} key - Path relatif objek di bucket (misalnya: image_components/abc.jpg)
 */
const extractS3KeyFromUrl = (url) => {
  const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  return url.replace(baseUrl, "");
};

/**
 * Menghapus file dari Amazon S3
 * @param {String} key - Key dari objek di S3
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (key) => {
  try {
    if (!key) throw new Error("No S3 key provided for deletion");

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    console.log(`[S3] Deleting file: ${key}`);
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`[S3] File deleted successfully`);
  } catch (error) {
    console.error("[S3] Delete error:", error);
    throw new Error("Failed to delete image from S3");
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  extractS3KeyFromUrl,
  s3Client,
};
