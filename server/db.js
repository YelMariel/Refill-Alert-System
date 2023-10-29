const express = require('express');
const mysql = require('mysql2'); // Use the 'mysql2/promise' package for async/await support

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
});

// Define an API endpoint to insert data into the database
app.post('/api/store-location', async (req, res) => {
  try {
    const { location } = req.body;

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Insert the data into the database
    const [results] = await connection.execute('INSERT INTO locations (location) VALUES (?)', [location]);

    // Release the connection back to the pool
    connection.release();

    // Respond with a success message
    res.json({ message: 'Location data stored successfully' });
  } catch (error) {
    console.error('Error storing location data:', error);
    res.status(500).json({ error: 'An error occurred while storing location data' });
  }
});

const PORT = 3001 ;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
