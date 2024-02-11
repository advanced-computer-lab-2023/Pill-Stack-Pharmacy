const orderModel = require('../Models/Order');
const cartModel = require('../Models/Cart');
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');
const Pharmacist = require('../Models/Pharmacist'); 
const sendEmail = require("../Utilities/SendEmail");
const paymentIntentModel=require('../Models/PaymentIntent');
const stripe = require('stripe')(process.env.SECRETKEY);

module.exports.get_orders = async (req,res) => {
    const userId = req.user._id;
    orderModel.find({userId}).sort({date:-1}).then(orders => res.json(orders));
}
module.exports.get_recent_order = async (req, res) => {
    const userId = req.user._id;
    orderModel
      .findOne({ userId })
      .sort({ date_added: -1 }) // Sort by date in descending order to get the most recent order first
      .then((order) => {
        res.send(order);
       })
      .catch((err) => res.status(500).json({ error: err.message }));
  };
module.exports.config=(req,res)=>{
    console.log('here')
    res.send({
      publishableKey: process.env.PUBLISHABLE_KEY,
    });
  }

module.exports.checkoutCredit = async (req,res) => {
    try{
        const userId = req.user._id;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        if(cart){
            const paymentIntent = await stripe.paymentIntents.create({
                amount: cart.bill*100*(1-cart.discount),
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                  },
              });
              const intent=await paymentIntentModel.create({ intentId:paymentIntent.id})

              res.send({
                clientSecret: paymentIntent.client_secret,paymentIntentId:intent._id
              });
        
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.creditConfirm=async(req,res)=>{
    const userId = req.user._id;
    let cart = await cartModel.findOne({userId});
    let user = await userModel.findOne({_id: userId});
    let address=req.body.address;
    let intentId=req.body.intentId;
    const paymentIntent=await paymentIntentModel.findByIdAndDelete(intentId);
    const pharms=await Pharmacist.find({});
    for (const item of cart.items) {
        const product = await medModel.findOne({ _id: item.productId });
        if(item.Onboard==false){
            for(let i=0;i<user.Prescriptions.length;i++){
                for(let j=0;j<user.Prescriptions[i].Medicine.length;j++){
                    if(user.Prescriptions[i].Medicine[j].Onboard==false &&user.Prescriptions[i].Medicine[j].Quantity==item.quantity){
                        user.Prescriptions[i].Status="Filled";
                    }
                }
            }
        }
        await user.save();
        if (product) {
            // Increase the sales by the quantity in the cart
            product.Sales += item.quantity;
            if(product.Quantity===0){
                for (const pharm of pharms) {
                    const notification = `${product.Name} is out of stock`;
                    pharm.Notifications.push(notification);
                    const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock.`;
                    await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                    await pharm.save();
                }
            }
            await product.save();
        }
    }
    const order = await orderModel.create({
        userId,
        items: cart.items,
        bill:cart.bill*(1-cart.discount),
        status:'Processing',
        address:address,
        payment_method:'credit',
        paymentIntentId:paymentIntent.intentId,

    });
    const data = await cartModel.findByIdAndDelete({_id:cart.id});
    return res.status(201).send(order);

}
module.exports.checkoutCash = async (req,res) => {
    try{
        const userId = req.user._id;
        let address=req.body.address;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        const pharms=await Pharmacist.find({});
        for (const item of cart.items) {
            const product = await medModel.findOne({ _id: item.productId });
            if(item.Onboard==false){
                for(let i=0;i<user.Prescriptions.length;i++){
                    for(let j=0;j<user.Prescriptions[i].Medicine.length;j++){
                        if(user.Prescriptions[i].Medicine[j].Onboard==false &&user.Prescriptions[i].Medicine[j].Quantity==item.quantity){
                            user.Prescriptions[i].Status="Filled";
                        }
                    }
                }
            }
            await user.save();
            if (product) {
                // Increase the sales by the quantity in the cart
                product.Sales += item.quantity;
                        if(product.Quantity===0){
                            for (const pharm of pharms) {
                                const notification = `${product.Name} is out of stock`;
                                pharm.Notifications.push(notification);
                                const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock.`;
                                await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                                await pharm.save();
                            }
                        }
                await product.save();
            }
        }
        if(cart){
           
            
                const order = await orderModel.create({
                    userId,
                    items: cart.items,
                    bill:cart.bill*(1-cart.discount),
                    status:'Processing',
                    address:address,
                    payment_method:'cash',


                });
                const data = await cartModel.findByIdAndDelete({_id:cart.id});
                return res.status(201).send(order);
            
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.checkoutWallet = async (req,res) => {
    try{
        const userId = req.user._id;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        let address=req.body.address;
        const wallet=user.WalletBalance;
        if(cart){
            if(wallet<cart.bill*(1-cart.discount)){
                console.log('heree');
                res.send("You do not have enough money in wallet");

            }else{
                   user.WalletBalance-=cart.bill*(1-cart.discount);
                   user.save();
                   const pharms=await Pharmacist.find({});
                   console.log(pharms);
                   for (const item of cart.items) {
                    const product = await medModel.findOne({ _id: item.productId });
                    if(item.Onboard==false){
                        for(let i=0;i<user.Prescriptions.length;i++){
                            for(let j=0;j<user.Prescriptions[i].Medicine.length;j++){
                                if(user.Prescriptions[i].Medicine[j].Onboard==false &&user.Prescriptions[i].Medicine[j].Quantity==item.quantity){
                                    user.Prescriptions[i].Status="Filled";
                                }
                            }
                        }
                    }
                    await user.save();
                    if (product) {
                        // Increase the sales by the quantity in the cart
                        product.Sales += item.quantity;
                        console.log(product.Quantity);
                        if(product.Quantity===0){
                            console.log('here');
                            for (const pharm of pharms) {
                                console.log('here1');
                                const notification = `${product.Name} is out of stock`;
                                pharm.Notifications.push(notification);
                                const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock.`;
                                await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                                await pharm.save();
                            }
                        }
                        await product.save();
                    }
                }
                    const order = await orderModel.create({
                        userId,
                        items: cart.items,
                        bill:cart.bill*(1-cart.discount),
                        status:'Processing',
                        address:address,
                        payment_method:'wallet'

                    });
                    const data = await cartModel.findByIdAndDelete({_id:cart.id});
                    return res.status(201).send(order);
                
            }
            
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.cancelOrder = async (req, res) => {
    try {
        console.log('here');
        const orderId = req.body.orderId; 
        console.log(orderId);
        const userId = req.user._id;
        const order = await orderModel.findById(orderId);
        const user = await userModel.findOne({ _id: userId });

        if (order) {
            switch (order.payment_method) {
                case 'credit':
                    // Handle Stripe payment refund
                    const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
                    await stripe.refunds.create({ payment_intent: paymentIntent.id });
                    break;
    
                case 'wallet':
                    // Refund amount to user's wallet
                   // const user = await userModel.findOne({ _id: userId });
                    
                    
                    user.WalletBalance += order.bill;
                    await user.save();
                    break;
    
                // Add more cases for other payment methods if needed
    
                default:
                    break;
            }
            for (const item of order.items) {

                const product = await medModel.findOne({ _id: item.productId });
                if(item.Onboard==false){
                    for(let i=0;i<user.Prescriptions.length;i++){
                        for(let j=0;j<user.Prescriptions[i].Medicine.length;j++){
                            if(user.Prescriptions[i].Medicine[j].Onboard==false &&user.Prescriptions[i].Medicine[j].Quantity==item.quantity){
                                user.Prescriptions[i].Status="Filled";
                            }
                        }
                    }
                }
                await user.save();
                
                if (product) {
                    product.Sales -= item.quantity;
                    product.Quantity+=item.quantity;
                    await product.save();
                }
            }
    
            order.status = 'Cancelled';
            await order.save();

            res.status(200).send("Order cancelled successfully");
        } else {
            res.status(404).send("Order not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.generateMedicineSalesReport = async (req, res)=> {
  let month;
  let medName=req.body.med;
  switch (req.body.month){
      case 'January':month='2023-01-01'; break;
      case 'February':month='2023-02-01'; break;
      case 'March':month='2023-03-01'; break;
      case 'April':month='2023-04-01'; break;
      case 'May':month='2023-05-01'; break;
      case 'June':month='2023-06-01'; break;
      case 'July':month='2023-07-01'; break;
      case 'August':month='2023-08-01'; break;
      case 'September':month='2023-09-01'; break;
      case 'October':month='2023-10-01'; break;
      case 'November':month='2023-11-01'; break;
      case 'December':month='2023-12-01'; break;
  }
  const chosenMonth=new Date(month);    
  try {
      const pipeline = [
        {
          $match: {
            date_added: {
              $gte: new Date(chosenMonth), // Start of chosen month
              $lt: new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1)), // End of chosen month
            },
            status: { $in: ['Processing', 'Delivered'] }, // Considering 'Processing' and 'Delivered' orders for sales
        }
      }, {
        $unwind: '$items'
    },
    {
        $match: {
            'items.name': medName,
            date_added: {
              $gte: new Date(chosenMonth), // Start of chosen month
              $lt: new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1)), // End of chosen month
            },

            status: { $in: ['Processing', 'Delivered'] }, // Considering 'Processing' and 'Delivered' orders for sales
        }
    },
    {
        $group: {
            _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$date_added' }
            },
            sales: { $sum: '$items.quantity' }
        }
    },
    {
        $sort: { _id: 1 } // Sort by date in ascending order
    }
       
      ];
  
      const result = await orderModel.aggregate(pipeline);
      const salesPerDay = {};
      let currentDate = chosenMonth;
      const endDate=new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1))
  
      while (currentDate <= endDate) {
          const formattedDate = currentDate.toISOString().split('T')[0];
          salesPerDay[formattedDate] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
      }
  
      result.forEach(item => {
          salesPerDay[item._id] = item.sales;
      });
      return res.send(salesPerDay);
    } catch (err) {
      console.error('Error generating sales report:', err);
      throw err;
    }
  }
module.exports.TotalStats=async(req,res)=>{
    let month;
    switch (req.body.month){
        case 'January':month='2023-01-01'; break;
        case 'February':month='2023-02-01'; break;
        case 'March':month='2023-03-01'; break;
        case 'April':month='2023-04-01'; break;
        case 'May':month='2023-05-01'; break;
        case 'June':month='2023-06-01'; break;
        case 'July':month='2023-07-01'; break;
        case 'August':month='2023-08-01'; break;
        case 'September':month='2023-09-01'; break;
        case 'October':month='2023-10-01'; break;
        case 'November':month='2023-11-01'; break;
        case 'December':month='2023-12-01'; break;
    }
    const chosenMonth=new Date(month);
    try {
        const pipeline = [
            {
              $match: {
                date_added: {
                  $gte: new Date(chosenMonth), // Start of chosen month
                  $lt: new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1)), // End of chosen month
                },
                status: { $in: ['Processing', 'Delivered'] }, // Considering 'Processing' and 'Delivered' orders for sales
              },
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalItems: { $sum: { $size: "$items" } },
                    totalRevenue: { $sum: "$bill" }
                }
            }
          ];
          
  
      const salesReport = await orderModel.aggregate(pipeline);
  
      if (salesReport.length>0) {
        return res.send(salesReport);
      } else {
        return res.send("no sales found for this month");
      }
    } catch (err) {
      console.error('Error generating sales report:', err);
      throw err;
    }

  }
  module.exports.DailyRevenue=async (req,res)=>{
    let month;
    switch (req.body.month){
        case 'January':month='2023-01-01'; break;
        case 'February':month='2023-02-01'; break;
        case 'March':month='2023-03-01'; break;
        case 'April':month='2023-04-01'; break;
        case 'May':month='2023-05-01'; break;
        case 'June':month='2023-06-01'; break;
        case 'July':month='2023-07-01'; break;
        case 'August':month='2023-08-01'; break;
        case 'September':month='2023-09-01'; break;
        case 'October':month='2023-10-01'; break;
        case 'November':month='2023-11-01'; break;
        case 'December':month='2023-12-01'; break;
    }
    const chosenMonth=new Date(month);
        try {
      const pipeline = [
        {
          $match: {
            date_added: {
              $gte: new Date(chosenMonth), // Start of chosen month
              $lt: new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1)), // End of chosen month
            },
            status: { $in: ['Processing', 'Delivered'] }, // Considering 'Processing' and 'Delivered' orders for sales
        }
    },
    {
        $group: {
            _id: { $dayOfMonth: '$date_added' },
            revenue: { $sum: '$bill' }
        }
    },
    {
        $project: {
            _id: 0,
            day: '$_id',
            revenue: 1
        }
    },
    {
        $sort: {
            day: 1
        }
    }
      ];
  
      const salesReport = await orderModel.aggregate(pipeline);
  
       return res.send(salesReport);
    } catch (err) {
      console.error('Error generating sales report:', err);
      throw err;
    }

  }
  module.exports.getAllorders = async (req,res) => {
    let month;
    switch (req.body.month){
        case 'January':month='2023-01-01'; break;
        case 'February':month='2023-02-01'; break;
        case 'March':month='2023-03-01'; break;
        case 'April':month='2023-04-01'; break;
        case 'May':month='2023-05-01'; break;
        case 'June':month='2023-06-01'; break;
        case 'July':month='2023-07-01'; break;
        case 'August':month='2023-08-01'; break;
        case 'September':month='2023-09-01'; break;
        case 'October':month='2023-10-01'; break;
        case 'November':month='2023-11-01'; break;
        case 'December':month='2023-12-01'; break;
    }
    const chosenMonth=new Date(month);
    orderModel.find({  date_added: {
      $gte: new Date(chosenMonth), // Start of chosen month
      $lt: new Date(new Date(chosenMonth).setMonth(chosenMonth.getMonth() + 1)), // End of chosen month
    }}, { 'items.image': 0 }).sort({date_added:-1}).then(orders => res.json(orders));
}
module.exports.ExtraStats=async(req,res)=>{
  let month;
  console.log(req.body.month);
  switch (req.body.month){
      case 'January':month='2023-01-01'; break;
      case 'February':month='2023-02-01'; break;
      case 'March':month='2023-03-01'; break;
      case 'April':month='2023-04-01'; break;
      case 'May':month='2023-05-01'; break;
      case 'June':month='2023-06-01'; break;
      case 'July':month='2023-07-01'; break;
      case 'August':month='2023-08-01'; break;
      case 'September':month='2023-09-01'; break;
      case 'October':month='2023-10-01'; break;
      case 'November':month='2023-11-01'; break;
      case 'December':month='2023-12-01'; break;
  }
  const startDate=new Date(month);
  const endDate=new Date(new Date(startDate).setMonth(startDate.getMonth() + 1))

  try {
    const cashOrders = await Order.countDocuments({
        date_added: { $gte: startDate, $lte: endDate },
        payment_method: 'cash',
        status: { $ne: 'Cancelled' } // Exclude cancelled orders
    });

    const creditOrders = await Order.countDocuments({
        date_added: { $gte: startDate, $lte: endDate },
        payment_method: 'credit',
        status: { $ne: 'Cancelled' } // Exclude cancelled orders
    });

    const walletOrders = await Order.countDocuments({
        date_added: { $gte: startDate, $lte: endDate },
        payment_method: 'wallet',
        status: { $ne: 'Cancelled' } // Exclude cancelled orders
    });

    const cancelledOrders = await Order.countDocuments({
        date_added: { $gte: startDate, $lte: endDate },
        status: 'Cancelled'
    });

    res.send ({
        cashOrders,
        creditOrders,
        walletOrders,
        cancelledOrders
    });
} catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
}

}
module.exports.MonthlyChanges=async(req,res)=>{
  try {
    const currentMonthData = await TotalStats(req, res);
    const currentMonth = req.body.month; // Get the current month from the request

    // Map the month names to their respective numbers for comparison
    const monthsMap = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
      'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
    };

    const currentMonthNum = monthsMap[currentMonth]; // Get the numeric representation of the current month
    const previousMonthNum = currentMonthNum - 1 === 0 ? 12 : currentMonthNum - 1; // Get the previous month's number

    const previousMonth = Object.keys(monthsMap).find(key => monthsMap[key] === previousMonthNum); // Get the name of the previous month

    // Find the data for the previous month
    req.body.month = previousMonth; // Set the month to the previous month
    const previousMonthData = await TotalStats(req, res);

    // Calculate increases
    const ordersIncrease = currentMonthData[0].totalOrders - (previousMonthData[0]?.totalOrders || 0);
    const itemsIncrease = currentMonthData[0].totalItems - (previousMonthData[0]?.totalItems || 0);
    const revenueIncrease = currentMonthData[0].totalRevenue - (previousMonthData[0]?.totalRevenue || 0);

    return res.json({
      currentMonth: currentMonthData[0],
      previousMonth: previousMonthData[0],
      increases: {
        ordersIncrease,
        itemsIncrease,
        revenueIncrease
      }
    });
  } catch (err) {
    console.error('Error calculating monthly increases:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }





  
}

  