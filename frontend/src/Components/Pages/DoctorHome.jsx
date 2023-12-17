import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SidebarDR from './sideDR';
import '../UI/home.css';
import WithSubnavigation from './navbar';
import { ChatIcon, Icon, EmailIcon,PhoneIcon,BellIcon } from "@chakra-ui/icons";
import RR from './RR'


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Center,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'; 
import Notifications from '../UI/notifications'; 

import {
  faCubesStacked,
  faCapsules,
  faArrowRightFromBracket,
  faListCheck 
 } from "@fortawesome/free-solid-svg-icons";
import {
  Flex,
  Text,
  Spacer,
  Avatar,
  Badge,
  Button,
  useDisclosure,
  Divider,
  SimpleGrid,
  Grid,
  Box,
} from "@chakra-ui/react";

import Shortcut from "../UI/Shortcut";

function DoctorHome() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure(); // useDisclosure hook for managing modal state
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [fullUser, setFullUser] = useState("");
  const [isChangePassOpen, setisChangePassOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("one");

  const handleRatingTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:8001",
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

  
  const openChangePasswordModal = () => {
    onOpen(); 
    setisChangePassOpen(true);
  };

  useEffect(() => {
    const fetchFullUser = async () => {
      if (username) {
        const { data } = await axios.get(`http://localhost:8001/pharmacist/myInfo/${username}`);
        setFullUser(data);
        console.log(fullUser);
      }
    };
    fetchFullUser();
  }, [username]);

  const openViewFamilyModal = () => {
    onOpen(); // Use onOpen to open the modal
    setisChangePassOpen(true);
  };

  const closeViewFamilyModal = () => {
    onClose(); // Use onClose to close the modal
    setisChangePassOpen(false);
  };
  

  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };
  const handleChangePass = async () => {
    const oldPassword = document.querySelector('#oldPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const confirmNewPassword = document.querySelector('#confirmNewPassword').value;
  
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords don\'t match', {
        position: 'top-right',
        autoClose: 3001,
      });
      return;
    }
  
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
  
    try {
      const response = await axios.post('http://localhost:8001/changePassword', data, {
        withCredentials: true,
      });
  
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 3001,
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-right',
          autoClose: 3001,
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Log the detailed error response for debugging
      if (error.response) {
        console.error('Response Data:', error.response.data);
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 3001,
        });
      } else {
        toast.error('An error occurred while processing your request', {
          position: 'top-right',
          autoClose: 3001,
        });
      }
    }
  };


  return (
    <>
      <ToastContainer/>
      {/* <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Welcome To Pill lorem </Text>
          <Spacer/>
          <Notifications  notifications={fullUser.Notifications}/>
          <Button onClick={openViewFamilyModal} style={{ color: 'Black', marginRight: '10px', textDecoration: 'none', cursor: 'pointer', marginBottom: '2px', ':hover': { color: 'black' } }}>ChangePass</Button>


          <Button onClick={Logout}> Logout <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft:"7px"}}/> </Button>
        </Flex> */}
        {/* <Box  m={10}>
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
              {fullUser.WalletBalance && (<Text m={2} fontSize={'3xl'}> 
                $ {fullUser.WalletBalance.toFixed(2)}
              </Text>)}
          </Flex>
          <Divider orientation="horizontal" />
          <Grid templateColumns='repeat(2, 1fr)'>
            <Flex m={5} flexDirection={'column'} borderRight='1px solid gray'>
              <Text fontSize={'3xl'}> Account Details </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Email: {fullUser.Email} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Affiliation: {fullUser.affiliation} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Educational Background: {fullUser.education_background} </Text>
            </Flex>
            <SimpleGrid minChildWidth='150px' spacing='1px' m={5} >
              <Shortcut 
                link={'/medicine/sales'} 
                icon={<FontAwesomeIcon icon={faListCheck} fontSize={'35px'}/>} 
                text={'Stock Management'}/> 
              <Shortcut 
                link={'/addMed'} 
                icon={<FontAwesomeIcon icon={faCapsules} fontSize={'35px'}/>} 
                text={'Add Meds'}/>
              <Shortcut 
                link={'/medicineControl'} 
                icon={<FontAwesomeIcon icon={faCubesStacked}  fontSize={'35px'}/>} 
                text={'Med Stock'}/>
            </SimpleGrid>
          </Grid>
        </Box> */}

        <SidebarDR onLogout={Logout}/>
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '1000'}}>
        <WithSubnavigation
         username={username}
         name={fullUser.Name}
         openChangePasswordModal={openChangePasswordModal}
          onLogout={Logout}
          notifications={fullUser.Notifications}
        />
        </div>

        <div className="home_page">
            <div className="home_page_content" >
            <div className="BigContainer">
          <div className="Container1">
            <Box className="boxW" >
               <div className="boxT">Wallet</div>
               <div className="square">$</div>
                <div className="balance">{`$ ${fullUser.WalletBalance}`}</div>
                <div className="square2">Total Balance</div>
            </Box>
            <Box className="box1" >
              <div className="boxT">Information</div>
            <div className="line">
              <EmailIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Email:  ${fullUser.Email}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Affiliation:  ${fullUser.affiliation}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 18px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Educational Background:  ${fullUser.education_background}`}</div>
            </div>
            </Box>

            

            <Box className="boxL1" >
            {/* <div className="boxT">Recent</div> */}
            <Box className="smallNot" style={{ color: '#4C4C4C', textDecoration: 'none' }}>
  <div className="boxT">Recent</div>

  {fullUser.Notifications && fullUser.Notifications[0] !== undefined ? (
    <div className="line" style={{ marginTop: '0px' }}>
      <BellIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
      <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-80px)' }}>
        {fullUser.Notifications[0]}
      </div>
    </div>
  ) : (
    <div className="line" style={{ marginTop: '0px' }}>
    <BellIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
    <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-80px)' }}>
      No New Notifications
    </div>
  </div>
  )}

  {fullUser.Notifications && fullUser.Notifications[1] !== undefined ? (
    <div className="line" style={{ marginTop: '-50px' }}>
      <BellIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
      <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-80px)' }}>
        {fullUser.Notifications[1]}
      </div>
    </div>
  ) : (
    <div className="line" style={{ marginTop: '-50px' }}>
    <BellIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
    <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-80px)' }}>
    No New Notifications
    </div>
  </div>
  )}
</Box>

              <Link to="/salesReport" className="box2sales" style={{ color: '#005660', textDecoration: 'none' }}>Sales Report</Link>
            
            </Box>
            
          </div>

    
            {/* </Box>
          </div> */}

          
          <div className="Container2">
            <Box className="box3" ></Box>
            {/* {fullUser.Gender && (fullUser.Gender.toLowerCase() === 'male' ? (
              <Box className="ppM" ></Box>
            ) : fullUser.Gender.toLowerCase() === 'female' ? (
              <Box className="ppF" ></Box>
            ) : (
              <Box className="ppM"></Box>
            ))} */}
            
            <Box className="ppM"></Box>

            <Box className="Details" style={{ overflow: 'hidden' }}>
            <Box style={{ textAlign: 'center' }}>{fullUser.Name}</Box>
              <Box className="GenderB">
              {/* {fullUser.Gender && (fullUser.Gender.toLowerCase() === 'male' ? (
                <Box className="Male">
                  Male
                </Box>
              ) : fullUser.Gender.toLowerCase() === 'female' ? (
                <Box className="Female">
                  Female
                </Box>
              ) : (
                <Box className="Male"> 
                  Male
                </Box>
              ))} */}
               <Box className="Male"> 
                  Doctor
                </Box>
            </Box>
            <Box className='infoI' style={{ transform: 'translate(-30%, 395%)' }}>
              Username
            </Box>
            <Box className="RoundBox" style={{ marginTop: '5px' }}>
            {fullUser.Username}
            </Box>
            {selectedTab === 'one' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-35%, 750%)' , textAlign: 'center' }}>
            Email
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.Email}
          </Box>
        </div>
      )}
            {selectedTab === 'two' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Date Of Birth
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.DateOfBirth}
          </Box>
        </div>
      )}

      {selectedTab === 'three' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-17%, 750%)' }}>
          Educational Background
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.education_background}
          </Box>
        </div>
      )}

      {selectedTab === 'four' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-31%, 750%)' }}>
            Affiliation
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.affiliation}
          </Box>
        </div>
      )}
      {selectedTab === 'five' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Hourly Rate
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.hourly_rate}
          </Box>
        </div>
      )}
      <Box style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>More</Box>

<RR onRatingTabClick={handleRatingTabClick} setSelectedTab={setSelectedTab} style={{ marginTop: '-10px',transform: 'translate(-35%, 345%)' }}></RR>

            </Box>
            
          </div>
          <div className="Container3">
          <Link to="/medicine/sales" className="box2sm" style={{ color: '#005660', textDecoration: 'none' }} >Stock Management</Link>
            <Link to="/addMed" className="box2am" style={{ color: '#005660', textDecoration: 'none' }}>Add Meds</Link>
            <Link to="/medicineControl" className="box2sm" style={{ color: '#005660', textDecoration: 'none' }} >Med Stock</Link>

          </div>
        </div>
      </div>
            </div>
            {/* <Shortcut 
                link={'/medicine/sales'} 
                icon={<FontAwesomeIcon icon={faListCheck} fontSize={'35px'}/>} 
                text={'Stock Management'}/> 
              <Shortcut 
                link={'/addMed'} 
                icon={<FontAwesomeIcon icon={faCapsules} fontSize={'35px'}/>} 
                text={'Add Meds'}/>
              <Shortcut 
                link={'/medicineControl'} 
                icon={<FontAwesomeIcon icon={faCubesStacked}  fontSize={'35px'}/>} 
                text={'Med Stock'}/> */}









        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen} 
          onClose={closeViewFamilyModal} 
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <Input id="oldPassword" type="password" ref={initialRef} placeholder="Old Password" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>New Password</FormLabel>
                <Input id="newPassword" type="password" placeholder="New Password" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input id="confirmNewPassword" type="password" placeholder="Confirm New Password" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleChangePass} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={closeViewFamilyModal}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <motion.div
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         style={{
           position: "fixed",
           bottom: "20px",
           right: "20px",
           background: "#005660",
           borderRadius: "100px",
           cursor: "pointer",
          }}
        >
          <Link to={`/chatwithPatient/${username}`}>
          <Center>
          <Icon as={ChatIcon} boxSize={6} m={5} style={{ textDecoration: "none", color: "white" }} />  
          </Center>    
          </Link>
        </motion.div>

        {/* <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#005660",
            borderRadius: "100px",
            cursor: "pointer",
          }}
        >
          <Link to={`/chatwithdoctor/${username}`}>
          <Center>
          <Icon as={ChatIcon} boxSize={6} m={5} style={{ textDecoration: "none", color: "white" }} />  
          </Center>          
          </Link>
        </motion.div> */}
       
    </>
  );
}

export default DoctorHome;
