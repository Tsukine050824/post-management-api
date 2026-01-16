import React, { useState } from "react";
import { changePassword } from "../services/api";

export default function AccountPassword({ token, onBack }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setMsg("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await changePassword(
        {
          currentPassword,
          newPassword,
        },
        token
      );
      setMsg("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="account-password-page">
      <div className="account-password-header">
        <button className="account-back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h2 className="account-password-title">Đổi mật khẩu</h2>
      </div>

      <div className="account-password-content">
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Đổi mật khẩu</button>
          {msg && (
            <p className={msg.includes("thành công") ? "form-message success" : "form-message error"}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
