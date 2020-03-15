import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';

import './login-view.scss';


export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(username, password);
    /* Send a request to the server for authentication */
    props.onLoggedIn(username)
  };


  return (
    /*
    <Form>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <Button type="button" onClick={handleSubmit}>Submit</Button>
      <div>
        New User? Register<Button type="button" onClick={() => props.onClick()}>Here</Button>
      </div>
    </Form>
    */
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
          <Form.Control type="password" placeholder="Passwordy" value={password} onChange={e => setPassword(e.target.value)} />
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
    /*
    <Form>
       <Form.Group controlId="formBasicEmail">
         <Form.Label>Email address</Form.Label>
         <Form.Control type="email" placeholder="Enter email" />
         <Form.text className="text-muted">
           We'll never share your email with anyone else.
         </Form.text>
       </Form.Group>
     </Form> 
     */
  );
}