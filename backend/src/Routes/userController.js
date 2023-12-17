// #Task route solution
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');
const orderModel=require('../Models/Order.js');
const { default: mongoose } = require('mongoose');
const pharmacist =require('../Models/Pharmacist.js');

const orderDetails = async (req, res) => {
  console.log("DAREEENNN");
  const id = req.user._id;
  const objectIdValue = id.valueOf();
  console.log(objectIdValue);

  try {
    // Use await to wait for the result of the query
    const orders = await orderModel.find({ userId: objectIdValue });

    if (!orders || orders.length === 0) {
      // Handle the case where no orders are found
      return res.status(404).send({ message: "Orders not found" });
    }
    const currentTime = new Date();

    // Map through each order and extract details
    const orderDetailsArray = orders.map((order) => {
      // Check if the order time has surpassed 1 hour
      const orderTime = order.date_added;
      const timeDifference = currentTime - orderTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

      if (hoursDifference >= 1 && order.status !== 'Delivered' && order.status !== 'Cancelled' ) {
        // If the order time has surpassed 1 hour and status is not delivered, update the status
        orderModel.findByIdAndUpdate(order._id, { status: 'Delivered' }).exec(); // Update status to delivered
        order.status = 'Delivered'; // Update status in the current order object
      }
      
      return {
        _id: order._id,
        Status: order.status,
        Items: order.items,
        address: order.address,
        bill: order.bill,
        dateAdded: order.date_added,
      };
    });

    res.send(orderDetailsArray);

   
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};



const searchMedicinePat = async (req, res) => {
   const searchTerm = req.body.name;
   console.log(searchTerm);
   try {
    const medicine = await medModel.findOne({ Name: searchTerm });

    if(medicine)
    res.render('searchMedResult.ejs', {medicine});
    else
    res.send("Medicine not found");
   } catch (error) {
     res.status(500).send('Error searching for medicines');
   }
 }

 // Function to filter medicines based on medicinal use
const filterMedicinesByMedicinalUse = async (req, res) => {

  try {
   const medicinalUse = req.query.medicinalUse;

    // Use Mongoose to find medicines where medicinal use matches any element in the array   
    const filteredMedicines = await medModel.find({
      MedicinalUse: { $in: medicinalUse },
    });

    res.render('medicinaluseFilter.ejs', { medicines: filteredMedicines });
  } catch (error) {
    console.error('Error filtering medicines by medicinal use:', error);
    res.status(500).send('Internal server error');
  }
 };

 const getAddresses=async(req,res)=>{
   const username=req.user.Username;
   const user=await userModel.findOne({Username:username});
   if(user){
    const address=user.DeliveryAddress;
    res.send(address);
 
   }else{
    res.send('could not find user');
   }
 }

 const addDeliveryAddress = async (req, res) => {
  const username = req.params.username;
  const newAddress = req.body.address; // Assuming the new address is sent in the request body
  console.log(username)
  try {
    // Find the user by their username
    const user = await userModel.findOne({ Username: username });
    console.log(user)

    if (user) {
      // Add the new address to the DeliveryAddress array
      user.DeliveryAddress.push(newAddress);

      // Save the updated user document
      await user.save();

      res.send('Delivery address added successfully');
    } else {
      res.send('Could not find the user');
    }
  } catch (error) {
    console.error('Error adding delivery address:', error);
    res.status(500).send('Internal server error');
  }
};
const addDeliveryAddress2 = async (req, res) => {
  const userId= req.user._id;
  const newAddress = req.body.address; // Assuming the new address is sent in the request body
  try {
    // Find the user by their username
    const user = await userModel.findById(userId);
    console.log(user)

    if (user) {
      // Add the new address to the DeliveryAddress array
      user.DeliveryAddress.push(newAddress);

      // Save the updated user document
      await user.save();

      res.send('Delivery address added successfully');
    } else {
      res.send('Could not find the user');
    }
  } catch (error) {
    console.error('Error adding delivery address:', error);
    res.status(500).send('Internal server error');
  }
};

const getFullInfo = async (req, res) => {
  try {
    const {username} = req.params;
    const user = await userModel.findOne({Username:username});
    res.status(200).send(user);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateRoom = () => {
  return Math.random().toString(36).substring(2, 15);
};
const joinChatRoomPatient = async (req, res) => {
  try {

    const username = req.params.username;
    const doctorUsername = req.params.doctorUsername;
    console.log(doctorUsername)
    const patient = await userModel.findOne({ Username: username });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the patient already has a chat room with this doctor
    const existingChatRoom = patient.chatRooms.find(
     (room) => room.doctorUsername === doctorUsername && room.username === username
   );
    if (existingChatRoom) {
     console.log("mariam")
     console.log(existingChatRoom);

      // If a chat room already exists, return the existing room and messages
      const { room, messages } = existingChatRoom;
      res.status(200).json({ room, messages });
    } else {
      // Otherwise, create a new chat room
      const room = generateRoom();

      // Initialize an empty array for messages
      const messages = [];

      // Store the room information and messages for the doctor-patient chat
      patient.chatRooms.push({
        room,
        doctorUsername,
        username,
        messages,
      });

      await patient.save();
 
      res.status(200).json({ room, messages });
    }
  } catch (error) {
    console.error('Error joining chat room for patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getDoctorUsername = async (req, res) => {
  try {
    // Use the find method to get all pharmacist documents and select only the 'Username' field
    const usernames = await pharmacist.find({}, 'Username');

    // Check if the result is empty
    if (!usernames || usernames.length === 0) {
      return res.status(404).json({ message: 'No pharmacists found' });
    }

    // Extract the usernames from the result and send them in the response using forEach
    const pharmacistUsernames = [];
    usernames.forEach(pharmacist => {
      pharmacistUsernames.push(pharmacist.Username);
    });

    return res.status(200).json({ pharmacistUsernames });
  } catch (error) {
    console.error('Error retrieving pharmacist usernames:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const sendMessage = async (req, res, socket) => {
  try {
    // Find the chat room based on doctorUsername
    const patientUsername = req.params.patientUsername;
    const selectedDoctor = req.params.selectedDoctor;
    const message = req.body.message;
    // Find the user with the specified doctor in their chatRooms
    const user = await userModel.findOne({
     'Username': patientUsername,
     'chatRooms.doctorUsername': selectedDoctor
   });
    console.log(user+"uuu")
    if (user) {
      // Find the specific room within the chatRooms array
      const specificRoom = user.chatRooms.find(room => room.doctorUsername === selectedDoctor);

      if (specificRoom) {
        // Create the message object
        const messageData = {
          sender: patientUsername,
          recipient: selectedDoctor,
          message: message,
        };

        // Add the message to the specific room
        specificRoom.messages.push(messageData);
        // Save changes to the user's database
        await user.save();

        // Emit the message to other users in the chat room
        const room = specificRoom.room;
        console.log(room)
        console.log(message)

        return { room, message: messageData };
      } else {
        console.error('Chat room not found for the selected doctor');
        return null;
      }
    } else {
      console.error('User not found for the selected doctor');
      return null;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
const getMedAndRelatedProducts=async(req,res)=>{
  console.log('getting');
  const medId=req.body.medicineID;
  console.log(medId);
  try{
   const med=await medModel.findById(medId);
      //get related meds and send them here as an array 
   const relatedMed=await medModel.find({Details:med.Details, Name:{$ne:med.Name}});
   return res.send({currentMed:med,relatedMed:relatedMed});
  }catch (error){
    return res.status(401);
  }
}
const userPrescription=async(req,res)=>{
  const userid=req.user.id;
  const user=await userModel.findById(userid);
  //console.log(user.Prescriptions);
  const x=user.Prescriptions.filter((Prescription)=>{
    return Prescription.Status !=="Filled"
  })
  res.json(x).status(200);
}
const getPrescribtionMedicene=async(req,res)=>{
  const userid=req.user.id;
  const PrescriptionId=req.body.prescID;
  const user=await userModel.findById(userid);
  let PrescribedMedicene=[];
  for(let i=0;i<user.Prescriptions.length;i++){
    if(user.Prescriptions[i].id==PrescriptionId){
      for(let j=0;j<user.Prescriptions[i].Medicine.length;j++){
        if(user.Prescriptions[i].Status!="Filled"){
        const Medicene=await medModel.find({Name:user.Prescriptions[i].Medicine[j].MedicineName});
        console.log(user.Prescriptions[i].Medicine[j].MedicineName);
        PrescribedMedicene.push(Medicene);}
      }
    }

  }
  if(PrescribedMedicene[0].length==0){
    res.send("error").status(400);
  }
  else{
  console.log(PrescribedMedicene);
  res.json(PrescribedMedicene).status(200);}
}

module.exports = {searchMedicinePat, filterMedicinesByMedicinalUse,getAddresses,addDeliveryAddress,addDeliveryAddress2, orderDetails,getFullInfo,
  generateRoom,joinChatRoomPatient,getDoctorUsername,sendMessage,getMedAndRelatedProducts,getPrescribtionMedicene,userPrescription};
