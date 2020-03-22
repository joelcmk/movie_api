import React from 'react';
import Card from 'react-bootstrap/Card';

export class DirectorView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { director } = this.props;

    if (!director) return null;

    return (
      <Card className="director-card">
        <Card.Body>
          <Card.Title>{director.Name}</Card.Title>
          <Card.Text>
            Bio: {director.Bio}
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}