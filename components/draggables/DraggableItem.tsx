import { omit } from 'lodash';
import React, { ChangeEvent, useContext, useRef } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { ViewContext } from '../context/ViewContextProvider';

const DELETE_KEY_CODE = 8;
const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

interface IProps {
  itemId: string;
  index: number;
  setId: string;
  addItem: () => void;
  deleteSet: () => void;
}

const DraggableItem = ({ itemId, index, setId, addItem, deleteSet }: IProps) => {
  const { sets, setSets, items, setItems } = useContext(ViewContext);
  const itemRef = useRef<HTMLInputElement>();

  const item = items[itemId];
  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems(prev => ({ ...prev, [itemId]: item.update(newText) }));
  };

  const deleteItem = () => {
    items[itemId].delete();
    setItems(omit(items, [itemId]));
    const updatedItemIds = sets[setId].itemIds.filter(id => id !== itemId);
    if (updatedItemIds.length > 0) {
      setSets(prev => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
    } else {
      deleteSet();
    }
  };

  const handleKeydown = e => {
    const { keyCode, metaKey, target } = e;
    if (metaKey && keyCode === DELETE_KEY_CODE && !target.value) {
      deleteItem();
    }
    if (metaKey && keyCode === ENTER_KEY_CODE && target.value.length) {
      addItem();
    }
    if (keyCode === ESC_KEY_CODE) {
      itemRef.current.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.addEventListener('keydown', handleKeydown);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.removeEventListener('keydown', handleKeydown);
  };

  return (
    <>
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(
          itemsDraggableProvided: DraggableProvided,
          itemsDraggableSnapshot: DraggableStateSnapshot,
        ) => (
          <div
            className="item"
            {...itemsDraggableProvided.draggableProps}
            ref={itemsDraggableProvided.innerRef}
          >
            <div className="handle" {...itemsDraggableProvided.dragHandleProps} />
            <input
              style={{
                boxShadow: itemsDraggableSnapshot.isDragging ? '0 0 15px rgba(0,0,0,.3)' : '',
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="text"
              value={item.text}
              onChange={handleChange}
              ref={itemRef}
            />
            <button tabIndex={-1} type="button" className="delete-item" onClick={deleteItem}>
              Delete
            </button>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .item:first-of-type input {
          color: black;
        }
        .item input {
          height: 40px;
          width: 60vw;
          padding-left: 0.5rem;
          font-size: 2rem;
          color: #646464;
          font-weight: 800;
          border: none;
          transition: color 240ms ease-out;
          transition: box-shadow 240ms ease-out;
        }
        .item {
          padding: 4px 0;
          display: flex;
          align-items: center;
        }
        .item .handle {
          width: 8px;
          align-self: stretch;
          background-color: lightgray;
          opacity: 0;
          transition: opacity 80ms ease-out;
        }
        .item .handle:hover,
        .item .handle:focus {
          opacity: 1;
        }
        .item:hover .handle {
          opacity: 1;
        }
        .delete-item {
          opacity: 0;
          line-height: 40px;
          cursor: pointer;
          font-size: 1rem;
          margin-right: 16px;
        }
        .delete-item:hover {
          text-decoration: underline;
        }
        .item:hover .delete-item {
          opacity: 0.4;
        }
      `}</style>
    </>
  );
};

export default DraggableItem;
