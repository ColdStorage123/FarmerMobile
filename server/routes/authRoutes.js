const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return await bcrypt.hash(password, 8);
}

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const User = mongoose.model('User');
const ColdStorage = mongoose.model('ColdStorage');

///nodemailer
const nodemailer = require("nodemailer");
const OrderPlacement = require('../models/OrderPlacement');
const Review = require('../models/Review');
const authMiddleware = require('../Middlewares/authMiddleware');
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  requireTLS: true,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'fypcomsats123@gmail.com',
    pass: 'xbngznhntmcngxqj'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function mailer(receiveremail,code) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'Kashatkar 👻', // sender address
    to: `${receiveremail}`, // list of receivers
    subject: "Email registration", // Subject line
    text: `your verification code is : ${code} `, // plain text body
    html: `<b>your verification code is : ${code} </b>` , // html body
  });

  console.log("Message sent: %s", info.messageId);
  

  
}

///nodemailer
router.post('/verify', (req, res) => {
  console.log("sent by client ", req.body);
  
   const { fullName, email, password, confirmPassword, phoneNumber, role } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !phoneNumber || !role) {
    return res.status(422).json({ error: "Please fill all fields" });
    //got error in postman : specify content type application/json 
  }
  User.findOne({ email: email })
    .then(async (existingUser) => {
    if (existingUser) {
      return res.status(422).json({ error: "User already exists with this email" });
      }
      try {
        // Hash the user's password before saving it
    // const saltRounds = 10; // You can adjust the number of salt rounds as needed
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
        let VerificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  let user = [
          {
            fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      
      VerificationCode,
      role,
          }
        ]
  await mailer(email,VerificationCode);
        res.send({ message: "Verification Code Send to Your Email", userData: user });
      }
      catch (err) {
        console.log(err);
      }
  })
    

  
});

router.post('/signup', async (req, res) => {
  console.log('sent by client', req.body);

  const { fullName, email, password, confirmPassword, phoneNumber, role } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !phoneNumber ||!role) {
    return res.status(422).json({ error: "Please fill all fields" });
    //got error in postman : specify content type application/json 
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ error: "User already exists with this email" });
    }

    const user = new User({
      fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      role,
    });
 console.log('The length of the password is: ', password.length);
    await user.save();
//GENERATING TOKEN BY ADDING USER ID AND SECRET KEY
    const token = jwt.sign({ _id: user._id , role: user.role}, process.env.JWT_SECRET);

    res.send({ message:'User Registered successfully' ,token, role: user.role ,_id: user._id });
    // res.json({ message: "Signup successful", token });
  } catch (error) {
    console.error("db err", error);
    return res.status(500).json({ error: "Failed to signup. Please try again later" });
  }
})


// router.post('/login', async (req, res) => {
//   const { email, password, newPassword } = req.body;
//   if (!email) {
//     return res.status(422).json({ error: "Add email" });
//   }

//   const saveUser = await User.findOne({ email: email });
//   if (!saveUser) {
//     return res.status(422).json({ error: "Invalid credentials" });
//   }

//   try {
//     // Check the newPassword field first (for users who have reset their password)
//     if (newPassword) {
//       const passwordMatch = await bcrypt.compare(newPassword, saveUser.password);
//       console.log('After Reset Comparison Result:', passwordMatch);
//       console.log('Entered New Password:', newPassword);
//       console.log('Saved User Password:', saveUser.password);
//       if (passwordMatch) {
//         const token = jwt.sign({ _id: saveUser._id , role: saveUser.role }, process.env.JWT_SECRET);
//         return res.send({ token, role: saveUser.role });
//       } else {
//         return res.status(422).json({ error: "Invalid credentials" });
//       }
//     } else {
//       // If newPassword is not provided, check the regular password field
//       const passwordMatch = await bcrypt.compare(password, saveUser.password);
//       console.log('Before Reset Comparison Result:', passwordMatch);
//       console.log('Entered New Password:', password);
//       console.log('Saved User Password:', saveUser.password);
//       if (passwordMatch) {
//         const token = jwt.sign({ _id: saveUser._id }, process.env.JWT_SECRET);
//         return res.send({ token });
//       } else {
//         return res.status(422).json({ error: "Invalid credentials" });
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Failed to log in. Please try again later." });
//   }
// });

