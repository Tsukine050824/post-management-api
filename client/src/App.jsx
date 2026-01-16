import React, { useState, useEffect, useRef } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import Landing from "./pages/Landing";
import Account from "./pages/Account";
import AccountInfo from "./pages/AccountInfo";
import AccountPassword from "./pages/AccountPassword";
import AccountPosts from "./pages/AccountPosts";

// Thời gian timeout (30 phút = 1800000ms)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 phút
const LAST_ACTIVITY_KEY = "lastActivityTime";

export default function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "home" : "landing"
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [selectedPostId, setSelectedPostId] = useState(null);
  const inactivityTimerRef = useRef(null);
  const activityCheckIntervalRef = useRef(null);
  const tokenRef = useRef(token);

  // Cập nhật ref khi token thay đổi
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Hàm tự động đăng xuất
  function autoLogout() {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setPage("landing");

    // Clear timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
      activityCheckIntervalRef.current = null;
    }
  }

  // Cập nhật thời gian hoạt động cuối cùng
  function updateLastActivity() {
    if (tokenRef.current) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }

  // Reset timer khi có hoạt động
  function resetInactivityTimer() {
    if (!tokenRef.current) return;

    updateLastActivity();

    // Clear timer cũ
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set timer mới
    inactivityTimerRef.current = setTimeout(() => {
      autoLogout();
    }, INACTIVITY_TIMEOUT);
  }

  // Kiểm tra thời gian không hoạt động khi app load lại
  function checkInactivityOnLoad() {
    if (!tokenRef.current) return;

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) {
      // Nếu không có lastActivity, set ngay bây giờ
      updateLastActivity();
      return;
    }

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
      // Đã quá thời gian, tự động đăng xuất
      autoLogout();
    } else {
      // Chưa quá thời gian, reset timer với thời gian còn lại
      const remainingTime = INACTIVITY_TIMEOUT - timeSinceLastActivity;
      inactivityTimerRef.current = setTimeout(() => {
        autoLogout();
      }, remainingTime);
    }
  }

  function handleLogin(t, name) {
    setToken(t);
    setUsername(name || "");
    localStorage.setItem("token", t);
    localStorage.setItem("username", name || "");
    updateLastActivity();
    setPage("home");
    resetInactivityTimer();
  }

  function handleUsernameUpdate(newUsername) {
    setUsername(newUsername);
    localStorage.setItem("username", newUsername);
  }

  function handleLogout() {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setPage("landing");

    // Clear timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
      activityCheckIntervalRef.current = null;
    }
  }

  // Effect để setup auto logout khi có token
  useEffect(() => {
    if (!token) return;

    // Kiểm tra khi component mount
    checkInactivityOnLoad();

    // Setup các event listeners để track activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Track khi tab/window bị ẩn
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab bị ẩn, lưu thời gian hiện tại
        updateLastActivity();
        // Clear timer khi tab bị ẩn
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
      } else {
        // Tab được hiển thị lại, kiểm tra thời gian
        checkInactivityOnLoad();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Track khi đóng tab/window
    const handleBeforeUnload = () => {
      updateLastActivity();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check định kỳ mỗi phút để đảm bảo
    activityCheckIntervalRef.current = setInterval(() => {
      if (tokenRef.current) {
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
          if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
            autoLogout();
          }
        }
      }
    }, 60000); // Check mỗi phút

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [token]);

  return (
    <div className="app-container">
      {!token && page === "landing" ? (
        <>
          <Landing onNavigateToLogin={() => setPage("login")} />
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
        </>
      ) : (
        <>
          <header className="header">
            <div className="header-content">
              <h1>Post Management</h1>
              <nav className="nav">
                {token && (
                  <>
                    <button onClick={() => setPage("create")}>Create</button>
                    <button
                      className="account-icon-btn"
                      onClick={() => setPage("account")}
                      title="Tài khoản"
                    >
                      👤
                    </button>
                  </>
                )}
                {!token && (
                  <>
                    <button onClick={() => setPage("landing")}>Home</button>
                    <button onClick={() => setPage("login")}>Login</button>
                    <button onClick={() => setPage("register")}>
                      Register
                    </button>
                  </>
                )}
              </nav>
            </div>
          </header>

          <main className="main-content">
            {page === "home" && username && (
              <div className="welcome-section">
                <p>
                  Welcome <strong>{username}</strong>
                </p>
              </div>
            )}

            {page === "account" ? (
              <Account
                token={token}
                username={username}
                onNavigate={(pageName) => setPage(pageName)}
                onLogout={handleLogout}
                onBack={() => setPage("home")}
              />
            ) : page === "account-info" ? (
              <AccountInfo
                token={token}
                username={username}
                onBack={() => setPage("account")}
                onUsernameUpdate={handleUsernameUpdate}
              />
            ) : page === "account-password" ? (
              <AccountPassword
                token={token}
                onBack={() => setPage("account")}
              />
            ) : page === "account-posts" ? (
              <AccountPosts
                token={token}
                onBack={() => setPage("account")}
                onSelectPost={(id) => {
                  setSelectedPostId(id);
                  setPage("detail");
                }}
              />
            ) : (
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
            )}
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
        </>
      )}
    </div>
  );
}
