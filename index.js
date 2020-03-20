const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
require('./passport');
const { check, validationResult } = require('express-validator');
const cors = require('cors');


//mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://myFlixDBadmin:Newyork_12@cluster0-3ykus.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

var auth = require('./auth')(app);

app.use(express.static('public'));

// Specifies that app uses CORS - default: allows requests from all origins
app.use(cors());


// Allowing only certain origins to be given access
var allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // if specific origin isn't found on list of allowed origins
        var message =
          'The CORS policy for this application doesn´t allow access from origin' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  })
);


// Gets the list of data about all the movies
app.get("/movies", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    }).catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Gets the data about a movie, by name
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      res.json(movie)
    })
    .catch(function (err) {
      res.status(500).send("Error: " + err);
    });
});

//Gets the genere of a movie, by name
app.get("/movies/:Title/Genre", passport.authenticate('jwt', { session: false }), function (req, res) {
  let movie = Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      res.json(movie.Genre)
    })
    .catch(function (err) {
      res.status(500).send("Error: " + err)
    });
});

//Gets the director of the movie, by name
app.get("/movies/:Title/Director", passport.authenticate('jwt', { session: false }), function (req, res) {
  let movie = Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      res.json(movie.Director)
    })
    .catch(function (err) {
      res.status(500).send("Error: " + err)
    });
});

//Get a list of all the users
app.get("/users", function (req, res) {
  Users.find().then(movies => res.json(movies));
});

//Add new users
app.post('/users',
  [check('Username', 'Username is required').isLength({ min: 4 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then(function (user) {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(function (user) { res.status(201).json(user) })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

//Update User info
app.put('/users/:Username',
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()],
  passport.authenticate('jwt', { session: false }), function (req, res) {

    //Check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Delete a movie from the list of favorites
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $pull: { Favorite: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { Favorite: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});
