// External variables
const express = require("express");
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const {patientRegister} = require("./Routes/userController");
const {createPharmacistReq,searchMedicine} = require("./Routes/pharmacistController");
const {addAdmin,viewPatientDet, PatientDetailsResults,removeUser} = require("./Routes/adminController");

//App variables
const app = express();
const path = require("path");
app.use(express.static('uploads'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "Views"));
const admin = require("./Routers/adminRoute");
const pharmacist = require("./Routers/pharmacistRoute");
 


app.use(bodyParser.urlencoded({extended:false}));
const port = process.env.PORT || "8000";

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
app.use("/pharmacist",pharmacist)
app.use("/admin",admin)


app.get("/admin_home", (req, res) => {
  res.render('admin_home')
  });

  app.get("/register", (req, res) => {
  res.render('register')
    });
  app.get("/patient", (req, res) => {
    res.render('patient')
    });
  app.get("/availableMedicines", (req, res) => {
    res.render('availableMedicines')
    });
  app.get("/pharmacist_home", (req, res) => {
    res.render('pharmacist_home')
    });
   
app.post("/addUser",patientRegister);

app.get("/PatientDetailsResults",PatientDetailsResults);



// pharmacist register request
app.route('/pharmacist_register')
  .get((req, res) => { res.render('pharmacistRegister')})
  .post(createPharmacistReq);

  app.route('/removeUser')
  .get((req, res) => { res.render('removeUser')})
  .post(removeUser);

  app.route('/searchMedicine')
  .get((req, res) => { res.render('searchMedicine')})
  .post(searchMedicine);

app.use(express.json());


