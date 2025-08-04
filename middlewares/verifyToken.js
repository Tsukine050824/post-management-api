const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // ✅ Log để kiểm tra giá trị thật nhận được
  console.log('🛡️ Authorization header:', authHeader);
  console.log('🔑 JWT_SECRET (from .env):', process.env.JWT_SECRET);

  // ✅ Kiểm tra header có tồn tại & đúng định dạng
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token hoặc sai định dạng' });
  }

  // ✅ Cắt lấy token
  const token = authHeader.split(' ')[1];

  try {
    // ✅ Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Debug: Xem nội dung trong token
    console.log('✅ Token decoded:', decoded);

    // ✅ Gắn vào request để controller có thể dùng
    req.user = decoded;

    // ✅ Cho phép request tiếp tục
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};
