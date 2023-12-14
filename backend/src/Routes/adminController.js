//importing user models
const adminModel = require('../Models/Admin.js');
const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const Patient = require('../Models/patient.js'); 
const pharmacistModel=require('../Models/Pharmacist.js');
//importing medicines model
const medModel = require('../Models/Medicine.js');
//importing mongoose 
const { default: mongoose } = require('mongoose');


const getAllUsers = async (req, res) => {
  try {
    const patients = await Patient.find({});
    const doctors = await pharmacistModel.find({});
    const admins = await adminModel.find();

    // Add the 'role' property to each user object
    const patientsWithRole = patients.map(patient => ({ ...patient._doc, role: 'patient' }));
    const doctorsWithRole = doctors.map(doctor => ({ ...doctor._doc, role: 'pharmacist' }));
    const adminsWithRole = admins.map(admin => ({ ...admin._doc, role: 'admin' }));

    // Combine all user types into a single array
    const allUsers = [...adminsWithRole, ...doctorsWithRole, ...patientsWithRole];
    // console.log(allUsers);
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const viewPharmacistApp= async (req, res) => {
    const applicationId = req.params.id;
    const application = await pharmaReqModel.findById(applicationId);
    res.render('singleApplication.ejs', { application });
}

const viewAllApp= async (req, res) => {
    const applications = await pharmaReqModel.find({});
    res.send(applications);
}

const PatientDetailsResults = async (req, res) => {
  const username = req.query.username;
  let patients
  try {
    if (username ==="All")
    patients = await Patient.find({ });
    else
    patients = await Patient.find({ Username: username });

    if (!patients || patients.length === 0) {
      // If no patient is found, you can handle it here
      return res.status(404).send("Patient not found");
    }

    // Render the EJS template with the patient data
    res.render('patientDetailsResults.ejs', { patients: patients });



  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const PharmacistDetailsResults = async (req, res) => {
  const username = req.query.username;

  try {
    const pharmacists = await pharmacistModel.find({});

    if (!pharmacists || pharmacists.length === 0) {
      // If no pharmacist is found, you can handle it here
      return res.status(404).send("Pharmacist not found");
    }

    // Render the EJS template with the Pharmacist data
    res.render('pharmacistDetailsResults.ejs', { pharmacists: pharmacists });
    console.log(pharmacists);
    

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};


  async function getAvailableMedicines(req, res) {
    try {
      // Use Mongoose to find medicines with quantity > 0
         const availableMedicines = await medModel.find({ status: 'Available' });

      res.send( availableMedicines );
    } catch (error) {
      console.error('Error fetching available medicines:', error);
      throw error;
    }
  }

  async function getAvailableMedicinesPH(req, res) {
    try {
      // Use Mongoose to find medicines with quantity > 0
      const availableMedicines = await medModel.find({  });
      res.send( availableMedicines );
    } catch (error) {
      console.error('Error fetching available medicines:', error);
      throw error;
    }
  }

 

  async function getMedicinalUse (req,res) {

    const result=await  medModel.aggregate([
       { $unwind: '$MedicinalUse' }, // Unwind the array
       { $group: { _id: '$MedicinalUse' } }, // Group by MedicinalUse
     ]);
     const uniqueMedicinalUses = result.map((use) => use._id);
     res.send( uniqueMedicinalUses);
   
 
   }

  const viewPatientDet = async (req, res) => {
    res.render('PatientDetails');
  }
  const viewPharmacistDet = async (req, res) => {
    res.render('PharmacistDetails');
  }

  

  // const PatientDetailsResults = async (req, res) => {
  //   const patients = await Patient.find({});
  //  res.send(patients);  
  // }


//removing a user (admin, patient or pharmacist) from the system
const removeUser = async (req, res) => {
  const toBeDeleted =  req.body.id ;
  const userType = req.body.role; // This will hold the selected user type
  // console.log({ Username: req.body.username });
  console.log(toBeDeleted);
  console.log(userType);
  // Determine which model to use based on the userType
  let UserModel;
  switch (userType) {
    case 'patient':
      UserModel = Patient;
      break;
    case 'pharmacist':
      UserModel=pharmacistModel;
      break;
    case 'admin':
      UserModel = adminModel;
      break;
    default:
      return res.status(400).send('Invalid user type');
  }
  try {
    // Find and delete the user by username
    const deletedUser = await UserModel.findOneAndDelete({ _id:  toBeDeleted});

    if (deletedUser) {
      res.send(`User '${toBeDeleted.Username}' of type '${userType}' deleted successfully.`);
    } else {
      res.send(`User '${toBeDeleted.Username}' not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};


const searchMedicineA = async (req, res) => {
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
 


 const acceptRegRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pharmaReqModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const newDoctor = new pharmacistModel({
      Username: request.Username,
      Name: request.Name,
      Email: request.Email,
      Password: request.Password,
      DateOfBirth: request.DateOfBirth,
      hourly_rate: request.HourlyRate,
      affiliation: request.Affiliation,
      education_background: request.EducationalBackground,
    });
    await newDoctor.save();
    await pharmaReqModel.findByIdAndRemove(id);

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectRegRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pharmaReqModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await pharmaReqModel.findByIdAndRemove(id);

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFullInfo = async (req, res) => {
  try {
    console.log("iin=kasndfasn");
    const {username} = req.params;
    console.log("the ",username);
    const user = await adminModel.findOne({Username:username});
    res.status(200).send(user);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getMedNames = async (req, res) => {
  try {
   const meds=await medModel.find({},{_id:0,Name:1});
   return res.send(meds);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
    viewAllApp,viewPharmacistApp,getAvailableMedicines,viewPatientDet
    ,PatientDetailsResults,removeUser,searchMedicineA,filterMedicinesByMedicinalUse,getAvailableMedicinesPH,
    PharmacistDetailsResults, viewPharmacistDet, getAllUsers,
    getMedicinalUse, acceptRegRequest, rejectRegRequest, getFullInfo ,getMedNames
};
