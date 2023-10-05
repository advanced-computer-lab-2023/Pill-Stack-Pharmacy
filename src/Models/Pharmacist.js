const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pharmacistSchema = new Schema({

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
      hourly_rate:{
      type : Number,
      required:true,
      },
      affiliation:{
      type:String,
      required:true,
    },
    education_background:{
        type:String,
        required:true,
    }
    
    }, { timestamps: true});

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
module.exports = Pharmacist;