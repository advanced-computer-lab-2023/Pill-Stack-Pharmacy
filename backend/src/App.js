// External variables
const express = require("express");
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const {patientRegister} = require("./Routes/userController");
const {createPharmacistReq,searchMedicine} = require("./Routes/pharmacistController");
const {addAdmin,viewPatientDet, PatientDetailsResults} = require("./Routes/adminController");
const cors = require('cors');
var cookies = require("cookie-parser");

//App variables
const app = express();
const path = require("path");
app.use(express.static('uploads'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "Views"));

const admin = require("./Routers/adminRoute");
const pharmacist = require("./Routers/pharmacistRoute");
const patient = require("./Routers/patientRoute");
const auth = require("./Routers/authRoute");


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(cookies());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

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
app.use("/",auth);
app.use("/pharmacist",pharmacist)
app.use("/admin",admin)
app.use("/patient",patient)





