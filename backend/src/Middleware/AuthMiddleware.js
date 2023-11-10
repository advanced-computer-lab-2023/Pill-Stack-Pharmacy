const patientModel = require("../Models/patient");
const pharmaModel = require('../Models/Pharmacist.js');
const adminModel = require('../Models/Admin.js');


require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
  const token = req.cookies.token
  if (!token) {

    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      var user;
        if(data.role==='patient'){
         user = await patientModel.findById(data.id);
        }
        if(data.role==='pharmacist'){
           user = await pharmaModel.findById(data.id);
          }
          if(data.role==='admin'){
             user = await adminModel.findById(data.id);
            }
        

      if (user) {
      req.user = user;
      next(); 
    }
      else return res.json({ status: false })
    }
  })
}
