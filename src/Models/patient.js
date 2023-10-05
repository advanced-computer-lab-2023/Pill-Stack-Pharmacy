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
      Emergency_Name: {
        type: String,
        required: true,
      },
      Emergency_MobileNumber: {
        type: Number,
        required: true,
      },
      Emergency_relation_to_patient:{
        type: String,
        required: true,
      }
    
    }, { timestamps: true});

const Patient = mongoose.model('Patient', medicineSchema);
module.exports = Patient;