import React, { userState } from 'react';

export function LoginView(props) {
  const [username, setUsername] = userState('');
  const [password, setPassword] = userState('');

  const handleSubmit = () => {
    console.log(username, password);
    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */
  };

  return (
    <form>
      <label>
        Username:
        <input type="text" value="{username}" onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="text" value="{password}" onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="button" onClick={handleSubmit}>Submit</button>
    </form>
  )
}