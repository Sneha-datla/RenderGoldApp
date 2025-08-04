import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [purityFilter, setPurityFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [products, setProducts] = useState([]);

  const API_URL = 'https://rendergoldapp-1.onrender.com/products/all';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const purityMatch = purityFilter === 'All' || product.purity === purityFilter;
    const featuredMatch = featuredFilter === 'All' || product.featured === featuredFilter;
    return purityMatch && featuredMatch;
  });
  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;
  try {
await axios.delete(`https://rendergoldapp-1.onrender.com/products/${id}`);
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
};


  return (
    <div className="products-page-wrapper">
      <style>{`
        .products-page-wrapper {
          padding: 30px;
          background-color: #fff;
          width: 150%;
          min-height: 100vh;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 25px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          font-weight: 500;
          margin-bottom: 5px;
        }

        h2 {
          font-weight: 600;
          margin: 0;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        table {
          width: 100%;
        }

        table th,
        table td {
          vertical-align: middle !important;
        }

        .badge {
          font-size: 0.9rem;
          padding: 0.4em 0.7em;
        }
      `}</style>

      <div className="products-header">
        <h2>Gold Products Management</h2>
        <Link to="/addproduct">
          <button className="btn btn-warning text-white">+ Add Product</button>
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Filter by Purity</label>
          <select
            className="form-select"
            value={purityFilter}
            onChange={(e) => setPurityFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Filter by Featured</label>
          <select
            className="form-select"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table table-bordered table-striped">
          <thead className="table-secondary">
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>Purity</th>
               <th>weight</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Productimage</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.product_id}</td>
                  <td>{product.title}</td>
                  <td>{product.purity}</td>
                    <td>{product.weight}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                   
                  <td>
                    <span
  className={`badge ${
    product.featured === true || product.featured === 'true' ? 'bg-success' : 'bg-secondary'
  }`}
>
  {product.featured === true || product.featured === 'true' ? 'Yes' : 'No'}
</span>

                  </td>
<td>
  {(Array.isArray(product.image_urls)
    ? product.image_urls
    : JSON.parse(product.image_urls)
  ).map((imgUrl, i) => (
    <img
      key={i}
      src={imgUrl} // Adjust this if your backend URL is different
      alt={`${product.title} ${i + 1}`}
      width="50"
      height="50"
      style={{ objectFit: 'cover', borderRadius: '4px', marginRight: '5px' }}
    />
  ))}
</td>

                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <FaEdit />
                    </button>
                   <button
  className="btn btn-sm btn-outline-danger"
  onClick={() => handleDelete(product.id)}
>
  <FaTrash />
</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
