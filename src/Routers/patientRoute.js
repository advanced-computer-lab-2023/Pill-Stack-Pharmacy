const express = require('express');
let router = express.Router();
const {filterMedicinesByMedicinalUse} = require('../Routes/userController');
const {viewPharmacistApp,getAvailableMedicines,viewAllApp,addAdmin,viewPatientDet, PatientDetailsResults, filterMedicinesByMedicinalUse} = require('../Routes/adminController.js');


router.get('/availableMedicines.ejs',getAvailableMedicines);


// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);




module.exports = router;
