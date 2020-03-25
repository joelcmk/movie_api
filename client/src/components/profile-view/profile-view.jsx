import React from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

import './profile-view.scss';

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
      favouriteMovies: []
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
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favouriteMovies: response.data.Favorite
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteMovieFromFavs(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios.delete(`https://my-flix-1098.herokuapp.com/users/${localStorage.getItem('user')}/Favourites/${favoriteMovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Oops... something went wrong...');
      });
  }

  handleChanges(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  deleteProfile() {
    axios.delete(`https://my-flix-app0.herokuapp.com/users/${localStorage.getItem('user')}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        alert('Do you really want to delete your account?')
      })
      .then(res => {
        alert('Account was succesfully deleted')
      })
      .then(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('user')

        this.setState({
          user: null
        })
        window.open('/', '_self');
      })
      .catch(e => {
        alert('Account could not be deleted ' + e)
      })
  }

  render() {

    const { username, email, birthday, favouriteMovies } = this.state;

    return (
      <Card className="profile-card">
        <Card.Body className="profile-card2">
          <Card.Title className="title">My Profile</Card.Title>
          <Card.Text>
            <div>
              <span>Username: {username}</span>
            </div>
            <div>
              <span>Email: {email}</span>
            </div>
            <div>
              <span>Password: ********</span>
            </div>
            <div>
              <span>Birthday: {birthday}</span>
            </div>
          </Card.Text>
          <div className="profile-btns">
            <Link to={`/update/${username}`}>
              <Button className="profile-btn">Update my profile</Button>
            </Link>
            <Button className="profile-btn" onClick={() => this.deleteProfile()}>Delete my profile</Button>
          </div>
        </Card.Body>
        <div>
          <ListGroup.Item>Favourite Movies:
             <div>
              {favouriteMovies.length === 0 &&
                <div className="value">No Favourite Movies have been added</div>
              }
              {favouriteMovies.length > 0 &&
                <ul>
                  {favouriteMovies.map(favoriteMovie =>
                    (<li key={favoriteMovie}>
                      <p className="favouriteMovies">
                        {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === favoriteMovie).Title}
                      </p>
                      <Link to={`/movies/${favoriteMovie}`}>
                        <Button size="sm" variant="info">Open</Button>
                      </Link>
                      <Button variant="secondary" size="sm" onClick={(event) => this.deleteMovieFromFavs(event, favoriteMovie)}>
                        Delete
                        </Button>
                    </li>)
                  )}
                </ul>
              }
            </div>
          </ListGroup.Item>
        </div>
      </Card >
    )
  }
}