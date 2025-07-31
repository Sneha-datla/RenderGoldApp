import React, { useState, useEffect } from 'react';

const SelectDeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // Fetch addresses for the logged-in user
  useEffect(() => {
    const fetchAddresses = async () => {
      const user = JSON.parse(localStorage.getItem('user')); // or just use 'userId' if you only store that
      if (user && user.id) {
        try {
          const res = await fetch(`https://adminapp-1-nk19.onrender.com/users/loginaddress?userId=${user.id}`);
          const data = await res.json();
          setAddresses(data);
        } catch (err) {
          console.error('Failed to fetch addresses:', err);
        }
      }
    };

    fetchAddresses();
  }, []);

  const handleSelect = (index) => {
    setSelectedAddressIndex(index);
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: 450,
      margin: '0 auto',
      padding: '10px',
      backgroundColor: '#fff',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      padding: '10px 0',
      borderBottom: '1px solid #ddd',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '10px 0',
    },
    addressCard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '10px 0',
      borderBottom: '1px solid #f1f1f1',
      cursor: 'pointer',
    },
    addressRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    name: {
      fontWeight: 'bold',
    },
    tag: {
      backgroundColor: '#e5f0ff',
      color: '#0066ff',
      fontSize: '12px',
      padding: '2px 6px',
      borderRadius: '6px',
      marginLeft: '6px',
    },
    addressText: {
      marginLeft: '26px',
      fontSize: '14px',
      color: '#444',
    },
    addNew: {
      color: '#0066ff',
      fontWeight: 'bold',
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'right',
      marginTop: '-20px',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>&larr; Order Summary</span>
        <span>&times;</span>
      </div>

      <div style={styles.title}>Select delivery address</div>

      <div style={styles.addNew}>+ Add New</div>

      {addresses.map((item, index) => (
        <div
          key={index}
          style={styles.addressCard}
          onClick={() => handleSelect(index)}
        >
          <div style={styles.addressRow}>
            <span>{item.icon || '📍'}</span>
            <span style={styles.name}>
              {item.name}
              {index === selectedAddressIndex && (
                <span style={styles.tag}>Currently selected</span>
              )}
            </span>
          </div>
          <div style={styles.addressText}>      
            {item.flat}, {item.street}, {item.city}, {item.state}
</div>
        </div>
      ))}
    </div>
  );
};

export default SelectDeliveryAddress;
