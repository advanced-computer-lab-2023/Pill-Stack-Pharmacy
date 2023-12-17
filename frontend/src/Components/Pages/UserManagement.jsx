import React from 'react'
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Text,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Center ,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Avatar,
    Badge,
    Stack,
    Checkbox,
    AbsoluteCenter,
    Divider



} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor,
    faBedPulse,
    faUserCog
 } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import '../UI/button.css'
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import SidebarAdmin from '../Pages/sideAdmin';



function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isOpenM, setIsOpenM] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();
    const back =()=>  navigate(-1);

    useEffect(() => {
        const getUsers = async () => {
            try {
            const { data } = await axios.get("http://localhost:8001/admin/allUsers", {
                withCredentials: true,
            });
            // setFiltered( 
              setUsers(data)
              console.log("again", data)
              // );
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, [update]);

    const firstLetterUpper = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
     
    const handleRemove = async (event, id, role) => {
      event.stopPropagation();
        try {
            const body = {
                id: id, 
                role: role
            }
          const { data } = await axios.post("http://localhost:8001/admin/removeUser", body ,
            {
              withCredentials: true,
            }
          );
          console.log(data);
          setUsers(users.filter((user) => user._id !== id));
          //toast success
          toast.success("User Removed", {
            position: "bottom-left",
          });
        } catch (err) {
          console.log(err);
            //toast error
            toast.error("Error Removing User", {
                position: "bottom-left",
            });
        }
      };

      // const handleFilter = (value) => {
      //   setFilter(value);
      //   console.log("surprise m", value);
      // }

      const openModal = () => setIsOpenM(true);
      const closeModal = () => setIsOpenM(false);

      const handleAddAdmin = async () => {
        try {
          const body = {
            username: username,
            password: password,
            email: mail,
          };
          const { data } = await axios.post(
            "http://localhost:8001/administration",
            body,
            {
              withCredentials: true,
            }
          );
          console.log(data);
          //toast success
          toast.success("Admin Added", {
            position: "bottom-left",
          });
          
          setUpdate(!update);
          closeModal();
        } catch (err) {
          console.log(err);
          //toast error
          toast.error("Error Adding Admin", {
            position: "bottom-left",
          });
        }
      }
      

  return (
    <>

      <Navigation
      pagetitle={"Manage Users"}/>
       <SidebarAdmin
      />
      <div className="content">
        {/* <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
            <Text fontSize={'3xl'} color={'white'} >Manage Users</Text>
            <button className="btn" onClick={back}>back</button>
        </Box> */}
        <Box  display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} my={5}>
            <Flex justifyContent={'end'} alignItems={'center'} m={10}>
              <Button colorScheme='blue' variant='solid' size='lg' mr={10}
              onClick={openModal}>
                Add New Admin
              </Button>
            </Flex>
            {users &&  
            <TableContainer w={'90%'}>
                <Table size='lg'> 
                  <Thead>
                    <Tr bg={'#2d2d2e'}>
                      <Th color={'white'}>Userame</Th>
                      <Th color={'white'}>Name</Th>
                      <Th color={'white'}><Center> Role </Center></Th>
                      <Th color={'white'}><Center>Joined </Center></Th>
                      <Th color={'white'}> </Th>

                    </Tr>
                  </Thead>
                    <Tbody>
                        {
                            users &&
                            users.map((user) => {
                                // Check if user.createdAt is a valid date
                                const createdAtDate = user.createdAt instanceof Date
                                  ? user.createdAt.toLocaleDateString()
                                  : new Date(user.createdAt).toLocaleDateString();
                                return (
                                  <Tr key={user._id}
                                  onClick={() => {
                                    setSelectedUser(user);
                                    onOpen();
                                  }
                                  }
                                  _hover={{ bg: "#8d8f8c", color: "white" , cursor: 'pointer', borderRadius: '10px', boxShadow: '2xl'}}
                                  bg=
                                  {
                                      user.role === "admin" ?
                                      '#eff30a28' : user.role === "patient" ? '#00f34928' : '#00a6f328'}
                                  >
                                    <Td w={'20%'} >
                                    <Flex align="center"> 
                                        {
                                        user.role === "pharmacist" ? <FontAwesomeIcon icon={faUserDoctor} />
                                        : user.role === "patient" ? <FontAwesomeIcon icon={faBedPulse} />
                                        : user.role === "admin" ? <FontAwesomeIcon icon={faUserCog} />: <></>
                                        }
                                        <Text fontSize={'lg'} ml={5}>{user.Username}</Text> 
                                    </Flex>
                                    </Td>
                                    <Td w={'20%'}> {user.Name} </Td>
                                    <Td w={'20%'}> <Center> {  firstLetterUpper(user.role)} </Center></Td>
                                    <Td w={'20%'}> <Center>{createdAtDate}  </Center></Td>
                                    <Td w={'20%'}>
                                        <Center>
                                        <Button colorScheme='red' variant='solid' size='sm'
                                        onClick={(event) => handleRemove(event, user._id, user.role)}
                                        >Remove User</Button>
                                        </Center>
                                    </Td>
                                  </Tr>
                                );
                              })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            }
        </Box>
        <ToastContainer />
        {/* add new admin modal */}
        <Modal isOpen={isOpenM} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Admin</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Username</Text>
              <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Text mt={5}>Password</Text>
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text mt={5}>Email</Text>
              <Input
                type="email"
                placeholder="ex@example.com"
                onChange={(e) => setMail(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddAdmin}>
                Add Admin
              </Button>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* drawer more info */}
        {selectedUser &&
          <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          size={'xl'}
          // finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>

              <Text fontSize={'2xl'}  textAlign={'center'}>{firstLetterUpper(selectedUser.role)}</Text>

              <Flex>              {
                selectedUser.role === "pharmacist" ? 
                  (<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                      <FontAwesomeIcon icon={faUserDoctor} fontSize={'25px'} /> 
                    </Flex>)
                : selectedUser.role === "patient" ? 
                  (<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <FontAwesomeIcon icon={faBedPulse} fontSize={'25px'} />
                  </Flex>
                  )
                : selectedUser.role === "admin" ? 
                (
                  <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <FontAwesomeIcon icon={faUserCog}  fontSize={'25px'}/>
                  </Flex>
                ): <></>
                } 
              <Box ml='3'>
                  <Text fontWeight='bold'>
                  {selectedUser.Name}
                  <Badge ml='1' colorScheme='green'>
                      Active
                  </Badge>
                  </Text>
                  <Text fontSize='sm'> {selectedUser.Username }</Text>
              </Box>
              </Flex>
              </DrawerHeader>

              <DrawerBody>
              <Flex justifyContent={'center'}  alignItems={'center'} >
                <Stack spacing={10}>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Email
                </AbsoluteCenter>
                </Box>
                <Text fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.Email} </Center> </Text>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Joined
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {new Date(selectedUser.createdAt).toLocaleDateString()} </Center></Text>
                {
                  selectedUser.MobileNumber? 
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Mobile Number
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.MobileNumber} </Center></Text>
                </> 
                : <></>
                }
                {
                  selectedUser.EmergencyContact_Name?
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Emergency Contact
                </AbsoluteCenter>
                </Box>
                <Box>
                <Flex alignItems={'center'} justifyContent={'center'}>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.EmergencyContact_Relation}: {" "}</Center></Text>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.EmergencyContact_Name} </Center></Text>
                </Flex>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.EmergencyContact_MobileNumber} </Center></Text>
                </Box>
                </>
                : <></>
                }
                {
                  selectedUser.DateOfBirth?
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Date Of Birth
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {new Date(selectedUser.DateOfBirth).toLocaleDateString()} </Center></Text>
                </>
                : <></>
                }
                {
                  selectedUser.affiliation?
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Affiliation
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> {selectedUser.affiliation} </Center></Text>
                </>
                : <></>
                }
                {
                  selectedUser.education_background?
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Educational Background
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}>  <Center> {selectedUser.education_background} </Center></Text>
                </>
                : <></>
                }
                {
                  selectedUser.hourly_rate?
                  <>
                <Box position='relative' >
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    Hourly Rate
                </AbsoluteCenter>
                </Box>
                <Text  fontSize={'2xl'} color={'#00a6ff'}> <Center> ${selectedUser.hourly_rate} </Center></Text>
                </>
                : <></>
                }
                </Stack>
              </Flex>

              </DrawerBody>

              <DrawerFooter>
                <Button variant='outline' mr={3} onClick={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        }
        </div>
    </>
  )
}

export default UserManagement

