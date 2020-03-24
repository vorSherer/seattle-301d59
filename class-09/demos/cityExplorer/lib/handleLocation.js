'use strict';

const checkTheDataBase = require('./checkTheDataBase');

function handleLocation(request,response){

  // first get the city
  let city = request.query.city;

  checkTheDataBase(city, response);



};


module.exports = handleLocation;