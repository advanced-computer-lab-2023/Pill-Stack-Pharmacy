const cartModel = require('../Models/Cart.js');
const medModel = require('../Models/Medicine.js');
module.exports.get_cart_items = async (req,res) => {
    const userId = req.user._id;
    try{
        let cart = await cartModel.findOne({userId});

        if(cart && cart.items.length>0){

            res.send(cart);
        }
        else{
            res.send(null);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.add_cart_item = async (req,res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try{
        let cart = await cartModel.findOne({userId});
        let item = await medModel.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found!')
        }
        const price = item.Price;
        const name = item.Name;
        const image=item.Image;

        if(cart){
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({ productId, name, quantity, price ,image});
            }
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).send(cart);
        }
        else{
            // no cart exists, create one
            const newCart = await cartModel.create({
                userId,
                items: [{ productId, name, quantity, price,image }],
                bill: quantity*price
            });
            return res.status(201).send(newCart);
        }       
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.delete_item = async (req,res) => {
    const userId = req.user._id;
    const productId = req.params.itemId;
    try{
        let cart = await cartModel.findOne({userId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.items.splice(itemIndex,1);
        }
        cart = await cart.save();
        return res.status(201).send(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.update_cart_item = async (req,res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try{
        let cart = await cartModel.findOne({userId});
        let item = await medModel.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found!')
        }
        const price = item.Price;
        const name = item.Name;
        const image=item.Image;

        if(cart){
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);
            const originalBill=cart.bill;
            var editedPrice;

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                editedPrice=productItem.quantity*productItem.price;
                productItem.quantity = quantity;
                cart.items[itemIndex] = productItem;
            }
            cart.bill-=editedPrice;
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).send(cart);
        }
           
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}