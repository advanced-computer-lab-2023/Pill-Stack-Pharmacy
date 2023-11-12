import { useEffect, useState, useRef } from "react";
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




export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [fullUser, setFullUser] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [isChangePassOpen, setisChangePassOpen] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
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


  const openViewFamilyModal = () => {
    onOpen(); // Use onOpen to open the modal
    setisChangePassOpen(true);
  };

  const closeViewFamilyModal = () => {
    onClose(); // Use onClose to close the modal
    setisChangePassOpen(false);
  };

  useEffect(() => {
    const fetchFullUser = async () => {
      if (username) {
        const { data } = await axios.get(`http://localhost:8000/admin/myInfo/${username}`);
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
        autoClose: 3000,
      });
      return;
    }
  
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/changePassword', data, {
        withCredentials: true,
      });
  
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Log the detailed error response for debugging
      if (error.response) {
        console.error('Response Data:', error.response.data);
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('An error occurred while processing your request', {
          position: 'top-right',
          autoClose: 3000,
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
        <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Admin Home Welcome {username} </Text>
          <Spacer/>
          <Button onClick={openViewFamilyModal} style={{ color: 'Black', marginRight: '10px', textDecoration: 'none', cursor: 'pointer', marginBottom: '2px', ':hover': { color: 'black' } }}>ChangePass</Button>

          <Button onClick={Logout}>Logout <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft:"7px"}}/></Button>
        </Flex>
        <Box  m={10}>
          {/* {fullUser && */}
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
              {/* <Text >Wallet: </Text> */}
              {/* <Text m={2} fontSize={'3xl'}> 1000 EGP </Text> */}
          </Flex>
           {/* } */}
          <Divider orientation="horizontal" />
          {/* <Grid templateColumns='repeat(2, 1fr)'>
            <Flex m={5} flexDirection={'column'} borderRight='1px solid gray'>
              <Text fontSize={'3xl'}> Delivery Addresses </Text>
              <Spacer/>
              <Button onClick={openModal} w={'50%'} >Add address</Button>
            </Flex> */}
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
              {/* <Shortcut
                link={'/medicine/sales'}
                icon={<FontAwesomeIcon icon={faFile}  fontSize={'35px'}/>}
                text={'Sales Report'}/> */}
            </SimpleGrid>
            </Box>  

          {/* </Grid> */}
        </Box>
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