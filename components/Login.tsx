import React, { useState } from 'react';
import { ENTER_KEY_CODE } from '../constants/keyCode';
import firebase from '../libs/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((u) => {
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
      });
    setEmail('');
    setPassword('');
  };

  const handleSignup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
      });
    setEmail('');
    setPassword('');
  };
  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="input-wrapper">
          <p>Email</p>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="input-wrapper">
          <p>Password</p>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              const { keyCode } = e;
              if (keyCode === ENTER_KEY_CODE) {
                handleLogin();
              }
            }}
          />
        </div>
        <div className="buttons-wrapper">
          <div onClick={handleLogin}>Login</div>
          <div onClick={handleSignup}>SignUp</div>
        </div>
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background-color: #e5e5e5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .form-wrapper {
          padding: 3rem;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
        .input-wrapper {
          width: 100%;
        }
        .input-wrapper p {
          margin: 0;
          padding: 0;
          font-weight: 600;
          color: #c4c4c4;
        }
        .input-wrapper input {
          width: 100%;
          margin-bottom: 1.5rem;
          border: none;
          border-bottom: 2px solid #c4c4c4;
          outline: none;
          height: 2rem;
        }
        .buttons-wrapper {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .buttons-wrapper div {
          background-color: #c4c4c4;
          color: white;
          border: 2px solid #c4c4c4;
          font-weight: 600;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .buttons-wrapper div:hover {
          background-color: white;
          color: #c4c4c4;
          border: 2px solid #c4c4c4;
        }
        .buttons-wrapper div:nth-child(1) {
          margin-right: 0.5rem;
        }
        .buttons-wrapper div:nth-child(2) {
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Login;
