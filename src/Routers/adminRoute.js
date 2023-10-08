const express = require('express');
let router = express.Router();
const {viewPharmacistApp,getAvailableMedicines,viewAllApp,addAdmin,viewPatientDet, PatientDetailsResults} = require('../Routes/adminController.js');
router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewPharmacistApp);
router.get('/adminstration',addAdmin);
router.get('/PatientDetails',viewPatientDet);

router.get('/PatientDetailsResults',PatientDetailsResults);


router.route('/administration')
.get((req,res) => {res.render('administration')})
.post(addAdmin);



// .get((req,res) => {res.render('PatientDetails')})



router.get('/availableMedicines.ejs',getAvailableMedicines);

router.get('/PatientDetails',viewPatientDet);





module.exports = router;