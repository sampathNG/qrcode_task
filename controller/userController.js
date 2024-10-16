const user = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const duplicate = await user.findOne({ email });
  if (duplicate) {
    return res.status(409).json({ message: "User already exists" });
  }
  const newUser = new user({
    name,
    email,
    password: hashedPassword,
    role,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userr = await user.findOne({ email });
    if (userr) {
      const validity = await bcrypt.compare(password, userr.password);
      if (validity) {
        const token = jwt.sign(
          { user_id: user._id, role: userr.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "48h",
          }
        );
        console.log(token);
        res.status(200).json({ user, token });
      } else {
        res.status(401).json("Wrong Password");
      }
    } else {
      res.status(401).json("User Not Found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const userr = await user.findById(id);
    res.status(200).json(userr);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedUser = {
    name,
    email,
    password: hashedPassword,
  };
  try {
    const userrs = await user.findByIdAndUpdate(id, updatedUser, { new: true });
    res.status(200).json(userrs);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  // const id = req.params.id;
  try {
    // const userds = await user.findByIdAndDelete(id);
    const userds = await user.deleteMany();
    res.status(200).json(userds);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
