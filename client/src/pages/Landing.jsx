import React from "react";

export default function Landing({ onNavigateToLogin }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-logo">
          <h1 className="logo-text">Post Management</h1>
        </div>
        <h2 className="landing-headline">Crafting Digital Stories</h2>
        <p className="landing-tagline">
          Empowering Creators, Managing Portfolios, Showcasing Brilliance
        </p>
        <button className="landing-login-btn" onClick={onNavigateToLogin}>
          LOGIN
        </button>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Create & Manage</h3>
          <p>Easily create and manage your posts with rich content and media</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Beautiful Design</h3>
          <p>
            Showcase your work with stunning visuals and professional layouts
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Fast & Reliable</h3>
          <p>
            Built for speed and performance to handle all your content needs
          </p>
        </div>
      </div>
    </div>
  );
}
