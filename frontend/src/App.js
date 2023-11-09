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
import{MedicineListwithSales} from "./Components/UI/MedicineListWithSales";
import {AddMedicine} from "./Components/UI/AddMed";
import {Cart} from "./Components/Pages/Cart";
import  Completion from "./Components/Pages/Completion";
import  CreditPayment from "./Components/Pages/CreditPayment";
import ForgotPassword from './Components/Pages/ForgotPassword.jsx';
import PasswordReset from './Components/Pages/PasswordReset.jsx';



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

        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/admin-users" element={<UserManagement />} />
        <Route path="/admin-requests" element={<PharmacistReqs />} />
        <Route path="/medicine" element={<MedicineList />} />
        <Route path="/medicine/sales" element={<MedicineListwithSales />} />
        <Route path="/addMed" element={<AddMedicine />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/home/creditPayment/:address" element={<CreditPayment />} />
        <Route path="/completion/:address" element={<Completion />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/PasswordReset" element={<PasswordReset/>} />




      
     
      </Routes>
    </div>
  );
}

export default App;