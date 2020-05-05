import firebase from 'firebase/app';
import React, { useState, useEffect } from 'react';
import { db } from '../libs/firebase';

const Items = db.collection('items');

export interface IItem {
  createdAt: firebase.firestore.Timestamp;
  text: string;
  userId: string;
  key: string;
}

const createItem = (text: string) => ({
  createdAt: firebase.firestore.Timestamp.now(),
  text,
  userId: firebase.auth().currentUser.uid,
});

const App = ({ items, setItems }) => {
  const [val, setVal] = useState('');

  const handleLogout = () => {
    firebase.auth().signOut();
    setItems([]);
  };

  const submit = () => {
    // setsRef
    //   .doc(createdAt.toISOString())
    //   .set(createItem(val))
    //   .then(function() {
    //     console.log('Document successfully written!');
    //   })
    //   .catch(function(error) {
    //     console.error('Error writing document: ', error);
    //   });
    const newItem = createItem(val);
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

  return (
    <div>
      <input type="text" value={val} onChange={e => setVal(e.target.value)} />
      <button type="button" onClick={submit} disabled={!val}>
        ADD
      </button>
      {items.map(item => (
        <>
          <h1 key={item.key}>{item.text}</h1>
          <button type="button" onClick={() => deleteItem(item.key)}>
            delete
          </button>
        </>
      ))}
      <hr />
      <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default App;
