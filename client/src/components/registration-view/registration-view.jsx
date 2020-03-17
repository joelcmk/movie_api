import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthday);
    /* Send a request to the server for authentication */
    props.onSignedIn(username)
  };


  return (

    <Container className='loginContainer'>
      <h1>Creare a new account!</h1>
      <form>
        <Form.Group controlId="formBasicUsename">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" placeholder="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
        </Form.Group>
        <Button className='loginButton' onClick={handleSubmit}>
          Submit
     </Button>
      </form>
    </Container>
  );
}