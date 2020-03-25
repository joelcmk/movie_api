import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update'


import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { Link } from 'react-router-dom';

import './main-view.scss';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
    };
  }

  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('https://my-flix-app0.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    })
    window.open('/', '_self');
  }


  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie, user, register } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <nav class="navbar navbar-expand-sm navbar-dark">
          <a routerLink="/" class="navbar-brand" href="/">MyFlix</a>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Link to={`/users/${user}`}>
                <a class="nav-link">{user}</a>
              </Link>
            </li>
            <li class="nav-item">
              <Button className="nav-btn" onClick={() => this.onLogOut()}>Sign Out</Button>
            </li>
          </ul>
        </nav>
        <Container>
          <Row>
            <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return movies.map(m => <MovieCard key={m._id} movie={m} />)
            }
            } />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
            <Route path="/genres/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
            }
            } />
            <Route path="/directors/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
            }
            } />
            <Route path="/users/:Username" render={() => <ProfileView />} />
            <Route exact path="/update/:Username" render={() => <ProfileUpdate user={user} />} />
          </Row>
        </Container>
      </Router >
    );
  }
}