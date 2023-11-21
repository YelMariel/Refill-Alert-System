const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
  connectionLimit: 10, // Adjust this based on your requirements
});

app.use(cors());
app.use(bodyParser.json());

// CHECK IF DUPLICATE IP
app.post('/checkDuplicate', (req, res) => {
  const { ip_address } = req.body;

  pool.query('SELECT 1 FROM users WHERE ip_address = ?', [ip_address], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking for duplicate data:', selectErr);
      res.status(500).json({ error: 'Error checking for duplicate data.' });
    } else {
      if (selectResults.length > 0) {
        // Duplicate IP address found
        const dupe = ip_address;
        console.log('Duplicate IP address:', dupe);
        res.status(200).json({ duplicate: true });
      } else {
        // No duplicate found
        res.status(200).json({ duplicate: false });
      }
    }
  });
});

// FOR REGISTER
app.post('/register', (req, res) => {
  const { ip_address } = req.body;

  // No duplicate found, proceed with the insertion
  pool.query('INSERT INTO users (ip_address) VALUES (?)', [ip_address], (insertErr, insertResults) => {
    if (insertErr) {
      console.error('Error inserting data:', insertErr);
      res.status(500).send('Error inserting data into the database.');
    } else {
      console.log('IP has been registered successfully!');
      res.status(200).send('IP has been registered successfully!');
    }
  });
});

// FOR DELETE
// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
