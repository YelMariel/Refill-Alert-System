// src/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [limit, setLimit] = useState(3);
  const [switchState, setSwitchState] = useState(false);
  const [time, setTime] = useState(0);
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get('http://localhost:3002/stuffs');
        // Assuming the response data is an array and the first element contains the IP address
        const firstStuff = response.data[0];
        if (firstStuff && firstStuff.ip_address) {
          setIpAddress(firstStuff.ip_address);
        } else {
          console.error('Error fetching IP address from localhost:3002/stuffs');
        }
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []); // Empty dependency array to ensure the effect runs only once on component mount

  const updateSettings = async () => {
    try {
      const response = await axios.post(`http://${ipAddress}/setparams`, {
        limit,
        switch: switchState ? 0 : 1,
        time,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div>
      <label>Limit:</label>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value, 10))}
      />

      <label>Switch:</label>
      <input
        type="checkbox"
        checked={switchState}
        onChange={() => setSwitchState(!switchState)}
      />

      <label>Time:</label>
      <input
        type="number"
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value, 10))}
      />

      <button onClick={updateSettings} disabled={!ipAddress}>
        Update Settings
      </button>
    </div>
  );
};

export default Settings;
