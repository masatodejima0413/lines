import firebase from 'firebase/app';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../libs/firebase';

const Items = db.collection('items');

export interface IItem {
  createdAt: firebase.firestore.Timestamp;
  text: string;
  userId: string;
  id: string;
  children: string[];
}

const createItem = (id: string) => ({
  id,
  createdAt: firebase.firestore.Timestamp.now(),
  text: '',
  userId: firebase.auth().currentUser.uid,
  children: [],
});

const App = ({ items, setItems }) => {
  const handleLogout = () => {
    firebase.auth().signOut();
    setItems([]);
  };

  const addItem = () => {
    const id = uuidv4();
    const newItem = createItem(id);
    setItems(prev => [...prev, newItem]);
    Items.doc(id)
      .set(createItem(id))
      .then(() => console.log('Successfully added.'))
      .catch(() => console.warn('Failded to add.'));
  };

  const deleteItem = id => {
    const newItems = items.filter(newItem => newItem.id !== id);
    setItems(newItems);
    Items.doc(id).delete();
  };

  const updateItem = (e, id) => {
    const newItems = items.map(newItem => {
      if (newItem.id === id) {
        newItem.text = e.target.value;
        Items.doc(id).update({ text: e.target.value });
      }
      return newItem;
    });
    setItems(newItems);
  };

  const addChild = id => {
    const newItems = items.map(newItem => {
      if (newItem.id === id) {
        newItem.children.push('');
      }
      return newItem;
    });
    setItems(newItems);
  };

  const deleteChild = (index, id) => {
    const newItems = items.map(newItem => {
      if (newItem.id === id) {
        newItem.children.splice(index, 1);
      }
      return newItem;
    });
    setItems(newItems);
  };

  const updateChild = (e, index, id) => {
    const newItems = items.map(newItem => {
      if (newItem.id === id) {
        newItem.children[index] = e.target.value;
      }
      return newItem;
    });
    setItems(newItems);
  };

  return (
    <div className="container">
      <div className="main-wrapper">
        <button className="add" type="button" onClick={addItem}>
          +
        </button>
        {items.map(item => (
          <div className="item" key={item.id}>
            <button type="button" onClick={() => deleteItem(item.id)}>
              -
            </button>
            <input type="text" size={15} value={item.text} onChange={e => updateItem(e, item.id)} />
            <button type="button" onClick={() => addChild(item.id)}>
              +
            </button>
            <div className="children-wrapper">
              {item.children.length > 0 &&
                item.children.map((child, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={child}
                      onChange={e => updateChild(e, index, item.id)}
                    />
                    <button type="button" onClick={() => deleteChild(index, item.id)}>
                      -
                    </button>
                  </div>
                ))}
            </div>
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
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          border-left: 0.5rem solid #c4c4c4;
        }
        .item input {
          height: 2.5rem;
          font-size: 2rem;
          margin: 1rem;
          border: none;
        }
        .item button {
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .children-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .children-wrapper input {
          font-size: 1rem;
          height: 1.2rem;
          border: none;
          padding-left: 0.5rem;
          border-left: 0.2rem solid #c4c4c4;
          margin: 0.1rem;
        }
        .logout {
          margin: 0 auto;
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
