import express from "express";
import jwt from "jsonwebtoken"; // <-- you missed this!
import User from "../model/user.js";

const routes = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

routes.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" }); // fixed typo
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 characters" }); // fixed logic
    }

    const exitUserEmail = await User.findOne({ email });
    if (exitUserEmail)
      return res.status(400).json({ message: "User email already exists" });

    const exitUserUsername = await User.findOne({ username });
    if (exitUserUsername)
      return res.status(400).json({ message: "Username already exists" });

    const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage, // now actually using the generated image
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." }); // added error response
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All filed are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exists" });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      message:"Log in successfully"
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." }); // added error response
  }
});

export default routes;
