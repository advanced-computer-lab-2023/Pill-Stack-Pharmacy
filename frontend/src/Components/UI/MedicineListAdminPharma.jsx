import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Buffer } from 'buffer';
import { SimpleGrid, Box, Heading, Input, Text, IconButton,Flex } from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import '../UI/button.css';
import Navigation from "../UI/Navigation";
import '../UI/innerPages.css';
import SidebarDR from '../Pages/sideDR';

export function MedicineListControl() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const navigate = useNavigate();
  const back = () => navigate(-1);
  const toast = useToast();

  useEffect(() => {
    // Fetch medicines and their medicinal uses from your server's API endpoint
    fetch('http://localhost:8001/admin/availableMedicinesPH')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));

    // Fetch the list of unique medicinal uses
    fetch('http://localhost:8001/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);

  // Function to change medicine status
  const changeMedicineStatus = (medicineId) => {
    // Update the medicine status in the backend
    fetch(`http://localhost:8001/pharmacist/changeMedicineStatus/${medicineId}`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        // Display a success toast
        toast({
          title: 'Success',
          description: `Medicine status changed to ${data.status}`,
          status: 'success',
          duration: 3001,
          isClosable: true,
        });

        // Update the medicine list with the new status
        setMedicines((prevMedicines) =>
          prevMedicines.map((medicine) =>
            medicine._id === data._id ? data : medicine
          )
        );
      })
      .catch((error) => {
        console.error('Error changing medicine status:', error);

        // Display an error toast
        toast({
          title: 'Error',
          description: 'Failed to change medicine status',
          status: 'error',
          duration: 3001,
          isClosable: true,
        });
      });
  };

  // Filter the medicines based on the search term and selected medicinal use
  const filteredMedicines = medicines
  .filter((medicine) =>
    medicine.Name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(
    (medicine) =>
      selectedMedicinalUse === '' ||
      medicine.MedicinalUse.includes(selectedMedicinalUse)
  );
  return (
    <>
     <Navigation
      pagetitle={"Available Medicines"}/>
       {/* <SidebarDR
      /> */}
      {/* <div className="content" mr={13}> */}
      {/* <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}>
          Available Medicines
        </Text>
        <button className="btn" onClick={back}>
          back
        </button>
      </Box> */}
      <Flex  Flex align="center" mb={4}>
        <MedicinalUseFilter
          selectedMedicinalUse={selectedMedicinalUse}
          onMedicinalUseChange={setSelectedMedicinalUse}
          medicinalUses={medicinalUses}
        />
        <Input
          htmlSize={15}
          width='auto'
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={4}
        />
        </Flex>
      <Box className="med_page">
      
        <SimpleGrid columns={3} spacing={10}>
          {filteredMedicines.map((medicine) => (
            <Box
              key={medicine._id}
              p={4}
              border="1px"
              borderRadius="md"
              borderColor="gray.200"
              position="relative"
              className={medicine.status === 'archived' ? 'archived' : ''}
            >
              {/* Toggle Icon based on medicine status */}
              {medicine.status === 'Available' ? (
                <UnlockIcon
                  size="xs"
                  color="gray.500"
                  _hover={{ color: 'cyan.500' }}
                  position="absolute"
                  top={2}
                  right={2}
                  style={{ width: '20px', cursor: 'pointer' }}
                  zIndex={1}
                  onClick={() => changeMedicineStatus(medicine._id)}
                />
              ) : (
                <LockIcon
                  size="xs"
                  color="gray.500"
                  _hover={{ color: 'cyan.500' }}
                  position="absolute"
                  top={2}
                  right={2}
                  style={{ width: '20px', cursor: 'pointer' }}
                  zIndex={1}
                  onClick={() => changeMedicineStatus(medicine._id)}
                />
              )}
              {/* Medicine Content */}
              <img
                style={{ objectFit: 'cover',minHeight:'400px', maxHeight: '400px' }} 
                src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
                  medicine.Image.data
                ).toString('base64')}`}
                alt={medicine.Name}
              />
              <Heading as="h2" size="md" mt={2}>
                {medicine.Name}
              </Heading>
              <p>{medicine.Details}</p>
              <p>Price: ${medicine.Price}</p>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      {/* </div> */}
    </>
  );
}  
export default MedicineListControl;
