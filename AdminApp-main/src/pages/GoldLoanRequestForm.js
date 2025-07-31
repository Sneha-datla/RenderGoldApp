import React, { useState } from 'react';
import axios from 'axios';

const GoldLoanRequestForm = () => {
  const [formData, setFormData] = useState({
    bank: '',
    fullname: '',
    mobile: '',
    address: '',
    goldweight: '',
    goldtype: '',
    idproof: '',
    loanamount: '',
    remarks: '',
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      setMessage('Please upload at least 3 images.');
    } else {
      setImages(files);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      bank, fullname, mobile, address,
      goldweight, goldtype, idproof, loanamount
    } = formData;

    if (
      !bank || !fullname || !mobile || !address ||
      !goldweight || !goldtype || !idproof || !loanamount
    ) {
      setMessage('Please fill all required fields.');
      return;
    }

    if (images.length < 3) {
      setMessage('Please upload at least 3 images of gold items.');
      return;
    }

    const data = new FormData();
    images.forEach((img) => data.append('image', img));
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post('https://adminapp-1-nk19.onrender.com/loan/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Request submitted successfully!');
      console.log(response.data);

      setFormData({
        bank: '',
        fullname: '',
        mobile: '',
        address: '',
        goldweight: '',
        goldtype: '',
        idproof: '',
        loanamount: '',
        remarks: '',
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      setMessage('Submission failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Doorstep Gold Loan Request</h2>
      <p style={styles.subheading}>Upload minimum 3 images of gold item</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={styles.upload}
        />

        <select name="bank" value={formData.bank} onChange={handleChange} style={styles.input}>
          <option value="">Select Bank</option>
          <option value="SBI">SBI</option>
          <option value="HDFC">HDFC</option>
          <option value="Axis">Axis</option>
          <option value="ICICI">ICICI</option>
        </select>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="goldweight"
          placeholder="Gold Weight in grams"
          value={formData.goldWeight}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="goldtype"
          placeholder="Gold Type (e.g., Chain, Coin)"
          value={formData.goldType}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="idproof"
          placeholder="ID Proof (e.g., Aadhar, PAN)"
          value={formData.idProof}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="loanamount"
          placeholder="Expected Loan Amount"
          value={formData.loanAmount}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks (Optional)"
          value={formData.remarks}
          onChange={handleChange}
          style={styles.input}
        />

        {message && <p style={styles.message}>{message}</p>}

        <button type="submit" style={styles.button}>Submit Request</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 450,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial',
  },
  heading: {
    textAlign: 'center',
    color: '#FEC601',
    fontWeight: 'bold',
    fontSize: 22,
  },
  subheading: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  upload: {
    padding: 10,
    border: '2px dashed #FEC601',
    borderRadius: 10,
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#FEC601',
    border: 'none',
    padding: 14,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 10,
    marginTop: 10,
    cursor: 'pointer',
  },
  message: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default GoldLoanRequestForm;
