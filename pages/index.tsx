import firebase, { User } from 'firebase/app';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import App from '../components/App';
import { ViewContext } from '../components/context/ViewContextProvider';
import Login from '../components/Login';
import { Items, Sets, Views } from '../data/collections';
import { itemConverter } from '../data/data_model/item';
import { setConverter } from '../data/data_model/set';
import View, { viewConverter } from '../data/data_model/view';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const { setCurrentView, setSets, setItems } = useContext(ViewContext);

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
              newView.save();
              setCurrentView(newView);
            } else {
              snapshot.forEach(doc => {
                const latestView = viewConverter.fromFirestore(doc);
                setCurrentView(latestView);
              });
            }
          });

        Items.where('userId', '==', loginUser.uid)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log('no item found');
            } else {
              snapshot.forEach(doc => {
                const loadedItem = itemConverter.fromFirestore(doc);
                setItems(prev => ({ ...prev, [loadedItem.id]: loadedItem }));
              });
            }
          });

        Sets.where('userId', '==', loginUser.uid)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log('no set found');
            } else {
              snapshot.forEach(doc => {
                const loadedSet = setConverter.fromFirestore(doc);
                setSets(prev => ({ ...prev, [loadedSet.id]: loadedSet }));
              });
            }
          });
      } else {
        console.log('loginUser is null');
        setUser(null);
      }
    });
  }, []);
  return (
    <div>
      <Head>
        <title>lines</title>
        <link rel="icon" href="/logo.png" />
      </Head>
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
        *:focus {
          filter: invert(100%);
          outline: none;
        }
        button {
          border: none;
          cursor: pointer;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default Home;
