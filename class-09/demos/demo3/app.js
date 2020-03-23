'use strict';

const hours = ['7am', '8am', '9am'];

const Store = function(location, min, max, avg) {
  this.location = location;
  this.minCustomersPerHour = min;
  this.maxCustomersPerHour = max;
  this.avgCookiesPerCustomer = avg;
  this.projections = {};
  this.projectSales();
  Store.stores.push(this);
};
Store.stores = [];

const utilities = {};

utilities.randomNumberBetween = function(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Store.prototype.projectSales = function() {
  hours.forEach( (hour) => {
    this.projections[hour] = utilities.randomNumberBetween(this.minCustomersPerHour, this.maxCustomersPerHour) * this.avgCookiesPerCustomer;
  });
};

const pike = new Store('Pike Place', 5, 10, 2.5);

console.log(pike);