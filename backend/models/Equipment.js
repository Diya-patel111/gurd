const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  warrantyInfo: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  assignedEmployee: {
    type: String // Could be a User reference
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Or just a string if User model isn't fully defined yet
  },
  is_usable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);
