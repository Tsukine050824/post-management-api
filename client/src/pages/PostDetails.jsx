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

  if (loading) return <p className="loading">Loading...</p>;
  if (!post) return <p className="error">No post found</p>;

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
    <div className="post-details">
      <div className="post-details-header">
        <button onClick={onBack}>← Back</button>
      </div>
      {editing ? (
        <div className="form-container">
          <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#667eea" }}>
            Edit Post
          </h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <div className="file-input-container">
            <label>Change thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFile(e.target.files[0])}
            />
            {newFile && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(newFile)}
                  alt="new-thumb"
                />
              </div>
            )}
          </div>
          <div className="post-details-actions">
            <button className="save" onClick={save}>Save</button>
            <button className="cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="post-details-title">{post.title}</h2>
          {post.thumbnail && (
            <div className="post-details-thumbnail">
              <img
                src={getMediaUrl(post.thumbnail)}
                alt="thumbnail"
              />
            </div>
          )}
          <p className="post-details-content">{post.content}</p>
          <small className="post-details-author">By {post.author?.username || "anonymous"}</small>
          {canEdit && (
            <div className="post-details-actions">
              <button className="edit" onClick={() => setEditing(true)}>Edit</button>
              <button className="delete" onClick={remove}>Delete</button>
            </div>
          )}
        </div>
      )}
      {msg && (
        <p className={msg.includes("Updated") ? "form-message success" : "form-message error"}>
          {msg}
        </p>
      )}
    </div>
  );
}
