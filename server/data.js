const axios = require('axios');
const mysql = require('mysql2');
const express = require('express');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
};

const pool = mysql.createPool(dbConfig);

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to MySQL');
        connection.release();
        resolve();
      }
    });
  });
}

async function getEsp8266ServerIP() {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [1]);

    console.log('Type of rows:', typeof rows);
    console.log('Structure of rows:', rows);

    if (rows && rows.length > 0) {
      const ipAddress = rows[0].ip_address;
      console.log('Real IP address found in esp8266_server table:', ipAddress);
      return ipAddress;
    } else {
      console.error('Warning: No record found in esp8266_server table. Using default IP address.');
      return null; // Use an appropriate default IP address
    }
  } catch (error) {
    console.error('Error fetching ESP8266 server IP from MySQL:', error);
    return null;
  }
}

async function fetchDataFromESP8266(ipAddress) {
  try {
    if (!ipAddress) {
      console.log('Skipping data fetch from ESP8266 due to missing server IP.');
      return;
    }

    const response = await axios.get(`http://${ipAddress}/getwaterstatus`);
    const data = response.data;

    if (data.water_level === 'HIGH' || data.water_level === 'LOW') {
      console.log('Received data from ESP8266:', data.water_level);

      await Promise.all([
        pool.promise().execute('UPDATE stats SET water_level = ? WHERE id = ?', [data.water_level, 1]),
        pool.promise().execute('UPDATE inventory SET consumed = ? WHERE id = ?', [data.consumed, 1]),
      ]);

      console.log('Data updated in MySQL');
    } else {
      console.log('Invalid water level data:', data.water_level);
    }
  } catch (error) {
    console.error('Error with ESP8266 or MySQL:', error);
  }
}

async function startServer() {
  const app = express();
  const port = 3003;

  app.get('/getdatafromdb', async (req, res) => {
    try {
      const [result] = await pool.promise().query('SELECT * FROM stats');
      const rows = result[0];
      res.json({ rows });
    } catch (error) {
      console.error('Error with MySQL:', error);
      res.status(500).json({ error: 'Failed to fetch data from MySQL' });
    }
  });

  app.get('/inventorydb', async (req, res) => {
    try {
      const [result] = await pool.promise().query('SELECT * FROM inventory');
      const rows = result[0];
      res.json({ rows });
    } catch (error) {
      console.error('Error with MySQL:', error);
      res.status(500).json({ error: 'Failed to fetch data from MySQL' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

async function main() {
  try {
    await connectToDatabase();
    await startServer();
  } catch (error) {
    console.error('Error initializing the application:', error);
    process.exit(1);
  }

  setInterval(async () => {
    const esp8266ServerIP = await getEsp8266ServerIP();

    if (esp8266ServerIP) {
      await fetchDataFromESP8266(esp8266ServerIP);
    } else {
      console.log('Skipping data fetch from ESP8266 due to missing server IP.');
    }
  }, 10000);
}

main();
