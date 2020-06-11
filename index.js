const express = require('express'),
  app = express(),
  morgan = require('morgan')
bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
require('./passport');
const path = require('path');

// Specifies that app uses CORS - default: allows requests from all origins
app.use(cors());

// Allowing only certain origins to be given access
var allowedOrigins = ['https://my-flix-app0.herokuapp.com', 'http://localhost:8080', 'http://localhost:1234'];

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

//mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://myFlixDBadmin:Newyork_12@cluster0-3ykus.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);

// Morgan middleware library used to log all requests to the terminal
app.use(morgan('common'));

// Serve static file(s) in public folder
app.use(express.static('public'));
// routes all requests for the client to 'dist' folder
app.use('/client', express.static(path.join(__dirname, 'client/dist')));
// all routes to the React client
app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Body-parser middleware used to read the body of HTTP requests, expected in JSON format
app.use(bodyParser.json());

// Authentication middleware. (app) argument ensures that Express is available in auth.js file
const auth = require('./auth')(app);

//Movie section 

/**
 * return json objet with movies to the user <br>
 * enpoint Url: /movies <br>
 * no required param
 * @method getMovies
 * @param {string} endpoint
 * @param {function} authorization 
 * @example call the method
 * getMovies(token) {
 *  axios.get('https://my-flix-app0.herokuapp.com/movies', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   })
 *     .then(response => {
 *       this.props.setMovies(response.data);
 *     })
 *     .catch(function (error) {
 *       console.log(error);
 *     });
 * }
 * @example example respone of method:
 * {
 * "_id":ObjectId:("5e38da04dfaabec038532342"),
 * "Title":"Gladiator",
 * "Description":"A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
 * "Genre":{
 * "Name":"Action",
 * "Description":"Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, and frantic chases. Action films tend to feature a resourceful hero struggling against incredible odds, which include life-threatening situations, a villain, or a pursuit which usually concludes in victory for the hero (though a small number of films in this genre have ended in the victory for the villain instead)."
 * },
 * "Director":{
 * "Name":"Ridley Scott",
 * "Bio":"Described by film producer Michael Deeley as the very best eye in the business, director Ridley Scott was born on November 30, 1937 in South Shields, Tyne and Wear (then County Durham).",
 * "Birth":"1937"
 * },
 * "ImagePath":"https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png",
 * "Featured":true
 * }
 */

// Gets the list of data about all the movies
app.get("/Movies", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find().then(Movies => res.json(Movies));
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

//Get user profile by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

/**
 * create new user <br>
 * enpoint URL: /users <br>
 * POST request
 * @method createNewUser 
 * @param {string} enpoint
 * @param {object} userData
 * @example call method:
 * const handleRegister = (e) => {
 *   e.preventDefault();
 *   axios.post('https://my-flix-app0.herokuapp.com/users', {
 *     Username: username,
 *     Password: password,
 *     Email: email,
 *     Birthday: birthday
 *   })
 *     .then(response => {
 *       const data = response.data;
 *       console.log(data);
 *       window.open('/client', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
 *     })
 *     .catch(e => {
 *       console.log('error registering the user')
 *     });
 * };
 * @example example response 
 * {"_id":ObjectId(5e39962adfaabec038532348"),
 * "Username":"yulissa",
 * "Password":"0811",
 * "Email":"yulissach@gmail.com",
 * "Birth_Date": 1997-08-12,
 * "Favorite": Array
 * }
 */

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

/**
 * update the user info (user, password, email and date of birth) <br>
 * endpoint URL: /:Username <br>
 * PUT request
 * @method updateUserData
 * @param {string} endpoint
 * @param {function} authorization
 * @param {object} newUserData
 * @example call method:
 * const handleUpdate = (e) => {
 * e.preventDefault();
 * axios.put(`https://my-flix-app0.herokuapp.com/users/${user}`, {
 *   Username: username,
 *   Password: password,
 *   Birthday: birthday,
 *   Email: email
 * }, {
 *   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
 * })
 *   .then(res => {
 *     const data = res.data;
 *     alert('Your profile was updated Succesfully');
 *     localStorage.setItem('user', data.Username);
 *     window.open(`/users/${localStorage.getItem('user')}`, `_self`)
 *   })
 * }
 * @example example response:
 * Your profile was updated Succesfully
 */

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

/**
 * delete a profile <br>
 * enpoint URL: /user/:Username <br>
 * DELETE request
 * @method deleteProfile
 * @param {string} endpoint
 * @param {function} authorization
 * @example calling the method: 
 * deleteProfile() {
 * axios.delete(`https://my-flix-app0.herokuapp.com/users/${localStorage.getItem('user')}`,
 *   {
 *     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
 *   })
 *   .then(res => {
 *     alert('Do you really want to delete your account?')
 *   })
 *   .then(res => {
 *     alert('Account was succesfully deleted')
 *   })
 *   .then(res => {
 *     localStorage.removeItem('token');
 *     localStorage.removeItem('user')
 *
 *     this.setState({
 *       user: null
 *     })
 *     window.open('/', '_self');
 *   })
 *   .catch(e => {
 *     alert('Account could not be deleted ' + e)
 *   })
 * }
 * @example example response: 
 * Profile was deleted 
 */

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
app.post('/users/:Username/Movies/:MovieID', function (req, res) {
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
