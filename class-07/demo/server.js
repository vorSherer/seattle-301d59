'use strict';

// libraries
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');

// global variables
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;

  // go to location IQ, get real data about the location that the user entered and send it to the front end

  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;

  superagent.get(url)
    .then(superagentResults => {
      console.log(superagentResults.body);
      let geo = superagentResults.body;
      let location = new City(geo[0], city);
      response.send(location);
    })
    .catch(err => console.error(err)); 
  })

function City(obj, city){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})