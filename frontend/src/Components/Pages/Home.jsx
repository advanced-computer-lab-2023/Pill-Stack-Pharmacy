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
  const [address, setAddress] = useState("");

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
      // Send the address to the backend
      const response = await axios.post(
        `http://localhost:8000/patient/addDeliveryAddress/${username}`,
        { address },
        { withCredentials: true }
      );
        console.log(response.data)
      if (response.data === "Delivery address added successfully") {
        toast("Delivery address added successfully", {
          position: "top-right",
        });

        setAddress("");
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
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
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
