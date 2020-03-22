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
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>
        <div className="movie-genre">
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link>
          <span className="label">Genre: </span>
          <span className="value">{movie.Genre.Name}</span>
        </div>
        <div className="movie-director">
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link>
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
        </div>
        <Link to={`/`}>
          <Button className="back-button" onClick={() => onClick()} className="back-button">Back</Button>
        </Link>
      </div >
    );
  }
}