import React, { useState, useEffect } from "react";
import { getMyPosts, getMediaUrl } from "../services/api";

export default function MyPosts({ token }) {
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
    <div className="my-posts">
      {posts.length === 0 ? (
        <p className="post-empty">Bạn chưa có bài viết nào.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p._id} className="post-item">
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
  );
}
