const express = require('express');
let router = express.Router();
const {createMedicine} = require('../Routes/pharmacistController.js');
// router.get("/", async(req,res) => {res.render('pharmacist_home')});

router.route('/createMedicine')
    .get((req, res) => { res.render('createMed')})
    .post(createMedicine);




module.exports = router;