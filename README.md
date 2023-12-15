![Alt text](screenshots/image.png)


PillStack is an online pharamcy linked to PillStack's online clinic. This MERN stack project aims to eradicate the challenges associated with physical hospital visits by providing a complete digital healthcare solution.

# Motivation

This project serves as a learning opportunity to collaborate effectively within a team setting, specifically focusing on the development of a MERN Stack project. The primary objectives include gaining practical experience in meeting both Functional and Non-Functional Requirements, navigating diverse APIs, and cultivating a consistent coding style.
# Build Status
- The system currently does not allow the user to top up their wallet balance. However in the future we intend to add this feature.
- The system does not verify the user's email upon registeration.
- The system does not provide real life tracking of orders.
- The system does not have an interface for people in charge of delivery.
- For reporting bugs or offering contributions or enhancements please check our Contributions section below.  

# Screenshots
- Login Page
![Alt text](screenshots/image-13.png)
- Patient home page
- View all doctors on the platform
- Book an appointment
- chat with a doctor 
- Add a family member
- View linked family members
- View my appointments
- View my family's appointments
- View my health packages
- Subscribe to a health package
- Doctor's home page
- View doctor's patients
- chat with a patient
- Add an appoinmment to my bookings
- Accept/Reject a follow up requested by a patient
- Schedule a follow up for a patient
- Admin home page
- Add a new admin to the system
- Delete a user from the system
- View doctor's applications



 

# Code Style
### Code Formatting
- Use 4-space indentation.
- Line length should not exceed 80 characters.
- End statements with semicolons.

### Naming Conventions
- Variables: camelCase
- Functions: snake_case

### Code Organization
- Group related files into directories (e.g., /src, /tests).

### Comments and Documentation
- Use comments to explain complex logic or non-obvious code parts.

### Version Control Practices
- Use concise and descriptive commit messages following the conventional commits specification.

# Tech/Frameworks used 
### This project was fully implemented using MERN Stack.
##### MERN Stack is a popular and robust combination of technologies used for building web applications. The acronym MERN stands for MongoDB, Express.js, React, and Node.js, which are the four core technologies that make up this stack. 
#### Backend
- Node.js: A JavaScript runtime for server-side development.
- Express.js: A web application framework for Node.js.
- MongoDB: A NoSQL database for storing application data.
- Socket.IO: A JavaScript library for enabling real-time, bidirectional communication between web clients and servers.
#### Frontend
- React.js: A JavaScript library for building user interfaces.
- Axios: A promise-based HTTP client for making HTTP requests.
#### Development & Testing
- Postman : For testing API endpoints during development.


# Features



### The system serves different roles of users:

1. Guest:

 As a Guest, I could:  

- Register as a patient.  
- Submit a request to register as a pharmacist .

2. Patient:

As a Patient, I could: 
- Add prescription medicines based on a recent prescription.
- Add/Update/Delete items to my cart.
- Choose to pay for an order using wallet,credit card,or cash on delivery.
- View my current and past orders.
- Cancel an order.
- Chat with a pharmacist.
- add a new delivery address.
- Reset a forgotten password through OTP sent to email.


3. Pharmacist
As a Pharmacist, I could: 

- View available quantity and sales of each medicine.
- Add a medicine with details.
- Edit medicine details and price.
- Archive/unarchive medicines. 
- Chat with a doctor from clinic.
- Reset a forgotten password through OTP sent to email.

4. Admin:
As a Doctor, I could:
- View total sales report.
- View available medicine.
- Archive/unarchive medicines.
- Add another administrator with specific credentials.
- Remove a pharmacist/patient/admin from the system.
- View and accept or reject a pharmacist's request to join the platform.
- Add/update/delete health packages.
- Reset a forgotten password through OTP sent to email.





 



# Code Example
Patient order cancellation function:
![Alt text](screenshots/image-1.png)
Cart delete item function:
![Alt text](screenshots/image-2.png)
Admin get all users on the platform function:
![Alt text](screenshots/image-3.png)

# Installation
1.Clone Repository to your device `https://github.com/advanced-computer-lab-2023/Pill-Stack-Pharmacy.git`  
  

  
2.Open 2 terminals  
  
3.In the first terminal run the following commands:  
 `cd backend`  
 `npm install`  
 `cd src`  
 `nodemon app.js`  
    
4.In the second terminal run the following commands:  
`cd frontend`  
`npm install`  
`cd src`  
`npm start`
    
Your default browser should automatically open on the web application's address.


# API Refrences


# Postman Testing
Monthly sales statistics regarding wallet, credit, cash, and cancelled orders  
![Alt text](screenshots/image-4.png) 
View all medicines listed 
![Alt text](screenshots/image-5.png) 
Patient's past orders  
![Alt text](screenshots/image-6.png)  
Adding a new delivery address
![Alt text](screenshots/image-7.png)  
Patient's delivery addresses
![Alt text](screenshots/image-8.png) 
Patient's cart
![Alt text](screenshots/image-9.png) 
Adding items to cart
![Alt text](screenshots/image-10.png)  
# How to Use
1. Open `http://localhost:3001/ ` to view the login page in your browser.  
![Alt text](screenshots/image-13.png) 
2. Register as a patient in order to be able to login into the system.  
3. Enter your registered credientials, and a redirection to the home page will occur.  
4. 


# Contribute 
Thank you for considering contributing to our project! We welcome contributions from everyone.
## Contribution Guidelines  
### Issues
- Reporting Bugs: If you find a bug or issue, please send us an email on `pillstackacl@gmail.com` mentioning the issue with a clear description.  
- Fixing Bugs: Fork the repository, create a new branch, and submit a pull request referencing the issue.
### Feature Requests
- Requesting Features: Propose new features by emailing us on `pillstackacl@gmail.com` to discuss changes.
- Implementing Features: Coordinate with developers before implementing new features.  

#### We appreciate your interest and support in making this project better!  
#### Feel free to modify this template to suit your project's specific guidelines and needs. 
# Credits
- [Node.js](https://youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&si=xl9Ckfm1dduvf3mB) 
- [Express](https://www.youtube.com/watch?v=fgTGADljAeg)
- [React](https://youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK&si=cxXCnx404gvfF9kF)
- [React Hooks](https://youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h&si=VL42ZHFVRkgV10hr)
- [JWT Authentication](https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/)
- [Stripe](https://youtu.be/e-whXipfRvg?si=-zWhuRFVhuLKciS9)  
# License
- The Stripe is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)





 

 









