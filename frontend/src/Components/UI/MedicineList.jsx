import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Navbar } from '../UI/navbar';
import axios from "axios";
import MedicineItem from '../UI/MedicineItem';
import { Text,SimpleGrid, Input, Box,  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,Button,useDisclosure,Select } from '@chakra-ui/react';
  import { Radio, RadioGroup,Stack } from '@chakra-ui/react'
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import '../../index.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import Sidebar from '../Pages/side';


export function MedicineList() {
//  const toast = useToast();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [addToCartQueue, setAddToCartQueue] = useState([]);
  const [Prescription, setPrescription] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false); // Flag to prevent concurrent processing
  const [openDetails, setOpenDetails] = useState(false); // Flag to prevent concurrent processing
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [PrescribedMed,SetPrescribedMed]=useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [check, setCheck] = useState(false);

  const navigate = useNavigate();
  const back =()=>  navigate(-1);

  useEffect(() => {
    // Fetch medicines and their medicinal uses from your server's API endpoint
    fetch('http://localhost:8001/admin/availableMedicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));
      //Fetch User Prescriptions
    // Fetch the list of unique medicinal uses
    fetch('http://localhost:8001/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);
useEffect(()=>{
  const Prescription = async () => {
    try {
    const { data } = await axios.post("http://localhost:8001/patient/Prescriptions",{}, {
        withCredentials: true,
    });
    // setFiltered( 
      setPrescription(data)

      // );
    } catch (err) {
        console.log(err);
    }
};
Prescription();
}, []);

  const addToCart = async (medicine, quantity) => {
    try {
      const response = await axios.post('http://localhost:8001/cart', {
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
    console.log(addToCartQueue);
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
    const getRelatedMeds=(currentMedicine)=>{
      const relatedMeds = medicines
      .filter((medicine) =>
        medicine.Details.toLowerCase().includes(currentMedicine.Details)
      )
      return relatedMeds;
    }
    const  handleOpenDetails=(medicineId)=>{
      setSelectedMedicineId(medicineId);
    }
    const prescriptionMed=async(prescID)=>{
      console.log(prescID);
      const response= await axios.post("http://localhost:8001/patient/PrescribedMedicene",{prescID}, {
      withCredentials: true,
  });
    // setMedicines([]);
    console.log(response);
    if(response.data =="error"){
      setCheck(false);
      toast("Medicene not available");
    }
    else{
    SetPrescribedMed(response.data[0]);
      console.log(response.data)
    setCheck(true);
    
  
  }
  
    }
   // setMedicines(data);

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

<Navigation
      pagetitle={"Medicine"}/>
       <Sidebar
      />
         <div className="content">
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

      <RadioGroup onChange={setValue} value={value}>
      <Stack direction='row'>
      <Button onClick={()=>setCheck(false)}>Reset</Button>
      {Prescription.map((presc,index)=>
        <Button onClick={()=>prescriptionMed(presc._id)} >Prescription: {index+1}</Button>   
        )} 
        
      </Stack>
    </RadioGroup>


  


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
            >        {!check && filteredMedicines.map((medicine) => (

   
          <MedicineItem
            key={medicine._id}
            medicine={medicine}
            addToCart={handleAddToCart}
          />

        ))}
        {check && PrescribedMed.map((medicine) => (
          
   
<MedicineItem
  key={medicine._id}
    medicine={medicine}
  addToCart={handleAddToCart}
  
/>
  
))}
         

      </div>
      </div>
      </div>
      </div>
      </>

  );
}

export default MedicineList;
