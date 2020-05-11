import firebase from 'firebase/app';
import React, { ChangeEvent } from 'react';
import { omit } from 'lodash';
import View from '../data/data_model/view';
import Item from '../data/data_model/item';

interface IProps {
  currentView: View;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  items: { [id: string]: Item };
  setItems: any;
}

const App = ({ currentView, setCurrentView, items, setItems }: IProps) => {
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const addItem = () => {
    const newItem = new Item({ viewId: currentView.id });
    console.log('called');
    const newView = currentView.addItem(newItem.id);
    setCurrentView(newView);
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    newItem.save();
  };

  const deleteItem = (id: string) => {
    items[id].delete(currentView.id);
    setItems(omit(items, id));
    const newSets = currentView.sets.filter(itemId => itemId !== id);
    console.log(newSets);
    setCurrentView(prev => new View({ ...prev, sets: newSets }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const text = e.target.value;
    setItems(prev => ({ ...prev, [id]: items[id].update(text) }));
  };

  if (!currentView || !Object.keys(items).length) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container">
      <div className="main-wrapper">
        <button className="add" type="button" onClick={addItem}>
          +
        </button>
        {currentView.sets.map(setId => {
          const item = items[setId];
          if (!item) return null;
          return (
            <div className="item" key={item.id}>
              <button type="button" onClick={() => deleteItem(item.id)}>
                -
              </button>
              <input type="text" value={item.text} onChange={e => handleChange(e, item.id)} />
            </div>
          );
        })}
        {/* {Object.keys(items).map(item => {
          if (items[item].viewId === currentView.id) {
            return (
              <div className="item" key={items[item].id}>
                <button type="button" onClick={() => deleteItem(items[item].id)}>
                  -
                </button>
                <input
                  type="text"
                  value={items[item].text}
                  onChange={e => handleChange(e, items[item].id)}
                />
              </div>
            );
          }
        })} */}
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
