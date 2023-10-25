const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { default: mongoose } = require('mongoose');




// add a new medicine
const createMedicine = async (req, res) => {
  try {
    console.log(req.file);
    const image = req.file;

    if (!image) {
      return res.status(400).send('Please upload an image.');
    }

    const medicine = new medModel({
      Name: req.body.name,
      Details: req.body.details,
      Price: req.body.price,
      Quantity: req.body.quantity,
      Sales: req.body.sales,
      Image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
      // Split the medicinal use string into an array
      MedicinalUse: req.body.medicinalUse.split(',')
      });
    console.log(image.buffer);
    console.log(image.mimetype)

    // Check for duplicate medicine
    const medExists = await medModel.findOne({ Name: req.body.name });

    if (medExists) {
      return res.status(400).send("Medicine already exists");
    }

    // Save the medicine using await
    const savedMedicine = await medicine.save();
    console.log('Medicine saved successfully:', savedMedicine);
    res.status(200).send("Medicine added successfully.");
  } catch (error) {
    console.error('Error saving medicine:', error);
    res.status(500).send("An error occurred while saving medicine.");
  }
};


const editMedicine = async(req, res) => {
  res.render('editmed')
}

async function getMedSQ(req, res) {
  try {
    // Use Mongoose to find medicines with quantity > 0
    const availableMedicines = await medModel.find({});
    console.log(availableMedicines)
    res.render('avMed.ejs', { data: availableMedicines });
  } catch (error) {
    console.error('Error fetching available medicines:', error);
    throw error;
  }
}



  const editMedicineResults = async (req, res) => {
    try {
      const medicineName = req.query.medicineName;
      const newPrice = req.query.newPrice;
      const newDetails = req.query.newDetails;
  
      // Assuming you have a model named medModel for your database
  
      // Find the medicine by name
      const existingMedicine = await medModel.findOne({ Name: medicineName });
  
      if (existingMedicine) {
        // Update the medicine information
        if (newPrice)
        existingMedicine.Price = newPrice;
        if (newDetails)
        existingMedicine.Details = newDetails;
  
        // Save the updated medicine
        await existingMedicine.save();
  
        console.log('Medicine information updated successfully.');
        res.send('Medicine information updated successfully.');
      } else {
        console.log('Medicine not found in the database.');
        res.send('Medicine not found in the database.');
      }
    } catch (error) {
      console.error('Error updating medicine information:', error);
      res.status(500).send('Error updating medicine information');
    }
  }
  







 //search for a medicine in the database
 const searchMedicinePh = async (req, res) => {
  const searchTerm = req.body.name;
  console.log(searchTerm);
  try {
    const medicine = await medModel.findOne({ Name: searchTerm });

    if(medicine)
    res.render('searchMedResult.ejs', {medicine});
    else
    res.send("Medicine not found");
  } catch (error) {
    res.status(500).send('Error searching for medicines');
  }
}
// Function to filter medicines based on medicinal use
const filterMedicinesByMedicinalUse = async (req, res) => {

  try {
   const medicinalUse = req.query.medicinalUse;

    // Use Mongoose to find medicines where medicinal use matches any element in the array   
    const filteredMedicines = await medModel.find({
      MedicinalUse: { $in: medicinalUse },
    });

    res.render('medicinaluseFilter.ejs', { medicines: filteredMedicines });
  } catch (error) {
    console.error('Error filtering medicines by medicinal use:', error);
    res.status(500).send('Internal server error');
  }
 };


 


module.exports = {
    
    createMedicine,
    searchMedicinePh,
    upload,
    filterMedicinesByMedicinalUse,
    editMedicine,
    editMedicineResults,
    getMedSQ
};