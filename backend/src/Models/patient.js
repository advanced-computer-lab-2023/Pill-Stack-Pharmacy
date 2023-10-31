const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


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
      },
      Wallet:{
        type:Number,
        default: 0
      },
      DeliveryAddress:[{
        type:String
      }]    
    }, { timestamps: true});
    patientSchema.pre('save', function(next) {
      const user = this;
      if (!user.isModified('password')) {
        return next();
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.Password, salt, null, (error, hash) => {
          if (error) {
            return next(error);
          }
          console.log('HASH: ', hash);
          user.Password = hash;
          console.log('USER.PASSWORD: ', user.Password);
          next();
        });
      });
    });

const Patient = mongoose.model('Patient',patientSchema);
module.exports = Patient;