import { omit } from 'lodash';
import React, { useContext } from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Item from '../../data/data_model/item';
import View from '../../data/data_model/view';
import DraggableItem from './DraggableItem';
import { ViewContext } from '../context/ViewContextProvider';

export enum DragDropType {
  SET = 'SET',
  ITEM = 'ITEM',
}

interface IProps {
  setIndex: any;
  setId: any;
}

const DraggableSet = ({ setId, setIndex }: IProps) => {
  const { currentView, setCurrentView, sets, setSets, items, setItems } = useContext(ViewContext);

  const set = sets[setId];
  if (!set) return null;

  const deleteSet = () => {
    sets[setId].delete(currentView.id);
    setSets(omit(sets, [setId]));
    const updatedSetIds = currentView.setIds.filter(argSetId => argSetId !== setId);
    setCurrentView(prev => new View({ ...prev, setIds: updatedSetIds }));
    sets[setId].itemIds.forEach(itemId => {
      setItems(omit(items, [itemId]));
    });
  };

  const addItem = () => {
    const newItem = new Item({});
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    setSets(prev => ({
      ...prev,
      [setId]: sets[setId].addItem(newItem.id),
    }));
    newItem.save();
  };

  return (
    <>
      <Draggable draggableId={setId} index={setIndex} key={setId}>
        {(setsDraggableProvided: DraggableProvided) => (
          <div
            className="set"
            {...setsDraggableProvided.draggableProps}
            ref={setsDraggableProvided.innerRef}
          >
            <div className="set-handle" {...setsDraggableProvided.dragHandleProps} />
            <Droppable droppableId={setId} type={DragDropType.ITEM}>
              {(itemsDroppableProvided: DroppableProvided) => {
                return (
                  <div
                    className="item-droppable-container"
                    ref={itemsDroppableProvided.innerRef}
                    {...itemsDroppableProvided.droppableProps}
                  >
                    {set.itemIds.map((itemId, index) => {
                      return (
                        <DraggableItem
                          key={itemId}
                          itemId={itemId}
                          index={index}
                          setId={setId}
                          addItem={addItem}
                        />
                      );
                    })}
                    {itemsDroppableProvided.placeholder}
                    <div className="add-item" onClick={addItem}>
                      + Add new item
                    </div>
                  </div>
                );
              }}
            </Droppable>
            <div className="delete-set" onClick={deleteSet}>
              Delete set
            </div>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .set-handle {
          width: 12px;
          align-self: stretch;
          border-radius: 2px;
          background-color: lightgray;
          opacity: 0;
          transition: opacity 80ms ease-out;
          margin-right: 8px;
        }
        .set-handle:hover {
          opacity: 1;
        }
        .set {
          display: flex;
          padding: 20px 0;
        }
        .delete-set {
          cursor: pointer;
          align-self: start;
        }
        .delete-set:hover {
          opacity: 0.4;
        }
        .add-item {
          opacity: 0.4;
          height: 40px;
          width: 60vw;
          line-height: 40px;
          padding-left: 16px;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .add-item:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default DraggableSet;
