const express = require('express');
let router = express.Router();
const {viewPharmacistApp,viewAllApp} = require('../Routes/adminController.js');
router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewPharmacistApp);




module.exports = router;