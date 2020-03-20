'use strict';

const client = require('./client');
require('dotenv').config();
const superagent = require('superagent');

function checkTheDataBase(city, response){
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
}

function City(obj, city){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

module.exports = checkTheDataBase;