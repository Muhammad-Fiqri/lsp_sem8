import "./stylesheet/Login.css"
import {useRef, useState} from "react"

export default function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleLogin = (formData) => {
    const usernameInput = formData.get("username");
    const passwordInput = formData.get("password");

    setUsername(usernameInput);
    setPassword(passwordInput);

    const response = fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(data => {
      alert(data.message);

      if (data.success) {
        window.location.href = "/dashboard"; // Change this to your desired route
      }
    });
  }

  const handleSignup = (formData) => {
    const usernameInput = formData.get("username");
    const passwordInput = formData.get("password");

    setUsername(usernameInput);
    setPassword(passwordInput);


     const response = fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Signup successful! Please wait for database admin approval.");
      }
    });
  }

  return (
    <div className="login">
        <div className="text-logo">
          <h1>
            Construction<br></br>Material<br></br>Manager
          </h1>
          <img src="/public/Logo.svg" alt="logo" />
        </div>
        <div className="login-card">
          <h1>{mode === "login" ? "Log in" : "Sign up"}</h1>
          <span>{mode === "login" ? "New Admin? " : "Already an Admin?"} <a href="#" onClick={(e) => {
            e.preventDefault();
            setMode(mode === "login" ? "signup" : "login");
          }}>{mode === "login" ? "Sign up (Require Database Admin Approval)" : " Log in"}</a></span>
          <form action={mode === "login" ? handleLogin : handleSignup}>
            <label htmlFor="username">Username</label>
            <input ref={usernameRef} value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Enter your username" />

            <label htmlFor="password">Password</label>
            <input ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter your password" />

            <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
          </form>
        </div>
    </div>
  )
}