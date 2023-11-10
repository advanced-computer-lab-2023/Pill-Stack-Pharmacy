const express = require('express');
let router = express.Router();
const {filterMedicinesByMedicinalUse, searchMedicinePat,getAddresses,addDeliveryAddress, getFullInfo,orderDetails} = require('../Routes/userController');
const {getAvailableMedicines} = require('../Routes/adminController.js');
const { userVerification } = require('../Middleware/AuthMiddleware');


router.get('/Address',userVerification,getAddresses)
router.get('/orderDetails',userVerification,orderDetails)
router.get('/myInfo/:username' , getFullInfo )



// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);

router.route('/searchMedicine').post(searchMedicinePat);
router.post('/addDeliveryAddress/:username',addDeliveryAddress)

module.exports = router;
