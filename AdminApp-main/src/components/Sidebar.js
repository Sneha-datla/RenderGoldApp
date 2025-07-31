import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaShoppingCart, FaBell,} from 'react-icons/fa';

const Sidebar = () => (
  <div className="sidebar">
    <h2 className="brand">GBuyers</h2>
    <ul>
      <li><Link to="/dashboard"><FaTachometerAlt style={{ marginRight: '10px' }} />Dashboard</Link></li>
      <li><Link to="/users"><FaUsers style={{ marginRight: '10px' }} />Users</Link></li>
      <li><Link to="/products"><FaBox style={{ marginRight: '10px' }} />Products</Link></li>
      <li><Link to="/orders"><FaShoppingCart style={{ marginRight: '10px' }} />Orders</Link></li>
      <li><Link to="/SellerTable"><FaUsers style={{ marginRight: '10px' }} />Seller Details</Link></li>
      <li><Link to="/GoldLoanRequest"><FaUsers style={{ marginRight: '10px' }} />GoldLoanRequest</Link></li>
      <li><Link to="/signup">Signup</Link></li>
      <li><Link to="/addAddress">addDeliveryAddress</Link></li>
     <li><Link to="/selectDelivery">Selectaddress</Link></li>
     <li><Link to="/EditProfile">editProfileScreen</Link></li>
     <li><Link to="/GoldLoanRequestForm">GoldLoanRequestForm</Link></li>
      <li><Link to="/SellGoldform">SellGoldForm</Link></li>
      <li><Link to="/notifications"><FaBell style={{ marginRight: '10px' }} />Notifications</Link></li>
      <li><Link to="/Login">Login</Link></li>

       
    </ul>
  </div>
);

export default Sidebar;
