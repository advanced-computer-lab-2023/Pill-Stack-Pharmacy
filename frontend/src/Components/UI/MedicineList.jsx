import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Navbar } from '../UI/navbar';
import axios from "axios";
import MedicineItem from '../UI/MedicineItem';
import { SimpleGrid,Heading, Input, Box } from '@chakra-ui/react';
import '../../index.css'

export function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);

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
    const response = await axios.post('http://localhost:8000/cart', {
      productId: medicine._id,
      quantity,
    }, { withCredentials: true });
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

  return (
    <Box className="med_page" >
      <Navbar />

      <Heading as="h1" mb={4}>
        Available Medicines
      </Heading>
      <MedicinalUseFilter
        selectedMedicinalUse={selectedMedicinalUse}
        onMedicinalUseChange={setSelectedMedicinalUse}
        medicinalUses={medicinalUses}
      />
      <Input htmlSize={15} width='auto'
        type="text"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredMedicines.map((medicine) => (
          <MedicineItem
            key={medicine._id}
            medicine={medicine}
            addToCart={addToCart}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default MedicineList;
