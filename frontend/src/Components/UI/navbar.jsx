import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping} from "@fortawesome/free-solid-svg-icons";

import '../UI/navbar.css'
export const Navbar=()=>{
    return(
<div className="navbar">
    <div className="links">
<Link to="/cart">
    <FontAwesomeIcon icon={faCartShopping} fontSize={'35px'}/>
</Link>
    </div>
</div>
    );
};