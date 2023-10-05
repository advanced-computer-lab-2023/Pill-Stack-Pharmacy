const pharmaReqModel = require('../Models/Pharmacist_Request.js');
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


module.exports = {
    createPharmacistReq,
};