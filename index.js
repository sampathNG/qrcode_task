require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connectDB");
const AccessLog = require("./db/accessLog");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Access Log (Optional)
app.post("/log-access", async (req, res) => {
  const { fileId, accessedBy } = req.body;

  const log = new AccessLog({ fileId, accessedBy });
  await log.save();
  res.json({ message: "Access logged" });
});
// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Upload files to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Initialize upload middleware
const upload = multer({ storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.use("/", require("./routes/uploadRoute"));
app.use("/", require("./routes/userRoute"));
// app.use("/", require("./routes/qrCode"));
app.get("/", (req, res) => {
  try {
    res.send("server is running");
  } catch (error) {
    res.send(error.message);
  }
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
