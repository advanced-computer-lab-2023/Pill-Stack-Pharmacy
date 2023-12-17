const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Details: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Onboard:{
    type:Boolean,
    required:true
  },
  Sales: {
    type: Number,
  },
  Image: {
    data: Buffer, // Store the filename as a string
    contentType: String,
  },
  MedicinalUse: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Archived', 'Available'],
    default: 'Available', 
  },
}, { timestamps: true });

const Medicines = mongoose.model('Medicines', medicineSchema);
module.exports = Medicines;
