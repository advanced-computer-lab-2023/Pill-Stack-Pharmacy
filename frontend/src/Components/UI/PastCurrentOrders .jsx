import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Center } from '@chakra-ui/react';

const PastCurrentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8001/patient/orders', { withCredentials: true })
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.log('Error fetching data: ', error);
      });
  }, []);

  return (
    <Box p="4">
      <Center>
        <h2>Past and Current Orders</h2>
      </Center>
      <Table variant="striped" colorScheme="teal" mt="4">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Order Date</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map(order => (
              <Tr key={order.paymentIntentId}>
                <Td>{order.paymentIntentId}</Td>
                <Td>{new Date(order.date_added).toLocaleDateString()}</Td>
                <Td>{order.status}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="3">No orders found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PastCurrentOrders;
