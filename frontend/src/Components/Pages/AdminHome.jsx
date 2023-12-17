import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import SidebarAdmin from './sideAdmin';
import WithSubnavigation from './navbar';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex,
  Text,
  Spacer,
  Avatar,
  Badge,
  Button,
  useDisclosure,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,
  faUser,
  faNotesMedical,
  faCapsules,
  faFile,
  faArrowRightFromBracket
 } from "@fortawesome/free-solid-svg-icons";
import Shortcut from "../UI/Shortcut";
import { ChatIcon, Icon, EmailIcon,PhoneIcon,BellIcon } from "@chakra-ui/icons";
import RR from './RR'



export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [fullUser, setFullUser] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [isChangePassOpen, setisChangePassOpen] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
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


  const openViewFamilyModal = () => {
    onOpen(); // Use onOpen to open the modal
    setisChangePassOpen(true);
  };

  const closeViewFamilyModal = () => {
    onClose(); // Use onClose to close the modal
    setisChangePassOpen(false);
  };

  const openChangePasswordModal = () => {
    onOpen(); // Use onOpen to open the modal
    setisChangePassOpen(true);
  };

  useEffect(() => {
    const fetchFullUser = async () => {
      if (username) {
        const { data } = await axios.get(`http://localhost:8001/admin/myInfo/${username}`);
        setFullUser(data);
        console.log(fullUser);
      }
    };
    fetchFullUser();
  }, [username]);

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
  

  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };


  return (
    <>
        {/* <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Admin Home Welcome {username} </Text>
          <Spacer/>
          <Button onClick={openViewFamilyModal} style={{ color: 'Black', marginRight: '10px', textDecoration: 'none', cursor: 'pointer', marginBottom: '2px', ':hover': { color: 'black' } }}>ChangePass</Button>

          <Button onClick={Logout}>Logout <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft:"7px"}}/></Button>
        </Flex> */}
        {/* <Box  m={10}>
          <Flex m={5}>
              <Avatar src='https://bit.ly/sage-adebayo' />
              <Box ml='3'>
                  <Text fontWeight='bold'>
                  {fullUser.Username} 
                  
                  <Badge ml='1' colorScheme='green'> 
                      Active
                  </Badge>
                  </Text>
                  <Text fontSize='sm'> {fullUser.Email}</Text>
              </Box>
              <Spacer/>
        
          </Flex>
          <Divider orientation="horizontal" />

            <Box m={10} p={5} bg={'#666964'} rounded={10}>
              <Text fontSize={'3xl'} > Shortcuts </Text>
            <SimpleGrid minChildWidth='150px' spacing='1px' m={5} > 
              <Shortcut 
                link={"/admin-users"} 
                icon={<FontAwesomeIcon icon={faUser} fontSize={'35px'}/>} 
                text={'Manage Users'}/>
              <Shortcut 
                link={'/admin-requests'} 
                icon={<FontAwesomeIcon icon={faNotesMedical} fontSize={'35px'}/>} 
                text={'Doctor Requests'}/>
              <Shortcut 
                link={'/medicineControl'} 
                icon={<FontAwesomeIcon icon={faCapsules} fontSize={'35px'}/>} 
                text={'Pharmacy'}/>
             <Shortcut
                link={'/salesReport'}
                icon={<FontAwesomeIcon icon={faFile}  fontSize={'35px'}/>}
                text={'Sales Report'}/> 
            </SimpleGrid>
            </Box>  

       
        </Box> */}
        <SidebarAdmin onLogout={Logout}/>
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
                <div className="balance">{`Private Account`}</div>
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
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Mobile: Private Number`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#005660' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 18px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Emergency Mobile: Private Number`}</div>
            </div>
            </Box>

            <Box className="boxL1" >
            {/* <div className="boxT">Recent</div> */}
            <Link to="/salesReport" className="box2sales" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Sales Report</Link>
            <Box onClick={openChangePasswordModal} className="box2settings"style={{ color: '#4C4C4C', textDecoration: 'none' }} >Control Account</Box>
            
            </Box>
          </div>

          
          <div className="Container2">
            <Box className="box3" ></Box>
            {/* {fullUser.Gender && (fullUser.Gender.toLowerCase() === 'male' ? (
              <Box className="ppM" ></Box>
            ) : fullUser.Gender.toLowerCase() === 'female' ? (
              <Box className="ppF" ></Box>
            ) : (
              <Box className="ppM"></Box>
            ))} */}
            <Box className="ppM" ></Box>
            <Box className="Details" style={{ overflow: 'hidden' }}>
            <Box style={{ textAlign: 'center' }}>{fullUser.Username}</Box>
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
                  Male
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
          <Box className='infoI' style={{ transform: 'translate(-16%, 750%)' }}>
            Emergency Contact Name
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.EmergencyContact_Name}
          </Box>
        </div>
      )}

      {selectedTab === 'four' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-25%, 750%)' }}>
            Delivery Address
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.DeliveryAddress}
          </Box>
        </div>
      )}
      {selectedTab === 'five' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-34%, 750%)' }}>
            Mobile
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {fullUser.MobileNumber}
          </Box>
        </div>
      )}
      <Box style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>More</Box>

<RR onRatingTabClick={handleRatingTabClick} setSelectedTab={setSelectedTab} style={{ marginTop: '-10px',transform: 'translate(-35%, 345%)' }}></RR>

            </Box>
            
          </div>
          <div className="Container3">
          <Link to="/admin-users" className="box2u" style={{ color: '#005660', textDecoration: 'none' }} >Manage Users</Link>
            <Link to="/admin-requests" className="box2pr" style={{ color: '#005660', textDecoration: 'none' }}>Pharamcist Requests</Link>
            <Link to="/medicineControl" className="box2am" style={{ color: '#005660', textDecoration: 'none' }} >Medicine Control</Link>

          </div>
        </div>
      </div>
   

            </div>
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





      <ToastContainer />
    </>
  );
};

export default AdminHome;