import firebase from 'firebase/app';
import React from 'react';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import Item from '../data/data_model/item';
import Set from '../data/data_model/set';
import View from '../data/data_model/view';
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

  const move = {
    inSameField: ({
      sourceIndex,
      destIndex,
      draggableId,
      array,
    }: {
      sourceIndex: number;
      destIndex: number;
      draggableId: string;
      array: string[];
    }) => {
      const ids = [...array];
      ids.splice(sourceIndex, 1);
      ids.splice(destIndex, 0, draggableId);
      return ids;
    },
    toOtherField: ({
      source,
      destination,
      draggableId,
      sourceArray,
      destArray,
    }: {
      source: any;
      destination: any;
      draggableId: string;
      sourceArray: string[];
      destArray: string[];
    }) => {
      console.log('one to anothoer move');
      const startIds = [...sourceArray];
      startIds.splice(source.index, 1);
      const finishIds = [...destArray];
      finishIds.splice(destination.index, 0, draggableId);
      return { startIds, finishIds };
    },
  };

  const onDragEnd = ({ source, destination, draggableId, type }: DropResult) => {
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      if (type === DragDropType.ITEM) {
        const set = sets[destination.droppableId];

        const updatedItemIds = move.inSameField({
          sourceIndex: source.index,
          destIndex: destination.index,
          draggableId,
          array: set.itemIds,
        });
        setSets(prev => ({ ...prev, [set.id]: set.update(updatedItemIds) }));
      }
      if (type === DragDropType.SET) {
        const updatedSetIds = move.inSameField({
          sourceIndex: source.index,
          destIndex: destination.index,
          draggableId,
          array: currentView.setIds,
        });
        const updatedView = currentView.update(updatedSetIds);
        setCurrentView(updatedView);
      }
    } else {
      if (type === DragDropType.ITEM) {
        const sourceSet = sets[source.droppableId];
        const destSet = sets[destination.droppableId];
        const { startIds, finishIds } = move.toOtherField({
          source,
          destination,
          draggableId,
          sourceArray: sourceSet.itemIds,
          destArray: destSet.itemIds,
        });
        setSets(prev => ({
          ...prev,
          [sourceSet.id]: sourceSet.update(startIds),
          [destSet.id]: destSet.update(finishIds),
        }));
        return;
      }
      throw new Error('Invalid drag drop type');
    }
  };

  if (!currentView) {
    return <h2>Loading...</h2>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
    </DragDropContext>
  );
};

export default App;
