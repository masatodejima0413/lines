import firebase, { User } from 'firebase/app';
import React, { useEffect, useState } from 'react';
import App from '../components/App';
import Login from '../components/Login';
import { Items, Views } from '../data/collections';
import Item, { itemConverter } from '../data/data_model/item';
import View, { viewConverter } from '../data/data_model/view';

const Home = () => {
  const [currentView, setCurrentView] = useState<View>();
  const [items, setItems] = useState<{ [id: string]: Item }>({});
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
              Views.doc(newView.id).set(viewConverter.toFirestore(newView));
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
      } else {
        console.log('loginUser is null');
        setUser(null);
      }
    });
  }, []);
  return (
    <div>
      {user ? (
        <App
          currentView={currentView}
          setCurrentView={setCurrentView}
          items={items}
          setItems={setItems}
        />
      ) : (
        <Login />
      )}
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
