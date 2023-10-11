// #Task route solution
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');

const { default: mongoose } = require('mongoose');




const patientRegister = async (req, res) => {
   try {
      const user = new userModel({
         Username: req.body.username, 
         Name: req.body.name, 
         Email: req.body.email, 
         Password: req.body.password,
         DateOfBirth: req.body.dob,
         Gender: req.body.gender,
         MobileNumber: req.body.mobile,
         EmergencyContact_Name: req.body.emergency_name,
         EmergencyContact_MobileNumber: req.body.emergency_phone,
         EmergencyContact_Relation: req.body.emergency_relation
      });
      registeredUsername = req.body.username;

       //check for duplicate username
       const userExists = await userModel.findOne({Username: req.body.username});
       if (userExists) return res.status(400).send("Username already exists");


      await user.save();
      console.log('User INSERTED!');
      res.status(400).send("Registered Successfully");
      

   } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
}
const searchMedicinePat = async (req, res) => {
   const searchTerm = req.body.name;
   console.log(searchTerm);
   try {
     const result = await medModel.findOne({ Name: searchTerm });
     console.log(result.Name);
     console.log(result.Details);
     const name = result.Name;
     const detail = result.Details;
     const price = result.Price;
     const quantity = result.Quantity;
     res.status(200).json({ name, detail, price, quantity });
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






module.exports = {patientRegister,searchMedicinePat, filterMedicinesByMedicinalUse};
