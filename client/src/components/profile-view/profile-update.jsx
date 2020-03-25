import React, { useState } from 'react';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './profile-view.scss'

export function ProfileUpdate(props) {
  const { user } = props;

  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');
  const [email, updateEmail] = useState('');
  const [birthday, updateBirthday] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://my-flix-app0.herokuapp.com/users/${user}`, {
      Username: username,
      Password: password,
      Birthday: birthday,
      Email: email
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        const data = res.data;
        alert('Your profile was updated Succesfully');
        localStorage.setItem('user', data.Username);
        window.open(`/users/${localStorage.getItem('user')}`, `_self`)
      })
  }

  return (
    <Container className="container-update">
      <Form className="update-form">
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control required type="text" placeholder="Update username or repeat original" onChange={e => updateUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" placeholder="Update password or repeat original" onChange={e => updatePassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control required type="text" placeholder="Update your email adress or repeat original" onChange={e => updateEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicBirthday">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control required type="date" placeholder="Update your birthday or repeat original" onChange={e => updateBirthday(e.target.value)} />
        </Form.Group>
        <Row className="justify-content-center">
          <Button className="update-btn mr-3 profile-btn" variant="primary" type="submit" onClick={handleUpdate}>Update</Button>
        </Row>
      </Form>
    </Container>
  )
}