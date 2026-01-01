const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Corrective', 'Preventive'],
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  scheduledDate: {
    type: Date
  },
  duration: {
    type: Number, // In minutes or hours
    default: 0
  },
  stage: {
    type: String,
    enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
    default: 'New'
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
