import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await axios.post(
      "https://adminapp-1-nk19.onrender.com/users/login",
      {
        identifier: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login successful:", response.data);
    // Optionally store user data or token here
    navigate("/Dashboard"); // Redirect on successful login
  } catch (err) {
    console.error("Login error:", err);
    alert("Invalid email or password");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="shield"
          style={styles.image}
        />
      </div>
      <div style={styles.rightPane}>
        <div style={styles.form}>
          <h2 style={styles.logo}>
            <span role="img" aria-label="shield">🛡️</span>
            <span style={{ fontWeight: "bold" }}>Admin</span>Panel
          </h2>
          <h3>Welcome Back</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <div style={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>
          <button style={styles.button} onClick={handleLogin}>
            ➜ Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftPane: {
    flex: 1,
    background: "linear-gradient(to bottom right, #f6a100, #e38e00)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "200px",
    height: "200px",
  },
  rightPane: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "300px",
  },
  logo: {
    color: "#e38e00",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    backgroundColor: "#e38e00",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;
