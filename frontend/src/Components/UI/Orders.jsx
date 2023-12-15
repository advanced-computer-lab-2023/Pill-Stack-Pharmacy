import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";
import { Buffer } from 'buffer';
import styled from 'styled-components'
function Orders({currentMonth}) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            
            try {
                
                const response = await axios.post('http://localhost:8001/order/salesOrder', { month:currentMonth }, { withCredentials: true });
                console.log(response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching monthly revenue:', error);
            }
        };

        fetchOrders();
    }, [currentMonth]);
    return (
        <Section>
        <div className="orders">
      <div className="orders__details">
          <div>
                <h4>Recent Orders</h4> 
          </div>
      
        </div>
        <div className="orders__table">
            <table>
            <tr>
              <th>Tracking ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
            {orders.map((order,index)=>(
                order.items.map((item,index)=>(
                    <tr>
                    <td>{order._id.toString().substr(0, 8)}</td>
                    <td className="img">{item.name}
                   
                       <span></span></td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>{item.price*item.quantity}</td>
                    <td>{new Date(order.date_added).toLocaleDateString('en-US')}
                    </td>
                    <td ><button>{order.status}</button></td>
                  </tr>

               ))
                

            ))}
           

            </table>
        </div>
        </div>
        </Section>
    )
}

export default Orders
const Section = styled.section`
.orders {
    color: black;
    width: 100%;
    .orders__details {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0 ;
        div {
            display: flex;
            gap: 1rem;
            button {
                padding: 0.4rem 1rem;
                border: none;
                cursor: pointer;
                background-color: white;
                color: #668DFF;
                font-weight: bold;
            }
        }
    }
    .orders__table {
        overflow-y: auto; 
        max-height: 400px; 
  
        margin: 1rem 0;
        table {
            border-collapse: collapse;
            width: 100%;
            th, td {
                text-align: center;
                padding: 5px;
                justify-content: space-evenly;
                button {
border-radius: 0.3rem;
padding: 0.4rem 1rem;
border: none;
cursor: pointer;
background-color: #EEF4FF;
color: blue;
font-weight: bold;
                }
                img {
                    height: 2rem;
                    width: 2rem;
                }
                span {
                    margin-top: 0.2 rem;
                }
            }
            .img {
                display: flex;
                justify-content: center;
            }
        }
    }
}
`;