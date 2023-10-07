// #Task route solution
const userModel = require('../Models/patient.js');
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



module.exports = {patientRegister};
