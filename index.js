const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true});

const app = express();

app.use(bodyParser.json());


// Gets the list of data about all the movies
app.get("/movies", function(req, res) {
  Movies.find().then(movies => res.json(movies));
});

//Get a list of all the users
app.get("/users", function(req, res) {
  Users.find().then(movies => res.json(movies));
});

//Gets the data about a movie, by name
app.get("/movies/:Title", function(req,res) {
  Movies.findOne({Title : req.params.Title })
  .then (function (movie) {
    res.json(movie)
  })
  .catch(function(err) {
    res.status(500).send("Error: " + err);
  });
});

//Gets the genere of a movie, by name
app.get("/movies/:Title/Genre", function(req, res) {
    let movie = Movies.findOne({ Title : req.params.Title })
  .then (function (movie) {
    res.json(movie.Genre)
  })
  .catch(function(err) {
    res.status(500).send("Error: " + err)
  });
});

//Gets the director of the movie, by name
app.get("/movies/:Title/Director", function(req, res) {
  let movie = Movies.findOne({ Title : req.params.Title })
  .then (function (movie) {
    res.json(movie.Director)
  })
  .catch(function(err) {
    res.status(500).send("Error: " + err)
  });
});

//Add new users
app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//Update User info
app.put('/users/:Username', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $set :
    {
      Username : req.body.Username,
      Password : req.body.Password,
      Email : req.body.Email,
      Birthday : req.body.Birthday
    }},
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " +err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Delete a user by username
app.delete('/users/:Username', function(req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Delete a movie from the list of favorites
app.delete('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username },
    { $pull : { Favorite : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username },
    { $push : { Favorite : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

app.use(express.static('public'));

// Listen for requests
app.listen(8080, () =>
  console.log('My app is listen on port 8080')
);
