const mongoose = require('mongoose');

const orderPlacementSchema = new mongoose.Schema({
   farmerId: {
    type: String, // cahnge1
    required: true,
  },
  managerid: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userId is a string, adjust the type if it's different
    required: true,
  },
  
  
  cropQuantity: {
    type: String,
    required: true,       
  },
  selectedStartDate: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Example: Validate if the date is in "YYYY-MM-DD" format
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      }, 
      
      message: props => `${props.value} is not a valid date in YYYY-MM-DD format!`,
    },
  },
  
  storageDays: {
    type: String,
    required: true,
  },
  userRequirements: {
    type: String,
    required: true,
  },
  selectedEndDate: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Example: Validate if the date is in "YYYY-MM-DD" format
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      },
      message: props => `${props.value} is not a valid date in YYYY-MM-DD format!`,
    },
  },
   images: [{ type: String }], // Array of image URIs
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

const OrderPlacement = mongoose.model('OrderPlacement', orderPlacementSchema);

module.exports = OrderPlacement;
