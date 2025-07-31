import React, { useState } from 'react';
import axios from 'axios';
const AddProduct = () => {
  const [product, setProduct] = useState({
    productId: '',
    title: '',
    purity: '',
    price: '',
    stock: '',
    featured: 'No',
   image_urls: [],

  });

const handleChange = (e) => {
  const { name, value, type, files } = e.target;
  if (type === 'file') {
    setProduct({ ...product, [name]: Array.from(files) }); // ⬅️ multiple files
  } else {
    setProduct({ ...product, [name]: value });
  }
};




const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("productId", product.productId);
  formData.append("title", product.title);
  formData.append("purity", product.purity);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("featured", product.featured);

  // Append each image individually
  product.image_urls.forEach((file) => {
    formData.append("image_urls", file); // ⬅️ use same name as multer
  });

  try {
    const response = await axios.post('https://adminapp-1-nk19.onrender.com/products/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Product added:', response.data);
    alert('Product added successfully!');
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product!');
  }
};



  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Product</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Product ID</label>
          <input
            type="text"
            name="productId"
            value={product.productId}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Purity</label>
          <select
            name="purity"
            value={product.purity}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="18K">18K</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Featured</label>
          <select
            name="featured"
            value={product.featured}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Product Image</label>
         <input
  type="file"
  name="image_urls"
  accept="image/*"
  multiple
  onChange={handleChange}
  required
/>

        </div>

        <button type="submit" style={styles.button}>Add Product</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 370px',
    backgroundColor: '#ffffff',
    minHeight: '60vh',
    maxWidth: '6000px',
    margin: 'auto',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  button: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default AddProduct;
