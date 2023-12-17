import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import EditMedicine from '../UI/EditMedicine';
import { Button, Input, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import SidebarDR from '../Pages/sideDR';

export function MedicineListwithSales() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8001/admin/availableMedicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));

    fetch('http://localhost:8001/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);

  const openEditModal = (medicine) => {
    console.log('here');
    setEditMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditMedicine(null);
    setIsModalOpen(false);
  };
  const back =()=>  navigate(-1);

  const updateMedicine = async (updatedMedicine) => {
    try {
      // Update the medicine's details and price on your server
      await axios.put(`http://localhost:8001/admin/availableMedicines/${updatedMedicine._id}`, updatedMedicine);

      // Update the medicine in your local state
      const updatedMedicines = medicines.map((medicine) => (
        medicine._id === updatedMedicine._id ? updatedMedicine : medicine
      ));
      setMedicines(updatedMedicines);

      closeEditModal();
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const filteredMedicines = medicines
    .filter((medicine) => medicine.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((medicine) => selectedMedicinalUse === '' || medicine.MedicinalUse.includes(selectedMedicinalUse));

  return (
    <>
    <Navigation
      pagetitle={"Stock Management"}/>
       <SidebarDR
       mb={3}
      />
  <div className="content" mt={3}>     
   
        <MedicinalUseFilter
          selectedMedicinalUse={selectedMedicinalUse}
          onMedicinalUseChange={setSelectedMedicinalUse}
          medicinalUses={medicinalUses} />
        <Input
          htmlSize={15} width='auto'
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          mb={3}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <VStack align="start" w="100%">
          {filteredMedicines.map((medicine, index) => (
            <Box key={medicine._id} w='100%' p={4} borderWidth="10px" borderRadius="md">
              <Text>Name: {medicine.Name}</Text>
              <Text>Details: {medicine.Details}</Text>
              <Text>Price: ${medicine.Price}</Text>
              <Text>Available Quantity: {medicine.Quantity}</Text>
              <Text>Sales: {medicine.Sales}</Text>
              <Button size="sm" colorScheme="teal" onClick={() => openEditModal(medicine)}>Edit</Button>

              {index !== filteredMedicines.length - 1 && (
                <Box h="1px" bg="gray.200" w="100%" my={4}></Box>
              )}
              
            </Box>
            
          ))}
          
        </VStack>

        {isModalOpen && (
  <Modal isOpen={isModalOpen} onClose={closeEditModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Edit Medicine</ModalHeader>
      <ModalBody>
        <EditMedicine medicine={editMedicine} onUpdate={updateMedicine} />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={closeEditModal}>
          Close
        </Button>
        {/* You can add additional buttons or elements here if needed */}
      </ModalFooter>
    </ModalContent>
  </Modal>
)}
        
        </div>   
      
      </>
      
  );
}

export default MedicineListwithSales;
