import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Buffer } from 'buffer';
import '../../index.css'
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Button,
    Select,
    FormControl,
    FormLabel,
    Flex,
    HStack,
  } from '@chakra-ui/react';
  import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
    } from "mdb-react-ui-kit";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'
export const Cart = () => {
    const navigate = useNavigate();
    const back =()=>  navigate(-1);
    const [cart, setCart] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isErrorPayment, setIsErrorPayment] = useState(null);
    const [isSucessPayment, setIsSucessPayment] = useState(null);
    const [isFailPayment, setIsFailPayment] = useState(null);
    const [isSucessMessage, setIsSucessMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);




    const [address, setAddress] = useState([]);

    const handleCheckout =  async () => {
        setErrorMessage('');
        setIsModalOpen(true);
        const response = await axios.get(
            'http://localhost:8000/patient/Address',
            { withCredentials: true }
          );
        setAddress(response.data);

    }

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cart', { withCredentials: true });
                setCart(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getCart();
    }, [cart]);
    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            // Display an error message or prevent the update action here.
            setErrorMessage('Quantity cannot be less than 1');
            return;
        }
        try{
        setErrorMessage('');
        const response= await axios.post('http://localhost:8000/cart/update',{productId:productId,quantity:newQuantity },  { withCredentials: true });
        setCart(response.data);
        }catch (err) {
            console.log(err);
        }
        // Send an API request to update the quantity of the item in the cart
        // You will need to implement this API on the server side
    };
    const handleDelete= async (productId,itemPrice,itemQuantity) => {
      setIsDeleting(true);
        try{
      
        const response= await axios.delete(`http://localhost:8000/cart/${productId}`, { withCredentials: true });
        if (response.status === 200) {
          // Item was successfully deleted
          setCart(response.data);

        }

      
        }catch (err) {
            console.log(err);
            setIsDeleting(false);

        }finally{
          setIsDeleting(false);

        }
        // Send an API request to update the quantity of the item in the cart
        // You will need to implement this API on the server side
    };
    const handlePay=async(selectedAddress,selectedPayment)=>{
        if(selectedPayment=='' | selectedAddress===''){
          setIsErrorPayment(true);
          return;
        }else{
            if(selectedPayment==='cash'){
                const response= await axios.post('http://localhost:8000/order/orderCash',{address:selectedAddress},  { withCredentials: true });
                setIsSucessPayment(true);
                setIsModalOpen(false);
                setCart(null);
                navigate('/completion');


            }else{
                if(selectedPayment==='wallet'){
                    const response= await axios.post('http://localhost:8000/order/orderWallet',{address:selectedAddress},  { withCredentials: true });
                    if(response.data==='You do not have enough money in wallet'){
                        setErrorMessage('Not enough balance in Wallet.Please top up your wallet or pick a different payment method.')
                        setIsModalOpen(false);

                    }else{
                        setIsSucessPayment(true);
                        setIsModalOpen(false);
                        setCart(null);
                        navigate('/completion');

                    }

                }else{
                    navigate(`/home/creditPayment/${selectedAddress}`);


                }
            }
        }


    }

    // return (
    //   <><Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
    //     <Text fontSize={'3xl'} color={'white'}>My Cart</Text>
    //     <button className="btn" onClick={back}>back</button>
    //   </Box><div className="cart-container">
    //       {isSucessPayment && (
    //         <Alert status="success">
    //           <AlertIcon />
    //           <AlertTitle>Confirmation</AlertTitle>
    //           <AlertDescription>Order has been placed successfully</AlertDescription>
    //         </Alert>
    //       )}
    //       {errorMessage && (
    //         <Alert status="error">
    //           <AlertIcon />
    //           <AlertTitle>Error</AlertTitle>
    //           <AlertDescription>{errorMessage}</AlertDescription>
    //         </Alert>
    //       )}
    //        {isDeleting && (
    //    <CircularProgress isIndeterminate value={80} />
    //   ) }
    //       <h1>Your Cart</h1>

    //       {cart ? (
    //         <ul>
    //           {cart.items.map((item) => (
    //             <li key={item.productId}>
    //               <div className="cart-item">
    //                 <img
    //                   className="product-image"
    //                   src={`data:${item.image.contentType};base64, ${Buffer.from(item.image.data).toString('base64')}`}
    //                   alt={item.name} />
    //                 <div className="product-details">
    //                   <p className="product-name">{item.name}</p>
    //                   <p>Quantity: {item.quantity}</p>
    //                   <p>Price: ${item.price}</p>
    //                   <div>
    //                     <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
    //                     <span>Quantity: {item.quantity}</span>
    //                     <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
    //                   </div>
    //                   <button onClick={() => handleDelete(item.productId)} className="remove-button">Remove</button>
    //                 </div>
    //               </div>
    //             </li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <p>Add items to your cart..</p>
    //       )}
    //       {cart && (
    //         <div className="cart-summary">
              
    //           {cart.discount > 0 ? (
    //               <div>
    //                 <p>Subtotal: ${cart.bill}</p>
    //                 <p>Discount: ${(cart.discount * cart.bill).toFixed(2)}</p>
    //                 <p>Total: ${cart.bill - cart.discount*cart.bill}</p>
    //               </div>
    //             ) : (
    //               // JSX content when discount <= 0
    //               <div>
    //                 <p>Total: ${cart.bill}</p>
    //               </div>
    // )}
    //           <button onClick={() => handleCheckout()} className="checkout-button">Checkout</button>
    //         </div>
    //       )}
    //       <Modal isOpen={isModalOpen} onClose={() => {
    //         setIsModalOpen(false);
    //         setSelectedPayment('');
    //         setSelectedAddress('');
    //         setIsErrorPayment(false);
    //       } }>
    //         <ModalOverlay />
    //         <ModalContent>
    //           <ModalHeader>Select Payment Option</ModalHeader>
    //           <ModalCloseButton />
    //           <ModalBody>
    //             {isErrorPayment && (<Alert status='error'>
    //               <AlertIcon />
    //               <AlertTitle>Missing information</AlertTitle>
    //               <AlertDescription>Please select address and payment method.</AlertDescription>
    //             </Alert>)}
    //             <FormControl>
    //               <FormLabel>Select Address</FormLabel>
    //               <Select
    //                 value={selectedAddress}
    //                 onChange={(e) => { setSelectedAddress(e.target.value); } }
    //               >
    //                 <option value="">Select</option>


    //                 {(

    //                   address.map((add) => (
    //                     <option key={add} value={add}>
    //                       {add}
    //                     </option>
    //                   ))
    //                 )}
    //               </Select>
    //             </FormControl>
    //             <FormControl>
    //               <FormLabel>Select Payment Method</FormLabel>
    //               <Select
    //                 value={selectedPayment}
    //                 onChange={(e) => {
    //                   setSelectedPayment(e.target.value);

    //                 } }

    //               >
    //                 <option value="">Select payment</option>
    //                 <option value="wallet">Wallet</option>
    //                 <option value="cash">Cash on delivery</option>
    //                 <option value="credit">Credit</option>
    //                 {/* Add more options as needed */}
    //               </Select>
    //             </FormControl>

    //           </ModalBody>
    //           <ModalFooter>
    //             <Button colorScheme="blue" onClick={() => handlePay(selectedAddress, selectedPayment)}>
    //               Pay
    //             </Button>
    //           </ModalFooter>
    //         </ModalContent>
    //       </Modal>
    //     </div></>

    // );
    return (
      <>
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
       
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol size="12">
              <MDBCard className="card-registration card-registration-2" style={{ borderRadius: "15px" }}>
                <MDBCardBody className="p-0">
                {isSucessPayment && (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Confirmation</AlertTitle>
              <AlertDescription>Order has been placed successfully</AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
                  <MDBRow className="g-0">
                    <MDBCol lg="8">
                      <div className="p-5">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                          <MDBTypography tag="h1" className="fw-bold mb-0 text-black">
                            Shopping Cart
                          </MDBTypography>
                          <MDBTypography className="mb-0 text-muted">
                            {cart && cart.items.length}
                          </MDBTypography>
                        </div>
                        <hr className="my-4" />

                        {cart && cart.items.length > 0 ? (
                           cart.items.map((item,index) => (
                        <MDBRow key={index} className="mb-4 d-flex justify-content-between align-items-center">
                          <MDBCol md="2" lg="2" xl="2">
                            <MDBCardImage
                              src={`data:${item.image.contentType};base64, ${Buffer.from(item.image.data).toString('base64')}`}
                              fluid className="rounded-3" alt={item.name} />
                          </MDBCol>
                          <MDBCol md="3" lg="3" xl="3">
                            <MDBTypography tag="h6" className="text-muted">
                              {item.name}
                            </MDBTypography>
                            <MDBTypography tag="h6" className="text-black mb-0">
                              Cotton T-shirt
                            </MDBTypography>
                          </MDBCol>
                          <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                            <MDBBtn color="link" className="px-2" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>
                              <MDBIcon fas icon="minus"  />
                            </MDBBtn>
                            <MDBTypography tag="h6" className="text-black mb-0">
                            {item.quantity}
                            </MDBTypography>
                            
                            <MDBBtn color="link" className="px-2" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>
                              <MDBIcon fas icon="plus" />
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="3" lg="2" xl="2" className="text-end">
                            <MDBTypography tag="h6" className="mb-0">
                              {item.price*item.quantity}
                            </MDBTypography>
                          </MDBCol>
                         
                          <MDBCol md="1" lg="1" xl="1" className="text-end">
                              <a href="#!" className="text-muted">
                              <MDBIcon fas icon="trash-alt" onClick={() => handleDelete(item.productId)} /> </a>
                          </MDBCol>
                        </MDBRow>

                        ))):(<p>Add items to your cart...</p>)}
      
                        
      
      
                  
      
                        <hr className="my-4" />
      
                      </div>
                    </MDBCol>
                    
                    {cart && cart.items.length > 0 && (
                    <MDBCol lg="4" className="bg-grey">
                      <div className="p-5">
                        <MDBTypography tag="h3" className="fw-bold mb-5 mt-2 pt-1">
                          Summary
                        </MDBTypography>
      
                        <hr className="my-4" />
      
                        <div className="d-flex justify-content-between mb-4">
                          <MDBTypography tag="h5" className="text-uppercase">
                            items {cart && cart.items.length}
                          </MDBTypography>
                         
                          <MDBTypography tag="h5">$ {cart && cart.bill}</MDBTypography>
                        </div>
      
                        <MDBTypography tag="h5" className="text-uppercase mb-3">
                          Shipping
                        </MDBTypography>
      
                        <div className="mb-4 pb-2">
                          <select className="select p-2 rounded bg-grey" style={{ width: "100%" }}>
                            <option value="1">Standard-Delivery-FREE</option>
                            <option value="2">Express-FREE</option>
                          </select>
                        </div>
      
                        <MDBTypography tag="h5" className="text-uppercase mb-3">
                          Give code
                        </MDBTypography>
      
                        <div className="mb-5">
                          <MDBInput size="lg" label="Enter your code" />
                        </div>
      
                        <hr className="my-4" />
      
                        <div className="d-flex justify-content-between mb-1">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Sub Total
                          </MDBTypography>
                          
                          <MDBTypography tag="h5">$ {cart && cart.bill}
                          </MDBTypography>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Discount
                          </MDBTypography>
                          
                          <MDBTypography tag="h5">$ {cart && (cart.discount * cart.bill).toFixed(2)}
                          </MDBTypography>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Total Price
                          </MDBTypography>
                          <MDBTypography tag="h5">$ {cart && cart.bill-(cart.discount * cart.bill).toFixed(2)}
                          </MDBTypography>
                        </div>
      
                        <MDBBtn color="dark" block size="lg" onClick={() => handleCheckout()}>
                          Checkout
                        </MDBBtn>
                      </div>
                    </MDBCol>)}
                    <Modal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedPayment('');
            setSelectedAddress('');
            setIsErrorPayment(false);
          } }>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select Payment Option</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {isErrorPayment && (<Alert status='error'>
                  <AlertIcon />
                  <AlertTitle>Missing information</AlertTitle>
                  <AlertDescription>Please select address and payment method.</AlertDescription>
                </Alert>)}
                <FormControl>
                  <FormLabel>Select Address</FormLabel>
                  <Select
                    value={selectedAddress}
                    onChange={(e) => { setSelectedAddress(e.target.value); } }
                  >
                    <option value="">Select</option>


                    {(

                      address.map((add) => (
                        <option key={add} value={add}>
                          {add}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Select Payment Method</FormLabel>
                  <Select
                    value={selectedPayment}
                    onChange={(e) => {
                      setSelectedPayment(e.target.value);

                    } }

                  >
                    <option value="">Select payment</option>
                    <option value="wallet">Wallet</option>
                    <option value="cash">Cash on delivery</option>
                    <option value="credit">Credit</option>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>

              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={() => handlePay(selectedAddress, selectedPayment)}>
                  Pay
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
                  </MDBRow>
                </MDBCardBody>
                
              </MDBCard>
              
              <div className="pt-5">
                          <MDBTypography tag="h6" className="mb-0">
                            <MDBCardText tag="a" href="/medicine" className="text-body">
                              <MDBIcon fas icon="long-arrow-alt-left me-2" /> Back
                              to shop
                            </MDBCardText>
                          </MDBTypography>
                        </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        
      </section>
    </>
      );
}
