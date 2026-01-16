import React, { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.token) {
        onLogin(res.token, res.username);
      } else setMsg("No token returned");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#667eea" }}>
        Login
      </h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {msg && <p className="form-message error">{msg}</p>}
    </form>
  );
}
