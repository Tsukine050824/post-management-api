// controllers/auth.controller.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

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

// Lấy thông tin profile của user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật avatar
exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar && req.file) {
      const oldAvatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Cập nhật avatar mới
    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();
    res.json({ message: "Cập nhật avatar thành công", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật username
exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Vui lòng nhập username" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra username đã tồn tại chưa
    const exist = await User.findOne({ username });
    if (exist && exist._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Cập nhật username
    user.username = username;
    await user.save();

    res.json({ message: "Cập nhật username thành công", username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
