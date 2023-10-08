const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');

const { default: mongoose } = require('mongoose');


const createPharmacistReq = async (req, res) => {
    console.log(req.body.name);
    // register as a doctor using username, name, email, password, date of birth,
    //  hourly rate, affiliation (hospital), educational background. 

    const pharmacistReq = new pharmaReqModel({
       Username: req.body.username, 
       Name: req.body.name, 
       Email:req.body.email, 
       Password:req.body.password,
       DateOfBirth: req.body.dob,
       HourlyRate: req.body.hourly_rate,
       Affiliation: req.body.affiliation,
       EducationalBackground: req.body.educational_background       
       });

       //check for duplicate username
      const docExists = await pharmaReqModel.findOne({Username: req.body.username});
      if (docExists) return res.status(400).send("Username already exists");
       
      pharmacistReq.save(function(err){
       if (err) {
          throw err;
       }
       console.log('INSERTED!');
 
   });
   // res.render('patient_home');
    res.status(200).send("Your Request has been sent to the admin.")
 }


// add a new medicine
 const createMedicine = async (req, res) => {
  console.log(req.body.name);
  try {
    const medExists = await medModel.findOne({ Name: req.body.name });

    if (medExists) {
      return res.status(400).send("Medicine already exists");
    }

    const medicine = new medModel({
      Name: req.body.name,
      Details: req.body.details,
      Price: req.body.price,
      Quantity: req.body.quantity,
    });

    await medicine.save();
    console.log('Med INSERTED!');
    res.status(200).send("Medicine added successfully.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Medicine not added");
  }
};


 //search for a medicine in the database
 const searchMedicine = async (req, res) => {
  const searchString = { Name:req.body.name};
  // await medicineModel.find(search);
  const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive search
  // Search for medicine by name using the regular expression
  medModel.find({ name: { $regex: regex } }, (err, medicines) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Found Medicines:', medicines);
    }
  });
 }

module.exports = {
    createPharmacistReq,
    createMedicine,
    searchMedicine
};