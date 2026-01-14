const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // ✅ Log để kiểm tra giá trị thật nhận được
  console.log("🛡️ Authorization header:", authHeader);
  console.log("🔑 JWT_SECRET (from .env):", process.env.JWT_SECRET);

  // Allow token to be provided either via Authorization header or via query param (fallback)
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("🛡️ Token source: Authorization header (Bearer)");
  } else if (authHeader) {
    // Accept raw token in Authorization header (no 'Bearer ' prefix)
    token = authHeader.trim();
    console.log("🛡️ Token source: Authorization header (raw)");
  } else if (req.query && req.query.token) {
    token = req.query.token;
    console.log("🛡️ Token source: query param");
  } else if (req.body && req.body.token) {
    token = req.body.token;
    console.log("🛡️ Token source: request body");
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token hoặc sai định dạng" });
  }

  try {
    // Debug: show token summary and decoded (without verification) to inspect format
    try {
      console.log(
        "🔍 Raw token (first/last 20):",
        token.slice(0, 20) + "..." + token.slice(-20)
      );
      const decodedUnsafe = jwt.decode(token);
      console.log("🔍 jwt.decode ->", decodedUnsafe);
    } catch (e) {
      console.warn("🔍 Could not decode token for debug:", e.message);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
