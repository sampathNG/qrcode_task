const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const authAdmin = require("../utils/authorization");
const auth = require("../utils/authentication");
router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.get("/users/:id", auth, getUserById);
router.put("/users/:id", auth, updateUser);
router.delete("/users", deleteUser);
module.exports = router;
