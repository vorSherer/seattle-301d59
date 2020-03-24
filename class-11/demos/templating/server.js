'use strict';

const express = require('express');
let ejs = require('ejs');
const app = express();
require('dotenv').config();

//middleware
app.use(express.static('./public')); // serve my css files
app.set('view engine', 'ejs');

//global variables
const PORT = process.env.PORT || 3001;

const list = ['toilet paper', 'hand santizer', 'face masks', 'lysol', 'tofu', 'ramen', 'coffee', 'whisky'];

const quantities = [
  {name: 'toilet paper', quantity: 10},
  {name: 'hand santizer', quantity: 4},
  {name: 'face masks', quantity: 100},
  {name: 'lysol', quantity: 2},
  {name: 'tofu', quantity: 0},
  {name: 'ramen', quantity: 30},
  {name: 'coffee', quantity: 3},
  {name: 'whisky', quantity: 3}
]

// routes
app.get('/', (request, response) => {
  response.render('index.ejs');
})

// /list => render a list of groceries => GET
app.get('/list', (request, response) => {
  response.render('list.ejs', {myKey: list })
})

// /quantities => render a list of groceries and their quantities => GET
app.get('/quantities', (request, response) => {
  response.render('quantities.ejs', {yourKey: quantities})
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
