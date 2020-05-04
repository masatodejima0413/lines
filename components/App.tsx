import React, { useState } from 'react';
import fire, { db } from '../config/fire';

// TODO: Might be good to have class for item
interface IItem {
  parentItem: string;
  createdAt: Date;
  childItems: string[];
}
let createdAt;
const createItem = (parentItem: string) => ({
  parentItem,
  createdAt,
  childItems: ['', '', '', ''],
});

const handleLogout = () => {
  fire.auth().signOut();
};

const App = () => {
  const [val, setVal] = useState('');
  const [items, setItems] = useState<IItem[]>([]);
  const setsRef = db
    .collection('users')
    .doc(fire.auth().currentUser.uid)
    .collection('sets');

  const submit = () => {
    createdAt = new Date();
    setsRef
      .doc(createdAt.toISOString())
      .set(createItem(val))
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });
    setItems(prev => [...prev, createItem(val)]);
    setVal('');
  };

  const changeChildItem = (e, i, index) => {
    let newItems = [...items];
    newItems[i].childItems[index] = e.target.value;
    setItems(newItems);
    // arrayの単一要素のupdateはできない
    setsRef.doc(items[i].createdAt.toISOString()).update({ childItems: newItems[i].childItems });
  };

  return (
    <div>
      <input type="text" value={val} onChange={e => setVal(e.target.value)} />
      <button type="button" onClick={submit} disabled={!val}>
        ADD
      </button>
      {items.map((item, i) => (
        <>
          <h1 key={item.createdAt.toISOString()}>{item.parentItem}</h1>
          {item.childItems.map((childItem, index) => (
            <input
              type="text"
              key={index}
              value={childItem}
              onChange={e => changeChildItem(e, i, index)}
            />
          ))}
        </>
      ))}
      <hr />
      <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default App;
