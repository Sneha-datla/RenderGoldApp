import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Email or phone
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const form = new FormData();
  form.append('identifier', formData.identifier);
  form.append('password', formData.password);

  try {
    const response = await axios.post(
      'https://adminapp-1-nk19.onrender.com/users/login',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // 👈 Important!
        },
      }
    );

    setSuccess('Login successful!');
    console.log('Login Response:', response.data);
  } catch (err) {
    setError('Invalid credentials');
    console.error(err);
  }
};



  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Welcome Back</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={formData.identifier}
          onChange={handleChange}
          style={styles.input}
        />
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div style={styles.forgotContainer}>
          <span style={styles.forgot}>Forgot Password?</span>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <Link to="/users">
  <button className="btn btn-warning text-white" style={styles.button}>Login</button>
</Link>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  input: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    cursor: 'pointer',
    fontSize: 18,
  },
  forgotContainer: {
    textAlign: 'right',
    marginTop: 4,
  },
  forgot: {
    color: '#FEC601',
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#FEC601',
    border: 'none',
    color: '#000',
    padding: 14,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 10,
    cursor: 'pointer',
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: -10,
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: -10,
  },
};

export default LoginForm;
