// #Task route solution
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');

const { default: mongoose } = require('mongoose');





const searchMedicinePat = async (req, res) => {
   const searchTerm = req.body.name;
   console.log(searchTerm);
   try {
    const medicine = await medModel.findOne({ Name: searchTerm });

    if(medicine)
    res.render('searchMedResult.ejs', {medicine});
    else
    res.send("Medicine not found");
   } catch (error) {
     res.status(500).send('Error searching for medicines');
   }
 }

 // Function to filter medicines based on medicinal use
const filterMedicinesByMedicinalUse = async (req, res) => {

  try {
   const medicinalUse = req.query.medicinalUse;

    // Use Mongoose to find medicines where medicinal use matches any element in the array   
    const filteredMedicines = await medModel.find({
      MedicinalUse: { $in: medicinalUse },
    });

    res.render('medicinaluseFilter.ejs', { medicines: filteredMedicines });
  } catch (error) {
    console.error('Error filtering medicines by medicinal use:', error);
    res.status(500).send('Internal server error');
  }
 };

 const getAddresses=async(req,res)=>{
   const username=req.user.Username;
   const user=await userModel.findOne({Username:username});
   if(user){
    const address=user.DeliveryAddress;
    res.send(address);
 
   }else{
    res.send('could not find user');
   }
 }

 const addDeliveryAddress = async (req, res) => {
  const username = req.params.username;
  const newAddress = req.body.address; // Assuming the new address is sent in the request body
  console.log(username)
  try {
    // Find the user by their username
    const user = await userModel.findOne({ Username: username });
    console.log(user)

    if (user) {
      // Add the new address to the DeliveryAddress array
      user.DeliveryAddress.push(newAddress);

      // Save the updated user document
      await user.save();

      res.send('Delivery address added successfully');
    } else {
      res.send('Could not find the user');
    }
  } catch (error) {
    console.error('Error adding delivery address:', error);
    res.status(500).send('Internal server error');
  }
};

const getFullInfo = async (req, res) => {
  try {
    const {username} = req.params;
    const user = await userModel.findOne({Username:username});
    res.status(200).send(user);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {searchMedicinePat, filterMedicinesByMedicinalUse,getAddresses,addDeliveryAddress, getFullInfo};
