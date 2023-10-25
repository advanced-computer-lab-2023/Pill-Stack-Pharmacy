// #Task route solution
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');

const { default: mongoose } = require('mongoose');





const searchMedicinePat = async (req, res) => {
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






module.exports = {searchMedicinePat, filterMedicinesByMedicinalUse};
