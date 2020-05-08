import firebase from 'firebase/app';
import React, { ChangeEvent } from 'react';
import { Items } from '../data/collections';
import Item from '../data/data_model/item';

interface IProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const App = ({ items, setItems }: IProps) => {
  const handleLogout = () => {
    firebase.auth().signOut();
    setItems([]);
  };

  const addItem = () => {
    const newItem = new Item({});
    setItems(prev => [...prev, newItem]);
    newItem.save();
  };

  const deleteItem = (id: string) => {
    const restItems = items.filter(item => item.id !== id);
    setItems(restItems);
    Items.doc(id).delete();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const text = e.target.value;
    const updatedItems = items.map(i => (i.id === id ? new Item({ ...i, text }) : i));
    setItems(updatedItems);
    Items.doc(id).update({ text });
  };

  // const addChild = id => {
  //   const newItems = items.map(newItem => {
  //     if (newItem.id === id) {
  //       newItem.children.push('');
  //     }
  //     return newItem;
  //   });
  //   setItems(newItems);
  // };

  // const deleteChild = (index, id) => {
  //   const newItems = items.map(newItem => {
  //     if (newItem.id === id) {
  //       newItem.children.splice(index, 1);
  //     }
  //     return newItem;
  //   });
  //   setItems(newItems);
  // };

  // const updateChild = (e, index, id) => {
  //   const newItems = items.map(newItem => {
  //     if (newItem.id === id) {
  //       newItem.children[index] = e.target.value;
  //     }
  //     return newItem;
  //   });
  //   setItems(newItems);
  // };

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
            <input
              type="text"
              size={15}
              value={item.text}
              onChange={e => handleChange(e, item.id)}
            />
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
