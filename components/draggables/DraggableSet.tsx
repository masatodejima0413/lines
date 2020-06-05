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
import { UP_ARROW_KEY_CODE } from '../../constants/keyCode';
import Item from '../../data/data_model/item';
import View from '../../data/data_model/view';
import { ViewContext } from '../context/ViewContextProvider';
import DraggableItem, { itemHeight } from './DraggableItem';

export enum DragDropType {
  SET = 'SET',
  ITEM = 'ITEM',
}

interface IProps {
  setIndex: number;
  setId: string;
  isDraggingOverView: boolean;
}

const DraggableSet = ({ setId, setIndex, isDraggingOverView }: IProps) => {
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
            className={`set ${isDraggingOverView ? 'dragging-over-view' : ''}`}
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
                    className={`item-droppable-container ${
                      itemsDroppableSnapshot.isDraggingOver ? 'dragging-over-set' : ''
                    } ${setsDraggableSnapshot.isDragging ? 'dragging' : ''}`}
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
                          deleteSet={deleteSet}
                          addItemRef={addItemRef}
                          isDraggingOverSet={itemsDroppableSnapshot.isDraggingOver}
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
        .dragging-over-view:hover .set-handle {
          opacity: 0;
        }
        .item-droppable-container {
          transition: all 240ms ease-out;
          background-color: white;
        }
        .dragging {
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
        .dragging-over-set {
          background-color: #f5f5f5;
        }
        .delete-set {
          cursor: pointer;
          align-self: start;
        }
        .delete-set:hover {
          opacity: 0.4;
        }
        .add-item {
          background-color: transparent;
          color: transparent;
          font-size: 1rem;
          width: 60vw;
          line-height: ${itemHeight};
          padding: 4px 16px 4px;
        }
        .set:hover .add-item::before {
          content: 'Add item';
          color: darkgray;
        }
        .set:focus-within .add-item::before {
          content: 'Cmd + Enter to add';
          color: darkgray;
        }
        .set:focus-within .add-item:hover::before {
          content: 'Add item';
        }
        .add-item:focus::before {
          content: 'Press Enter to add' !important;
          text-decoration: underline;
        }
        .add-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </>
  );
};

export default DraggableSet;
