const express = require('express'),
  bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let Movies = [{
  name: 'Citizen Kane',
  year: '1941'
},
{
  name: 'The Godfather',
  year: '1972'
},
{
  name: 'Manchester by the Sea',
  year: '2016'
},
{
  name: 'Rosemary\'s Baby',
  year: '1968'
},
{
  name: 'The Maltese Falcon',
  year: '1941'
},
{
  name: 'Ratatouille',
  year: '2006'
},
{
  name: 'A Streetcar Named Desire',
  year: '1951'
},
{
  name: 'Mean Streets',
  year: '1973'
},
{
  name: 'Gravity',
  year: '2013',
  director: 'test',
  genere: 'Action'
},
{
  name: 'Spirited Away',
  year: '2001',
  genere: 'Terror'
}
];

let Users = [{
  name: 'Mark',
  password: '123',
  email: 'ahah@hak.com'
},
{
  name: 'Casey',
  password: '373',
  email: 'dd@dn.com'
}];



// Gets the list of data about all the movies
app.get("/movies", (req, res) => {
  res.json(Movies);
});

//Gets the data about a movie, by name
app.get("/movies/:name", (req, res) => {
  res.json(Movies.find( (movies) =>
    { return movies.name === req.params.name   }));
});

//Gets the genere of a movie, by name
app.get("/movies/:name/genere", (req, res) => {
  let movie = Movies.find((movie) => { return movie.name === req.params.name });
  if (movie) {
    res.json(movie.genere)
  }
});

//Gets the director of the movie, by name
app.get('/movies/:name/director', (req, res) => {
  let movie = Movies.find((movie) => { return movie.name === req.params.name });
  if (movie) {
    res.json(movie.director)
  }
});

//Add new users
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

//Update User info
app.put('/users/:user/info', (req, res) => {
  let user = Users.find((user) => { return user.name === req.params.name });

  if (user) {
    res.status(201).send('The user:' + user.name + 'updated the password' + user.password + 'was assigned the email:' + user.email + 'and the date of birth:' +user.birth + '!');
  } else {
    res.status(404).send('The user was not found.')
  }
});

//Add a list to the list of favorites
app.post('/users/:user/favorites', (req, res) => {
  let user = Users.find((user) => { return user.name === req.params.name});
  let favoriteMovie = req.body;

  if (!favoriteMovie.name) {
    const message = 'Missing Username'
    res.status(400).send(message)
  } else {
    user.favorites.push(favoriteMovie)
    res.status(201).send(favoriteMovie)
  }
});

//Remove a movie from the list of favorites.
app.delete('/users/:user/favorites/:name', (req, res) => {
  let favorites = Users.find((favorites) => { return favorites.name === req.params.name});
  let movie = Movies.find((movie) => { return movie.name === req.params.name});

  if (movie) {
    res.status(201).send('' + movie.name + ' was deleted.')
  }
});

//Remove user
app.delete('/users/:name', (req, res) => {
  let user = Users.find((user) => { return user.name === req.params.name });

  if(user) {
    Users.filter(function(obj){ return obj.name !== req.params.name });
    res.status(201).send('The username: ' +req.params.name+ ' was deleted.')
  }
});

app.use(express.static('public'));



// Listen for requests
app.listen(8080, () =>
  console.log('My app is listen on port 8080')
);
