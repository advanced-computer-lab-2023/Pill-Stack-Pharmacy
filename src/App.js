// External variables
const express = require("express");
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;

const {createMedicine, getMedicine, searchMedicine, deleteMedicine} = require("./Routes/medicineController");
const {createPharmacistReq} = require("./Routes/pharmacistController");

//App variables
const app = express();
const path = require("path");


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "Views"));
const admin = require("./Routers/adminRoute");
const pharmacist = require("./Routers/pharmacistRoute");



app.use(bodyParser.urlencoded({extended:false}));
const port = process.env.PORT || "8000";

app.get("/searchMedicine", (req, res) => {
    res.sendFile(__dirname + "/Views/searchMedicine.html");
    // res.render('./Views/register')
    });

// configurations
// Mongo DB
mongoose.connect(MongoURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
dbName: "pharmacy"})
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));


// Routes
app.use("/admin",admin)
app.use("/pharmacist",pharmacist)



// pharmacist register request
app.route('/pharmacist_register')
  .get((req, res) => { res.render('pharmacistRegister')})
  .post(createPharmacistReq);


app.use(express.json());
app.post("/addMedicine",createMedicine);
app.get("/medicines", getMedicine);
app.put("/searchMedicine", searchMedicine);
app.delete("/deleteMedicine", deleteMedicine);


