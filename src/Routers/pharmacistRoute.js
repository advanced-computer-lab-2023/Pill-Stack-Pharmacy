const express = require('express');
let router = express.Router();
const {createMedicine,searchMedicine} = require('../Routes/pharmacistController.js');
//const { searchMedicine } = require('../Routes/medicineController.js');
// router.get("/", async(req,res) => {res.render('pharmacist_home')});

router.route('/createMedicine')
    .get((req, res) => { res.render('createMed')})
    .post(createMedicine);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicine')})
   .post(searchMedicine);



module.exports = router;