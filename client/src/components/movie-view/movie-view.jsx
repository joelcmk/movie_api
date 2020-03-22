import React from 'react';
import Button from 'react-bootstrap/Button'

import { Link } from 'react-router-dom';

import './movie-view.scss'

export class MovieView extends React.Component {

  constructor() {
    super()

    this.state = {};
  }


  render() {
    const { movie, onClick } = this.props;
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
      </div >
    );
  }
}