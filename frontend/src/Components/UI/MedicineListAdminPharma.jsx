import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Buffer } from 'buffer';
import '../../index.css';


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

    <div className="med_page">

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
      <div className="medicine-grid">
        {filteredMedicines.map((medicine) => (
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
         
          </div>
        ))}
      </div>
     
    </div>
  );
}

export default MedicineList;
