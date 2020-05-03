import { User } from 'firebase';
import React, { useEffect, useState } from 'react';
import App from '../components/App';
import Login from '../components/Login';
import fire from '../config/fire';

const Home = () => {
  const [state, setState] = useState<{ user: User | null }>({ user: null });

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
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
