import React, { useState, useEffect } from "react";
import { getMyPosts, getMediaUrl } from "../services/api";

export default function AccountPosts({ token, onBack, onSelectPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, [token]);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getMyPosts(token);
      setPosts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="loading">Đang tải...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="account-posts-page">
      <div className="account-posts-header">
        <button className="account-back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h2 className="account-posts-title">Các bài đã đăng</h2>
      </div>

      <div className="account-posts-content">
        {posts.length === 0 ? (
          <p className="post-empty">Bạn chưa có bài viết nào.</p>
        ) : (
          <ul className="post-list">
            {posts.map((p) => (
              <li
                key={p._id}
                className="post-item"
                onClick={() => {
                  if (onSelectPost) {
                    onSelectPost(p._id);
                  }
                }}
              >
                {p.thumbnail && (
                  <div className="post-thumbnail">
                    <img src={getMediaUrl(p.thumbnail)} alt="thumb" />
                  </div>
                )}
                <div className="post-content">
                  <h3 className="post-title">{p.title}</h3>
                  <p className="post-description">{p.content || p.desc}</p>
                  <small className="post-author">
                    Đăng bởi {p.author?.username || "bạn"}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
