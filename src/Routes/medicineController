// #Task route solution
const medicineModel = require('../Models/Medicine.js');
const { default: mongoose } = require('mongoose');





//Add medicine by :
//1-active_ingredients  2-price 3-available_quantity 
//medicine quantity should be updated automatically  
const createMedicine = async(req,res) => {
   const medicine = new medicineModel({Name: req.body.name,
       ActiveIngredient: req.body.active_ingredient,
       Price:req.body.price ,
       AvailableQuantity:req.body.available_quantity});
      
   medicine.save(function(err){
      if (err) {
                 throw err;
      }
      console.log('INSERTED!');
  });
  res.send(200,{title:"create medicine"})
}



const getMedicine = async (req, res) => {
   //retrieve all users from the database
   const users = await medicineModel.find({});
   res.send(users);
  }


const searchMedicine = async (req, res) => {
   //search for a medicine in the database
   const searchString = { Name:req.body.name};
   // await medicineModel.find(search);
   const regex = new RegExp(searchString, 'i');
   // Search for documents where the specified field contains the substring
   medicineModel.find({ fieldToSearch: regex }).toArray();
   res.send(result);
   // console.log(result);
  }

const deleteMedicine = async (req, res) => {
   //delete a user from the database
   const filter ={Email:req.body.email};
   await medicineModel.deleteOne({Email:req.body.email});
   res.send(users);
  }

module.exports = {createMedicine, getMedicine, searchMedicine, deleteMedicine};