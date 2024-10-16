const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
module.exports = auth;
