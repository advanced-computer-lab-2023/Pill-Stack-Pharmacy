import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex,
  Input,
  Button,
  Text,
  GridItem,
  Grid,
  FormControl,
  FormLabel,
  Stack,
  HStack,
  Checkbox,
  Divider,
  Center, 
  Heading,
  Image,
  Avatar,
  AvatarGroup,
  extendTheme,

} from "@chakra-ui/react";

import  Logo  from "../UI/Images/pillstackLogo.png";
import '../../index.css'


export const Login = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
      username: "",
      password: "",
    });
    const { username, password } = inputValue;

  
    const handleError = (err) =>
      toast.error(err, {
        position: "bottom-left",
      });
    const handleSuccess = (msg) =>
      toast.success(msg, {
        position: "bottom-left",
      });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      try {
        const { data } = await axios.post(
          "http://localhost:8001/login",
          {
            username: user,
            password: pass,
          },
          { withCredentials: true }
        );
        console.log(data);
        const { success, message ,role} = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            if (role === 'patient') {
              navigate('/home');
            } else if (role === 'pharmacist') { 
              navigate('/doctor-home');
            } else if (role === 'admin') {
              navigate('/admin-home');
            }
          }, 1000);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.log(error);
      }
      setInputValue({
        ...inputValue,
        username: "",
        password: "",
      });
    };
  
    return (
      // <div className="form_container">
      //   <h2>Login Account</h2>
      //   <form onSubmit={handleSubmit}>
      //     <div>
      //       <label htmlFor="username">Username</label>
      //       <input
      //         type="username"
      //         name="username"
      //         value={username}
      //         placeholder="Enter your username"
      //         onChange={handleOnChange}
      //       />
      //     </div>
      //     <div>
      //       <label htmlFor="password">Password</label>
      //       <input
      //         type="password"
      //         name="password"
      //         value={password}
      //         placeholder="Enter your password"
      //         onChange={handleOnChange}
      //       />
      //     </div>
      //     <button type="submit">Submit</button>
      //     <span>
      //       Already have an account? <Link to={"/signup"}>Signup</Link>
      //     </span>
      //   </form>
      //   <ToastContainer />
      // </div>
      <>
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(7, 1fr)' }} gap={6} h={{ base: 'auto', sm: '100vh' }}>
      <GridItem colSpan={{ base: 'auto', sm: 4 }} p={10} h={'100%'} >
      <Stack direction="column" spacing={7} alignItems="center" w="100%" h="100%" justify="center">
        <Image src={Logo} alt="Logo" w="70%" mb={10} />
        <Box alignSelf="flex-start" mx={3} textAlign='start'>
          <Text fontSize="6xl" mb={2} as='abbr'  color={'#005660'} fontWeight={'bold'}> Your Health, <br /> One Click Away</Text>
        </Box>
        <Box alignSelf="flex-start" mx={3} textAlign='start'>
          <Text fontSize="2xl" as='cite'> "Join our platform for access to top-tier doctors and hassle-free appointments. Your wellness journey starts here." </Text>
        </Box>
        <HStack alignSelf={'start'} my={10} mx={10} >
          <AvatarGroup size="md" max={5}  >
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
            <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
            <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
          </AvatarGroup>
          <Text fontWeight={'medium'}> Join 10,000+ Users</Text>
        </HStack>
      </Stack>

      </GridItem>
      <GridItem colSpan={{ base: 'auto', sm: 3 }} h={'100%'} bg={'#005660'} borderLeftRadius={{ base: 'none', sm: 'xl' }} >
        <Flex w={'100%'} h={'100%'} justifyContent={'center'} alignItems={'center'} >
        <Box
        p={10}
        bg={'white'}
        color={'black'}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
      <Stack spacing="6">
      {/* <Logo /> */}
      <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
        <Heading size={{ base: 'xs', md: 'lg' }}>Log in to your account</Heading>
        <Text >
          Don't have an account? <Link to="/patient-register" style={{ color:"#4fbbf3", textDecoration:'underline'}}   >Sign up</Link>
        </Text>
      </Stack>
    </Stack>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input id="username" type="text" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" />
            </FormControl>
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="text" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button variant={'outline'} colorScheme="blue"  onClick={handleSubmit}>Sign in</Button>
            <HStack>
              <Divider />
              <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                Are you a Pharmacist?
              </Text>
              <Divider />
            </HStack>
            <Stack direction="row" spacing="4" align="center" justify="center">
            <Link to="/pharmacist-register" style={{color:'#4fbbf3', textDecoration:'underline'}}> Register as a pharmacist</Link>
            </Stack>

            {/* <OAuthButtonGroup /> */}
          </Stack>
        </Stack>
        </Box>
        </Flex>
      </GridItem>
    </Grid>

    <ToastContainer />
    </> 
    );
};

