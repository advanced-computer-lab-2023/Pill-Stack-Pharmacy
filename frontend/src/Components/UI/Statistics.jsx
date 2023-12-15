import styled from 'styled-components';
import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { AiFillTag } from "react-icons/ai";
import { AiFillExperiment } from "react-icons/ai";
import { AiFillDollarCircle } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
const Statistic=({currentMonth})=>{
    const [orderStats, setOrderStats] = useState([{ totalOrders: 0, totalItems: 0, totalRevenue: 0 }]);
    const [orderChanges, setOrderChanges] = useState({ totalChange: 0, itemsChange: 0, revenueChange: 0 });

    useEffect(() => {
        // fetch total number of orders 
        const fetchOrderStats = async () => {
          try {
            const response=await axios.post('http://localhost:8001/order/salesStats',{month:currentMonth},{ withCredentials: true });
           // console.log(response.data);
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
        const fetchChanges = async () => {
            try {
                let previousMonth;
                switch(currentMonth){
                    case 'January':previousMonth='December'; break;
                    case 'February':previousMonth='January'; break;
                    case 'March':previousMonth='Feburary'; break;
                    case 'April':previousMonth='March'; break;
                    case 'May':previousMonth='April'; break;
                    case 'June':previousMonth='May'; break;
                    case 'July':previousMonth='June'; break;
                    case 'August':previousMonth='July'; break;
                    case 'September':previousMonth='August'; break;
                    case 'October':previousMonth='September'; break;
                    case 'November':previousMonth='October'; break;
                    case 'December':previousMonth='November'; break;
    
                }
    
                const responseCurrentMonth = await axios.post('http://localhost:8001/order/salesStats', { month: currentMonth }, { withCredentials: true });
                const responsePreviousMonth = await axios.post('http://localhost:8001/order/salesStats', { month: previousMonth }, { withCredentials: true });
                console.log( responseCurrentMonth.data);
                console.log( responsePreviousMonth.data);

    
                if ( responseCurrentMonth.data !== 'no sales found for this month' && responsePreviousMonth.data!== 'no sales found for this month') {
                    const currentMonthData = responseCurrentMonth.data[0];
                    const previousMonthData = responsePreviousMonth.data[0];
                    const totalOrdersChange = currentMonthData.totalOrders - previousMonthData.totalOrders;
                    const totalItemsChange = currentMonthData.totalItems - previousMonthData.totalItems;
                    const totalRevenueChange = currentMonthData.totalRevenue - previousMonthData.totalRevenue;
    
                    let totalOrdersPercentageChange = 0;
                    let totalItemsPercentageChange = 0;
                    let totalRevenuePercentageChange = 0;
    
                    // Check if previous month's values are not zero to avoid division by zero
                    if (previousMonthData.totalOrders !== 0) {
                        totalOrdersPercentageChange = (totalOrdersChange / previousMonthData.totalOrders) * 100;
                    }else{
                        totalOrdersPercentageChange=100; 
                    }
                    if (previousMonthData.totalItems !== 0) {
                        totalItemsPercentageChange = (totalItemsChange / previousMonthData.totalItems) * 100;
                    }else{
                        totalItemsPercentageChange=100;
                    }
                    if (previousMonthData.totalRevenue !== 0) {
                        totalRevenuePercentageChange = (totalRevenueChange / previousMonthData.totalRevenue) * 100;
                    }else{
                        totalRevenuePercentageChange=100;
                    }
    
                    setOrderChanges({
                        totalChange: totalOrdersPercentageChange,
                        itemsChange: totalItemsPercentageChange,
                        revenueChange: totalRevenuePercentageChange
                    });
                } else {
                    if (responseCurrentMonth.data === 'no sales found for this month'){
                        setOrderChanges({ totalChange:-100, itemsChange:-100, revenueChange:-100 });

                    }else{
                        console.log('yess')
                    setOrderChanges({ totalChange:100, itemsChange:100, revenueChange:100 });
                    }
                }
            } catch (error) {
                console.error('Error fetching sales stats:', error);
                // Handle errors here
            }
        };
        fetchChanges();
    
      }, [currentMonth]);
   

    return(
        <Section>
        <div className="analytic color1">
            <div className="design">
                <div className="logo">
                    <AiFillTag />
                </div>
                <div className="content">
                    <h5>{orderStats[0].totalOrders}</h5>
                </div>
            </div>
            <div className="total">
                <h6>TOTAL ORDERS</h6>
                {orderChanges.totalChange>0 ?(<>
                <span className="t1">{orderChanges.totalChange}%</span>
                <AiOutlineArrowUp className="svg1" />
                </>):
                (
                    <> <span className="t2">{orderChanges.totalChange}%</span>
                       <AiOutlineArrowDown className="svg2" />

                    </>
                )
                } 
            </div>
        </div>
        <div className="analytic color2">
            <div className="design">
                <div className="logo">
                    <AiFillExperiment />
                </div>
                <div className="content">
                    <h5>{orderStats[0].totalItems}</h5>
                </div>
            </div>
            <div className="total">
                <h6>TOTAL MEDICINE PURCHASED</h6>
                {orderChanges.itemsChange>0 ?(<>
                <span className="t1">{orderChanges.itemsChange}%</span>
                <AiOutlineArrowUp className="svg1" />
                </>):
                (
                    <> <span className="t2">{orderChanges.itemsChange}%</span>
                       <AiOutlineArrowDown className="svg2" />

                    </>
                )
                } 
            </div>
        </div>
        <div className="analytic color3">
            <div className="design">
                <div className="logo">
                    <AiFillDollarCircle />
                </div>
                <div className="content">
                    <h5>${orderStats[0].totalRevenue}</h5>
                </div>
            </div>
            <div className="total">
                <h6>TOTAL REVENUE</h6>
                {orderChanges.revenueChange>0 ?(<>
                <span className="t1">{orderChanges.revenueChange}%</span>
                <AiOutlineArrowUp className="svg1" />
                </>):
                (
                    <> <span className="t2">{orderChanges.revenueChange}%</span>
                       <AiOutlineArrowDown className="svg2" />

                    </>
                )
                } 
            </div>
        </div>
        </Section>
    );
    }
    export default Statistic;

    const Section = styled.section `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    .color1 {
        background-color: #EEF4FF;
    }
    .color2{
        background-color: #FDF4F5;
    }
    .color3{
        background-color: #FFFCE4;
    }
    .analytic {
        padding: 1rem 2rem 1rem 2rem;
        border-radius: 1rem;
        color: black;
        justify-content: space-evenly;
        align-items: center;
        gap: 1rem;
        transition: 0.5s ease-in-out;
        &:hover {
            background-color: #D4E0FF;
            color: black;
            svg {
                color: black;
            }
        }
        .design{
            display: flex;
            align-items: center;
            gap: 1rem;
            .logo {
                background-color: white;
                border-radius: 1rem;
                border: 1px solid black;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1.5rem;
                svg {
                    font-size: 1.5rem;
                }
            }
        }
        .total {
            display: flex;
            align-items: center;
            gap: 1rem;
            justify-content: space-evenly;
            margin-top: 20px;
            .svg1 {
                color: green;
            }
            .svg2 {
                color: red;
            }
            .t1 {
                color: green;
            }
            .t2{
                color: red;
            }
            h6{
                color: grey;
            }
        }
    }
`;









