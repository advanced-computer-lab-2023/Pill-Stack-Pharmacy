const express = require('express');
let router = express.Router();

const {viewPharmacistApp,getAvailableMedicines,viewAllApp,addAdmin,viewPatientDet, PatientDetailsResults} = require('../Routes/adminController.js');


router.get('/availableMedicines.ejs',getAvailableMedicines);
