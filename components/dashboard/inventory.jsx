import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Table } from 'react-bootstrap'; // Import Bootstrap Table component

const InventoryComponent = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [refillLogs, setRefillLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/inventory');
        setInventoryData(response.data);
        createRefillLog(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // You can set up a timer here to periodically fetch data if needed
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 10000);

    // Cleanup the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures that useEffect runs only once when the component mounts

  const createRefillLog = (data) => {
    const logs = data.map((item) => ({
      id: item.id,
      date: new Date().toISOString(),
      consumed: item.consumed,
    }));

    setRefillLogs(logs);
  };

  return (
    <div>
      

      <h2>Refill Logs</h2>
      {refillLogs.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Consumed</th>
            </tr>
          </thead>
          <tbody>
            {refillLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.date}</td>
                <td>{log.consumed}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No refill logs found.</p>
      )}
    </div>
  );
};

export default InventoryComponent;
