import React, { useState } from 'react';
import axios from 'axios';

const SellGoldForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    weight: '',
    purity: '',
    condition: '',
    price: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage('You can upload a maximum of 5 images.');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const { name, category, weight, purity, condition, price, description } = formData;
    if (!name || !category || !weight || !purity || !condition || !price || !description) {
      setMessage('Please fill all fields.');
      return;
    }

    const formPayload = new FormData();
    images.forEach((img) => formPayload.append('images', img));
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      const response = await axios.post('https://adminapp-1-nk19.onrender.com/seller/add', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Listing submitted successfully!');
      console.log(response.data);

      // Reset form
      setFormData({
        name: '',
        category: '',
        weight: '',
        purity: '',
        condition: '',
        price: '',
        description: '',
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      setMessage('Failed to submit listing.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Sell Gold</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={styles.upload}
        />

        <input
          type="text"
          name="name"
          placeholder="e.g. Gold Necklace"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Category</option>
          <option value="Necklace">Necklace</option>
          <option value="Ring">Ring</option>
          <option value="Bracelet">Bracelet</option>
          <option value="Coin">Coin</option>
        </select>

        <input
          type="number"
          name="weight"
          placeholder="Weight (g)"
          value={formData.weight}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="purity"
          value={formData.purity}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Purity</option>
          <option value="24K">24K</option>
          <option value="22K">22K</option>
          <option value="18K">18K</option>
        </select>

        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Enter Price ₹"
          value={formData.price}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Describe your item in detail..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
        />

        {message && <p style={styles.message}>{message}</p>}

        <button type="submit" style={styles.button}>Submit Listing</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 420,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  textarea: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  upload: {
    border: '2px dashed #FEC601',
    padding: 12,
    borderRadius: 10,
    cursor: 'pointer',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FEC601',
    border: 'none',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
};

export default SellGoldForm;
