import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import './login-view.scss';
import axios from 'axios';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('https://my-flix-evagrean.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };


  return (
    <Container className="loginContainer">
      <h1>Welcome!</h1>
      <Form>
        <Form.Label>Username: </Form.Label>
        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <Form.Label>Password: </Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button className="loginButton" type="button" onClick={handleSubmit}>Submit</Button>
        <div className="button-div">
          New User? Register<Button className="registerButton" type="button" onClick={() => props.onClick()}>Here</Button>
        </div>
      </Form>
    </Container>
    /*
        <Container className='loginContainer'>
          <h1>Welcome!</h1>
          <form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={username} onChange={e => setUsername(e.target.value)} />
              <Form.Text className="emailShare">
                We'll never share your email with anyone else.
           </Form.Text>
            </Form.Group>
    
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button id='loginButton' onClick={handleSubmit}>
              Log in
         </Button>
    
            <Form.Group controlId='newUser'>
              <Form.Text>New User? Click <Button id='registerButton' onClick={() => props.onClick()}> Here! </Button>
              </Form.Text>
            </Form.Group>
          </form>
        </Container>
        */
  );
}