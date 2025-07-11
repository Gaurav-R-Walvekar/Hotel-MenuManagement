const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  menu: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: null
  },
  auto_update_expiration_date: {
    type: Boolean,
    default: false
  },
  expiration_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'menu'
});

module.exports = mongoose.model('Hotel', hotelSchema, 'menu'); 