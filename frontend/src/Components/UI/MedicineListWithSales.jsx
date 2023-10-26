import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import EditMedicine from '../UI/EditMedicine';
import { Button, ButtonGroup } from '@chakra-ui/react'
import axios from 'axios'; // Import axios for making HTTP requests


export function MedicineListwithSales() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const openEditModal = (medicine) => {
    console.log('Edit button clicked'); // Add this line
  console.log(medicine);
    setEditMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditMedicine(null);
    setIsModalOpen(false);
  };

  const updateMedicine = (updatedMedicine) => {
    // Update the medicine's details and price in your local state
    const updatedMedicines = medicines.map((medicine) => {
      if (medicine._id === updatedMedicine._id) {
        return updatedMedicine;
      }
      return medicine;
    });
    setMedicines(updatedMedicines);

    // You should also send a PUT request to update the data on your server
    closeEditModal();
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
    <div>
      <h1>Available Medicines</h1>
      <MedicinalUseFilter
        selectedMedicinalUse={selectedMedicinalUse}
        onMedicinalUseChange={setSelectedMedicinalUse}
        medicinalUses={medicinalUses}
      />
      <div>
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        {filteredMedicines.map((medicine,index) => (
          <div key={medicine._id} className="medicine-card">
          
            <h2>{medicine.Name}</h2>
            <p>{medicine.Details}</p>
            <p>Price: ${medicine.Price}</p>
            <p>Available Quantity: {medicine.Quantity}</p>
            <p>Sales: {medicine.Sales}</p>
            <button onClick={() => openEditModal(medicine)}>Edit</button>

            {index !== filteredMedicines.length - 1 && (
              <div className="separator"></div>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && (
          <div className="modal">
            <EditMedicine medicine={editMedicine} onUpdate={updateMedicine} />
            <br />
            <Button colorScheme='teal' size='sm' onClick={closeEditModal}>Close</Button>
          </div>
      )}
    
    </div>
  );
}

export default MedicineListwithSales;
