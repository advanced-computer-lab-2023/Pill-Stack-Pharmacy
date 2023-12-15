import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import styled from "styled-components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineShopping } from "react-icons/ai";
import { AiOutlineTeam } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";

function Shopping({currentMonth}) {
  const [orderStats, setOrderStats] = useState({ creditOrders: 0, walletOrders: 0, cashOrders: 0 ,cancelledOrders:0});
  useEffect(() => {
    // fetch total number of orders 
    const fetchOrderStats = async () => {
      try {
        const response=await axios.post('http://localhost:8001/order/salesExtraStats',{month:currentMonth},{ withCredentials: true });
        console.log(response.data);
        if(response.data!=='no sales found for this month') {
            setOrderStats(response.data);
        } else{
            setOrderStats([{ totalOrders: 0, totalItems: 0, totalRevenue: 0 }])
        }          

    } catch (error) {
        console.error('Error fetching medicine details:', error);
        // Handle errors here
      }
    };
    fetchOrderStats();
  }, [currentMonth]);

    return (
        <Section>
        <div className="shopping ">
        <div className="design ">
            <div className="logo img1">
            <AiOutlineShoppingCart />
        </div>
        </div>
        <div className="total ">
        <h6>CREDIT ORDERS</h6>
        
      
        </div>
        <div className="number ">
        <h5>{orderStats.creditOrders}</h5>
     
        </div>
          
        </div>
        <div className="shopping ">
        <div className="design ">
            <div className="logo img2">
            <AiOutlineShoppingCart />
        </div>
        </div>
        <div className="total ">
        <h6>WALLET ORDERS</h6>
        
      
        </div>
        <div className="number ">
        <h5>{orderStats.walletOrders}</h5>
      
        </div>
          
        </div>
        <div className="shopping ">
        <div className="design ">
            <div className="logo img3">
            <AiOutlineShoppingCart />
            
        </div>
        </div>
        <div className="total ">
        <h6>CASH ORDERS</h6>
        
      
        </div>
        <div className="number ">
          <h5>{orderStats.cashOrders}</h5>
       
        </div>
          
        </div>
        <div className="shopping ">
        <div className="design ">
            <div className="logo img4">
            <AiOutlineShopping />
        </div>
        </div>
        <div className="total ">
        <h6>CANCELLED ORDERS</h6>
        
      
        </div>
        <div className="number ">
        <h5>{orderStats.cancelledOrders}</h5>
        </div>
          
        </div>
      
      
      
      </Section>
    )
}

export default Shopping
const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  .shopping {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    border-radius: 1rem;
    color: black;
    background-color: #F8F9FE;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.5rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #D4E0FF;
      color: black;
      svg {
        color: black;
      }
    }
    .design {
        display: flex;
        align-items: center;
        gap: 0.5rem;
          .img1{
                background-color: #668DFF;
            }
            .img2{
                background-color: #FFB2C3;
            }
            .img3{
                background-color: #FFDD00;
            }
            .img4{
                background-color: #030303;
            }
        .logo {
      border-radius: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.8rem;
      svg {
        font-size: 1rem;
        color: white;
      }
    }
    }
    .total {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-evenly;
        margin-top: 10px;
     h6{
        color: grey; 
     }
    }
    .number {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-evenly;
        margin-top: 10px;
            .svg1 {
                color: green; 
            }
          .t1{
              color: green; 
          }    
     h6{
        color: black; 
     }
    }
    
  }
  
  `
  ;