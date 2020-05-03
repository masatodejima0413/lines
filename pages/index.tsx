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
  return (
    <div>
      {state.user ? <App /> : <Login />}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap');
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Roboto', sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
