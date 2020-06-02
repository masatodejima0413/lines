import firebase from 'firebase/app';
import React, { useContext } from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
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
    return <h1>⏱</h1>;
  }

  return (
    <DragDropContextProvider
      currentView={currentView}
      setCurrentView={setCurrentView}
      sets={sets}
      setSets={setSets}
    >
      <div className="container">
        <Droppable droppableId="all-sets" direction="vertical" type={DragDropType.SET}>
          {(
            setsDroppableProvided: DroppableProvided,
            setsDroppableSnapshot: DroppableStateSnapshot,
          ) => (
            <div
              className={`set-droppable-container ${
                setsDroppableSnapshot.isDraggingOver ? 'dragging-over' : ''
              }`}
              {...setsDroppableProvided.droppableProps}
              ref={setsDroppableProvided.innerRef}
            >
              {currentView.setIds.map((setId, setIndex) => (
                <DraggableSet
                  key={setId}
                  setId={setId}
                  setIndex={setIndex}
                  isDraggingOverView={setsDroppableSnapshot.isDraggingOver}
                />
              ))}
              {setsDroppableProvided.placeholder}
              <button type="button" className="add-set" onClick={addSet}>
                + Add
              </button>
            </div>
          )}
        </Droppable>
      </div>
      <div className="logout" onClick={handleLogout}>
        Logout
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }
        .add-set {
          opacity: 0;
          width: 60vw;
          line-height: 40px;
          padding-left: 16px;
          font-size: 1.6rem;
          cursor: pointer;
        }
        .add-set:hover,
        .add-set:focus {
          opacity: 0.4;
          text-decoration: underline;
        }
        .set-droppable-container {
          transition: all 240ms ease-out;
          background-color: white;
        }
        .dragging-over {
          background-color: #f5f5f5;
        }
        .logout {
          position: fixed;
          top: 16px;
          right: 16px;
          cursor: pointer;
        }
        .logout:hover {
          text-decoration: underline;
        }
      `}</style>
    </DragDropContextProvider>
  );
};

export default App;
