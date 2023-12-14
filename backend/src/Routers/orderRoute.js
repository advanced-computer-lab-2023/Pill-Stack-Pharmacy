const { Router } = require('express');
const orderController = require('../Routes/orderController');
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = Router();

router.get('/',userVerification,orderController.get_orders);
router.get('/recent',userVerification,orderController.get_recent_order);
router.get('/config',userVerification,orderController.config);

router.post('/orderCredit',userVerification,orderController.checkoutCredit);
router.post('/orderCredit/confirm',userVerification,orderController.creditConfirm);

router.post('/orderCash',userVerification,orderController.checkoutCash);
router.post('/orderWallet',userVerification,orderController.checkoutWallet);
router.post('/cancel-order',userVerification, orderController.cancelOrder);
router.post('/sales',orderController.generateMedicineSalesReport);
router.post('/salesStats',orderController.TotalStats);
router.post('/salesDaily',orderController.DailyRevenue);
router.post('/salesOrder',orderController.getAllorders);
router.post('/salesExtraStats',orderController.ExtraStats);
router.post('/salesChanges', orderController.MonthlyChanges);









module.exports = router;