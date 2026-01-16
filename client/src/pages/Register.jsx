import React, { useState } from "react";
import { register } from "../services/api";

export default function Register({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await register({ username, password });
      setMsg("Registered — please login");
      if (onRegistered) onRegistered();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form onSubmit={submit} className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#667eea" }}>
        Register
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
      <button type="submit">Register</button>
      {msg && (
        <p className={msg.includes("Registered") ? "form-message success" : "form-message error"}>
          {msg}
        </p>
      )}
    </form>
  );
}
