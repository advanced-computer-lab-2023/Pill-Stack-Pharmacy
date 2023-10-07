const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({

    Username: {
        type: String,
        required: true,
      },
      Name: {
        type: String,
        required: true,
      },
      Email: {
        type: String,
        required: true
      },
      Password: {
        type: String,
        required: true,
      },
      DateOfBirth:{
        type: Date,
        required: true,
      },
      Gender: {
        type: String,
        required: true,
      },
      MobileNumber: {
        type: Number,
        required: true,
      },
      EmergencyContact_Name: {
        type: String,
        required: true,
      },
      EmergencyContact_MobileNumber: {
        type: Number,
        required: true,
      },
      EmergencyContact_Relation:{
        type: String,
        required: true,
      }
    
    }, { timestamps: true});

const Patient = mongoose.model('Patient',patientSchema);
module.exports = Patient;