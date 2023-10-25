const {  Login,PatientRegister ,pharmaRegister,addAdmin, currentUser,Logout,ChangePassword,SendOTP,ResetPassword} = require('../Routes/authController')
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = require('express').Router()
router.post('/',currentUser)

router.post('/login', Login);

router.post('/Patientregister',PatientRegister);

router.route('/doc_register')
  .post(pharmaRegister);

router.route('/administration')
  .post(addAdmin);

router.post('/',userVerification);
router.post('/logout',userVerification,Logout);
router.post('/changePassword',userVerification,ChangePassword);
router.post('/sendOTP',SendOTP);
router.post('/resetPassword',ResetPassword);






module.exports = router