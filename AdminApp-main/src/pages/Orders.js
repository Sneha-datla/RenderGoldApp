import React, { useState, useEffect } from 'react';
import '../App.css';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://rendergoldapp-1.onrender.com/order/all`);
      const data = await response.json();
setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

const handleStatusChange = async (orderId, newStatus) => {
  try {
    // Call your backend API to update the status in the database
    const res = await fetch('https://rendergoldapp-1.onrender.com/order/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    const result = await res.json();

    if (res.ok) {
      // If backend update is successful, update the frontend state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } else {
      console.error('Failed to update status:', result.message);
    }
  } catch (err) {
    console.error('Error updating order status:', err);
  }
};


  return (
    <div className="order-container">
      <h2>Order Details</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)}>
          <option value="">All Purity</option>
          <option value="18K">18k</option>
          <option value="22K">22k</option>
          <option value="24K">24k</option>
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">Price Range</option>
          <option value="low">Below $10,000</option>
          <option value="mid">$10,000 - $30,000</option>
          <option value="high">Above $30,000</option>
        </select>

        <button className="export-btn">📁 Export</button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Quantity</th>
              <th>Purity</th>
              <th>Price</th>
              <th>Addresses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.flatMap((order, orderIndex) =>
               (order.orderSummary || [])
  .filter(item => {
    const matchTitle = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchPurity = purityFilter === '' || item.purity === purityFilter;
    const matchPrice =
      priceFilter === '' ||
      (priceFilter === 'low' && item.price < 10000) ||
      (priceFilter === 'mid' && item.price >= 10000 && item.price <= 30000) ||
      (priceFilter === 'high' && item.price > 30000);

    return matchTitle && matchPurity && matchPrice;
  })
                  .map((item, itemIndex) => (
                    <tr key={`${orderIndex}-${itemIndex}`}>
                      <td>
                        <img src={item.image[0]} alt={item.title} width="50" />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td><span className="purity-badge">{item.purity}</span></td>
                      <td>${item.price?.toLocaleString()}</td>
                        <td>
                        {order.address ? (
                          <div className="address-info">
                            <strong>{order.address.name}</strong><br />
                            {order.address.flat}, {order.address.street}<br />
                            {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                            <small>{order.address.mobile}</small><br />
                            <em>{order.address.addressType}</em>
                          </div>
                        ) : (
                          'No address found'
                        )}
                      </td>
                      <td><span className={`status-badge`}>{order.status || 'Processing'}</span></td>
                      <td>
                        <button onClick={() => handleStatusChange(order.id, 'processing')} className="btn-processing">🕐 Processing</button>
                        <button onClick={() => handleStatusChange(order.id, 'approved')} className="btn-approve">✅ Approve</button>
                        <button onClick={() => handleStatusChange(order.id, 'completed')} className="btn-complete">🏁 Complete</button>
                      </td>
                    </tr>
                  ))
              )
            ) : (
              <tr><td colSpan="7">No orders found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderTable;
