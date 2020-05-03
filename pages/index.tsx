import React, { useState, useEffect } from 'react';
import fire from '../config/fire';
import Login from '../components/Login';
import App from '../components/App';

const Home = () => {
  const [state, setState] = useState<{ user: any | null }>({ user: null });

  useEffect(() => {
    fire.auth().onAuthStateChanged(loginUser => {
      if (loginUser) {
        setState({ user: loginUser });
      } else {
        console.log('loginUser is null');
        setState({ user: null });
      }
    });
  });
  return <div>{state.user ? <App /> : <Login />}</div>;
};

export default Home;
