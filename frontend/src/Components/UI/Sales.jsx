import React from 'react'
import styled from "styled-components";
import { AreaChart, Area, Tooltip, ResponsiveContainer,XAxis, YAxis, CartesianGrid } from "recharts";
import { AiOutlineCaretDown } from "react-icons/ai";
import { useState, useEffect } from 'react';
import axios from "axios";
function Sales({currentMonth}) {
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

    useEffect(() => {
        const fetchMonthlyRevenue = async () => {
            
            try {
                const response = await axios.post('http://localhost:8001/order/salesDaily', { month:currentMonth }, { withCredentials: true });
                setMonthlyRevenueData(response.data);
            } catch (error) {
                console.error('Error fetching monthly revenue:', error);
            }
        };

        fetchMonthlyRevenue();
    }, [currentMonth]);

    return (
        <Section>
        <div className="sales">
      <div className="sales__details">
        <div>
          <h4>Sales Overview</h4>
         
        </div>
      
      </div>
      <div className="sales__graph">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
                    width={500}
                    height={400}
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
         >
                    <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'bottom' }} />
                    <YAxis label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={false} />
            <defs>
              <linearGradient id="colorview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="30%" stopColor="#668DFF" stopOpacity={0.4} />
                <stop offset="85%" stopColor="#D4E0FF" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Tooltip cursor={false} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#668DFF"
              fill="url(#colorview)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
        </div>
        </Section>
    )
}

export default Sales
const data = [
    {
      data1: 2400,
    },
    {
      data1: 1398,
    },
    {
      data1: 12800,
    },
    {
      data1: 3908,
    },
    {
      data1: 4800,
    },
    {
      data1: 3800,
    },
    {
      data1: 4300,
    },
  ];
  const Section = styled.section`
  .sales {
    color: black;
    width: 100%;
    .sales__details {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
      div {
        display: flex;
        gap: 1rem;
        button {
          border-radius: 0.5rem;
          padding: 0.4rem 1rem;
          border: none;
          cursor: pointer;
          background-color: #EEF4FF;
            color: black;
            svg {
                font-size: 0.6rem;
            }
        }
      }
    }
    .sales__graph {
      height: 10rem;
      width: 100%;
      .recharts-default-tooltip {
      background-color: black !important;
      border-color: black !important;
      color : white !important;
    }
    }
  }
  `;