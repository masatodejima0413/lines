import firebase from 'firebase/app';
import React, { useContext } from 'react';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Item from '../data/data_model/item';
import Set from '../data/data_model/set';
import DragDropContextProvider from './context/DragDropContextProvider';
import { ViewContext } from './context/ViewContextProvider';
import DraggableSet, { DragDropType } from './draggables/DraggableSet';

const App = () => {
  const { currentView, setCurrentView, sets, setSets, setItems } = useContext(ViewContext);

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
        <button className="add-set" type="button" onClick={addSet}>
          +
        </button>
        <Droppable droppableId="all-sets" direction="vertical" type={DragDropType.SET}>
          {(setsDroppableProvided: DroppableProvided) => (
            <div {...setsDroppableProvided.droppableProps} ref={setsDroppableProvided.innerRef}>
              {currentView.setIds.map((setId, setIndex) => (
                <DraggableSet key={setId} setId={setId} setIndex={setIndex} />
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
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 12px;
        }
        .add-set {
          border: none;
          font-size: 2.5rem;
          display: block;
          margin: 12px auto 12px 12px;
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