router.post('/login', async (req, res) => {
  const { email, password,newPassword} = req.body;
  if (!email) {
    return res.status(422).json({ error: "Add email" });
  }

  const saveUser = await User.findOne({ email: email });
  if (!saveUser) {
    return res.status(422).json({ error: "Invalid credentials" });
  }

  try {
    if (newPassword) {
      const passwordMatch = await bcrypt.compare(newPassword, saveUser.password);
      if (passwordMatch) {
        const token = jwt.sign({ _id: saveUser._id, role: saveUser.role }, process.env.JWT_SECRET);
        return res.send({ token, role: saveUser.role , _id: saveUser._id });
      } else {
        return res.status(422).json({ error: "Invalid credentials" });
      }
    } else {
      const passwordMatch = await bcrypt.compare(password, saveUser.password);
      if (passwordMatch) {
        const token = jwt.sign({ _id: saveUser._id, role: saveUser.role }, process.env.JWT_SECRET);
        return res.send({ token, role: saveUser.role , _id: saveUser._id });
      } else {
        return res.status(422).json({ error: "Invalid credentials" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to log in. Please try got later." });
  }
});


router.post('/login/google', async (req, res) => {
  const { googleAccessToken } = req.body;

  try {
    // Verify the Google access token (you'll need to implement this part)
    const googleUser = await verifyGoogleAccessToken(googleAccessToken);

    // Check if the Google user exists in your database based on the email
    const existingUser = await User.findOne({ email: googleUser.email });

    if (!existingUser) {
      return res.status(422).json({ error: "No user found with this Google account" });
    }

    // Check if the user has previously signed up with Google
    if (!existingUser.googleId) {
      // If not, save the Google ID in the user's profile
      existingUser.googleId = googleUser.sub;
      await existingUser.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET);
    return res.send({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to log in with Google" });
  }
});


router.post('/storage', authMiddleware, async (req, res) => {
 
  console.log('Data sent by client', req.body);
  const { coldStorageName, description, capacity, location, images, phoneNumber } = req.body;

  // Access the authenticated user's _id and role from req.user
  const { _id, role } = req.user;

  if (role !== 'Manager') {
    return res.status(403).json({ error: 'Only managers can register cold storage facilities.' });
  }

  if (!coldStorageName || !description || !capacity || !location || !images || !phoneNumber || !_id) {
    return res.status(422).json({ error: 'Please fill all fields' });
  }

  try {
    // Create a new cold storage instance
    const coldStorage = new ColdStorage({
      coldStorageName,
      description,
      capacity,
      location,
      images,
      phoneNumber,
      managerid: _id, // Use the authenticated user's _id as managerid
    });


    // Save the cold storage data to the database
    await coldStorage.save();

    // You can perform additional actions or validations here if needed

    res.json({ message: 'Cold storage data stored successfully', coldStorage });
  } catch (error) {
    console.error('Error saving cold storage data', error);
    return res.status(500).json({ error: 'Failed to store cold storage data. Please try again later' });
  }
});


router.post('/order' , authMiddleware ,async (req, res) => {
  console.log('Data sent by client', req.body);
  const {farmerId, managerid,  cropQuantity, selectedStartDate, storageDays, userRequirements, images, selectedEndDate } = req.body;
  // Access the authenticated user's _id and role from req.user
  const { _id, role } = req.user;

  if (role !== 'Farmer') {
    return res.status(403).json({ error: 'Only Farmers can place order.' });
  }

  // Perform validation checks if required
  if (!farmerId || !managerid || !cropQuantity || !selectedStartDate|| !storageDays || !userRequirements || !images || !selectedEndDate || !_id) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    // Create a new cold storage instance
    const orderPlacement = new OrderPlacement({
      // farmerId, // Assign farmerId to userId field in the schema
      farmerId: _id,
      managerid,
      cropQuantity,
      selectedStartDate,
      storageDays,
      userRequirements,
      images,
      selectedEndDate,
      
    });

    // Save the cold storage data to the database
    await orderPlacement.save();

    // You can perform additional actions or validations here if needed

   res.json({ message: "Your order is successfully added in waiting list for approval", orderPlacement });

  } catch (error) {
    console.error('Error in Placing order:', error);
   console.error("Error saving order placement data:", error);
return res.status(500).json({ error: `Failed to place your order. Error: ${error.message}` });

  }
});


/////////////////////////////////////////////////

router.get('/getUserData', authMiddleware, async (req, res) => {
  // Now, req.user should contain user data, including _id
  try {
    // Fetch user data from the database based on the user ID
    const user = await User.findById(req.user._id).select('-password'); // Exclude the password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data. Please try again later.' });
  }
});


router.put('/updateUserData',authMiddleware, async (req, res) => {
  try {
    // Get the user ID from the request, assuming you're using JWT for authentication
    const userId = req.user._id; // Assuming you have middleware to verify JWT and add user data to the request object

    // Fetch user data from the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data with the new values
    user.fullName = req.body.fullName;
    user.phoneNumber = req.body.phoneNumber;

    // Save the updated user data to the database
    await user.save();

    res.json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data. Please try again later.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email,role } = req.body;
 console.log('User Role:', role);
  if (!email) {
    return res.status(422).json({ error: 'Please provide an email address' });
  }

  try {
    // Check if the user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this email address' });
    }

    // Generate a verification code
    const verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    // Send the verification code to the user's email using Nodemailer
    await mailer(email, verificationCode);

    // Store the verification code in the user document (you should have a field for this in your User schema)
    user.resetPasswordCode = verificationCode;
    await user.save();
console.log('Verification code sent to user:', verificationCode);
    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while sending the verification code' });
  }
});

// Endpoint to reset the user's password using the verification code


// router.post('/reset-password', async (req, res) => {
//   const { email, verificationCode, newPassword  } = req.body;

//   if (!email || !verificationCode || !newPassword ) {
//     return res.status(422).json({ error: 'Please provide all required information' });
//   }
// // if (newPassword !== confirmPassword) {
// //     return res.status(422).json({ error: 'Passwords do not match' });
// //   }
//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found with this email address' });
//     }

//     // Check if the provided verification code matches the stored code
//     if (user.resetPasswordCode !== verificationCode) {
//       console.log('Verification Code Mismatch');
//       return res.status(422).json({ error: 'Incorrect verification code' });
//     }

//     // Store the new password (unhashed)
//     user.password = newPassword;
//     user.confirmPassword = newPassword;
//     user.resetPasswordCode = null;

//     // Hash the new password before saving it
//     const saltRounds = 8; // You can adjust the number of salt rounds as needed
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password with the hashed password
//     user.password = hashedPassword;

//     // Save the updated user data
//     await user.save();

//     console.log('User Password Updated:', user.password);
//     res.json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while resetting the password' });
//   }
// });

// ... (other routes and imports)


// POST route to reset the user's password using the verification code

// Password Reset Route
// Password Reset Route
router.post('/reset-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  if (!email || !verificationCode || !newPassword) {
    return res.status(422).json({ error: 'Please provide all required information' });
  }

  try {
    // Find the user by email
    const saveUser = await User.findOne({ email });

    if (!saveUser) {
      return res.status(404).json({ error: 'User not found with this email address' });
    }

    // Check if the provided verification code matches the stored code
    if (saveUser.resetPasswordCode !== verificationCode) {
      console.log('Verification Code Mismatch');
      return res.status(422).json({ error: 'Incorrect verification code' });
     
    }
 console.log('The length of the password before hashing is: ', newPassword.length);
    // Hash the new password before saving it
    const saltRounds = 8;
    // const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
const hashedPassword = await hashPassword(newPassword);
    // Update the user's password with the hashed password
    saveUser.password = hashedPassword;
    saveUser.resetPasswordCode = null; // Clear the reset code
    console.log('The length of the password after hashing is: ', saveUser.password.length);
    const passwordMatch = await bcrypt.compare(newPassword, saveUser.password);

    
    // Save the updated user data
    await saveUser.save();

    // Generate a new token for the user
    const token = jwt.sign({ _id: saveUser._id, role: saveUser.role }, process.env.JWT_SECRET);

    console.log('User Password Updated:', saveUser.password);
   console.log('The length of the password after saving is: ', saveUser.password.length);
    // Send the new token in the response
    res.json({ message: 'Password reset successful', token, role: saveUser.role});
    console.log("Your new token is:", token);
    console.log("Your role is:",saveUser.role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
});

//22september homefarmer

router.get('/cold-storages', async (req, res) => {
  try {
    // Fetch all cold storage details from the database
    const coldStorages = await ColdStorage.find();
    
    // You can customize the data you want to send to the client
    const formattedColdStorages = coldStorages.map((coldStorage) => ({
      _id: coldStorage._id,
      coldStorageName: coldStorage.coldStorageName,
      description: coldStorage.description,
      capacity: coldStorage.capacity,
      location: coldStorage.location,
      images: coldStorage.images, 
      // Add more fields as needed
    }));

    res.json(formattedColdStorages);
  } catch (error) {
    console.error('Error fetching cold storage data:', error);
    res.status(500).json({ error: 'Failed to fetch cold storage data. Please try again later.' });
  }
});
router.get('/accepted-storages', async (req, res) => {
  try {
    const acceptedStorages = await ColdStorage.find({ status: 'accepted' });
    res.json(acceptedStorages);
  } catch (error) {
    console.error('Error fetching accepted cold storages:', error);
    return res.status(500).json({ error: 'Failed to fetch accepted cold storages' });
  }
});


router.get('/farmerorders', async (req, res) => {
  const farmerId = req.query.farmerId;

  try {
    // Fetch orders from the database where managerid matches the provided managerid
    const orders = await OrderPlacement.find({ farmerId: farmerId });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders. Error: ${error.message} '});
  }
});


router.post('/reviews', async (req, res) => {
  try {
    const { managerid, rating, reviewText } = req.body;
    const review = new Review({ managerid, rating, reviewText });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/viewreviews/:managerid', async (req, res) => {
  try {
    const { managerid } = req.params;
    const reviews = await Review.find({ managerid });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
module.exports = router;
