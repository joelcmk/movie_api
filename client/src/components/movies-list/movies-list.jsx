import React from 'react';
import { connect } from 'react-redux';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './movies-list.scss'

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.toLowerCase().includes(visibilityFilter.toLowerCase()));
  }

  if (!movies) return <div className="main-view" />;

  return <div className="movies-list">
    <div className="filter">
      <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    </div>
    <Container>
      <Row>
        {filteredMovies.map(m => (
          <Col key={m._id} >
            <MovieCard key={m._id} movie={m} />
          </Col>
        ))}
      </Row>
    </Container>

  </div>;
}


export default connect(mapStateToProps)(MoviesList);