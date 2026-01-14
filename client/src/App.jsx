import React, { useState } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";

export default function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [selectedPostId, setSelectedPostId] = useState(null);

  function handleLogin(t, name) {
    setToken(t);
    setUsername(name || "");
    localStorage.setItem("token", t);
    localStorage.setItem("username", name || "");
    setPage("home");
  }

  function handleLogout() {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .header {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .nav {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .nav button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .nav button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .nav button:active {
          transform: translateY(0);
        }

        .main-content {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 30px;
          width: 100%;
        }

        .welcome-section {
          background: white;
          padding: 20px 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .welcome-section p {
          font-size: 18px;
          color: #555;
          margin: 0;
        }

        .welcome-section p strong {
          color: #667eea;
          font-weight: 700;
        }

        .content-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer {
          background: white;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          padding: 30px 0;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 30px;
          text-align: center;
        }

        .footer-content p {
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
        }

        .footer-links a {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
          }

          .nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .main-content {
            padding: 20px 15px;
          }

          .content-card {
            padding: 20px;
          }
        }
      `}</style>

      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <h1>Post Management</h1>
            <nav className="nav">
              <button onClick={() => setPage("home")}>Home</button>
              <button onClick={() => setPage("create")}>Create</button>
              {!token ? (
                <>
                  <button onClick={() => setPage("login")}>Login</button>
                  <button onClick={() => setPage("register")}>Register</button>
                </>
              ) : (
                <button onClick={handleLogout}>Logout</button>
              )}
            </nav>
          </div>
        </header>

        <main className="main-content">
          {page === "home" && username && (
            <div className="welcome-section">
              <p>Welcome <strong>{username}</strong></p>
            </div>
          )}

          <div className="content-card">
            {page === "home" && (
              <PostList
                onSelect={(id) => {
                  setSelectedPostId(id);
                  setPage("detail");
                }}
              />
            )}
            {page === "create" && <PostForm token={token} />}
            {page === "login" && <Login onLogin={handleLogin} />}
            {page === "register" && (
              <Register onRegistered={() => setPage("login")} />
            )}
            {page === "detail" && selectedPostId && (
              <PostDetails
                id={selectedPostId}
                token={token}
                onBack={() => setPage("home")}
                onUpdated={() => setPage("home")}
              />
            )}
          </div>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 Post Management System. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}