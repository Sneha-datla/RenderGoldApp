import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoldLoanTable = () => {
  const [loans, setLoans] = useState([]);
  const [activeLoan, setActiveLoan] = useState(null);

  const API_URL = 'https://rendergoldapp-1.onrender.com/loan/all';

  const fetchLoans = async () => {
    try {
      const response = await axios.get(API_URL);
      setLoans(response.data.data);
    } catch (error) {
      console.error('Error fetching gold loan requests:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this loan request?')) {
      try {
await axios.delete(`https://rendergoldapp-1.onrender.com/loan/${id}`);
        fetchLoans();
        setActiveLoan(null);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleRowClick = (loan) => {
    setActiveLoan(loan.id === activeLoan?.id ? null : loan);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div>
      <h4 className="mb-3">Doorstep Gold Loan Requests</h4>

      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Image</th>
            <th>Bank Name</th>
            <th>Full Name</th>
            <th>Mobile Number</th>
            <th>Address</th>
            <th>Gold Weight (gm)</th>
            <th>Gold Type</th>
            <th>ID Proof</th>
            <th>Loan Amount</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <tr
                key={loan.id}
                className={activeLoan?.id === loan.id ? 'table-primary' : ''}
                onClick={() => handleRowClick(loan)}
              >
               <td>
  {(Array.isArray(loan.image)
    ? loan.image
    : JSON.parse(loan.image)
  ).map((imgUrl, i) => (
    <img
      key={i}
      src={imgUrl} // Adjust if needed
      alt={`Gold item ${i + 1}`}
      width="50"
      height="50"
      style={{ objectFit: 'cover', borderRadius: '4px', marginRight: '5px' }}
    />
  ))}
</td>

                <td>{loan.bank}</td>
                <td>{loan.fullname}</td>
                <td>{loan.mobile}</td>
                <td>{loan.address}</td>
                <td>{loan.goldweight}</td>
                <td>{loan.goldtype}</td>
                <td>{loan.idproof}</td>
                <td>₹{loan.loanamount}</td>
                <td>{loan.remarks}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(loan.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">No loan requests available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {activeLoan && (
        <div className="card mt-4 p-3 shadow">
          <h5 className="mb-3">Loan Request Details</h5>
          <div className="row">
            <div className="col-md-3">
              <img src={activeLoan.image} alt="Gold Item" className="img-fluid" />
            </div>
            <div className="col-md-9">
              <p><strong>Bank Name:</strong> {activeLoan.bank}</p>
              <p><strong>Full Name:</strong> {activeLoan.fullname}</p>
              <p><strong>Mobile Number:</strong> {activeLoan.mobile}</p>
              <p><strong>Address:</strong> {activeLoan.address}</p>
              <p><strong>Gold Weight:</strong> {activeLoan.goldweight} gm</p>
              <p><strong>Gold Type:</strong> {activeLoan.goldtype}</p>
              <p><strong>ID Proof Number:</strong> {activeLoan.idproof}</p>
              <p><strong>Loan Amount:</strong> ₹{activeLoan.loanamount}</p>
              <p><strong>Remarks:</strong> {activeLoan.remarks}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldLoanTable;
