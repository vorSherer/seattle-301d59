// GOAL: render each dog and their info to the index page
  // constructor function
let dogs = [];
function Dog(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.hobbies = obj.hobbies;
  dogs.push(this);
}
  // call a render method on each dog instance

Dog.prototype.render = function(){
  console.log('in the render function');
  // select all the html in the dog template
  let template = $('#dog-template').html();

  // make a new section tag
  let $section = $('<section></section>');

  // put the html from the template into the section
  $section.html(template);

  // find the h2 and assign it the name
  $section.find('h2').text(this.name);
  $section.find('p').text(this.hobbies);
  $section.find('img').attr('src', this.image_url);

  // append it to the main
  $('main').append($section);
}

  // $.ajax to get the information about the dogs
$.ajax('./data.json', {METHOD: 'GET', DATATYPE: 'JSON'})
  .then(data => {
    // loop over my array of object
    data.forEach(dog => {
      new Dog(dog).render();
    })
    // send them through the constructor
    // call the render method on each one
  })


