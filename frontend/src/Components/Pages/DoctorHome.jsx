import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,
  faUser,
  faNotesMedical,
  faCapsules,
  faFile
 } from "@fortawesome/free-solid-svg-icons";
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
      console.log("data is :0", data);
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (console.log("else itttttttt"),
          removeCookie("token"), navigate("/"));
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
      {console.log("in hereeeeeeeeeee")}
      {fullUser && fullUser.Name}
    </>
  )
}

export default DoctorHome
