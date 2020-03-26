'use strict';

// external libraries
require('dotenv').config();
const pg = require('pg');
const express = require('express')
const app = express();
require('ejs');
const methodOverride = require('method-override');

// middleware

app.use(express.static('./public'));

// this is the robber who checks if the imcomming request has a body, if it does, it parses it so we can read it
app.use(express.urlencoded({extended:true}));

// tells the servers to use ejs templating - aka look in the views folders for .ejs files to render
app.set('view engine', 'ejs');

// lets us transform a post on the front end into a put
app.use(methodOverride('_method'));

// database connection
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;

// routes
app.get('/', getAllTasks);
app.get('/add', displayAddATask);
app.post('/add', addTask);
app.get('/tasks/:task_id', getOneTask);
app.put('/update/:task_id', updateTask);
app.get('*', (request, response) => {
  response.status(404).send('this page does not exist')
})

function getAllTasks(request, response){
  // go to the database, get all the tasks, and render them to the index.ejs page

  let sql = 'SELECT * FROM tasks;';

  client.query(sql)
    .then(results => {
      let tasks = results.rows;
      response.render('./index', {taskArray: tasks})
    })
}

function displayAddATask(request, response){
  // render the add-view.ejs page ( this is the form that adds a task )
  response.render('./pages/add-view.ejs');
}

function addTask(request, response){
  // collect the information from the form, run it through a constructor and add it to the database
  // redirect to the homepage

  let {title, description, category, contact, status} = request.body;

  let sql = 'INSERT INTO tasks (title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5);';

  let safeValues = [title, description, category, contact, status];

  client.query(sql, safeValues)
    .then(() => {
      response.redirect('/');
    })


}

function getOneTask(request, response){
  // when I click on a task, I get details of just that one tasks by the id from the DB

  let id = request.params.task_id;

  let sql = 'SELECT * FROM tasks WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(results => {
      let task = results.rows[0];
      response.render('./pages/detail-view.ejs', {task: task});
    })
}

function updateTask(request, response){
  // get the id from the params
  let id = request.params.task_id;
  // console.log(request.body)

  let {title, description, contact, status} = request.body;

  // search the database for the the id that matches
  let sql = 'UPDATE tasks SET title=$1, description=$2, contact=$3, status=$4 WHERE id=$5;';
  let safeValues = [title, description, contact, status, id];

  // update the information in the database
  client.query(sql, safeValues)
    .then(() => {
      // redirect to the task
      // find the task in the database
      let newSql = 'SELECT * FROM tasks WHERE id=$1;';
      let safeValues = [id];
      
      client.query(newSql, safeValues)
      .then(results => {
        console.log(results.rows)
        // render that task to the detail page
        response.render('./pages/detail-view', {task: results.rows[0]})
        })
    })
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })