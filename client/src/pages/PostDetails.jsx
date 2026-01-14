import React, { useEffect, useState } from "react";
import {
  getPost,
  updatePost,
  updatePostMultipart,
  deletePost,
  decodeToken,
  getMediaUrl,
} from "../services/api";

export default function PostDetails({ id, token, onBack, onUpdated }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPost(id)
      .then((p) => {
        setPost(p);
        setTitle(p.title);
        setContent(p.content || "");
      })
      .catch((e) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>No post</p>;

  const currentUserId = token ? decodeToken(token)?.id : null;
  const canEdit =
    currentUserId &&
    post.author &&
    (post.author._id === currentUserId || post.author === currentUserId);

  async function save() {
    try {
      // if user selected a new thumbnail, send multipart
      if (newFile) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("content", content);
        fd.append("thumbnail", newFile);
        await updatePostMultipart(id, fd, token);
      } else {
        await updatePost(id, { title, content }, token);
      }
      setMsg("Updated");
      setEditing(false);
      setNewFile(null);
      if (onUpdated) onUpdated();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove() {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id, token);
      if (onUpdated) onUpdated();
      if (onBack) onBack();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div>
      <button onClick={onBack}>Back</button>
      {editing ? (
        <div style={{ display: "grid", gap: 8 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div>
            <label>Change thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFile(e.target.files[0])}
            />
            {newFile && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(newFile)}
                  alt="new-thumb"
                  style={{ maxWidth: 200 }}
                />
              </div>
            )}
          </div>
          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{post.title}</h2>
          {post.thumbnail && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={getMediaUrl(post.thumbnail)}
                alt="thumbnail"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
          <p>{post.content}</p>
          <small>By {post.author?.username || "anonymous"}</small>
          {canEdit && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={remove} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      {msg && <p>{msg}</p>}
    </div>
  );
}
