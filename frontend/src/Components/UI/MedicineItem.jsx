import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import {
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const MedicineItem = ({ medicine, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  console.log(medicine);
//   return (
//     <div key={medicine._id} className="medicine-card">
//      <img
//   width="150"
//   height="150"
//   style={{ objectFit: 'cover', maxHeight: '150px' }}  // Added styling for consistent height
//   src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
//     medicine.Image.data
//   ).toString('base64')}`}
//   alt={medicine.Name}
// />

//       <h2>{medicine.Name}</h2>
//       <p>{medicine.Details}</p>
//       <p>Price: ${medicine.Price}</p>
//       <div className="quantity-control">
//         <NumberInput value={quantity} onChange={(value) => setQuantity(value)} min={1}>
//           <NumberInputField />
//           <NumberInputStepper>
//             <NumberIncrementStepper />
//             <NumberDecrementStepper />
//           </NumberInputStepper>
//         </NumberInput>
//       </div>
//       {medicine.Quantity > 0 ? (
//         <Button onClick={() => addToCart(medicine, quantity)} mt={2} colorScheme="teal">
//         Add to Cart
//       </Button>
//       ) : (
//         <Button mt={2} colorScheme="teal" disabled>
//           Out of Stock
//         </Button>
//       )}
     
//     </div>
//   );
return (
  <div className="col">
    <div className="card shadow-sm">
      <Link to={`/medicine/details/${medicine._id}`} href="!#" replace>
        
       <img
          className="card-img-top bg-dark cover"
          height="100"
          Width="50"
          style={{ objectFit: 'cover',minHeight:'400px', maxHeight: '400px' }}  
          src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
                 medicine.Image.data
               ).toString('base64')}`}
               alt={medicine.Name}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title text-center text-dark text-truncate">
          {medicine.Name}
        </h5>
        <p className="card-text text-center text-muted mb-0">$ {medicine.Price}</p>
        <div className="d-grid d-block">
        {medicine.Quantity > 0 ? (
          <button className="btn btn-outline-dark mt-3" onClick={() => addToCart(medicine, 1)}>
            <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
          </button>):(
            <button className="btn btn-outline-dark mt-3">
            <FontAwesomeIcon icon="fa-regular fa-circle-xmark" /> Out of Stock
          </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default MedicineItem;
