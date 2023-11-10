import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetailsPage = () => {
  const [orderDetailsArray, setOrderDetailsArray] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/orderDetails', {
          withCredentials: true,
        }); // Replace with your actual endpoint
        setOrderDetailsArray(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, []); // Run the effect only once when the component mounts

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing':
        return {
          color: '#ff9800', // Orange color for Processing
        };
      case 'Delivered':
        return {
          color: '#4caf50', // Green color for Delivered
        };
      case 'Cancelled':
        return {
          color: '#f44336', // Red color for Cancelled
        };
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      {orderDetailsArray.length > 0 ? (
        orderDetailsArray.map((order, index) => (
          <div key={index} style={{ ...styles.orderContainer, ...getStatusStyle(order.Status) }}>
            <h2 style={styles.heading}>Order Details</h2>
            <p>Status: {order.Status}</p>
            <p>Address: {order.address}</p>
            <p>Bill: {order.bill}</p>
            <p>Date Added: {order.dateAdded}</p>

            {order.Items && order.Items.length > 0 ? (
              <>
                <h3 style={styles.subHeading}>Items:</h3>
                <div style={styles.itemsContainer}>
                  {order.Items.map((item, itemIndex) => (
                    <div key={itemIndex} style={styles.item}>
                      <p>Product ID: {item.productId}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No items in this order.</p>
            )}
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
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
  itemsContainer: {
    marginTop: '10px',
  },
  item: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
};

export default OrderDetailsPage;


