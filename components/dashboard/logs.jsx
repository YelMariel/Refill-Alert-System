import React, { useState, useEffect } from 'react';

const LogsConsumedComponent = () => {
  const [logsConsumedData, setLogsConsumedData] = useState(null);

  useEffect(() => {
    // Fetch all data from logs_consumed except id from the server
    const fetchLogsConsumedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getAllLogsConsumed');
        const data = await response.json();

        if (response.ok) {
          setLogsConsumedData(data);
        } else {
          console.error('Error fetching logs_consumed data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching logs_consumed data:', error);
      }
    };

    fetchLogsConsumedData();
  }, []); // Run once on component mount

  return (
    <div>
      <h2>Refill logs</h2>
      {logsConsumedData !== null ? (
        <table>
          <thead>
            <tr>
              {Object.keys(logsConsumedData).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(logsConsumedData).map(value => (
                <td key={value}>{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LogsConsumedComponent;
