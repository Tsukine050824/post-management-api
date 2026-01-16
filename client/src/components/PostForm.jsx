import React, { useState } from "react";
import { createPost } from "../services/api";

export default function PostForm({ token }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    // backend expects `content` field
    fd.append("content", content);
    // backend multer expects field name `thumbnail`
    if (file) fd.append("thumbnail", file);
    try {
      await createPost(fd, token);
      setMsg("Created");
      setTitle("");
      setContent("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#667eea" }}>
        Create New Post
      </h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="file-input-container">
        <label>Thumbnail Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files[0];
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
      </div>
      {preview && (
        <div className="file-preview">
          <img src={preview} alt="preview" />
        </div>
      )}
      <button type="submit">Create Post</button>
      {msg && (
        <p className={msg.includes("Created") ? "form-message success" : "form-message error"}>
          {msg}
        </p>
      )}
    </form>
  );
}
