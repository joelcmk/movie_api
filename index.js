const express = require('express');
const morgan =require('morgan');
const app = express();

var topMovies = [{
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
  year: '2013'
},
{
  name: 'Spirited Away',
  year: '2001'
}
]

app.use(morgan('common'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
})

// GET request
app.get('/', function(req, res) {
  res.send('Welcome to MyFlix')
});
app.get('/movies', function(req, res) {
  res.json(topMovies)
});
app.use(express.static('public'));

// Listen for requests
app.listen(8080, () =>
  console.log('My app is listen on port 8080')
);
