import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {  
    Box, 
    Stack,
    Text,
    Button,
    Flex,
    Spacer,
    Avatar,
    Badge,
    Divider,
    SimpleGrid,
    Grid,

} from "@chakra-ui/react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,
  faUser,
  faNotesMedical,
  faCapsules,
  faFile
 } from "@fortawesome/free-solid-svg-icons";
import Shortcut from "../UI/Shortcut";




export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
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
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

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
  

  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };


  return (
    <>
        <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Admin Home Welcome {username} </Text>
          <Spacer/>
          <Button onClick={Logout}>LOGOUT</Button>
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





      <ToastContainer />
    </>
  );
};

export default AdminHome;