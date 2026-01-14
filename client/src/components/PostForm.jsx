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
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files[0];
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
      {preview && (
        <div>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: 200, marginTop: 8 }}
          />
        </div>
      )}
      <button type="submit">Create</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
