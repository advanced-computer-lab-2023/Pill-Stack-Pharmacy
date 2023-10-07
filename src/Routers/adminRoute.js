const express = require('express');
let router = express.Router();
const {viewPharmacistApp,viewAllApp,addAdmin} = require('../Routes/adminController.js');
router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewPharmacistApp);
router.get('/adminstration',addAdmin);

router.route('/administration')
.get((req,res) => {res.render('administration')})
.post(addAdmin);




module.exports = router;