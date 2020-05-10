import firebase, { User } from 'firebase/app';
import React, { useEffect, useState } from 'react';
import App from '../components/App';
import Login from '../components/Login';
import Item from '../data/data_model/item';
import { Views } from '../data/collections';
import View, { viewConverter } from '../data/data_model/view';

const Home = () => {
  const [currentView, setCurrentView] = useState<View>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(loginUser => {
      if (loginUser) {
        setUser(loginUser);
        Views.where('userId', '==', loginUser.uid)
          .limit(1)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              const newView = new View({});
              setCurrentView(newView);
            }
            snapshot.forEach(doc => {
              const view = viewConverter.fromFirestore(doc);
              setCurrentView(view);
            });
          });
      } else {
        console.log('loginUser is null');
        setUser(null);
      }
    });
  }, []);
  return (
    <div>
      {user ? <App currentView={currentView} setCurrentView={setCurrentView} /> : <Login />}
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
        *:focus {
          outline: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
