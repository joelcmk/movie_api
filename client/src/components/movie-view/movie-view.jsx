import React from 'react';
import Button from 'react-bootstrap/Button'

import axios from 'axios';
import { Link } from 'react-router-dom';

import './movie-view.scss';

export class MovieView extends React.Component {

  constructor() {
    super()

    this.state = {};
  }

  addToFavorites(e) {
    const { movie } = this.props;
    e.preventDefault();
    axios.post(`https://my-flix-app0.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movie._id}`,
      {
        username: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        alert(`${movie.Title} successfully added to your favorites`);
      })
      .then(res => {
        document.location.reload(true);
      })
      .catch(error => {
        alert(`${movie.Title} not added to your favorites` + error)
      });
  }

  render() {
    const { movie, onClick } = this.props;
    console.log(movie)
    if (!movie) return null;
    return (
      <div className="movie-view">
        <img className="movie-poster" src={movie.ImagePath} />
        <div className="movie-title">
          <span className="value">{movie.Title}</span>
          <br />
          <br />
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>
        <div className="movie-genre">
          <span className="label">Genre: </span>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">{movie.Genre.Name}</Button>
          </Link>
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">{movie.Director.Name}</Button>
          </Link>
        </div>
        <Link to={`/`}>
          <Button className="back-button">Back</Button>
        </Link>
        <Button className="favorite-btn" onClick={e => this.addToFavorites(e)}>
          Add to my favorites
        </Button>
      </div >

    );
  }
}