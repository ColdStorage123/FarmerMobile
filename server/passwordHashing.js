// common/passwordUtils.js

const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 8;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = {
  hashPassword,
};
