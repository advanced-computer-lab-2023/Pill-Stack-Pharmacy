import React, { useState } from 'react';
import { Buffer } from 'buffer';
import '../../index.css'

import {
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react'
  
const MedicineItem = ({ medicine, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div key={medicine._id} className="medicine-card">
 <img
              width="150"
              height="150"
              src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
                medicine.Image.data
              ).toString('base64')}`}
            />
            <h2>{medicine.Name}</h2>
            <p>{medicine.Details}</p>
            <p>Price: ${medicine.Price}</p>     
             <div className="quantity-control">
        <NumberInput value={quantity} onChange={(value) => setQuantity(value)} min={1}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </div>
      <Button onClick={() => addToCart(medicine, quantity)}>Add to Cart</Button>
    </div>
  );
};

export default MedicineItem;
