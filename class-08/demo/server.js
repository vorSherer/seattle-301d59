'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3001;

// connect to the Database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err))

app.get('/add', (request, response) => {
  // get some info and add it to the database
  let first = request.query.first;
  let last = request.query.last;

  console.log(first, last);
  let sql = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2);';
  let safeValues = [first, last];

  client.query(sql, safeValues);
})

app.get('/select', (request, response) => {
  // see everything in the table

  let sql = 'SELECT * FROM people;';
  client.query(sql)
    .then(sqlResults => {
      response.send(sqlResults.rows);
    })
})

// only turn on the server if you first connect to the database
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening to ${PORT}`);
    })
  })