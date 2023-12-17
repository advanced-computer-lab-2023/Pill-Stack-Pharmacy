const express = require('express');
let router = express.Router();
const {getDoctors,filterMedicinesByMedicinalUse, searchMedicinePat,
    getAddresses,addDeliveryAddress,addDeliveryAddress2, getFullInfo,orderDetails,generateRoom,
    joinChatRoomPatient,getDoctorUsername,sendMessage,getMedAndRelatedProducts,orders,getPrescribtionMedicene,userPrescription} = require('../Routes/userController');
const {getAvailableMedicines} = require('../Routes/adminController.js');
const { userVerification } = require('../Middleware/AuthMiddleware');


router.get('/Address',userVerification,getAddresses)
router.get('/orderDetails',userVerification,orderDetails)
router.get('/myInfo/:username' , getFullInfo )



// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);

router.route('/searchMedicine').post(searchMedicinePat);
router.post('/addDeliveryAddress/:username',addDeliveryAddress)
router.post('/addDeliveryAddress',userVerification,addDeliveryAddress2)

router.get('/getDoctorUsername/:username',getDoctorUsername);
router.post('/Chat/:username/:doctorUsername',joinChatRoomPatient)
router.post('/sendMessage/:patientUsername/:selectedDoctor',sendMessage)
router.post('/medicine/details',getMedAndRelatedProducts)
router.post('/PrescribedMedicene',userVerification,getPrescribtionMedicene);
router.post('/Prescriptions',userVerification,userPrescription);

module.exports = router;
