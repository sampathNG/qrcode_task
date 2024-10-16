const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const User = require("../db/userModel");
const File = require("../db/fileModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { uploadLogo, uploadsLogo } = require("../controller/uploadController");
const auth = require("../utils/authentication");
const authAdmin = require("../utils/authorization");
router.post("/uploadd", uploadsLogo);
// router.post("/uploadPoster", authAdmin, uploadsPoster);
// router.post("/uploadFestival", authAdmin, uploadsFestival);
// router.post("/uploadBrocher", authAdmin, uploadsBrocher);
//
router.get("/files", async (req, res) => {
  const files = await File.find();
  res.json(files);
});
router.post("/aws", auth, uploadLogo, async (req, res) => {
  try {
    const password = req.query.password;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const filesPath = path.join(__dirname, "../upload/image");
    const files = await fs.promises.readdir(filesPath);
    const originalname = files[0];
    const filePath = path.join(__dirname, "../upload/image", files[0]);
    const fileContent = fs.readFileSync(filePath);
    // const fileContent = fs.createReadStream(filePath);
    const params = {
      Bucket: "itpros741",
      Key: filePath,
      Body: fileContent,
      ACL: "public-read",
    };
    const data = await s3.upload(params).promise();
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const file = new File({
      userId: req.user.userId,
      fileName: originalname,
      s3Key: data.Key,
      passwordHash,
    });

    await file.save();
    await fs.promises.unlink(filePath);
    console.log(data.Location);
    res.json({ message: "File uploaded successfully", fileKey: data.Location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading file", error });
  }
});
router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.passwordHash) {
      const { password } = req.query;
      const isMatch = await bcrypt.compare(password, file.passwordHash);
      if (!isMatch)
        return res.status(403).json({ message: "Incorrect password" });
    }
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.s3Key,
    };
    const stream = s3.getObject(s3Params).createReadStream();
    stream.on("error", (err) => {
      console.error("Error retrieving file from S3:", err);
      return res.status(500).json({ message: "Error retrieving file" });
    });
    res.attachment(file.fileName);
    stream.pipe(res);
  } catch (error) {
    res.send({ message: error.message });
  }
});
//
module.exports = router;
