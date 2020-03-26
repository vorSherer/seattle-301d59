//GOAL for today: 
  //1. Go to google books API and get get books either by author or by title. 
  //2. Display them using ejs.

//OVERALL GOAL: 
  //1. get books from google API, 
  //2. dispaly them using ejs, 
  //3. save the ones you want to a database. 
  //4. Dispaly those saved books to your home page. 
  //5. Be able to update a book's information (like the title and author), and 
  //6. delete the book from your saved books. 
  //7. Also be able to view just an individual book when you click on it rather than just a list of all the books.

/////////////////////////////////////////////////
'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();
const superagent = require('superagent');

// middleware
// tells express that we are using ejs as our templating system
app.set('view engine', 'ejs');
// parses our request.body so that we can read form data when it comes in
app.use(express.urlencoded({extended:true}));
// serve my static files from my public directory
app.use(express.static('./public'));

const PORT = process.env.PORT || 3001;

// routes
app.get('/', (request, response) => {
  // render my index.ejs page
  response.render('./index.ejs');
})

app.get('/bananas', (request, response) => {
  // render my searches/new.ejs page (my search page)
  response.render('./searches/new.ejs')
})

app.post('/searches', (request, response) => {
  console.log(request.body);
  // { search: [ '1984', 'title' ] }
  let thingTheyAreSearchingFor = request.body.search[0];
  let titleOrAuthor = request.body.search[1];

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(titleOrAuthor === 'title'){
    url += `+intitle:${thingTheyAreSearchingFor}`;
  } else if(titleOrAuthor === 'author'){
    url += `+inauthor:${thingTheyAreSearchingFor}`;
  }

  superagent.get(url)
    .then(results => {
      let bookArray = results.body.items;
      let finalBookArray = bookArray.map(book => {
        return new Book(book.volumeInfo);
      })
      // send this array of book objects into searches.ejs and render it from there
      // response.status(200).send(finalBookArray);
    })
})

function Book(obj){
  const placeholderImage = 'http://i.imgur.com/J5LVHEL.jpg';

  this.title = obj.title;
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})


// collect information from the form on my search page
// use that information to go to google books API
// search by either title OR author
  // render the results to a searches.ejs page