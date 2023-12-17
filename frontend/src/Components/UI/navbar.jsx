import React, { useState,useEffect } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './button.css'
import { useNavigate } from 'react-router-dom';

import '../UI/navbar.css'
export const Navbar=()=>{
    const [cart, setCart] = useState(null);
    
    const [openedDrawer, setOpenedDrawer] = useState(false)
    const navigate = useNavigate();
    const back = () => window.history.back();
    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get('http://localhost:8001/cart', { withCredentials: true });
                setCart(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getCart();
    }, [cart]);
    function toggleDrawer() {
      setOpenedDrawer(!openedDrawer);
    }
    return(
<div className="navbar">
{/* <button className="btn"  onClick={back}>back</button> */}
    <div className="links">
{/* <Link to="/cart">
    <FontAwesomeIcon icon={faCartShopping} fontSize={'35px'}/>
</Link> */}
<Link to="/cart">
            <button type="button" className="btn btn-outline-dark">
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
              <span className="ms-3 badge rounded-pill bg-dark">{cart ? cart.items.length : 0}</span>
            </button>
            <button className="navbar-toggler p-0 border-0 ms-3" type="button" onClick={toggleDrawer}>
              <span className="navbar-toggler-icon"></span>
            </button>
            </Link>
          </div>
          
</div>
    );
};