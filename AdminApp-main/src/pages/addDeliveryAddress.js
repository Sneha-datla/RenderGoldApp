import React, { useState } from 'react';

const AddDeliveryAddress = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    flat: '',
    street: '',
    cod: false,
    city: '',
    state: '',
    landmark: '',
    addressType: 'Home',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressType = (type) => {
    setFormData((prev) => ({
      ...prev,
      addressType: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      alert('Please log in to save your address.');
      return;
    }

    // ✅ Attach userId to form data
    const addressData = {
      ...formData,
      userId,
    };

    try {
      const response = await fetch('https://adminapp-1-nk19.onrender.com/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Address saved successfully!');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting address:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      backgroundColor: '#fcd401',
      padding: '12px',
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#000',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '20px',
    },
    input: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    row: {
      display: 'flex',
      gap: '10px',
    },
    toggleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    btnGroup: {
      display: 'flex',
      gap: '10px',
    },
    btn: {
      flex: 1,
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: '#fff',
    },
    btnActive: {
      backgroundColor: '#fcd401',
      fontWeight: 'bold',
      borderColor: '#000',
    },
    saveBtn: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      marginTop: '20px',
      cursor: 'pointer',
    },
    label: {
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Add Delivery Address</div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="tel"
          name="mobile"
          placeholder="10-digit mobile number"
          value={formData.mobile}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="pincode"
          placeholder="6-digit pincode"
          value={formData.pincode}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="flat"
          placeholder="Flat/House No, Building"
          value={formData.flat}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="street"
          placeholder="Street, Area, Locality"
          value={formData.street}
          onChange={handleChange}
        />
        <div style={styles.toggleRow}>
          <label style={styles.label}>Select Cash on Delivery</label>
          <input
            type="checkbox"
            name="cod"
            checked={formData.cod}
            onChange={handleChange}
          />
        </div>
        <div style={styles.row}>
          <input
            style={{ ...styles.input, flex: 1 }}
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            style={{ ...styles.input, flex: 1 }}
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <input
          style={styles.input}
          type="text"
          name="landmark"
          placeholder="Near school, park, etc."
          value={formData.landmark}
          onChange={handleChange}
        />
        <div>
          <label style={styles.label}>Address Type</label>
          <div style={styles.btnGroup}>
            {['Home', 'Work', 'Other'].map((type) => (
              <button
                key={type}
                type="button"
                style={{
                  ...styles.btn,
                  ...(formData.addressType === type ? styles.btnActive : {}),
                }}
                onClick={() => handleAddressType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" style={styles.saveBtn}>
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default AddDeliveryAddress;
