/* eslint-disable no-undef */

'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;





const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', err => console.error(err));

client.connect()
  .then (() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  })

// eslint-disable-next-line no-unused-vars
app.get('/location', (request,response) => {

  // first get the city
  let city = request.query.city;

  // look in the database to see if the city is in database
  let sql = 'SELECT * FROM city_explorer_table WHERE search_query=$1;';
  let safeValues = [city];
  client.query(sql, safeValues)
    .then(results => {
      // if the city we are searching for is in the database, it will be the first thing in the results.rows
      if(results.rows.length > 0){
        console.log(results.rows)
  
        console.log('I found data in the database');
        // if it is in database, return that information
        response.send(results.rows[0]);
      } else {
        // if it is not in the database, go to the  API to get the inforation 
        let urlGeo = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        
        superagent.get(urlGeo)
        .then(superagentResults => {
          let geo = superagentResults.body;
          let location = new City (geo[0],city);

          console.log('my location object',location)
          response.status(200).send(location);
          // insert that information into the database
          let sql = 'INSERT INTO city_explorer_table (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
          let safeValues = [city, location.formatted_query, location.latitude, location.longitude];
          client.query(sql, safeValues);

          })
        .catch(err => console.error(err))
        
      }
    })



});

app.get('/weather', (request,response) => {

  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let urlWeather = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`

  superagent.get(urlWeather)
    .then(superagentResults => {
      let weather = superagentResults.body;
      let weatherArr = weather.daily.data;
      const forecastArr =  weatherArr.map(day => {
        return new Weather(day)
      })

      response.status(200).send(forecastArr);
    })
    .catch(err => console.error(err))
});

/// weather

function Weather(obj) {
  this.time = new Date(obj.time * 1000).toDateString()
  this.forecast = obj.summary;
}



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

function City(obj, city){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})





