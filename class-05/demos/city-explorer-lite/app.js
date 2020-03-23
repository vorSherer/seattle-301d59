'use strict';
// goal: render the weather data from the json file to the page

// get the data using ajax
$.ajax('./city-weather-data.json', {method:'GET', datatype:'JSON'})
  .then(weatherData => {
    let weatherArray = weatherData.data;
    weatherArray.forEach(day => {
      new RainMaker(day).render();
    })
  })

let weather = [];
// run it through a constructor function
function RainMaker(obj){
  this.time = new Date(obj.time);
  this.description = obj.summary;

  weather.push(this);
}

RainMaker.prototype.render = function(){
  let bananas = $('#weather-results-template').html();
  let apples = Handlebars.compile(bananas);

  var html = apples(this);

  $('#weather-container').append(html);
}


// render it using Handlebars