/* eslint-disable no-console */
import React, { useState } from 'react';
import fire from '../config/fire';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(u => {
        console.log(u);
      })
      .catch(err => {
        console.log(err);
      });
    setEmail('');
    setPassword('');
  };

  const handleSignup = () => {
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(u => {
        console.log(u);
      })
      .catch(err => {
        console.log(err);
      });
    setEmail('');
    setPassword('');
  };
  return (
    <div>
      <p>Login Component!</p>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
      />
      <div onClick={handleLogin}>Login!</div>
      <div onClick={handleSignup}>SignUp!</div>
    </div>
  );
};

export default Login;
