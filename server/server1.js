const axios = require('axios');
const mysql = require('mysql2');

const esp8266ServerURL = 'http://192.168.150.54';
const esp8266ServerPort = 80;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error creating MySQL connection pool:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
  connection.release();
});


async function fetchDataFromESP8266AndStoreInDB() {
  try {
    const response = await axios.get(`${esp8266ServerURL}:${esp8266ServerPort}/getwaterstatus`);
    const data = response.data;

    if (data.water_level === 'HIGH' || data.water_level === 'LOW') {
      console.log('Received data from ESP8266:', data.water_level);

      const [rows, fields] = await pool.promise().execute('INSERT INTO status (water_level) VALUES (?)', [data.water_level]);
      console.log('Data inserted into MySQL');
    } else {
      console.log('Invalid water level data:', data.water_level);
    }
  } catch (error) {
    console.error('Error with MySQL:', error);
  }
}

setInterval(fetchDataFromESP8266AndStoreInDB, 5000);  