import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Buffer } from 'buffer';
import { SimpleGrid, Box, Heading, Input } from '@chakra-ui/react';

export function MedicineListControl() {
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
    <Box className="med_page" >
      <Heading as="h1" mb={4}>
        Available Medicines
      </Heading>
      <MedicinalUseFilter
        selectedMedicinalUse={selectedMedicinalUse}
        onMedicinalUseChange={setSelectedMedicinalUse}
        medicinalUses={medicinalUses}
      />
      <Input
      htmlSize={15} width='auto'
        type="text"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <SimpleGrid columns={3} spacing={10}>
        {filteredMedicines.map((medicine) => (
          <Box
            key={medicine._id}
            p={4}
            border="1px"
            borderRadius="md"
            borderColor="gray.200"
          >
            <img
              width="150"
              height="150"
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
  );
}

export default MedicineListControl;
