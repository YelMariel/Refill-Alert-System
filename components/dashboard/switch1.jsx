// src/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/stuffs');
        const data = response.data.map((stuff) => ({
          ipAddress: stuff.ip_address,
          location: stuff.location, // Assuming there is a 'location' property in your data
        }));
        setSettings(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

  fetchData();
  const intervalId = setInterval(updateCurrentTime, 1000);

  return () => {
    // Cleanup interval when component unmounts
    clearInterval(intervalId);
  };
}, []);

  return (
    <div>
        <div className="clock">{currentTime.toLocaleTimeString()}</div>
        <div className="cards-container" style={{ display: 'flex', gap: '20px' }}>
        {settings.map((setting) => (
            <CardSettings key={setting.ipAddress} setting={setting} />
        ))}
        </div>
  </div>
  );
  };

const CardSettings = ({ setting }) => {
  const { ipAddress, location } = setting;
  const [switchState, setSwitchState] = useState(false);
  const [time, setTime] = useState(0);


  const updateSettings = async () => {
    try {
      const response = await axios.post(`http://${ipAddress}/setparams`, {        
        switch: switchState ? 0 : 1,
        time,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="card" style={{ width: '250px', height: '200px' }}>
      <h2>Location:{location}</h2>
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
          style={{ width: '50%' }} // Adjust the width as needed
        />
<button
        onClick={updateSettings}
        disabled={!ipAddress}
        style={{ width: '50%', marginTop: '10px' }} // Adjust the width and styling as needed
      >
        Set
      </button>
    </div>
  );
};

export default Settings;
