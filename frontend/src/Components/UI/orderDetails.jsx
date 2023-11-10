import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Make a request to your backend to get order details
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/orderDetails', {
          withCredentials: true,
        }); // Replace with your actual endpoint
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, []); // Run the effect only once when the component mounts

  return (
    <div style={styles.container}>
      {orderDetails && Object.keys(orderDetails).length > 0 ? (
        <div style={styles.orderDetailsContainer}>
          <h2 style={styles.heading}>Order Details</h2>
          <p>Status: {orderDetails.Status}</p>
          <p>Address: {orderDetails.address}</p>
          <p>Bill: {orderDetails.bill}</p>
          <p>Date Added: {orderDetails.dateAdded}</p>

          {orderDetails.Items && orderDetails.Items.length > 0 ? (
            <>
              <h3 style={styles.subHeading}>Items:</h3>
              <ul style={styles.list}>
                {orderDetails.Items.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <p>Product ID: {item.productId}</p>
                    <p>Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      ) : (
        <p style={styles.noOrders}>No orders yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  orderDetailsContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
  noOrders: {
    fontSize: '16px',
    color: '#888',
  },
};

export default OrderDetails;