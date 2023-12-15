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

const http = require("http");
const{Server} = require("socket.io");
const fs = require('fs');

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
const cart = require("./Routers/cartRoute");
const order = require("./Routers/orderRoute");




app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(cookies());

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
const server = http.createServer(app);

app.use(cors(corsOptions));

const io = new Server(server,{
cors: {
  origin: "http://localhost:3001",
  methods: ["GET","POST"],
},
});
io.on("connection", (socket)=>{
console.log(`user Connected: ${socket.id}`);

socket.on("join_room",(data)=>{
  socket.join(data);
  console.log(`user with ID: ${socket.id} joined room: ${data}`)

});

socket.on("send_message",(data=>{
  socket.to(data.room).emit("receive_message",data);
}));


socket.on("disconnect",()=>{
  console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || "8001";


// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));


// Routes
app.use("/",auth);
app.use("/pharmacist",pharmacist)
app.use("/admin",admin)
app.use("/patient",patient)
app.use("/cart",cart);
app.use("/order",order)





