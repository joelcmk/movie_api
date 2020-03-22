import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

import { Link } from 'react-router-dom';

import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;

    return (
      <Container className="card-container">
        <Card style={{ with: '16rem' }}>
          <Card.Img className="card-img" variant="top" src={movie.ImagePath} />
          <Card.Body className="card-body">
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text className="card-text">{movie.Description}</Card.Text>
            <Link to={`/movies/${movie._id}`}>
              <Button className="open-card_button" variant="link">Open</Button>
            </Link>
          </Card.Body>
        </Card >
      </Container>

    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
}