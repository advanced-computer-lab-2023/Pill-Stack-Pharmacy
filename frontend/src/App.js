import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";


function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
      
     
      </Routes>
    </div>
  );
}

export default App;
