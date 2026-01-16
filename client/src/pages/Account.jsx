import React, { useState, useEffect } from "react";
import { getProfile, getMediaUrl } from "../services/api";

export default function Account({
  token,
  username,
  onNavigate,
  onLogout,
  onBack,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [token]);

  async function loadProfile() {
    try {
      const api = await import("../services/api");
      const data = await api.getProfile(token);
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    {
      id: "info",
      label: "Thông tin tài khoản",
      icon: "👤",
      color: "#4A90E2",
      onClick: () => onNavigate("account-info"),
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: "🔒",
      color: "#F5A623",
      onClick: () => onNavigate("account-password"),
    },
    {
      id: "posts",
      label: "Các bài đã đăng",
      icon: "📝",
      color: "#50C878",
      onClick: () => onNavigate("account-posts"),
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: "🚪",
      color: "#E74C3C",
      onClick: onLogout,
    },
  ];

  if (loading) {
    return <p className="loading">Đang tải...</p>;
  }

  const displayUsername = profile?.username || username || "User";
  const avatarUrl = profile?.avatar ? getMediaUrl(profile.avatar) : null;

  return (
    <div className="account-page-new">
      <div className="account-banner">
        <div className="account-banner-content">
          <div className="account-banner-left">
            <div className="account-avatar-container">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="account-avatar-img"
                />
              ) : (
                <div className="account-avatar-placeholder">
                  {displayUsername.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="account-banner-text">
              <h2 className="account-banner-title">Tài khoản</h2>
              <p className="account-banner-greeting">
                Xin chào, {displayUsername}
              </p>
            </div>
          </div>
          {/* balance removed per request */}
        </div>
      </div>

      <div className="account-menu-cards">
        <div className="account-menu-card">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="account-menu-item"
              onClick={item.onClick}
              style={{ "--icon-color": item.color }}
            >
              <span className="account-menu-icon" style={{ color: item.color }}>
                {item.icon}
              </span>
              <span className="account-menu-label">{item.label}</span>
              <span className="account-menu-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
