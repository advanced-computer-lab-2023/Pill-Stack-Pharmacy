import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Navbar } from '../UI/navbar';
import axios from "axios";
import MedicineItem from '../UI/MedicineItem';
import { Text,SimpleGrid, Input, Box } from '@chakra-ui/react';
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import '../../index.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [addToCartQueue, setAddToCartQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false); // Flag to prevent concurrent processing
  const navigate = useNavigate();
  const back =()=>  navigate(-1);

  useEffect(() => {
    // Fetch medicines and their medicinal uses from your server's API endpoint
    fetch('http://localhost:8000/admin/availableMedicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));

    // Fetch the list of unique medicinal uses
    fetch('http://localhost:8000/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);

  const addToCart = async (medicine, quantity) => {
    try {
      const response = await axios.post('http://localhost:8000/cart', {
        productId: medicine._id,
        quantity,
      }, { withCredentials: true });

      // Process the response or handle any other logic here
      setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));

      // Now that the request is complete, check the queue for more items to process
    } catch (error) {
      // Handle errors here
      // Also, make sure to handle the queue in case of errors
      setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));

    }
  };

  // Use useEffect to process the queue when it changes
  useEffect(() => {
    const processQueue = async () => {
      if (!processingQueue && addToCartQueue.length > 0) {
        const nextCartItem = addToCartQueue[0];
        const { medicine, quantity } = nextCartItem;

        setProcessingQueue(true);

        await addToCart(medicine, quantity);
        //setAddToCartQueue((prevQueue) => prevQueue.slice(1)); // Remove the processed item
        setProcessingQueue(false); // Release the processing flag
      }
    };

    processQueue();
  }, [addToCartQueue, processingQueue]);

  const handleAddToCart = (medicine, quantity) => {
    // Add the item to the queue
    setAddToCartQueue((prevQueue) => [...prevQueue, { medicine, quantity }]);
    // Start processing the queue if it's not already being processed
  };


  // Filter the medicines based on the search term and selected medicinal use
  const filteredMedicines = medicines
    .filter((medicine) =>
      medicine.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((medicine) =>
      selectedMedicinalUse === '' ||
      medicine.MedicinalUse.includes(selectedMedicinalUse)
    );

  // return (
  //   <Box className="med_page" >
           
  //     <Navbar />
      
  //     <Text fontSize={'3xl'} color={'Black'} >Over-the-counter medicine</Text>

  //     {/* <Heading as="h1" mb={4}>
  //       Available Medicines
  //     </Heading> */}
  //     <MedicinalUseFilter
  //       selectedMedicinalUse={selectedMedicinalUse}
  //       onMedicinalUseChange={setSelectedMedicinalUse}
  //       medicinalUses={medicinalUses}
  //     />
  //     <Input htmlSize={15} width='auto'
  //       type="text"
  //       placeholder="Search medicines..."
  //       value={searchTerm}
  //       onChange={(e) => setSearchTerm(e.target.value)}
  //       mb={4}
  //     />
  //           <div
  //             className={
  //               "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0  row-cols-xl-3"
  //             }
  //           >        {filteredMedicines.map((medicine) => (
  //         <MedicineItem
  //           key={medicine._id}
  //           medicine={medicine}
  //           addToCart={handleAddToCart}
  //         />
  //       ))}
  //     </div>
  //   </Box>
  // );
  return (
    <>
    <Navbar />

         <div className="container mt-5 py-4 px-xl-5">
      <div className="row mb-3 d-block d-lg-none">
        <div className="col-12">
          <div id="accordionFilter" className="accordion shadow-sm">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-expanded="false"
                  aria-controls="collapseFilter"
                >
                  Filter Products
                </button>
              </h2>
            </div>
          
          </div>
        </div>
      </div>
      <Text fontSize={'3xl'} color={'Black'} >Over-the-counter medicine</Text>
      <div className="col-lg-12">

      <div className="d-flex flex-column h-100">
            <div className="row mb-3">
      <div className="col-lg-3 d-none d-lg-block">
           <MedicinalUseFilter
        selectedMedicinalUse={selectedMedicinalUse}
        onMedicinalUseChange={setSelectedMedicinalUse}
        medicinalUses={medicinalUses}
      />
              </div>
              <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search products..."
                    aria-label="search input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                
                </div>
                </div>
                </div>
            </div>

   
            <div
              className={
                "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0  row-cols-xl-3"
              }
            >        {filteredMedicines.map((medicine) => (
          <MedicineItem
            key={medicine._id}
            medicine={medicine}
            addToCart={handleAddToCart}
          />
        ))}
      </div>
      </div>
      </div>
      </>

  );
}

export default MedicineList;
