import React, { useState } from 'react';
import { Button, ButtonGroup, Center, Select } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Text , Box} from '@chakra-ui/react'
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import SidebarDR from '../Pages/sideDR';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

export const AddMedicine = () => {
  const [medicineData, setMedicineData] = useState({
    name: '',
    details: '',
    price: '',
    quantity: '',
    medicinalUse: [],
    image: null,
    Onboard:true,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'medicinalUse') {
      // Split the input into an array using commas
      const medicinalUseArray = value.split(',');
      setMedicineData({
        ...medicineData,
        [name]: medicinalUseArray,
      });
    } else {
      setMedicineData({
        ...medicineData,
        [name]: value,
      });
    }
  };
  const back =()=>  navigate(-1);

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    setMedicineData({
      ...medicineData,
      image: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    setErrorMessage('');
    setSuccessMessage('');
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', medicineData.name);
    formData.append('details', medicineData.details);
    formData.append('price', medicineData.price);
    formData.append('quantity', medicineData.quantity);
    formData.append("Onboard",medicineData.Onboard);
    formData.append('medicinalUse', medicineData.medicinalUse.join(',')); // Join as a comma-separated string
    formData.append('image', medicineData.image);

    try {
     
      const response = await axios.post('http://localhost:8001/pharmacist/createMedicine', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
     
      console.log(response);

      if (response.data === 'Medicine added successfully.') {
        setMedicineData({
          name: '',
          details: '',
          price: '',
          quantity: '',
          medicinalUse: [],
          image: null,
        });
        console.log('Medicine added successfully.');
        setErrorMessage('');

        setSuccessMessage('Medicine added successfully.');
      
      } else {
        setErrorMessage(response.data);
        console.error('Error adding medicine.');
      }
    } catch (error) {
        setErrorMessage('server error');

      console.error('Error adding medicine12:', error);
    }finally {
      console.log('isSubfalse')
      setIsSubmitting(false); // Set isSubmitting to false to enable the button after the request is done
    }
  };

  return (
    <>
    <Navigation
      pagetitle={"Add New Medicine"}/>
       <SidebarDR
      />
     <div className="content">
    {/* <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Add New Medicine</Text>
      <button className="btn" onClick={back}>back</button>
    </Box> */}
    <Center>

        <div style={{ margin: "50px", width: "50%" }}>

          <Text fontSize='3xl'>Add New Medicine</Text>
          <form onSubmit={handleSubmit} style={{}}>
            <div>
              <label>Name:</label>
              <Input variant='filled' type="text" name="name" value={medicineData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label>Details:</label>
              <Input variant='filled' name="details" value={medicineData.details} onChange={handleInputChange} />
            </div>
            <div>
              <label>Price:</label>
              <Input variant='filled' type="text" name="price" value={medicineData.price}onChange={handleInputChange} />
            </div>
            <div>
              <label>Quantity:</label>
              <Input variant='filled' type="text" name="quantity" value={medicineData.quantity} onChange={handleInputChange} />
            </div>
            <div>
              <label>Medicinal Use (comma-separated):</label>
              <Input variant='filled' type="text" name="medicinalUse" value={medicineData.medicinalUse} onChange={handleInputChange} />
            </div>
            <div>
              <label>Is on Board Medicene :</label>
              <Select name="medicinOnboard" value={medicineData.Onboard} onChange={handleInputChange}>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </Select>
            </div>
            <div>
              <label>Image:</label>
              <Input variant='filled' type="file" name="image" accept="image/*" onChange={handleImageUpload} />
            </div>

            <Button colorScheme='blue' type="submit" m={5} disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Add Medicine'}
</Button>          </form>
          {successMessage && (
            <Alert status='success'>
              <AlertIcon />
              Data uploaded to the server. Fire on!
            </Alert>
          )}

          {errorMessage && (
            <Alert status='error'>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}



        </div>
        
      </Center>
      </div>  
      </>

  );
};

export default AddMedicine;
