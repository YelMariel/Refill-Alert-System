const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mariel',
    database: 'db_alert',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL!');
    }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { ip_address } = req.body;

  db.query('INSERT INTO users (ip_address) VALUES (?)', [ip_address], (err, results) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Error inserting data into the database.');
      } else {
          console.log('IP has been registered successfully!');
          res.status(200).send('IP has been registered successfully!');
      }
  });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
