import firebase from 'firebase/app';
import React, { useState } from 'react';
import { db } from '../libs/firebase';

const Items = db.collection('items');

export interface IItem {
  createdAt: firebase.firestore.Timestamp;
  text: string;
  userId: string;
}

const createItem = (text: string) => ({
  createdAt: firebase.firestore.Timestamp.now(),
  text,
  userId: firebase.auth().currentUser.uid,
});

const handleLogout = () => {
  firebase.auth().signOut();
};

const App = ({ items, setItems }) => {
  const [val, setVal] = useState('');

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
    setItems(prev => [...prev, newItem]);
    Items.add(newItem);
    setVal('');
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
        <h1 key={item.createdAt.toMillis()}>{item.text}</h1>
      ))}
      <hr />
      <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default App;
