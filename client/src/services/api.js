const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Return backend base (strip trailing /api if present)
const API_BASE = API_URL.replace(/\/api\/?$/, "");

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id) {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Get post failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function createPost(formData, token) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    // try to parse json or text for a helpful message
    let text;
    try {
      text = await res.text();
    } catch (e) {
      text = res.statusText;
    }
    throw new Error(`Failed to create post: ${res.status} ${text}`);
  }
  return res.json();
}

export async function updatePost(id, data, token) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: Object.assign(
      { "Content-Type": "application/json" },
      token ? { Authorization: `Bearer ${token}` } : {}
    ),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Update failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function updatePostMultipart(id, formData, token) {
  // debug: log token presence when sending multipart update
  try {
    console.log(
      "updatePostMultipart: sending token length",
      token ? token.length : null
    );
  } catch (e) {}
  // append token as query param as a fallback for environments that drop Authorization on multipart
  const url = token
    ? `${API_URL}/posts/${id}?token=${encodeURIComponent(token)}`
    : `${API_URL}/posts/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Update failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function deletePost(id, token) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Delete failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export function getMediaUrl(filePath) {
  if (!filePath) return null;
  // Normalize backslashes (Windows) and extract filename
  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const filename = parts[parts.length - 1];
  return `${API_BASE}/upload/${encodeURIComponent(filename)}`;
}

export async function login(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Login failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function register(credentials) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Register failed: ${res.status} ${text}`);
  }
  return res.json();
}
