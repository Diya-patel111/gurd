import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmartButton = ({ equipmentId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests/equipment/${equipmentId}/count`);
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching count:', error);
      }
    };

    if (equipmentId) {
      fetchCount();
    }
  }, [equipmentId]);

  return (
    <button className="relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
      View Maintenance
      {count > 0 && (
        <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

export default SmartButton;
