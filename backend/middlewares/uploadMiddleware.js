const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  fileFilter,
});

module.exports = { upload };
