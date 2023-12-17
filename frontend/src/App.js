import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";
import AdminHome from "./Components/Pages/AdminHome";
import DoctorHome from "./Components/Pages/DoctorHome";
import UserManagement from "./Components/Pages/UserManagement";
import PharmacistReqs from "./Components/Pages/PharmacistReqs";
import{MedicineList} from "./Components/UI/MedicineList";
import{MedicineDetails} from "./Components/UI/ProductDetails.jsx";
import{MedicineListControl} from "./Components/UI/MedicineListAdminPharma";
import{MedicineListwithSales} from "./Components/UI/MedicineListWithSales";
import {AddMedicine} from "./Components/UI/AddMed";
import {Cart} from "./Components/Pages/Cart";
import  Completion from "./Components/Pages/Completion";
import  Completion2 from "./Components/Pages/Completion2";
import  CreditPayment from "./Components/Pages/CreditPayment";
import ForgotPassword from './Components/Pages/ForgotPassword.jsx';
import PasswordReset from './Components/Pages/PasswordReset.jsx';
import PharmacistRegisterPage from './Components/Pages/PharmacistRegisterPage';
import PatientRegisterForm from './Components/Pages/PatientRegisterForm';
import OrderDetails from './Components/UI/orderDetails';
import ChatMessages from './Components/Pages/chatMessagesPatient.jsx';
import ChatMessagesDoctor from './Components/Pages/chatMessagesDoctor.jsx';
import SalesReport  from './Components/Pages/SalesReport.jsx';
import io from 'socket.io-client';
import LandingPage from './Components/Pages/LandingPage.jsx';


const socket = io.connect("http://localhost:8001");

function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
      {/* const handlePacks = () => {
        navigate("/admin-packs");
    };

  const handleUsers = () => {
      navigate("/admin-users");
  };

  const handleReqs = () => {
      navigate("/admin-requests");
  }; */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/admin-users" element={<UserManagement />} />
        <Route path="/admin-requests" element={<PharmacistReqs />} />
        <Route path="/medicine" element={<MedicineList />} />
        <Route path="/medicine/details/:medicineID" element={<MedicineDetails />} />
        <Route path="/medicineControl" element={<MedicineListControl/>} />
        <Route path="/medicine/sales" element={<MedicineListwithSales />} />
        <Route path="/addMed" element={<AddMedicine />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/home/creditPayment/:address" element={<CreditPayment />} />
        <Route path="/completion/:address/:intentid" element={<Completion />} />
        <Route path="/completion" element={<Completion2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/PasswordReset" element={<PasswordReset/>} />
        <Route path="/pharmacist-register" element={<PharmacistRegisterPage />} />
        <Route path="/patient-register" element={<PatientRegisterForm />} />
        <Route path="/orderdetails" element={<OrderDetails/>} />
        <Route path="/chatwithdoctor/:username" element={<ChatMessages socket={socket} />} />
        <Route path="/chatwithpatient/:username" element={<ChatMessagesDoctor socket={socket} />} />
        <Route path="/salesReport" element={<SalesReport/>}/>

      
     
      </Routes>
    </div>
  );
}

export default App;
