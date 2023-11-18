// src/Settings.js
import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [limit, setLimit] = useState(3);
  const [switchState, setSwitchState] = useState(false);
  const [time, setTime] = useState(0);

  const updateSettings = async () => {
    try {
      const response = await axios.post('http://192.168.18.30/setparams', {
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

      <button onClick={updateSettings}>Update Settings</button>
    </div>
  );
};

export default Settings;
