import firebase, { User } from 'firebase/app';
import React, { useEffect, useState } from 'react';
import App from '../components/App';
import Login from '../components/Login';
import { db } from '../libs/firebase';
import Item from '../data/data_model/item';

const Items = db.collection('items');

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(loginUser => {
      if (loginUser) {
        setUser(loginUser);
        Items.where('userId', '==', loginUser.uid)
          .get()
          .then(snapshot => {
            const userItems = [];
            snapshot.forEach(doc => {
              userItems.push(new Item(doc.data()));
            });
            setItems(userItems);
          });
      } else {
        console.log('loginUser is null');
        setUser(null);
      }
    });
  }, []);
  return (
    <div>
      {user ? <App items={items} setItems={setItems} /> : <Login />}
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
