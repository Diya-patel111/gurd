const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// Create a new Maintenance Request (Auto-Fill Logic)
exports.createRequest = async (req, res) => {
  try {
    const { subject, type, equipmentId, scheduledDate, duration } = req.body;

    // Fetch Equipment to get assigned Team and Technician
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const newRequest = new MaintenanceRequest({
      subject,
      type,
      equipment: equipmentId,
      scheduledDate,
      duration,
      assignedTeam: equipment.assignedTeam, // Auto-fill
      assignedTechnician: equipment.assignedTechnician // Auto-fill
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

// Update a Maintenance Request (Scrap Logic)
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Scrap Logic
    if (updates.stage === 'Scrap' && request.stage !== 'Scrap') {
      const equipment = await Equipment.findById(request.equipment);
      if (equipment) {
        equipment.is_usable = false;
        await equipment.save();
        
        // Log a note
        request.notes.push({ text: `Equipment marked as unusable due to Scrap stage on ${new Date().toLocaleDateString()}` });
      }
    }

    // Apply updates
    Object.assign(request, updates);
    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
};

// Get all requests (for Kanban)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('equipment')
      .populate('assignedTeam')
      .populate('assignedTechnician');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Get open request count for equipment (Smart Button)
exports.getOpenRequestCount = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const count = await MaintenanceRequest.countDocuments({
      equipment: equipmentId,
      stage: { $ne: 'Repaired' } // Assuming 'Repaired' and 'Scrap' are closed, or just 'Repaired'
    });
    // If 'Scrap' is also considered closed, add it to the exclusion
    // stage: { $nin: ['Repaired', 'Scrap'] }
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching count', error: error.message });
  }
};
