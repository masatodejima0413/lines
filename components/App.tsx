import firebase from 'firebase/app';
import React, { useState } from 'react';
import { db } from '../libs/firebase';

const Items = db.collection('items');

export interface IItem {
  createdAt: firebase.firestore.Timestamp;
  text: string;
  userId: string;
  key: string;
}

const createItem = () => ({
  createdAt: firebase.firestore.Timestamp.now(),
  text: '',
  userId: firebase.auth().currentUser.uid,
});

const App = ({ items, setItems }) => {
  const [val, setVal] = useState('');

  const handleLogout = () => {
    firebase.auth().signOut();
    setItems([]);
  };

  const submit = () => {
    const newItem = createItem();
    Items.add(newItem).then(docRef => {
      setItems(prev => [...prev, { ...newItem, key: docRef.id }]);
    });
    setVal('');
  };

  const deleteItem = key => {
    const newItems = [...items].filter(newItem => newItem.key !== key);
    setItems(newItems);
    Items.doc(key).delete();
  };

  // const changeChildItem = (e, i, index) => {
  //   let newItems = [...items];
  //   newItems[i].childItems[index] = e.target.value;
  //   setItems(newItems);
  //   // arrayの単一要素のupdateはできない
  //   setsRef.doc(items[i].createdAt.toISOString()).update({ childItems: newItems[i].childItems });
  // };

  const handleChange = (e, key) => {
    const newItems = [...items].map(newItem => {
      if (newItem.key === key) {
        newItem.text = e.target.value;
        Items.doc(key).update({ text: e.target.value });
      }
      return newItem;
    });
    setItems(newItems);
  };

  return (
    <div className="container">
      <div className="main-wrapper">
        <button className="add" type="button" onClick={submit}>
          +
        </button>
        {items.map(item => (
          <div className="item">
            <input
              type="text"
              key={item.key}
              value={item.text}
              onChange={e => handleChange(e, item.key)}
            />
            <button type="button" onClick={() => deleteItem(item.key)}>
              -
            </button>
          </div>
        ))}
        <hr />
        <div className="logout" onClick={handleLogout}>
          Logout
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
        .main-wrapper {
          padding: 3rem;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
        .add {
          border: none;
          font-size: 2.5rem;
          display: block;
          margin: 0 0 0 auto;
          cursor: pointer;
        }
        .item {
          border-left: 0.5rem solid #c4c4c4;
          margin-bottom: 1.5rem;
        }
        .item input {
          height: 2.5rem;
          border: none;
          font-size: 2rem;
          margin: 1rem;
        }
        .item button {
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .logout {
          background-color: #c4c4c4;
          color: white;
          border: 2px solid #c4c4c4;
          font-weight: 600;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .logout:hover {
          background-color: white;
          color: #c4c4c4;
          border: 2px solid #c4c4c4;
        }
      `}</style>
    </div>
  );
};

export default App;
