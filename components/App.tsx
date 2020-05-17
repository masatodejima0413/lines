import firebase from 'firebase/app';
import React from 'react';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Item from '../data/data_model/item';
import Set from '../data/data_model/set';
import View from '../data/data_model/view';
import DragDropContextProvider from './context/DragDropContextProvider';
import DraggableSet, { DragDropType } from './draggables/DraggableSet';

interface IProps {
  currentView: View;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  sets: { [id: string]: Set };
  setSets: any;
  items: { [id: string]: Item };
  setItems: any;
}

const App = ({ currentView, setCurrentView, sets, setSets, items, setItems }: IProps) => {
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const addSet = () => {
    const newItem = new Item({});
    const newSet = new Set({ itemIds: [newItem.id] });
    const updatedView = currentView.addSet(newSet.id);
    setCurrentView(updatedView);
    setSets(prev => ({ ...prev, [newSet.id]: newSet }));
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    newItem.save();
    newSet.save();
  };

  if (!currentView) {
    return <h2>Loading...</h2>;
  }

  return (
    <DragDropContextProvider
      currentView={currentView}
      setCurrentView={setCurrentView}
      sets={sets}
      setSets={setSets}
    >
      <div className="container">
        <div className="main-wrapper">
          <button className="add" type="button" onClick={addSet}>
            +
          </button>
          <Droppable droppableId="all-sets" direction="vertical" type={DragDropType.SET}>
            {(setsDroppableProvided: DroppableProvided) => (
              <div {...setsDroppableProvided.droppableProps} ref={setsDroppableProvided.innerRef}>
                {currentView.setIds.map((setId, setIndex) => (
                  <DraggableSet
                    key={setId}
                    setCurrentView={setCurrentView}
                    currentView={currentView}
                    setId={setId}
                    setIndex={setIndex}
                    items={items}
                    setItems={setItems}
                    sets={sets}
                    setSets={setSets}
                  />
                ))}
                {setsDroppableProvided.placeholder}
              </div>
            )}
          </Droppable>
          <hr />
          <div className="logout" onClick={handleLogout}>
            Logout
          </div>
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
    </DragDropContextProvider>
  );
};

export default App;
