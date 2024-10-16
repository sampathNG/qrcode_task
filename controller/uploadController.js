// const { fileStorage, fileFilter } = require("../utils/storage");
const { imageStorage } = require("../utils/storage");
const multer = require("multer");
// const uploadImage = multer({
const uploadLogo = multer({
  storage: imageStorage,
}).single("file");
const uploadsLogo = (req, res, next) => {
  // uploadImage(req, res, (err) => {
  uploadLogo(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Upload failed." });
    }
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    console.log(`File uploaded to local`);
    // res.send({
    //   message: "File uploaded successfully!",
    // });
  });
};
module.exports = {
  uploadsLogo,
  uploadLogo,
};
