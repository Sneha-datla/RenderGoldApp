import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://rendergoldapp-1.onrender.com/users/all');
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
      const res = await axios.delete(`https://rendergoldapp-1.onrender.com/users/${id}`);
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
      {/* Header */}
      <div style={styles.header}>
        <h4 style={styles.title}>👥 User Management</h4>
        <button style={styles.addButton}>+ Add User</button>
      </div>

      {/* Search Bar */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="🔍 Search users..."
          className="form-control"
          style={styles.search}
        />
      </div>

      {/* User Table */}
      <div style={styles.tableWrapper}>
        <table className="table table-hover table-bordered" style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th><input type="checkbox" /></th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={styles.tableRow}
              >
                <td><input type="checkbox" /></td>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td style={{ textAlign: 'center' }}>
                  <FaEdit style={styles.iconEdit} title="Edit User" />
                  <FaTrash
                    style={styles.iconTrash}
                    title="Delete User"
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
      </div>

      {/* Modal for User Details */}
      {selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h5 style={styles.modalTitle}>📄 User Details</h5>
            <p style={styles.userDetail}><strong>ID:</strong> {selectedUser.id}</p>
            <p style={styles.userDetail}><strong>Full Name:</strong> {selectedUser.full_name}</p>
            <p style={styles.userDetail}><strong>Email:</strong> {selectedUser.email}</p>
            <p style={styles.userDetail}><strong>Password:</strong> {selectedUser.password}</p>
            <p style={styles.userDetail}><strong>Phone:</strong> {selectedUser.phone}</p>
            <button style={styles.closeButton} onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '20px',
    backgroundColor: '#eef3f8',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontWeight: '600',
    color: '#1a237e',
    margin: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1a73e8',
    border: 'none',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: '0.3s',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  search: {
    maxWidth: '250px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    padding: '6px 10px',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  table: {
    marginBottom: 0,
  },
  tableHead: {
    backgroundColor: '#f1f3f4',
    color: '#333',
    fontWeight: '600',
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  iconEdit: {
    color: '#1a73e8',
    marginRight: '10px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  iconTrash: {
    color: '#e53935',
    cursor: 'pointer',
    fontSize: '16px',
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
    padding: '10px',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    width: '450px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    textAlign: 'left',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  modalTitle: {
    color: '#1a237e',
    marginBottom: '20px',
    fontWeight: '700',
    fontSize: '20px',
  },
  userDetail: {
    fontSize: '18px',
    marginBottom: '10px',
    lineHeight: '1.6',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    border: 'none',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default UserManagement;
