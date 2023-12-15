const express = require('express');
let router = express.Router();
const {createMedicine,searchMedicinePh,
    editMedicineResults,changeMedicineStatus,upload, getMedSQ, 
    filterMedicinesByMedicinalUse, getFullInfo,generateRoom,join,getPatientUsername,sendMessage ,sendMessage2,joinDoctorClin,getDoctorUsername  } = require('../Routes/pharmacistController.js');
const {getAvailableMedicines} = require('../Routes/adminController.js');

router.get("/", (req,res) => {res.render('pharmacist_home')});
router.get('/availableMedicines.ejs',getAvailableMedicines);
router.put('/editmedResults',editMedicineResults);
router.put('/changeMedicineStatus/:id', changeMedicineStatus);
router.get('/avMed.ejs',getMedSQ);

router.route('/createMedicine')
    .post(upload.single('image'), createMedicine);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicinePh.html')})
   .post(searchMedicinePh);
   


// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);
router.get('/myInfo/:username' , getFullInfo )
router.get('/getPatientUsername/:username',getPatientUsername);
router.post('/ChatDoctor/:doctorUsername/:username',join);
router.post('/sendMessage/:patientUsername/:doctorUsername',sendMessage);
router.get('/getDoctorUsername/:username',getDoctorUsername);
router.post('/ChatDoctor2/:doctorUsername/:docClinUsername',joinDoctorClin);
router.post('/sendMessage2/:docClinUsername/:doctorUsername',sendMessage2);


module.exports = router;