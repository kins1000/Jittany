import { useState } from "react";
import { isAdmin, login, logout } from "@/lib/admin";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login(password)) {
      window.location.reload();
    } else {
      alert("Incorrect password");
    }
  };

  if (isAdmin()) {
    return (
      <button
        onClick={() => {
          logout();
          window.location.reload();
        }}
      >
        Admin Logout
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin Password"
      />
      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
