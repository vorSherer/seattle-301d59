/* eslint-disable no-undef */

'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();

// my libraries
const handleLocation = require('./lib/handleLocation');
const client = require('./lib/client');
const handleWeather = require('./lib/handleWeather');

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/location', handleLocation);
app.get('/weather', handleWeather);


app.get('/trails', (request,response) => {

  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let urlTrail = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_API_KEY}`

  superagent.get(urlTrail)
    .then(superagentResults => {
      const theTrail = superagentResults.body.trails.map(trail => {
        return new Trail(trail)
      })
      response.status(200).send(theTrail);
    })
    .catch(err => console.error(err))
});

function Trail (obj) {
  this.name = obj.name ;
  this.location = obj.location;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionsStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}


app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})


client.connect()
  .then (() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  })



