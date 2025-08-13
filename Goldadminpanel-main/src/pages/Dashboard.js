import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSellers, setTotalSellers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [productData, setProductData] = useState({ labels: [], datasets: [] });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all users
        const usersRes = await axios.get('https://rendergoldapp-1.onrender.com/users/all');
        if (Array.isArray(usersRes.data)) {
          setTotalUsers(usersRes.data.length);
        }

        // Get all sellers
        const sellersRes = await axios.get('https://rendergoldapp-1.onrender.com/seller/all');
        if (Array.isArray(sellersRes.data)) {
          setTotalSellers(sellersRes.data.length);
        }

        // Get all orders and calculate revenue
        const ordersRes = await axios.get('https://rendergoldapp-1.onrender.com/order/all');
        if (Array.isArray(ordersRes.data)) {
          setTotalOrders(ordersRes.data.length);

          let revenue = 0;
          ordersRes.data.forEach(order => {
            if (Array.isArray(order.order_summary)) {
              order.order_summary.forEach(item => {
                if (item.price) {
                  revenue += Number(item.price) * (item.quantity || 1);
                }
              });
            }
          });
          setTotalRevenue(revenue);
        }

        // Get total loan request users
        const loansRes = await axios.get('https://rendergoldapp-1.onrender.com/loan/all');
        if (Array.isArray(loansRes.data)) {
          setTotalLoans(loansRes.data.length);
        }

        // Get product data for chart
        const productsRes = await axios.get('https://rendergoldapp-1.onrender.com/products/all');
        if (Array.isArray(productsRes.data)) {
          const productCountByTitle = {};
          productsRes.data.forEach(product => {
            const title = product.title || 'Unknown';
            productCountByTitle[title] = (productCountByTitle[title] || 0) + 1;
          });

          const labels = Object.keys(productCountByTitle);
          const counts = Object.values(productCountByTitle);

          setProductData({
            labels,
            datasets: [
              {
                label: 'Product Count',
                data: counts,
                backgroundColor: 'orange'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Logout Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e38e00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <h4>Total Users</h4>
          <p>{totalUsers.toLocaleString()}</p>
        </div>
        <div className="card">
          <h4>Total Sellers</h4>
          <p>{totalSellers.toLocaleString()}</p>
        </div>
        <div className="card">
          <h4>Total Orders</h4>
          <p>{totalOrders.toLocaleString()}</p>
        </div>
        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="card">
          <h4>Total Loan Requests</h4>
          <p>{totalLoans.toLocaleString()}</p>
        </div>
      </div>

      {/* Product Chart */}
      <div className="charts">
        <div className="chart">
          <h5>Product Count by Title</h5>
          <Bar
            data={productData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
