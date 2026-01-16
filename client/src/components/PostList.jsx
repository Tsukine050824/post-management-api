import React, { useEffect, useState } from "react";
import { fetchPosts, getMediaUrl } from "../services/api";

export default function PostList(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then((data) => {
        // Backend sometimes returns an object with pagination: { data: posts, total, ... }
        // or returns an array directly (search route). Normalize to array.
        if (Array.isArray(data)) setPosts(data);
        else if (data && Array.isArray(data.data)) setPosts(data.data);
        else setPosts([]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {posts.length === 0 && <p className="post-empty">No posts yet.</p>}
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p._id} className="post-item">
            {p.thumbnail && (
              <div className="post-thumbnail">
                <img
                  src={getMediaUrl(p.thumbnail)}
                  alt="thumb"
                />
              </div>
            )}
            <div className="post-content">
              <h3
                className="post-title"
                onClick={() =>
                  props && typeof props.onSelect === "function"
                    ? props.onSelect(p._id)
                    : null
                }
              >
                {p.title}
              </h3>
              <p className="post-description">{p.content || p.desc}</p>
              <small className="post-author">
                By {p.author?.username || p.username || "anonymous"}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
