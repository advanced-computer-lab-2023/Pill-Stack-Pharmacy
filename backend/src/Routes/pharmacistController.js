const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');
const Pharmacist = require('../Models/Pharmacist'); 
const bcrypt = require('bcryptjs');
const patientModel = require('../Models/patient.js')
const doctorModel = require('../Models/Doctor.js')


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { default: mongoose } = require('mongoose');




// add a new medicine
// add a new medicine
const createMedicine = async (req, res) => {
  try {
    const image = req.file;
    if (!req.body.name) {

      return res.send('Please enter medicine name');
    }
    if (!req.body.details) {

      return res.send('Please enter medicine details ');
    }
    if (!req.body.quantity) {
      return res.send('Please enter medicine quantity');
    }
    if (!req.body.price) {
      return res.send('Please enter medicine price');
    }
    if (!req.body.medicinalUse) {
      return res.send('Please enter medicine medicinal use');
    }
    if (!req.body.Onboard) {
      return res.send('Please enter medicine type');
    }

    if (!image) {
      return res.send("Please upload an image.");
    }

   

    const medicine = new medModel({
      Name: req.body.name,
      Details: req.body.details,
      Price: req.body.price,
      Quantity: req.body.quantity,
      Onboard:req.body.Onboard,
      Image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
      Sales:0,
      // Split the medicinal use string into an array
      MedicinalUse: req.body.medicinalUse.split(','), // Split by comma and trim spaces
      });

    // Check for duplicate medicine
    const medExists = await medModel.findOne({ Name: req.body.name });

    if (medExists) {
      const currentQuantity=medExists.Quantity;
      medExists.Quantity=currentQuantity+parseInt(req.body.quantity, 10);;
      await medExists.save();
    }else{
      await medicine.save();
      console.log('Medicine saved successfully:', medicine);
    }

    return res.status(200).send("Medicine added successfully.");
  } catch (error) {

    console.error('Error saving medicine:', error);
    res.status(400).send({message:"An error occurred in the server"});
  }
};


