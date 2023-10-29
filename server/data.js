const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3001;

//connection to sql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mariel",
  database: "db_fetch",
});

//endpoint
app.get("/", (req, res) => {
  res.send(
    "Input user details: firstName, lastName, phone, address1, address2, and email."
  );
  console.log(req.query);
  con.query(
    "insert into info(firstname, lastname, phone, address1, address2, email) values(?, ?, ?, ?, ?, ?);",
    [
      req.query.firstname,
      req.query.lastname,
      req.query.phone,
      req.query.address1,
      req.query.address2,
      req.query.email,
    ],
    function (err, results) {
      if (err) throw err;
      console.log(results);
    }
  );
});

//send to front end details of the selected id.
app.get("/details", (req, res) => {
  console.log(req.query);
  con.query(
    "select * from `info` where `id` = ?;",
    [req.query.id],
    function (err, results) {
      if (err) throw err;
      console.log(results);
      res.send(`First Name: ${results[0].firstname}, Last Name: ${results[0].lastname}, 
      Phone: ${results[0].phone}, Address 1: ${results[0].address1}, Address 2: ${results[0].address2},
      Email: ${results[0].email} `);
    }
  );
});

//send to front end full name 
app.get("/name", (req, res) => {
  console.log(req.query);
  con.query(
    "select * from `info` where `id` = ?;",
    [req.query.id],
    function (err, results) {
      if (err) throw err;
      console.log(results);
      res.send(
        `First Name: ${results[0].firstname}, Last Name: ${results[0].lastname} `
      );
    }
  );
});

//address of selected id
app.get("/address", (req, res) => {
  console.log(req.query);
  con.query(
    "select * from `info` where `id` = ?;",
    [req.query.id],
    function (err, results) {
      if (err) throw err;
      console.log(results);
      res.send(
        `Address 1: ${results[0].address1}, Address 2: ${results[0].address2} `
      );
    }
  );
});

//contact (phone, email)
app.get("/contact", (req, res) => {
  console.log(req.query);
  con.query(
    "select * from `info` where `id` = ?;",
    [req.query.id],
    function (err, results) {
      if (err) throw err;
      console.log(results);
      res.send(`Phone: ${results[0].phone}, Email: ${results[0].email} `);
    }
  );
});

//end point (display on terminal)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});