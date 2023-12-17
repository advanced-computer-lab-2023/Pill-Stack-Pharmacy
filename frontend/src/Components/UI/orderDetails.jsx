import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import {
  Box,
  Text} from '@chakra-ui/react';
  import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Buffer } from 'buffer';
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import Sidebar from '../Pages/side';

const OrderDetailsPage = () => {
  const [orderDetailsArray, setOrderDetailsArray] = useState([]);
  const [filterArray,setFilter]=useState([]);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);
  const [cancelSuccess, setCancelSuccess] = useState(false); // State for success message
  



  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8001/patient/orderDetails', {
          withCredentials: true,
        }); // Replace with your actual endpoint
        //setOrderDetailsArray(response.data);
        const allOrders =response.data;
        const pastOrders = allOrders.filter(order => order.Status === 'Delivered' || order.Status === 'Cancelled');
        const currentOrders = allOrders.filter(order => order.Status === 'Processing');
        if(filterArray=='past'){
        setOrderDetailsArray(pastOrders);
      }
      else if(filterArray=='current'){
        setOrderDetailsArray(currentOrders);
      }
      else{
        setOrderDetailsArray(response.data);
      }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [filterArray]); // Run the effect only once when the component mounts

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
  const calculateProgressBarWidth = (status) => {
    switch (status) {
      case 'Processing':
        return 25; // for example, 25% width for Processing
      case 'Delivered':
        return 100; // 100% width for Delivered
      case 'Cancelled':
        return 0; // 0% width for Cancelled
      default:
        return 0;
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post('http://localhost:8001/order/cancel-order', {
        orderId:orderId,
      }, { withCredentials: true });
  
      if (response.status === 200 && response.data === 'Order cancelled successfully') {
        // Order cancellation was successful, update the local state
        setOrderDetailsArray((orders) => {
          return orders.map((order) => {
            if (order._id === orderId) {
              return { ...order, Status: 'Cancelled' };
            }
            return order;
          });
        });
        setCancelSuccess(true); // Show success message

      } else if (response.status === 404) {
        // Order not found, handle as needed
        console.log('Order not found');
      } else {
        // Handle other errors
        console.log('Order cancellation failed');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };
  
  return (
    <>
      <Navigation
      pagetitle={"My Orders"}/>
       <Sidebar
      />
      <div className="content">
    <nav bg={'white'} class="navbar navbar-expand-lg navbar-blue bg-4bbbf3" height=" 100px" >
    <div class="container-fluid">
      <a class="navbar-brand" href="#"></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              FILTER ORDERS
            </a>
            <ul class="dropdown-menu dropdown-menu-blue" aria-labelledby="navbarDarkDropdownMenuLink">
            <li><a class="dropdown-item" onClick={() => setFilter('past')}>Past Orders</a></li>
          <li><a class="dropdown-item" onClick={() => setFilter('current')}>Current Orders</a></li>
  <li><a class="dropdown-item" onClick={() => setFilter('all')}>All Orders</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
        {orderDetailsArray.length > 0 ? (
          orderDetailsArray.map((order) => (
            <section
            className="h-100 gradient-custom"
            style={{ backgroundColor: "#eee" }}
          >
            <MDBContainer className="py-5 h-100">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="10" xl="8">
                  <MDBCard style={{ borderRadius: "20px" }}>
                    <MDBCardHeader className="px-4 py-5"
                     style={{
                      backgroundColor: "#4bbbf3",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}>
                          <h3 className="text-white">Order Details</h3>

                    </MDBCardHeader>
                    <MDBCardBody className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <p
                          className="lead fw-normal mb-0"
                          style={{ color: "#4bbbf3" }}
                        >
                          Receipt
                        </p>
                        <p className="text-muted mb-0 small">Order Status: {order.Status}</p>

                       
                      </div>
                      <MDBCardBody>
              {order.Items.map((item, index) => (
              <MDBCard key={index} className="shadow-0 border mb-4">
                <MDBCardBody>
                  <MDBRow>
              {/* Customize this structure based on your item properties */}
              <MDBCol md="2">
                {/* Display item image */}
                <MDBCardImage
                src={`data:${item.image.contentType};base64, ${Buffer.from(item.image.data).toString('base64')}`}
                fluid
                 alt={item.name} 
                   // Assuming name is the property holding the item name
                />
              </MDBCol>
              {/* Display other item details */}
              <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                <p className="text-muted mb-0">{item.name}</p>
              </MDBCol>
              <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                <p className="text-muted mb-0 small">Qty: {item.quantity}</p>
              </MDBCol>
              <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                <p className="text-muted mb-0 small">${item.price}</p>
              </MDBCol>
            </MDBRow>
            <hr
                            className="mb-4"
                            style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                          />
                          <MDBRow className="align-items-center">
                            <MDBCol md="2">
                              <p className="text-muted mb-0 small">Track Order</p>
                            </MDBCol>
                            <MDBCol md="10">
                              <MDBProgress
                                style={{ height: "6px", borderRadius: "16px" }}
                              >
                                <MDBProgressBar
                                  style={{
                                    borderRadius: "16px",
                                    backgroundColor: "#4bbbf3",
                                  }}
                                  width={calculateProgressBarWidth(order.Status)}
                                  valuemin={0}
                                  valuemax={100}
                                />
                              </MDBProgress>
                              <div className="d-flex justify-content-around mb-1">
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                  Out for delivary
                                </p>
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                  Delivered
                                </p>
                              </div>
                            </MDBCol>
                          </MDBRow>
                            </MDBCardBody>
                          </MDBCard>
                        ))}
                      </MDBCardBody>
    
             
    
                      
    
                      <div className="d-flex justify-content-between pt-2">
                        <p className="fw-bold mb-0">Order Details</p>
                        <p className="text-muted mb-0">
                          <span className="fw-bold me-4">Total</span> {(order.bill).toFixed(2)}
                        </p>
                      </div>
    
                      <div className="d-flex justify-content-between pt-2">
                        <p className="text-muted mb-0">Invoice Number : 788152</p>
                        <p className="text-muted mb-0">
                          <span className="fw-bold me-4">Delivery Charges</span>{" "}
                          Free
                        </p>
                      </div>
    
                      <div className="d-flex justify-content-between">
                        <p className="text-muted mb-0">
                          Invoice Date : { new Date(order.dateAdded).toLocaleString('en-US')
                          }
                        </p>
                       
                      </div>
    
                      <div className="d-flex justify-content-between mb-5">
                        <p className="text-muted mb-0">
                          Recepits Voucher :  {order._id}
                        </p>
                        <p className="text-muted mb-0">
                          <span className="fw-bold me-4">Total paid:</span>{" "}
                          {(order.bill).toFixed(2)}
                        </p>
                      </div>

                    </MDBCardBody>
                    <MDBCardFooter
                      className="border-0 px-4 py-2"
                      style={{
                        backgroundColor: "#4bbbf3",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                    
                      <MDBTypography
                        tag="h5"
                        className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                      >
                          {order.Status === 'Processing' && (
              <Button
                onClick={() => handleCancelOrder(order._id)}
                style={styles.cancelButton}
              >
                Cancel Order
              </Button>
            )}
                        
                      </MDBTypography>
                    </MDBCardFooter>
                    
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
             
          </section>
          ))
        ) : (
          <p>No orders found.</p>
          
        )}
      {cancelSuccess && (
      <Alert status="success">
        <AlertIcon />
        <AlertTitle>Confirmation</AlertTitle>
        <AlertDescription>Order was successfully Cancelled </AlertDescription>
      </Alert>
    )}
      </div>
    </>
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