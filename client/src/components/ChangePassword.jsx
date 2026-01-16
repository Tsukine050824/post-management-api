import React, { useState } from "react";
import { changePassword } from "../services/api";

export default function ChangePassword({ token }) {
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
    <div className="change-password">
      <form onSubmit={handleSubmit} className="form-container">
        <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#667eea" }}>
          Đổi mật khẩu
        </h3>
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
  );
}
