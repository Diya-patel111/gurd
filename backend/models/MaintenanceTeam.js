const mongoose = require('mongoose');

const MaintenanceTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  technicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming a User model exists, or just storing names/IDs for now
  }]
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTeam', MaintenanceTeamSchema);
