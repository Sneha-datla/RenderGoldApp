import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://adminapp-1-nk19.onrender.com/users/all');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Delete user using real API call
  const deleteUser = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;
    try {
      const res = await axios.delete(`https://adminapp-1-nk19.onrender.com/users/${id}`);
      console.log('User deleted:', res.data);
      alert(`Deleted user ID: ${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h4>User Management</h4>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      <div style={styles.controls}>
        <input type="text" placeholder="🔍 Search users..." className="form-control" style={styles.search} />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
       
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
              <td><input type="checkbox" /></td>
              <td>{user.id}</td>
              <td>{user.full_name} </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <FaEdit style={styles.iconEdit} />
               <FaTrash
  style={styles.iconTrash}
  onClick={(e) => {
    e.stopPropagation();         
    deleteUser(user.id);         
  }}
/>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for User Details */}
      {selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h5>User Details</h5>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Full Name:</strong> {selectedUser.full_name} </p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Password:</strong> {selectedUser.password}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
           
           
            <button className="btn btn-secondary mt-2" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    alignItems: 'center',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  search: {
    maxWidth: '200px',
  },
  iconEdit: {
    color: '#007bff',
    marginRight: '10px',
    cursor: 'pointer',
  },
  iconTrash: {
    color: 'red',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    textAlign: 'left',
  },
};

export default UserManagement;
