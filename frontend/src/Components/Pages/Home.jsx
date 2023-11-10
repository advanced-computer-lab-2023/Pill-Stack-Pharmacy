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
  Box,
  Flex,
  Text,
  Spacer,
  Avatar,
  Badge,
  Button,
  Divider,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,faShop,faBagShopping, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Shortcut from "../UI/Shortcut";


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
  const [fullUser, setFullUser] = useState("");

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
      if (status) {
        toast(`Hello ${user}`, {
          position: "top-right",
        });
        const fullUserData = await axios.get(`http://localhost:8000/patient/myInfo/${user}`);
        setFullUser(fullUserData.data);
        console.log(fullUserData.data);
      } else {
        removeCookie("token");
        navigate("/"); 
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  

  // useEffect(() => {
  //   console.log(username);
  //   const fetchFullUser = async () => {
  //     console.log("in1");
  //     if (username) {
  //       console.log("in2");
  //       const { data } = await axios.get(`http://localhost:8000/patient/myInfo/${username}`);
  //       setFullUser(data);
  //       console.log(fullUser);  
  //     }
  //   };
  //   fetchFullUser();
  // }, [username]);
  
  

  const Logout = () => {
    removeCookie("token");
    navigate("/");
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
        // add the address to the list of addresses
        setFullUser((prev) => ({
          ...prev,
          DeliveryAddress: [...prev.DeliveryAddress, newAddress],
        }));

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
        <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Welcome To Pill lorem </Text>
          <Spacer/>
          <Button onClick={Logout}> Logout <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft:"7px"}}/> </Button>
        </Flex>
        <Box  m={10}>
          <Flex m={5}>
              <Avatar src='https://bit.ly/sage-adebayo' />
              <Box ml='3'>
                  <Text fontWeight='bold'>
                  {fullUser && fullUser.Name}
                  <Badge ml='1' colorScheme='green'>
                      Active
                  </Badge>
                  </Text>
                  <Text fontSize='sm'> {username} </Text>
              </Box>
              <Spacer/>
              <Text >Wallet: </Text>
              <Text m={2} fontSize={'3xl'}> 
                $ {fullUser.Wallet}
              </Text>
          </Flex>
          <Divider orientation="horizontal" />
          <Grid templateColumns='repeat(2, 1fr)'>
            <Flex m={5} flexDirection={'column'} borderRight='1px solid gray'>
              <Text fontSize={'3xl'}> My Delivery Addresses </Text>
              { fullUser && 
                fullUser.DeliveryAddress.map((address, index) => (
                  <Text key={index} m={2} p={1} bg={'#fcfafc'} fontSize={'xl'}> {address} </Text>
                ))
              }
              <Spacer/>
              <Button onClick={openModal} w={'50%'} >Add address</Button>
            </Flex>
            <SimpleGrid minChildWidth='150px' spacing='1px' m={5} >
            <Shortcut 
                link={'/medicine'} 
                icon={<FontAwesomeIcon icon={faShop} fontSize={'35px'}/>} 
                text={'Shop'}/> 
              <Shortcut 
                link={'/cart'} 
                icon={<FontAwesomeIcon icon={faCartShopping} fontSize={'35px'}/>} 
                text={'View Cart'}/>
              <Shortcut 
                link={'/orderDetails'} 
                icon={<FontAwesomeIcon icon={faBagShopping} fontSize={'35px'}/>} 
                text={'Track Orders'}/>
            </SimpleGrid>

          </Grid>
        </Box>


{/* ///////////////// */}
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

      <ToastContainer />

    </>
  );
};
