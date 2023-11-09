import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
  Button,
} from "@chakra-ui/react";


export const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addAddress = async () => {
    try {
      if (!addressName.trim() || !streetName.trim() || !buildingNumber.trim() || !floor.trim() || !apartment.trim()) {
        toast("Please fill in all fields", {
          position: "top-right",
        });
        return;
      }
      // Send the address to the backend
      const newAddress = `${addressName}, ${streetName}, ${buildingNumber}, ${floor}, ${apartment}`;
      const response = await axios.post(
        `http://localhost:8000/patient/addDeliveryAddress/${username}`,
        { address:newAddress },
        { withCredentials: true }
      );
        console.log(response.data)
        
      if (response.data === "Delivery address added successfully") {
        toast("Delivery address added successfully", {
          position: "top-right",
        });

        setAddressName("");
        setStreetName("");
        setBuildingNumber("");
        setFloor("");
        setApartment("");
        closeModal();
      } else {
        toast("Could not add the delivery address", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding the delivery address:", error);
      toast("Internal server error", {
        position: "top-right",
      });
    }
  };

  return (
    <>



      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
        <div>
          <button onClick={openModal}>Add address</button>
        </div>
      </div>
      <ToastContainer />

      <Modal isOpen={modalIsOpen} onClose={closeModal}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Add Address</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="addressName">Address Name:</label>
          <input
            type="text"
            id="addressName"
            placeholder="Enter Address Name"
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="streetName">Street Name:</label>
          <input
            type="text"
            id="streetName"
            placeholder="Enter Street Name"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="buildingNumber">Building Number:</label>
          <input
            type="text"
            id="buildingNumber"
            placeholder="Enter Building Number"
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="floor">Floor:</label>
          <input
            type="text"
            id="floor"
            placeholder="Enter Floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="apartment">Apartment:</label>
          <input
            type="text"
            id="apartment"
            placeholder="Enter Apartment"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
          />
        </div>
      </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={closeModal}>
        Close
      </Button>
      <Button colorScheme="green" onClick={addAddress}>
        Save
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  );
};
