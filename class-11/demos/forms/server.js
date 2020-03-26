// GOAL: collect information from the form and send the thank you page

//1. serve your form from the public folder using app.use(express.static('./public'))

// 2. make sure you have a body parser

// 3. do an app.post on '/contact' (the action that your form has ).
'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

const PORT = process.env.PORT || 3001;

app.post('/contact', (request, response) => {
  console.log('this is my request.body', request.body);
  // { first_name: 'Lena',
  // last_name: 'Eivy',
  // message: 'yo',
  // phone: '123-456-7890',
  // contact: 'email' }
  response.sendFile('./thanks.html', {root: './public'});
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})