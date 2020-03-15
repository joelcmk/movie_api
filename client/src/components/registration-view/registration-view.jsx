import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(username, password);
    /* Send a request to the server for authentication */
    props.onLoggedIn(username)
  };


  return (

    <Container className='loginContainer'>
      <h1>Creare a new account!</h1>
      <form>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" placeholder="Birthday" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button id='loginButton' onClick={handleSubmit}>
          Submit
     </Button>
      </form>
    </Container>
  );
}