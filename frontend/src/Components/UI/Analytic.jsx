import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { AreaChart, Area, Tooltip, ResponsiveContainer,XAxis,YAxis } from "recharts";

function Analytic({currentMonth}) {
  const [selectedMedicine, setSelectedMedicine] = useState('Panadol');
  const [medicine, setMedicine] = useState([]);
  const [medicineSales, setMedicineSales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8001/admin/MedNames')
      .then((response) => response.json())
      .then((data) => setMedicine(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
      const fetchMedSales = async () => {
            
        try {
            const response = await axios.post('http://localhost:8001/order/sales', { month:currentMonth,med:selectedMedicine }, { withCredentials: true });
            console.log(response.data);
            setMedicineSales(response.data);
        } catch (error) {
            console.error('Error fetching monthly revenue:', error);
        }
    };
    fetchMedSales();
  }, [selectedMedicine,currentMonth]);
   const onMedicineChange=(e)=>{
    setSelectedMedicine(e.target.value);

   }
   const formattedData = Object.entries(medicineSales).map(([day, data]) => ({
    day,
    data,
  }));
  

    return (
        <Section>
            <div className="analytics">
                <div className="analytics__details">
                    <div>
                        <h4>Sales Analytics</h4>
                    </div>
                    <div>
                    <select id="medDrop" value={selectedMedicine} onChange={ onMedicineChange}>
                    <option value="Panadol">Panadol</option>
                    {medicine.map((med, index) => (
                      <option key={index} value={med.Name}>
                        {med.Name}
                      </option>
                    ))}
                  </select>                    
                </div>
                </div>
                <div className="analytics__graph">
                <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={formattedData}

            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            
                <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'bottom' }}/>
                <YAxis label={{ value: 'Sales', angle: -90, position: 'insideLeft' }} />
            <Tooltip cursor={false} />
            <Area
              animationBegin={800}
              animationDuration={2000}
              type="monotone"
              dataKey="data"
              stroke="#ffc107"
              fill="#ffeaa7"
              strokeWidth={4}
            />
          </AreaChart>
        </ResponsiveContainer>
                </div>
            </div>
        </Section>
    )
}

export default Analytic
const Section = styled.section`
.analytics {
color: black;
width: 100%;
.analytics__details {
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
        }
    }
}
.analytics__graph {
    height: 10rem;
      width: 100%;
      .recharts-default-tooltip {
      background-color: black !important;
      border-color: black !important;
      color : white !important;
    }
}
}
 padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  /* Additional styles for better visibility */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #999;
  }
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

`;
const StyledSelect = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  /* Additional styles for better visibility */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #999;
  }
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;
