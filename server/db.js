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
  connectionLimit: 20, // Adjust this based on your requirements
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

let previousTotalConsumed = null;

// FOR REGISTER
app.post('/storeTotalConsumed', (req, res) => {
  const { totalConsumed } = req.body;

  // Check if the value has changed before storing
  if (totalConsumed !== previousTotalConsumed) {
    // Check if a record with ID 1 exists
    pool.query('SELECT * FROM logs_consumed WHERE id = ?', [1], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error checking for existing record:', selectErr);
        res.status(500).json({ error: 'Error checking for existing record.' });
        return;
      }

      if (selectResults.length > 0) {
        // Update the existing record with ID 1
        pool.query('UPDATE logs_consumed SET total_value = ? WHERE id = ?', [totalConsumed, 1], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating total consumed data:', updateErr);
            res.status(500).send('Error updating total consumed data');
            return;
          }

          console.log('Total consumed data updated:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          res.sendStatus(200);
        });
      } else {
        // Insert a new record with ID 1
        pool.query('INSERT INTO logs_consumed (id, total_value) VALUES (?, ?)', [1, totalConsumed], (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting total consumed data:', insertErr);
            res.status(500).send('Error inserting total consumed data');
            return;
          }

          console.log('Total consumed data stored:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          res.sendStatus(200);
        });
      }
    });
  } else {
    console.log('Total consumed data unchanged. Skipping storage.');
    res.sendStatus(200);
  }
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

app.post('/storeTotalConsumed', (req, res) => {
  const { totalConsumed } = req.body;

  // Insert totalConsumed into the database
  const insertQuery = 'INSERT INTO logs_consumed (total_value) VALUES (?)';
  pool.query(insertQuery, [logs_consumed], (err, results) => {
    if (err) {
      console.error('Error inserting total consumed data:', err);
      res.status(500).send('Error storing total consumed data');
      return;
    }

    console.log('Total consumed data stored:', totalConsumed);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

