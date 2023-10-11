const express = require('express');
let router = express.Router();
const{ getMedSQ}=require('../Routes/pharmacistController.js');
const {viewPharmacistApp,getAvailableMedicines,searchMedicineA,viewAllApp,addAdmin,viewPatientDet, PatientDetailsResults,viewPharmacistDet,PharmacistDetailsResults,removeUser, filterMedicinesByMedicinalUse} = require('../Routes/adminController.js');
router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewPharmacistApp);
router.get('/adminstration',addAdmin);
router.get('/PatientDetails',viewPatientDet);
router.get('/PatientDetailsResults',PatientDetailsResults);
router.get('/PharmacistDetails',viewPharmacistDet);
router.get('/PharmacistDetailsResults',PharmacistDetailsResults);
router.route('/administration')
.get((req,res) => {res.render('administration')})
.post(addAdmin);

router.route('/removeUser')
   .get((req,res) => { res.render('removeUser.html')})
   .post(removeUser);

// .get((req,res) => {res.render('PatientDetails')})
router.get('/availableMedicines.ejs',getAvailableMedicines);

router.get('/PatientDetails',viewPatientDet);

// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);
router.get('/avMed.ejs',getMedSQ);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicineA.html')})
   .post(searchMedicineA);

module.exports = router;