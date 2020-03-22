import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom';

export class GenreView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { genre } = this.props;

    if (!genre) return null;

    return (
      <Card className="genre-card">
        <Card.Body>
          <Card.Title className="genre-title">{genre.Name}</Card.Title>
          <Card.Text>
            Description: {genre.Description}
          </Card.Text>
          <Link to={`/`}>
            <Button>Back</Button>
          </Link>
        </Card.Body>
      </Card>
    )
  }
}