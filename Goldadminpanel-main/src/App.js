import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import GoldLoanRequest from './pages/GoldLoanRequest';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';
import SellerTable from './pages/SellerTable';

import Users from './pages/users';

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
          <Route path="/addproduct" element={<AddProduct />}/>
          <Route path="/SellerTable" element={<SellerTable />} />
          <Route path='/GoldLoanRequest' element={<GoldLoanRequest/>} />

        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
