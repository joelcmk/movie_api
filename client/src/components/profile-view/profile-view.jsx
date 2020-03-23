import React from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom';

export class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      userData: null,
      favoriteMovies: []
    };
  }

  componentDidMount() {
    //authentication 
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken)
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://my-flix-app0.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Usename,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favouriteMovies: response.data.Favorites
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteMovieFromFavs(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios.delete(`https://my-flix-app0.herokuapp.com/users/${localStorage.getItem('user')}/Favorites/${favoriteMovie}`, {
      headers: { Autorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Opss... Something went wrong');
      });
  }

  handleChanges(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {

    const { username, email, birthday, favoriteMovies } = this.state;

    return (
      <Card>
        <Card.Title>My Profile</Card.Title>
        <Card.Text>
          <span>Username: {username}</span>
        </Card.Text>
      </Card>
    )
  }
}