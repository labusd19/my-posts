const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Signup method

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 12),
      roleId: 2,
    });
    await newUser.save();
    return res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.log("Creating user failed. ", error);
  }
};

// Login method
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exists!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password!" });
    }
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email, role: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    return res.status(200).json({
      message: "Login successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error!" });
  }
};
