import firebase, { User } from 'firebase';
import React, { useEffect, useState } from 'react';
import App from '../components/App';
import Login from '../components/Login';
// import firebase from 'firebase';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(loginUser => {
      if (loginUser) {
        setUser(loginUser);
      } else {
        console.log('loginUser is null');
        setUser(null);
      }
    });
  });
  return (
    <div>
      {user ? <App /> : <Login />}
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
