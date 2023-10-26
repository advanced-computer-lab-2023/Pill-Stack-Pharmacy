import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {  Box, Stack,
    Text
} from "@chakra-ui/react"



export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
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


  const handleUsers = () => {
      navigate("/admin-users");
  };

  const handleReqs = () => {
      navigate("/admin-requests");
  };

  return (
    <>
      <Box className="home_page" bg={'whiteAlpha.50'}>

        <Text color={'black'}>
          Welcome Adminnnnn {username}
        </Text>
        <Stack>
          <button onClick={handleUsers}>Manage Users</button>
          <button onClick={handleReqs}> Manage Doctor Requests </button>
        </Stack>
        <button onClick={Logout}>LOGOUT</button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default AdminHome;