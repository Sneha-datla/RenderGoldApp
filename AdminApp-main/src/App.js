import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import SellerTable from './pages/SellerTable';
import GoldLoanRequest from './pages/GoldLoanRequest';  
import SignupForm from './pages/signupform';
import LoginForm from './pages/Loginform';
import SellGoldForm from './pages/SellGoldForm';
import GoldLoanRequestForm from './pages/GoldLoanRequestForm';
import AddDeliveryAddress from './pages/addDeliveryAddress';
import SelectDeliveryAddress from './pages/SelectDeliveryAddress';
import Editprofile from './pages/editprofile';

import './App.css';

const App = () => (
  <Router>
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/addproduct" element={<AddProduct />}/>
          <Route path="/SellerTable" element={<SellerTable />} />
          <Route path='/GoldLoanRequest' element={<GoldLoanRequest/>} />
          <Route path="/signup" element={<SignupForm/>} />
          <Route path="/Login" element={<LoginForm/>} />
          <Route path="/SellGoldform" element={<SellGoldForm/>} />
          <Route path="/GoldLoanRequestForm" element={<GoldLoanRequestForm/>} />
          <Route path="/addAddress" element={<AddDeliveryAddress/>}/>
          <Route path="/selectDelivery" element={<SelectDeliveryAddress/>}/>
           <Route path="/EditProfile" element={<Editprofile/>}/>

        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
