const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  try {
    console.log(req.file);
    const image = req.file;

    if (!image) {
      return res.status(400).send('Please upload an image.');
    }

    const medicine = new medModel({
      Name: req.body.name,
      Details: req.body.details,
      Price: req.body.price,
      Quantity: req.body.quantity,
      Image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
    });
    console.log(image.buffer);
    console.log(image.mimetype)

    // Check for duplicate medicine
    const medExists = await medModel.findOne({ Name: req.body.name });

    if (medExists) {
      return res.status(400).send("Medicine already exists");
    }

    // Save the medicine using await
    const savedMedicine = await medicine.save();
    console.log('Medicine saved successfully:', savedMedicine);
    res.status(200).send("Medicine added successfully.");
  } catch (error) {
    console.error('Error saving medicine:', error);
    res.status(500).send("An error occurred while saving medicine.");
  }
};


 //search for a medicine in the database
 const searchMedicine= async(req, res) =>{
  const searchTerm = req.body.name;
  console.log(searchTerm);
  try {
    const result = await medModel.findOne({ Name: searchTerm });
    console.log(result.Name);
    console.log(result.Details);
    const name=result.Name;
    const detail=result.Details;
    const price =result.Price;
    const quantity=result.Quantity;
    //, {name,detail,price,quantity}
    res.status(200).send('search');
  } catch (error) {
    res.status(500).send('Error searching for medicines');
  }
 }
 


module.exports = {
    createPharmacistReq,
    createMedicine,
    searchMedicine,
    upload,
};