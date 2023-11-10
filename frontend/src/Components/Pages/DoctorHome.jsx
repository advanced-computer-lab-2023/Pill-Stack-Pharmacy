import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,
  faShop,
  faNotesMedical,
  faBagShopping,
  faCubesStacked,
  faCapsules,
  faArrowRightFromBracket

 } from "@fortawesome/free-solid-svg-icons";
import {
  Flex,
  Text,
  Spacer,
  Avatar,
  Badge,
  Button,
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
        const { data } = await axios.get(`http://localhost:8000/pharmacist/myInfo/${username}`);
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
              <Text fontSize={'3xl'}> Account Details </Text>
              {/* <Text fontSize={'xl'}> Name: {fullUser.Name} </Text> */}
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Email: {fullUser.Email} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Affiliation: {fullUser.affiliation} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Educational Background: {fullUser.education_background} </Text>

            </Flex>
            <SimpleGrid minChildWidth='150px' spacing='1px' m={5} >
            <Shortcut 
                link={'/medicine/sales'} 
                icon={<FontAwesomeIcon icon={faCubesStacked} fontSize={'35px'}/>} 
                text={'Medicine Stock'}/> 
              <Shortcut 
                link={'/addMed'} 
                icon={<FontAwesomeIcon icon={faCapsules} fontSize={'35px'}/>} 
                text={'Add Meds'}/>
              {/* <Shortcut 
                link={'/cart'} 
                icon={<FontAwesomeIcon icon={faBagShopping} fontSize={'35px'}/>} 
                text={'Track Orders'}/> */}
            </SimpleGrid>

          </Grid>
        </Box>
    </>
  )
}

export default DoctorHome
