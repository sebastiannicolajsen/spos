import { useState } from "react";
import api from "../../spos-client";
import { Navigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    await api.auth.login(username, password);
    setUsername("");
  };

  if (api.user.loggedIn()) {
    window.location.href = "/";
  }

  return (
    <div>
      login page <br />
      username:
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      password:
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <br />
      <button onClick={handleSubmit}>login</button>
    </div>
  );
}

export default LoginPage;
