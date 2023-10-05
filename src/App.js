// External variables
const express = require("express");
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {createMedicine, getMedicine, searchMedicine, deleteMedicine} = require("./Routes/medicineController");
const MongoURI = process.env.MONGO_URI ;

//App variables
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
const port = process.env.PORT || "8000";

app.get("/searchMedicine", (req, res) => {
    res.sendFile(__dirname + "/Views/searchMedicine.html");
    // res.render('./Views/register')
    });

// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));

app.use(express.json());
app.post("/addMedicine",createMedicine);
app.get("/medicines", getMedicine);
app.put("/searchMedicine", searchMedicine);
app.delete("/deleteMedicine", deleteMedicine);


