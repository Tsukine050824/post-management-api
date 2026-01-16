import React, { useState, useEffect } from "react";
import { getProfile, updateAvatar, updateUsername, getMediaUrl } from "../services/api";

export default function AccountInfo({ token, username, onBack, onUsernameUpdate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, [token]);

  async function loadProfile() {
    try {
      const data = await getProfile(token);
      setProfile(data);
      setNewUsername(data.username || username || "");
      if (data.avatar) {
        setPreview(getMediaUrl(data.avatar));
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarSubmit(e) {
    e.preventDefault();
    if (!avatarFile) {
      setMsg("Vui lòng chọn ảnh");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      await updateAvatar(formData, token);
      setMsg("Cập nhật avatar thành công");
      setAvatarFile(null);
      await loadProfile();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleUsernameSubmit(e) {
    e.preventDefault();
    if (!newUsername.trim()) {
      setMsg("Username không được để trống");
      return;
    }

    try {
      const res = await updateUsername(newUsername.trim(), token);
      setMsg("Cập nhật username thành công");
      setEditingUsername(false);
      await loadProfile();
      if (onUsernameUpdate) {
        onUsernameUpdate(res.username);
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (loading) return <p className="loading">Đang tải...</p>;

  const displayUsername = profile?.username || username || "User";
  const avatarUrl = profile?.avatar ? getMediaUrl(profile.avatar) : preview;

  return (
    <div className="account-info-page">
      <div className="account-info-header">
        <button className="account-back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h2 className="account-info-title">Thông tin tài khoản</h2>
      </div>

      <div className="account-info-content">
        <div className="account-info-section">
          <h3>Ảnh đại diện</h3>
          <div className="avatar-upload-section">
            <div className="avatar-preview-container">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="avatar-preview-img" />
              ) : (
                <div className="avatar-preview-placeholder">
                  {displayUsername.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <form onSubmit={handleAvatarSubmit} className="avatar-upload-form">
              <div className="file-input-container">
                <label>Chọn ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    setAvatarFile(f);
                    setPreview(f ? URL.createObjectURL(f) : avatarUrl);
                  }}
                />
              </div>
              {avatarFile && (
                <button type="submit" className="btn-primary">
                  Cập nhật avatar
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="account-info-section">
          <h3>Tên người dùng</h3>
          {editingUsername ? (
            <form onSubmit={handleUsernameSubmit} className="username-edit-form">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Nhập username mới"
                className="username-input"
                required
              />
              <div className="username-edit-actions">
                <button type="submit" className="btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(displayUsername);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="username-display-section">
              <p className="username-display">{displayUsername}</p>
              <button
                className="btn-edit"
                onClick={() => {
                  setEditingUsername(true);
                  setNewUsername(displayUsername);
                }}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>

        {msg && (
          <p className={msg.includes("thành công") ? "form-message success" : "form-message error"}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