async function getMedSQ(req, res) {
  try {
    // Use Mongoose to find medicines with quantity > 0
    const availableMedicines = await medModel.find({});
    console.log(availableMedicines)
    res.render('avMed.ejs', { data: availableMedicines });
  } catch (error) {
    console.error('Error fetching available medicines:', error);
    throw error;
  }
}



  const editMedicineResults = async (req, res) => {
    try {
      const medicineName = req.query.medicineName;
      const newPrice = req.query.newPrice;
      const newDetails = req.query.newDetails;
  
      // Assuming you have a model named medModel for your database
  
      // Find the medicine by name
      const existingMedicine = await medModel.findOne({ Name: medicineName });
  
      if (existingMedicine) {
        // Update the medicine information
        if (newPrice)
        existingMedicine.Price = newPrice;
        if (newDetails)
        existingMedicine.Details = newDetails;
  
        // Save the updated medicine
        await existingMedicine.save();
  
        console.log('Medicine information updated successfully.');
        res.send('Medicine information updated successfully.');
      } else {
        console.log('Medicine not found in the database.');
        res.send('Medicine not found in the database.');
      }
    } catch (error) {
      console.error('Error updating medicine information:', error);
      res.status(500).send('Error updating medicine information');
    }
  }

  const changeMedicineStatus = async (req, res) => {
    const medicineId = req.params.id;
    
    try {
      // Find the medicine by ID
      const medicine = await medModel.findById(medicineId);
  
      // Check the current status and toggle it
      if (medicine.status === 'Available') {
        medicine.status = 'Archived';
      } else if (medicine.status === 'Archived') {
        medicine.status = 'Available';
      }
  
      // Save the updated medicine
      const updatedMedicine = await medicine.save();
  
      // Send back the updated medicine data
      res.json(updatedMedicine);
    } catch (error) {
      console.error('Error changing medicine status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };





 //search for a medicine in the database
 const searchMedicinePh = async (req, res) => {
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



const getFullInfo = async (req, res) => {
  try {
    const {username} = req.params;
    const user = await Pharmacist.findOne({Username:username});
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
const join = async (req, res) => {
  try {
    const { doctorUsername, username } = req.params;

    const patient = await patientModel.findOne({ Username: username });

    if (!patient) {

      return res.status(404).json({ message: 'doctor not found' });
    }
    console.log("aaaaaaa");

    // Check if the patient already has a chat room with this doctor
    const existingChatRoom = patient.chatRooms.find(
      (room) => room.doctorUsername === doctorUsername && room.username === username
    );

    if (existingChatRoom) {
      // If a chat room already exists, return the existing room and messages
      const { room, messages } = existingChatRoom;
      console.log("mariam")
      console.log(room)
      console.log(messages);

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
      console.log("marioumaa");

      await patient.save();
      console.log(messages);
      console.log("marioumaa");
 
      res.status(200).json({ room, messages });
    }
  } catch (error) {
    console.error('Error joining chat room for patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getPatientUsername = async (req, res) => {
  try {
    // Use the find method to get all patient documents and select only the 'Username' field
    const usernames = await patientModel.find({}, 'Username');
    console.log("111")
    // Check if the result is empty
    if (!usernames || usernames.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    // Extract the usernames from the result and send them in the response
    const patientUsernames = usernames.map(patient => patient.Username);
    
    return res.status(200).json({ patientUsernames });
  } catch (error) {
    console.error('Error retrieving patient usernames:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const sendMessage = async (req, res, socket) => {
  console.log("maaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  try {
    // Find the chat room based on doctorUsername
    const patientUsername = req.params.patientUsername;
    const doctorUsername = req.params.doctorUsername;
    const message = req.body.message;
    // Find the user with the specified doctor in their chatRooms
    const user = await patientModel.findOne({
     'Username': patientUsername,
     'chatRooms.doctorUsername': doctorUsername
   });
    console.log(user +"ss")
    if (user) {
      // Find the specific room within the chatRooms array
      const specificRoom = user.chatRooms.find(room => room.doctorUsername === doctorUsername);

      if (specificRoom) {
        // Create the message object
        const messageData = {
          sender: doctorUsername,
          recipient: patientUsername,
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

const getDoctorUsername = async (req, res) => {
  try {
    // Use the find method to get all pharmacist documents and select only the 'Username' field
    const usernames = await doctorModel.find({}, 'Username');
    console.log(usernames);

    // Check if the result is empty
    if (!usernames || usernames.length === 0) {
      return res.status(404).json({ message: 'No pharmacists found' });
    }

    // Extract the usernames from the result and send them in the response using forEach
    const doctortUsernames = [];
    usernames.forEach(doctorModel => {
      doctortUsernames.push(doctorModel.Username);
    });

    return res.status(200).json({ doctortUsernames });
  } catch (error) {
    console.error('Error retrieving pharmacist usernames:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const joinDoctorClin = async (req, res) => {
  try {
    const { doctorUsername, docClinUsername } = req.params;

    const pharmacistt = await Pharmacist.findOne({ Username: doctorUsername });

    if (!pharmacistt) {

      return res.status(404).json({ message: 'pharmacist not found' });
    }

    console.log(pharmacistt.chatRooms);
    console.log(doctorUsername);
    console.log(docClinUsername);

    

    // Check if the patient already has a chat room with this doctor
    const existingChatRoom = pharmacistt.chatRooms.find(
      (room) => room.doctorUsername === docClinUsername && room.pharmacistUsername === doctorUsername
    );

    if (existingChatRoom) {
      // If a chat room already exists, return the existing room and messages
      const { room, messages } = existingChatRoom;
      console.log("mariam")
      console.log(room)
      console.log(messages);

      res.status(200).json({ room, messages });
    } else {
      // Otherwise, create a new chat room
      const room = generateRoom();

      // Initialize an empty array for messages
      const messages = [];

      // Store the room information and messages for the doctor-patient chat
      pharmacistt.chatRooms.push({
        room,
        doctorUsername,
        docClinUsername,
        messages,
      });
      console.log("marioumaa");

      await pharmacistt.save();
      console.log(messages);
      console.log("marioumaa");
 
      res.status(200).json({ room, messages });
    }
  } catch (error) {
    console.error('Error joining chat room for patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const sendMessage2 = async (req, res, socket) => {
  console.log("maaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  try {
    // Find the chat room based on doctorUsername
    const docClinUsername = req.params.docClinUsername;
    const doctorUsername = req.params.doctorUsername;
    const message = req.body.message;
    console.log(docClinUsername);
    console.log(doctorUsername);
    // Find the user with the specified doctor in their chatRooms
    const pharmacist = await Pharmacist.findOne({
      'Username': doctorUsername,
      'chatRooms.doctorUsername': docClinUsername
    });
    console.log(pharmacist);
    if (pharmacist) {
      // Find the specific room within the chatRooms array
      const specificRoom = pharmacist.chatRooms.find(room => room.doctorUsername === docClinUsername);

      if (specificRoom) {
        // Create the message object
        const messageData = {
          sender: doctorUsername,
          recipient: docClinUsername,
          message: message,
        };

        // Add the message to the specific room
        specificRoom.messages.push(messageData);
        // Save changes to the user's database
        await pharmacist.save();

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



module.exports = {
    
    createMedicine,
    searchMedicinePh,
    upload,
    filterMedicinesByMedicinalUse,
    editMedicineResults,
    changeMedicineStatus,
    getMedSQ,
    getFullInfo,generateRoom,join,getPatientUsername,sendMessage,sendMessage2,joinDoctorClin,getDoctorUsername
};