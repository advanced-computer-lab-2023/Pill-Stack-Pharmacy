import React, { useState } from 'react';
import { Button, ButtonGroup, Center } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
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
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


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

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    setMedicineData({
      ...medicineData,
      image: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!medicineData.name || !medicineData.price) {
        setSuccessMessage('');
        setErrorMessage('Please fill in all required fields.');
        return; // Exit the function to prevent the fetch request
      }
    formData.append('name', medicineData.name);
    formData.append('details', medicineData.details);
    formData.append('price', medicineData.price);
    formData.append('quantity', medicineData.quantity);
    formData.append('medicinalUse', medicineData.medicinalUse.join(',')); // Join as a comma-separated string
    formData.append('image', medicineData.image);

    try {
      const response = await fetch('http://localhost:8000/pharmacist/createMedicine', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        console.log('Medicine added successfully.');
        setErrorMessage('');

        setSuccessMessage('Medicine added successfully.');
        setMedicineData({
            name: '',
            details: '',
            price: '',
            quantity: '',
            medicinalUse: [],
            image: null,
          });
      } else {
        setErrorMessage(response.message);
        console.error('Error adding medicine.');
      }
    } catch (error) {
        setErrorMessage('server error');

      console.error('Error adding medicine:', error);
    }
  };

  return (
    <Center>
    <div style={{margin:"50px", width:"50%"}}>
      
      <Text fontSize='3xl'>Add New Medicine</Text>
      <form onSubmit={handleSubmit} style={{}}>
        <div>
          <label>Name:</label>
          <Input variant='filled' type="text" name="name" onChange={handleInputChange} />
        </div>
        <div>
          <label>Details:</label>
          <Input  variant='filled'name="details" onChange={handleInputChange}/>
        </div>
        <div>
          <label>Price:</label>
          <Input  variant='filled'type="text" name="price" onChange={handleInputChange} />
        </div>
        <div>
          <label>Quantity:</label>
          <Input  variant='filled'type="text" name="quantity" onChange={handleInputChange} />
        </div>
        <div>
          <label>Medicinal Use (comma-separated):</label>
          <Input variant='filled' type="text" name="medicinalUse" onChange={handleInputChange} />
        </div>
        <div>
          <label>Image:</label>
          <Input variant='filled' type="file" name="image" accept="image/*" onChange={handleImageUpload} />
        </div>
        
        <Button colorScheme='blue' type="submit" m={5}>Add Medicine</Button>
      </form>
      {successMessage && (
       <Alert status='success'>
       <AlertIcon />
       Data uploaded to the server. Fire on!
     </Alert>
      )}
      
      {errorMessage && (
       <Alert status='error'>
         <AlertIcon />
         There was an error processing your request
       </Alert>
      )}
      
      

    </div>
    </Center>

  );
};

export default AddMedicine;
