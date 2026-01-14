// controllers/auth.controller.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exist = await User.findOne({ username });
    if (exist) return res.status(400).json({ message: "Username đã tồn tại" });

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Issue a token without an expiry so the user won't need to re-login.
    // NOTE: Long-lived tokens have security implications. Consider
    // using refresh tokens for a safer solution in the future.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("🔑 Token tạo ra:", token);
    console.log("🔐 JWT_SECRET đang dùng:", process.env.JWT_SECRET);

    // Return the username as well so the client can show a welcome message
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
