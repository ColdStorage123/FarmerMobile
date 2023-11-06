// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   confirmPassword: {
//     type: String,
//     required: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String, // Adjust the type accordingly (String, Enum, etc.)
//     default: 'Farmer', // Set the default role if needed
//   },
//   resetPasswordCode: {
//     type: String,
//     default: null, // Initially, it can be set to null
//   },
// });

// // Encrypting user password before saving to the database using bcrypt
// // Encrypting user password before saving to the database using bcrypt
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (!user.isModified('password')) {
//     return next();
//   }
//   // Replace the existing hashing code with hashPassword
//   user.password = await hashPassword(user.password);
//   next();
// });


// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Your custom hashPassword function
async function hashPassword(password) {
  return await bcrypt.hash(password, 8);
}

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
 role: {
    type: String,
    default: 'null',
  },
  resetPasswordCode: {
    type: String,
    default: null,
  },
});

// Encrypting user password before saving to the database using the custom hashPassword function
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    // Hash the user's password using the custom hashPassword function
    user.password = await hashPassword(user.password);
    next();
  } catch (error) {
    return next(error); // Handle hashing error
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
