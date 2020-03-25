import React from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

import './profile-view.scss';

import { Link } from 'react-router-dom';


export class ProfileView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      userData: null,
      favouriteMovies: [],
      movies: []
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

  deleteFavorite(movieId) {
    axios.delete(`https://my-flix-app0.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movieId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        document.location.reload(true);
      })
      .then(res => {
        alert('Movie successfully deleted from favorites');
      })

      .catch(e => {
        alert('Movie could not be deleted from favorites ' + e)
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
    const { movies } = this.props;

    const favoritesList = movies.filter(movie => favouriteMovies.includes(movie._id));

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
            <div>

            </div>
          </Card.Text>
          <div className="profile-btns">
            <Link to={`/update/${username}`}>
              <Button className="profile-btn">Update my profile</Button>
            </Link>
            <Button className="profile-btn" onClick={() => this.deleteProfile()}>Delete my profile</Button>
          </div>
        </Card.Body>
        <ListGroup.Item className="favorite-card">Favorite Movies:
             <div>
            {favouriteMovies.length === 0 &&
              <div className="value">No Favorite Movies have been added</div>
            }
            {favouriteMovies.length > 0 &&
              <ul className="ml-0 pl-0">
                {favoritesList.map(movie =>
                  (
                    <li key={movie._id} className="mb-2 ">
                      <span className="d-flex align-items-center">
                        <Button className="delete-btn" onClick={e => this.deleteFavorite(movie._id)}>Delete</Button>
                        <Link to={`/movies/${movie._id}`}>
                          <span className="link"> {movie.Title}</span>
                        </Link>

                      </span>
                    </li>
                  ))}
              </ul>
            }
          </div>
        </ListGroup.Item>
      </Card >
    )
  }
}
