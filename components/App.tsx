import React, { useState } from 'react';
import fire from '../config/fire';

// TODO: Might be good to have class for item
interface IItem {
  text: string;
  createdAt: Date;
  userId: string;
}

const createItem = (text: string) => ({
  text,
  createdAt: new Date(),
  userId: fire.auth().currentUser.uid,
});

const handleLogout = () => {
  fire.auth().signOut();
};

const App = () => {
  const [val, setVal] = useState('');
  const [items, setItems] = useState<IItem[]>([]);

  const submit = () => {
    setItems(prev => [...prev, createItem(val)]);
    setVal('');
  };

  return (
    <div>
      <input type="text" value={val} onChange={e => setVal(e.target.value)} />
      <button type="button" onClick={submit} disabled={!val}>
        ADD
      </button>
      {items.map(i => (
        <h1 key={i.createdAt.toISOString()}>{i.text}</h1>
      ))}
      <hr />
      <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default App;
