import React, { useState } from 'react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    mobile: '+91 9876543210',
    password: 'password123',
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Changes saved!');
    console.log(formData);
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '30px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      backgroundColor: '#fff',
    },
    title: {
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '14px',
    },
    passwordWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    toggleIcon: {
      position: 'absolute',
      right: '10px',
      cursor: 'pointer',
    },
    button: {
      backgroundColor: '#fcd401',
      color: '#000',
      border: 'none',
      padding: '12px',
      width: '100%',
      fontWeight: 'bold',
      fontSize: '16px',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Edit Profile</div>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />

        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label style={styles.label}>Mobile Number</label>
        <input
          style={styles.input}
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passwordWrapper}>
          <input
            style={styles.input}
            type={formData.showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={togglePasswordVisibility} style={styles.toggleIcon}>
            {formData.showPassword ? '👁‍🗨' : '👁️'}
          </span>
        </div>

        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
