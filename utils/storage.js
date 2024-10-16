const multer = require("multer");
exports.imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/image");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});
