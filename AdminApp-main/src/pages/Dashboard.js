import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
      const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Transactions',
      data: [65, 58, 80, 81, 56, 55, 40],
      borderColor: 'gold',
      tension: 0.4,
      fill: false
    }],
  };

  const barData = {
    labels: ['Gold Bars', 'Coins', 'Jewelry', 'Bullion', 'Certificates'],
    datasets: [{
      label: 'Demand',
      data: [300, 450, 320, 290, 200],
      backgroundColor: 'orange'
    }]
  };

  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e38e00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <div className="cards">
        <div className="card">
          <h4>Total Users</h4>
          <p>24,591 <span className="success">+12.5%</span></p>
        </div>
        <div className="card">
          <h4>Active Listings</h4>
          <p>1,203 <span className="danger">-2.3%</span></p>
        </div>
        <div className="card">
          <h4>Revenue</h4>
          <p>$891,542 <span className="success">+8.1%</span></p>
        </div>
        <div className="card">
          <h4>Orders</h4>
          <p>3,845 <span className="success">+5.7%</span></p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h5>Daily Transactions</h5>
          <Line data={lineData} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart">
          <h5>Product Demand</h5>
          <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
