import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarView = () => {
  const [preventiveJobs, setPreventiveJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests');
        // Filter for Preventive jobs
        const preventive = response.data.filter(req => req.type === 'Preventive');
        // Sort by date
        preventive.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
        setPreventiveJobs(preventive);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-700">Upcoming Preventive Maintenance</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {preventiveJobs.length === 0 ? (
          <li className="p-4 text-gray-500 text-center">No preventive maintenance scheduled.</li>
        ) : (
          preventiveJobs.map(job => (
            <li key={job._id} className="p-4 hover:bg-gray-50 transition duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 truncate">{job.subject}</p>
                  <p className="text-sm text-gray-500">{job.equipment?.name || 'Unknown Equipment'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(job.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {job.assignedTechnician ? 'Assigned' : 'Unassigned'}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CalendarView;
