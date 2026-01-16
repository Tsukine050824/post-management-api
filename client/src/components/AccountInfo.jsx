import React, { useState, useEffect } from "react";
import { getProfile, updateAvatar, getMediaUrl } from "../services/api";

export default function AccountInfo({ token, username }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, [token]);

  async function loadProfile() {
    try {
      const data = await getProfile(token);
      setProfile(data);
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

      const res = await updateAvatar(formData, token);
      setMsg("Cập nhật avatar thành công");
      setAvatarFile(null);
      setPreview(null);
      // Reload profile
      await loadProfile();
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="account-info">
      <div className="account-info-card">
        <div className="avatar-section">
          <div className="avatar-container">
            {preview ? (
              <img src={preview} alt="Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <form onSubmit={handleAvatarSubmit} className="avatar-form">
            <div className="file-input-container">
              <label>Chọn ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  setAvatarFile(f);
                  setPreview(f ? URL.createObjectURL(f) : preview);
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

        <div className="user-info-section">
          <h3>Tên người dùng</h3>
          <p className="username-display">{profile?.username || username}</p>
        </div>
      </div>

      {msg && (
        <p className={msg.includes("thành công") ? "form-message success" : "form-message error"}>
          {msg}
        </p>
      )}
    </div>
  );
}
