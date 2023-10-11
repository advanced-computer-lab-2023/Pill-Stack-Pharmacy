const express = require('express');
let router = express.Router();
const {filterMedicinesByMedicinalUse, searchMedicinePat} = require('../Routes/userController');
const {getAvailableMedicines} = require('../Routes/adminController.js');


router.get('/availableMedicines.ejs',getAvailableMedicines);


// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicinePat.html')})
   .post(searchMedicinePat);


module.exports = router;
