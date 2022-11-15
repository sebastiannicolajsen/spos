import { useState } from "react";
import api from "../../spos-client";
import { btn, input } from "../../components/styles";

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
    <div className="m-auto w-1/4 content-center flex grid">
      <div className="grid grid-cols-2 pb-5">
        <div>username</div>
        <div>
          <input
            className={input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div>password</div>
        <div>
          {" "}
          <input
            className={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
      </div>

      <br />
      <button className={btn} onClick={handleSubmit}>
        login
      </button>
    </div>
  );
}

export default LoginPage;
