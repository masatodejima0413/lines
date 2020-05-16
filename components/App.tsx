import firebase from 'firebase/app';
import { omit } from 'lodash';
import React, { ChangeEvent } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import Item from '../data/data_model/item';
import Set from '../data/data_model/set';
import View from '../data/data_model/view';

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

  const deleteSet = (setId: string) => {
    sets[setId].delete(currentView.id);
    setSets(omit(sets, setId));
    const updatedSetIds = currentView.setIds.filter(argSetId => argSetId !== setId);
    setCurrentView(prev => new View({ ...prev, setIds: updatedSetIds }));
    sets[setId].itemIds.forEach(itemId => {
      setItems(omit(items, itemId));
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const text = e.target.value;
    setItems(prev => ({ ...prev, [id]: items[id].update(text) }));
  };

  const addItem = (setId: string) => {
    const newItem = new Item({});
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    newItem.save();
    setSets(prev => ({
      ...prev,
      [setId]: sets[setId].addItem(newItem.id),
    }));
  };

  const move = ({
    itemId,
    setId,
    sourceIndex,
    destIndex,
  }: {
    itemId: string;
    sourceIndex: number;
    destIndex: number;
    setId: string;
  }) => {
    const set = sets[setId];
    const itemIds = [...set.itemIds];
    itemIds.splice(sourceIndex, 1);
    itemIds.splice(destIndex, 0, itemId);
    setSets(prev => ({ ...prev, [set.id]: set.update(itemIds) }));
  };

  const onDragEnd = ({ source, destination, draggableId, type }: DropResult) => {
    move({
      itemId: draggableId,
      setId: destination.droppableId,
      sourceIndex: source.index,
      destIndex: destination.index,
    });
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
          {currentView.setIds.map(setId => {
            const set = sets[setId];
            if (!set) return null;
            return (
              <div className="set" key={set.id}>
                <button type="button" onClick={() => deleteSet(set.id)}>
                  -
                </button>

                <Droppable droppableId={setId} direction="horizontal">
                  {(itemsDroppableProvided: DroppableProvided) => (
                    <div
                      className="item-droppable-container"
                      ref={itemsDroppableProvided.innerRef}
                      {...itemsDroppableProvided.droppableProps}
                    >
                      {set.itemIds.map((itemId, index) => {
                        const item = items[itemId];
                        if (!item) return null;
                        return (
                          <Draggable key={itemId} draggableId={itemId} index={index}>
                            {(itemsDraggableProvided: DraggableProvided) => (
                              <div
                                className="item"
                                {...itemsDraggableProvided.draggableProps}
                                ref={itemsDraggableProvided.innerRef}
                              >
                                <div
                                  className="handle"
                                  {...itemsDraggableProvided.dragHandleProps}
                                />
                                <input
                                  key={item.id}
                                  type="text"
                                  value={item.text}
                                  onChange={e => handleChange(e, item.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {itemsDroppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button type="button" onClick={() => addItem(set.id)}>
                  +
                </button>
              </div>
            );
          })}
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
          .set {
            margin-bottom: 1.5rem;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            border-left: 0.5rem solid #c4c4c4;
            font-weight: bold;
          }
          .item-droppable-container {
            display: flex;
          }
          .set .item:first-of-type input {
            height: 2.5rem;
            font-size: 2rem;
            margin: 1rem;
            border: none;
          }
          .set .item input {
            font-size: 1rem;
            height: 1.2rem;
            border: none;
            // padding-left: 0.5rem;
            // border-left: 0.2rem solid #c4c4c4;
            margin: 0.1rem;
          }
          .item {
            display: flex;
            align-items: center;
          }
          .item .handle {
            width: 20px;
            height: 20px;
            background-color: #ffddd2;
            border-radius: 5px;
          }
          .set button {
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
    </DragDropContext>
  );
};

export default App;
