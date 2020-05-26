import { omit } from 'lodash';
import React, { useContext, useRef } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import Item from '../../data/data_model/item';
import View from '../../data/data_model/view';
import { ViewContext } from '../context/ViewContextProvider';
import DraggableItem from './DraggableItem';
import { UP_ARROW_KEY_CODE } from '../../constants/keyCode';

export enum DragDropType {
  SET = 'SET',
  ITEM = 'ITEM',
}

interface IProps {
  setIndex: any;
  setId: any;
}

const DraggableSet = ({ setId, setIndex }: IProps) => {
  const addItemRef = useRef();

  const {
    currentView,
    setCurrentView,
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    setFocussedId,
  } = useContext(ViewContext);

  const set = sets[setId];
  if (!set) return null;

  const deleteSet = () => {
    set.delete(currentView.id);
    setSets(omit(sets, [setId]));
    const updatedSetIds = currentView.setIds.filter(id => id !== setId);
    setCurrentView(prev => new View({ ...prev, setIds: updatedSetIds }));
    set.itemIds.forEach(itemId => {
      setItems(omit(items, [itemId]));
    });
  };

  const addItem = () => {
    const newItem = new Item({});
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    setSets(prev => ({
      ...prev,
      [setId]: set.addItem(newItem.id),
    }));
    newItem.save();
    setFocussedId(newItem.id);
  };

  const handleAddItemKeydown = e => {
    const { keyCode } = e;
    const lastItemRef = itemRefs[set.itemIds[set.itemIds.length - 1]];
    if (keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      lastItemRef.current.focus();
    }
  };

  const lastItem = items[set.itemIds[set.itemIds.length - 1]];
  const isLastItemEmpty = lastItem.text.length < 1;

  return (
    <>
      <Draggable draggableId={setId} index={setIndex} key={setId}>
        {(
          setsDraggableProvided: DraggableProvided,
          setsDraggableSnapshot: DraggableStateSnapshot,
        ) => (
          <div
            className="set"
            {...setsDraggableProvided.draggableProps}
            ref={setsDraggableProvided.innerRef}
          >
            <div className="set-handle" {...setsDraggableProvided.dragHandleProps} />
            <Droppable droppableId={setId} type={DragDropType.ITEM}>
              {(
                itemsDroppableProvided: DroppableProvided,
                itemsDroppableSnapshot: DroppableStateSnapshot,
              ) => {
                return (
                  <div
                    className="item-droppable-container"
                    ref={itemsDroppableProvided.innerRef}
                    {...itemsDroppableProvided.droppableProps}
                    style={{
                      boxShadow: setsDraggableSnapshot.isDragging ? '0 0 15px rgba(0,0,0,.3)' : '',
                      backgroundColor: itemsDroppableSnapshot.isDraggingOver ? '#f5f5f5' : 'white',
                    }}
                  >
                    {set.itemIds.map((itemId, index) => {
                      return (
                        <DraggableItem
                          key={itemId}
                          itemId={itemId}
                          index={index}
                          setId={setId}
                          addItem={addItem}
                          deleteSet={deleteSet}
                          addItemRef={addItemRef}
                        />
                      );
                    })}
                    {itemsDroppableProvided.placeholder}
                    {!isLastItemEmpty && (
                      <button
                        ref={addItemRef}
                        onKeyDown={handleAddItemKeydown}
                        type="button"
                        className="add-item"
                        onClick={addItem}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              }}
            </Droppable>
            {/* <div className="delete-set" onClick={deleteSet}>
              Delete set
            </div> */}
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .set {
          display: flex;
          padding: 20px 0;
        }
        .set-handle {
          width: 8px;
          align-self: stretch;
          background-color: lightgray;
          opacity: 0;
          transition: opacity 80ms ease-out;
          margin-right: 8px;
        }
        .set-handle:hover,
        .set-handle:focus {
          opacity: 1;
        }
        .set:hover .set-handle {
          opacity: 1;
        }
        .item-droppable-container {
          transition: all 240ms ease-out;
        }
        .delete-set {
          cursor: pointer;
          align-self: start;
        }
        .delete-set:hover {
          opacity: 0.4;
        }
        .add-item {
          opacity: 0;
          font-size: 1rem;
          width: 60vw;
          line-height: 40px;
          padding-left: 16px;
        }
        .set:focus-within .add-item,
        .set:hover .add-item {
          opacity: 0.4;
        }
        .add-item:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default DraggableSet;
