const orderModel = require('../Models/Order');
const cartModel = require('../Models/Cart');
const userModel = require('../Models/patient');
const stripe = require('stripe')(process.env.SECRETKEY);

module.exports.get_orders = async (req,res) => {
    const userId = req.user._id;
    orderModel.find({userId}).sort({date:-1}).then(orders => res.json(orders));
}
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
                amount: cart.bill*1000,
                currency: "usd",
                payment_method_types: ['card'],  // Specify the payment method(s) you want to use

              });
              res.send({
                clientSecret: paymentIntent.client_secret,
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
    const order = await orderModel.create({
        userId,
        items: cart.items,
        bill: cart.bill,
        status:'Processing',
        address:address

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
        if(cart){
           
            
                const order = await orderModel.create({
                    userId,
                    items: cart.items,
                    bill: cart.bill,
                    status:'Processing',
                    address:address

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
        const wallet=user.Wallet;
        if(cart){
            if(wallet<cart.bill){
                console.log('heree');
                res.send("You do not have enough money in wallet");

            }else{
                   user.Wallet-=cart.bill;
           
                   user.save();
                    const order = await orderModel.create({
                        userId,
                        items: cart.items,
                        bill: cart.bill,
                        status:'Processing',
                        address:address
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