import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KanbanBoard = () => {
  const [requests, setRequests] = useState([]);
  const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('requestId', id);
  };

  const handleDrop = async (e, newStage) => {
    const id = e.dataTransfer.getData('requestId');
    
    // Optimistic update
    const updatedRequests = requests.map(req => 
      req._id === id ? { ...req, stage: newStage } : req
    );
    setRequests(updatedRequests);

    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, { stage: newStage });
      // Re-fetch to ensure sync (especially for Scrap logic side effects)
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      fetchRequests(); // Revert on error
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date() && new Date(date).getFullYear() !== 1970; // Simple check
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {stages.map(stage => (
        <div 
          key={stage}
          className="bg-gray-100 p-4 rounded-lg min-w-[300px] flex-1"
          onDrop={(e) => handleDrop(e, stage)}
          onDragOver={handleDragOver}
        >
          <h3 className="font-bold text-lg mb-4 text-gray-700">{stage}</h3>
          <div className="space-y-3">
            {requests.filter(req => req.stage === stage).map(req => (
              <div 
                key={req._id}
                draggable
                onDragStart={(e) => handleDragStart(e, req._id)}
                className={`bg-white p-4 rounded shadow cursor-move border-l-4 ${
                  isOverdue(req.scheduledDate) && stage !== 'Repaired' ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{req.subject}</h4>
                  {req.assignedTechnician && (
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800" title="Technician">
                      {/* Avatar Placeholder */}
                      T
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{req.equipment?.name || 'Unknown Equipment'}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(req.scheduledDate).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${req.type === 'Corrective' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {req.type}
                  </span>
                </div>
                {isOverdue(req.scheduledDate) && stage !== 'Repaired' && (
                  <p className="text-xs text-red-600 font-bold mt-2">OVERDUE</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
