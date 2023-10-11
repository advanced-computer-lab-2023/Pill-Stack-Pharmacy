const express = require('express');
let router = express.Router();
const {createMedicine,searchMedicine,editMedicine,editMedicineResults,upload, getMedSQ, filterMedicinesByMedicinalUse} = require('../Routes/pharmacistController.js');
const {getAvailableMedicines} = require('../Routes/adminController.js');

//const { searchMedicine } = require('../Routes/medicineController.js');
// router.get("/", async(req,res) => {res.render('pharmacist_home')});
router.get('/availableMedicines.ejs',getAvailableMedicines);
router.get('/editmed',editMedicine);
router.get('/editmedResults',editMedicineResults);
router.get('/avMed.ejs',getMedSQ);

router.route('/createMedicine')
    .get((req, res) => { res.render('createMed')})
    .post(upload.single('file'), createMedicine);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicine')})
   .post(searchMedicine);
   


// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);



module.exports = router;