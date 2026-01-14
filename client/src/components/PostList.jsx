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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li
            key={p._id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            {p.thumbnail && (
              <div style={{ width: 80, height: 80, flex: "0 0 80px" }}>
                <img
                  src={getMediaUrl(p.thumbnail)}
                  alt="thumb"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "1px solid #eee",
                  }}
                />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h3
                style={{ cursor: "pointer", color: "#0366d6" }}
                onClick={() =>
                  props && typeof props.onSelect === "function"
                    ? props.onSelect(p._id)
                    : null
                }
              >
                {p.title}
              </h3>
              <p>{p.content || p.desc}</p>
              <small>
                By {p.author?.username || p.username || "anonymous"}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
